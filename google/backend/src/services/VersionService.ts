import { supabase } from "../utils/supabase";

export interface VersionSnapshot {
  id: string;
  project_id: string;
  version: number;
  summary: string;
  files: any[];
  artifacts: any[];
  messages: any[];
  created_at: string;
}

export class VersionService {
  /**
   * Capture a new version snapshot of the project
   */
  public async createVersion(projectId: string, summary: string): Promise<VersionSnapshot> {
    // 1. Fetch generated files
    const { data: filesData } = await supabase
      .from("generated_files")
      .select("path, content, language")
      .eq("project_id", projectId);

    let files = filesData || [];
    if (files.length === 0) {
      // Fallback to code artifacts
      const { data: artCode } = await supabase
        .from("artifacts")
        .select("filename, content")
        .eq("project_id", projectId)
        .eq("type", "code");
      
      files = (artCode || []).map(f => ({
        path: f.filename,
        content: f.content,
        language: "typescript"
      }));
    }

    // 2. Fetch design artifacts (excluding versions and fallback codes)
    const { data: artifactsData } = await supabase
      .from("artifacts")
      .select("id, type, filename, content, created_at")
      .eq("project_id", projectId)
      .neq("type", "version")
      .neq("type", "code");

    const artifacts = artifactsData || [];

    // 3. Fetch conversation messages
    const { data: messagesData } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    const messages = messagesData || [];

    // 4. Resolve next version number
    let nextVersionNum = 1;
    const versions = await this.listVersions(projectId);
    if (versions.length > 0) {
      const maxVersion = Math.max(...versions.map(v => v.version));
      nextVersionNum = maxVersion + 1;
    }

    const payload = {
      project_id: projectId,
      version: nextVersionNum,
      summary: summary || `Snapshot Version ${nextVersionNum}`,
      files,
      artifacts,
      messages
    };

    // 5. Try inserting into project_versions table first
    const { data: versionData, error: insertError } = await supabase
      .from("project_versions")
      .insert([payload])
      .select()
      .single();

    if (!insertError && versionData) {
      return versionData as VersionSnapshot;
    }

    // Fallback: Store version snapshot inside artifacts table as a JSON artifact
    console.warn("project_versions table not available. Storing version inside artifacts fallback...");
    const artifactFilename = `version-${nextVersionNum}.json`;
    const artifactPayload = {
      ...payload,
      created_at: new Date().toISOString()
    };

    const { data: artVersionData, error: artInsertError } = await supabase
      .from("artifacts")
      .insert([
        {
          project_id: projectId,
          type: "version",
          filename: artifactFilename,
          content: JSON.stringify(artifactPayload),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (artInsertError) {
      throw new Error(`Failed to create version fallback snapshot: ${artInsertError.message}`);
    }

    return {
      id: artVersionData.id,
      project_id: projectId,
      version: nextVersionNum,
      summary: payload.summary,
      files,
      artifacts,
      messages,
      created_at: artVersionData.created_at
    };
  }

  /**
   * List all versions for a project
   */
  public async listVersions(projectId: string): Promise<any[]> {
    // 1. Try project_versions first
    const { data: versionData, error } = await supabase
      .from("project_versions")
      .select("id, project_id, version, summary, created_at")
      .eq("project_id", projectId)
      .order("version", { ascending: false });

    if (!error && versionData && versionData.length > 0) {
      return versionData;
    }

    // 2. Fallback: Query version records from artifacts
    const { data: artifactsData } = await supabase
      .from("artifacts")
      .select("id, filename, content, created_at")
      .eq("project_id", projectId)
      .eq("type", "version")
      .order("created_at", { ascending: false });

    if (!artifactsData || artifactsData.length === 0) {
      return [];
    }

    const mapped = artifactsData.map(art => {
      try {
        const parsed = JSON.parse(art.content);
        return {
          id: art.id,
          project_id: projectId,
          version: parsed.version,
          summary: parsed.summary,
          created_at: art.created_at
        };
      } catch (parseErr) {
        return {
          id: art.id,
          project_id: projectId,
          version: parseInt(art.filename.replace("version-", "").replace(".json", "")) || 0,
          summary: `Version snapshot file ${art.filename}`,
          created_at: art.created_at
        };
      }
    });

    return mapped.sort((a, b) => b.version - a.version);
  }

  /**
   * Retrieve a specific version snapshot detail
   */
  public async getVersion(projectId: string, versionIdOrNum: string | number): Promise<any | null> {
    // Try UUID lookups first if versionIdOrNum is a string of length 36
    if (typeof versionIdOrNum === "string" && versionIdOrNum.length === 36) {
      const { data: ver } = await supabase
        .from("project_versions")
        .select("*")
        .eq("id", versionIdOrNum)
        .maybeSingle();

      if (ver) return ver;

      // Check artifacts lookup fallback
      const { data: art } = await supabase
        .from("artifacts")
        .select("*")
        .eq("id", versionIdOrNum)
        .maybeSingle();

      if (art) {
        try {
          return JSON.parse(art.content);
        } catch {
          return null;
        }
      }
    }

    // Lookup version by version number
    const verNum = typeof versionIdOrNum === "string" ? parseInt(versionIdOrNum) : versionIdOrNum;
    if (isNaN(verNum)) return null;

    // Check project_versions table
    const { data: verByNum } = await supabase
      .from("project_versions")
      .select("*")
      .eq("project_id", projectId)
      .eq("version", verNum)
      .maybeSingle();

    if (verByNum) return verByNum;

    // Check artifacts fallback
    const { data: artByFilename } = await supabase
      .from("artifacts")
      .select("*")
      .eq("project_id", projectId)
      .eq("type", "version")
      .eq("filename", `version-${verNum}.json`)
      .maybeSingle();

    if (artByFilename) {
      try {
        const parsed = JSON.parse(artByFilename.content);
        return {
          ...parsed,
          id: artByFilename.id,
          created_at: artByFilename.created_at
        };
      } catch {
        return null;
      }
    }

    return null;
  }

  /**
   * Delete a version history snapshot
   */
  public async deleteVersion(projectId: string, versionIdOrNum: string | number): Promise<boolean> {
    // Check UUID lookup
    if (typeof versionIdOrNum === "string" && versionIdOrNum.length === 36) {
      const { error: err1 } = await supabase.from("project_versions").delete().eq("id", versionIdOrNum);
      if (!err1) return true;

      const { error: err2 } = await supabase.from("artifacts").delete().eq("id", versionIdOrNum);
      if (!err2) return true;
    }

    // Check version number delete
    const verNum = typeof versionIdOrNum === "string" ? parseInt(versionIdOrNum) : versionIdOrNum;
    if (isNaN(verNum)) return false;

    await supabase.from("project_versions").delete().eq("project_id", projectId).eq("version", verNum);
    await supabase.from("artifacts").delete().eq("project_id", projectId).eq("type", "version").eq("filename", `version-${verNum}.json`);

    return true;
  }

  /**
   * Restore the active project state to a given version snapshot
   */
  public async restoreVersion(projectId: string, versionIdOrNum: string | number): Promise<boolean> {
    const snapshot = await this.getVersion(projectId, versionIdOrNum);
    if (!snapshot) {
      throw new Error(`Version snapshot not found for ID/Number: ${versionIdOrNum}`);
    }

    // 1. Delete current generated_files records
    await supabase.from("generated_files").delete().eq("project_id", projectId);

    // 2. Delete current artifacts (excluding version snapshots themselves)
    await supabase.from("artifacts").delete().eq("project_id", projectId).neq("type", "version");

    // 3. Delete current messages
    await supabase.from("messages").delete().eq("project_id", projectId);

    // 4. Restore files
    if (Array.isArray(snapshot.files) && snapshot.files.length > 0) {
      // Try writing to generated_files
      const filesPayload = snapshot.files.map((f: any) => ({
        project_id: projectId,
        path: f.path,
        content: f.content,
        language: f.language || "typescript",
        created_at: new Date().toISOString()
      }));

      const { error: filesErr } = await supabase.from("generated_files").insert(filesPayload);
      
      // Fallback write to artifacts
      if (filesErr) {
        console.warn("Restoring files to fallback artifacts table...");
        const fallbackPayload = snapshot.files.map((f: any) => ({
          project_id: projectId,
          type: "code",
          filename: f.path,
          content: f.content,
          created_at: new Date().toISOString()
        }));
        await supabase.from("artifacts").insert(fallbackPayload);
      }
    }

    // 5. Restore artifacts
    if (Array.isArray(snapshot.artifacts) && snapshot.artifacts.length > 0) {
      const artifactsPayload = snapshot.artifacts.map((a: any) => ({
        project_id: projectId,
        type: a.type,
        filename: a.filename,
        content: a.content,
        created_at: a.created_at || new Date().toISOString()
      }));
      await supabase.from("artifacts").insert(artifactsPayload);
    }

    // 6. Restore messages
    if (Array.isArray(snapshot.messages) && snapshot.messages.length > 0) {
      const messagesPayload = snapshot.messages.map((m: any) => ({
        project_id: projectId,
        role: m.role,
        content: m.content,
        created_at: m.created_at || new Date().toISOString()
      }));
      await supabase.from("messages").insert(messagesPayload);
    }

    return true;
  }
}
