import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/backend/src/utils/supabase";
import { GeminiService } from "@/backend/src/services/GeminiService";
import { ProjectService } from "@/backend/src/services/ProjectService";
import { AgentOrchestrator } from "@/backend/src/services/AgentOrchestrator";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id: projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select("id, project_id, role, content, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(messages || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve messages" },
      { status: 550 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id: projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { role, content } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: "role and content are required" },
        { status: 400 }
      );
    }

    // 1. Insert User Message
    const { data: userMsgData, error: userInsertError } = await supabase
      .from("messages")
      .insert([
        {
          project_id: projectId,
          role,
          content,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (userInsertError) {
      throw userInsertError;
    }

    // 2. Load Project Details
    const projectService = new ProjectService();
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // 3. Load all messages for conversation history context
    const { data: dbMessages, error: msgError } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (msgError) {
      throw msgError;
    }

    const conversationHistoryText = (dbMessages || [])
      .map(m => `${m.role === "user" ? "User" : m.role}: ${m.content}`)
      .join("\n\n");

    // 4. Analyze message to determine which agents must execute
    const analysisSystemPrompt = `You are the Lead Project Orchestrator of BuildAI OS.
Analyze the user's latest feedback/request and determine which of these agents need to be rerun to update the design specification artifacts.
The available agents and their responsibilities are:
- "CEO" (handles business requirements, strategic vision: requirements.md)
- "Product Manager" (handles product specifications, user stories, features: prd.md)
- "Architect" (handles architecture, database schemas, tech stack: architecture.md)
- "Frontend" (handles UI components, pages, visual routes: frontend-plan.md)
- "Backend" (handles API routes, controllers, database models: api-spec.md)
- "QA" (handles test plan, test cases, visual specs: test-plan.md)
- "Reviewer" (handles overall code review, safety guidelines: review.md)

Rule: If a change is made to a component higher up the pipeline, all dependent downstream components should also be rerun. E.g., if "Architect" schema changes, then "Backend" (and possibly "Frontend", "QA", "Reviewer") must also rerun.
If the user message is just a general question or greeting that requires no design changes, return an empty JSON array: [].

Return ONLY a raw JSON array of strings containing the exact agent names, e.g., ["Architect", "Backend", "QA", "Reviewer"] or ["CEO", "Product Manager", "Architect", "Frontend", "Backend", "QA", "Reviewer"] or [].
Do not include markdown code blocks (like \`\`\`json), formatting, or commentary.`;

    const userMessageContext = `Conversation History:\n${conversationHistoryText}\n\nLatest Feedback Request: ${content}`;

    const geminiService = new GeminiService();
    const analysisOutput = await geminiService.generate(analysisSystemPrompt, userMessageContext);

    let agentsToRerun: string[] = [];
    try {
      const cleanJson = analysisOutput.replace(/```json/g, "").replace(/```/g, "").trim();
      agentsToRerun = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse agent analysis JSON, output was:", analysisOutput);
      const textLower = content.toLowerCase();
      if (textLower.includes("database") || textLower.includes("schema") || textLower.includes("architect")) {
        agentsToRerun = ["Architect", "Backend", "QA", "Reviewer"];
      } else if (textLower.includes("frontend") || textLower.includes("ui") || textLower.includes("button") || textLower.includes("css")) {
        agentsToRerun = ["Frontend", "QA", "Reviewer"];
      } else if (textLower.includes("backend") || textLower.includes("api") || textLower.includes("route")) {
        agentsToRerun = ["Backend", "QA", "Reviewer"];
      } else if (textLower.includes("test") || textLower.includes("qa") || textLower.includes("assert")) {
        agentsToRerun = ["QA", "Reviewer"];
      }
    }

    // Extract @Mentions from the user content and force them to rerun
    const contentLower = content.toLowerCase();
    const forcedAgents: string[] = [];
    if (contentLower.includes("@ceo")) forcedAgents.push("CEO");
    if (contentLower.includes("@pm") || contentLower.includes("@productmanager") || contentLower.includes("@product manager")) forcedAgents.push("Product Manager");
    if (contentLower.includes("@architect")) forcedAgents.push("Architect");
    if (contentLower.includes("@frontend")) forcedAgents.push("Frontend");
    if (contentLower.includes("@backend")) forcedAgents.push("Backend");
    if (contentLower.includes("@qa")) forcedAgents.push("QA");
    if (contentLower.includes("@reviewer")) forcedAgents.push("Reviewer");

    forcedAgents.forEach(fa => {
      if (!agentsToRerun.includes(fa)) {
        agentsToRerun.push(fa);
      }
    });

    if (agentsToRerun && agentsToRerun.length > 0) {
      // 5. Rerun specified agents incrementally
      const orchestrator = new AgentOrchestrator();
      await orchestrator.orchestrateIncremental(projectId, content, agentsToRerun);

      try {
        const { VersionService } = require("@/backend/src/services/VersionService");
        const versionService = new VersionService();
        await versionService.createVersion(projectId, `Incremental AI update: reran ${agentsToRerun.join(", ")}`);
      } catch (vErr: any) {
        console.warn("Failed to automatically capture post-incremental version snapshot:", vErr.message);
      }

      // Define artifact mapping for loading agent specific content
      const AgentArtifactMap: { [key: string]: string } = {
        "CEO": "requirements.md",
        "Product Manager": "prd.md",
        "Architect": "architecture.md",
        "Frontend": "frontend-plan.md",
        "Backend": "api-spec.md",
        "QA": "test-plan.md",
        "Reviewer": "review.md"
      };

      let lastInsertedMessage = null;

      // 6. Each executing agent independently replies to the user in order
      for (const agent of agentsToRerun) {
        const filename = AgentArtifactMap[agent];
        let artifactContent = "";
        if (filename) {
          const { data: artData } = await supabase
            .from("artifacts")
            .select("content")
            .eq("project_id", projectId)
            .eq("filename", filename)
            .limit(1);
          if (artData && artData.length > 0) {
            artifactContent = artData[0].content;
          }
        }

        const agentCommunicatorPrompt = `You are the Chat Communicator module of BuildAI OS.
For the agent "${agent}", based on the latest generated artifact output and the user prompt, compile a Slack-style progress message (1-2 sentences) explaining what you did, and a brief explanation of the reasoning/thought process (1 sentence) behind the changes.
Return ONLY a raw JSON object with keys "text" and "reasoning". Do not include markdown code blocks.
Example:
{
  "text": "I have updated the database schemas to support persistent user sessions.",
  "reasoning": "Adding foreign keys ensures project message relations are clean and validated."
}`;

        const geminiInput = `Artifact Content:\n${artifactContent || "None"}\n\nUser Prompt: ${content}`;
        const output = await geminiService.generate(agentCommunicatorPrompt, geminiInput);

        let finalText = `Completed updates for the ${agent} specifications.`;
        let finalReasoning = "Incremental pipeline regeneration triggered.";

        try {
          const parsed = JSON.parse(output.replace(/```json/g, "").replace(/```/g, "").trim());
          if (parsed.text) finalText = parsed.text;
          if (parsed.reasoning) finalReasoning = parsed.reasoning;
        } catch {
          // Fallback if not valid JSON
          finalText = output;
        }

        const jsonContent = JSON.stringify({ text: finalText, reasoning: finalReasoning });

        const { data: aiMsgData } = await supabase
          .from("messages")
          .insert([
            {
              project_id: projectId,
              role: agent,
              content: jsonContent,
              created_at: new Date().toISOString()
            }
          ])
          .select();

        if (aiMsgData && aiMsgData.length > 0) {
          lastInsertedMessage = aiMsgData[0];
        }
      }

      return NextResponse.json(lastInsertedMessage, { status: 201 });
    } else {
      // General question chat reply
      const generalSystemPrompt = `You are the Reviewer Agent ("Judge") of BuildAI OS. 
Answer the user's latest query directly, briefly and constructively in a professional manner.
Return ONLY a raw JSON object with keys "text" and "reasoning" (explain why this response is provided). Do not include markdown code blocks.

Project Details:
Title: ${project.title}
Original Prompt: ${project.prompt}
Current Status: ${project.status}`;

      const output = await geminiService.generate(generalSystemPrompt, userMessageContext);
      let finalText = output;
      let finalReasoning = "Clarification query resolved.";

      try {
        const parsed = JSON.parse(output.replace(/```json/g, "").replace(/```/g, "").trim());
        if (parsed.text) finalText = parsed.text;
        if (parsed.reasoning) finalReasoning = parsed.reasoning;
      } catch {
        // Fallback if not valid JSON
      }

      const jsonContent = JSON.stringify({ text: finalText, reasoning: finalReasoning });

      const { data: aiMsgData, error: aiInsertError } = await supabase
        .from("messages")
        .insert([
          {
            project_id: projectId,
            role: "Reviewer",
            content: jsonContent,
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (aiInsertError) throw aiInsertError;
      return NextResponse.json(aiMsgData?.[0] || null, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process incremental request" },
      { status: 550 }
    );
  }
}
