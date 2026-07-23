import { GoogleGenerativeAI } from "@google/generative-ai";
import { Logger } from "../utils/Logger";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      Logger.error("GEMINI_API_KEY environment variable is not defined.");
    }
    // Initialize the official Google Gemini SDK
    this.genAI = new GoogleGenerativeAI(apiKey || "dummy-key");
    this.modelName = "gemini-2.5-flash";
  }

  // Resilient retry utility with backoff
  private async executeWithRetry<T>(fn: () => Promise<T>, attempts: number = 3): Promise<T> {
    let lastError: any;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        Logger.error(`Gemini request failure (Attempt ${attempt}/${attempts}): ${error.message || error}`);
        
        if (attempt < attempts) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error(`Gemini Service failed after ${attempts} attempts. Last error: ${lastError.message || lastError}`);
  }

  public async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    return this.executeWithRetry(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt
      });
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      if (!text) {
        throw new Error("Empty response text returned from Gemini API");
      }
      return text;
    });
  }

  public async generateJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
    return this.executeWithRetry(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: "application/json"
        }
      });
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      if (!text) {
        throw new Error("Empty JSON response returned from Gemini API");
      }
      return JSON.parse(text) as T;
    });
  }

  public async *stream(systemPrompt: string, userPrompt: string): AsyncGenerator<string, void, unknown> {
    const resultStream = await this.executeWithRetry(async () => {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt
      });
      const result = await model.generateContentStream(userPrompt);
      return result.stream;
    });

    for await (const chunk of resultStream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  }

  // Backward compatibility alias for AgentOrchestrator
  public async generateContent(prompt: string, role: string): Promise<string> {
    const systemPrompt = `You are the ${role} agent.`;
    return this.generate(systemPrompt, prompt);
  }
}
