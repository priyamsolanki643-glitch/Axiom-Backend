import { GoogleGenAI } from '@google/genai';
import { ContextMatrix, CapabilityVector } from '../engine/types';

// Lazy client — created only when first needed, NOT at import time.
// This prevents crashes during Cloud Run startup health checks.
let _ai: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!_ai) {
    const apiKey = process.env.AI_PROVIDER_KEY || '';
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

export class LLMService {
  /**
   * Sends a constructed prompt to the LLM and validates the output.
   * If validation fails, it attempts to regenerate up to 3 times.
   */
  static async generateValidatedResponse(
    userId: string,
    systemPrompt: string,
    conversationHistory: { role: "user" | "model", parts: { text: string }[] }[] = [],
    bannedCategories: string[],
    retries = 3
  ): Promise<any> {
    try {
      const strictPrompt = systemPrompt + "\n\nIMPORTANT: You must respond in ONLY raw JSON format. Your response MUST be a JSON object containing exactly one key named 'response_text' containing your actual response to the user. Do not include markdown formatting or backticks. Example: {\"response_text\": \"Hello, how can I help?\"}";

      const contents = [
        { role: 'user', parts: [{ text: strictPrompt }] },
        ...conversationHistory
      ];

      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents as any,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3, // Low temperature for deterministic output
        }
      });

      const rawText = response.text;
      
      if (!rawText) {
         throw new Error("Empty response from LLM");
      }

      let cleanOutput = rawText.trim();
      // Basic JSON cleanup
      if (cleanOutput.startsWith('```json')) cleanOutput = cleanOutput.substring(7);
      if (cleanOutput.startsWith('```')) cleanOutput = cleanOutput.substring(3);
      if (cleanOutput.endsWith('```')) cleanOutput = cleanOutput.substring(0, cleanOutput.length - 3);
      
      try {
        return JSON.parse(cleanOutput.trim());
      } catch (parseError) {
        if (retries > 0) {
          console.warn(`LLM Output JSON parse failed. Retries left: ${retries - 1}`);
          const retryPrompt = `${systemPrompt}\n\n[SYSTEM REJECTION]\nYour previous output was not valid JSON. Fix it and output only raw JSON.`;
          return this.generateValidatedResponse(userId, retryPrompt, conversationHistory, bannedCategories, retries - 1);
        }
        throw new Error('LLM Failed validation after maximum retries. Invalid JSON.');
      }

    } catch (error) {
      console.error('LLM Generation Error:', error);
      throw error;
    }
  }

  /**
   * Generates a grounded intelligence report by searching the web using Gemini's Google Search tool.
   */
  static async generateGroundedIntelligenceReport(
    researchMandate: string,
    retries = 2
  ): Promise<any> {
    try {
      const strictPrompt = researchMandate + "\n\nIMPORTANT: You must respond in ONLY raw JSON format exactly matching the `MarketIntelligenceReport` TypeScript interface. No markdown formatting or backticks. DO NOT INCLUDE ```json anywhere.";

      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: strictPrompt }] }] as any,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2, // Slightly higher to allow search variation
          tools: [{ googleSearch: {} }],
        }
      });

      const rawText = response.text;
      if (!rawText) throw new Error("Empty response from LLM Grounding");

      let cleanOutput = rawText.trim();
      if (cleanOutput.startsWith('```json')) cleanOutput = cleanOutput.substring(7);
      if (cleanOutput.startsWith('```')) cleanOutput = cleanOutput.substring(3);
      if (cleanOutput.endsWith('```')) cleanOutput = cleanOutput.substring(0, cleanOutput.length - 3);

      return JSON.parse(cleanOutput.trim());
    } catch (error) {
      if (retries > 0) {
        console.warn(`LLM Grounding JSON parse failed. Retries left: ${retries - 1}`);
        return this.generateGroundedIntelligenceReport(researchMandate, retries - 1);
      }
      console.error('LLM Grounding Error:', error);
      throw error;
    }
  }

  /**
   * Analyzes if a message indicates task completion or failure.
   */
  static async classifyMessageOutcome(message: string): Promise<'completed' | 'failed' | 'none'> {
    try {
      const prompt = `Analyze the user's message and determine if they are indicating that they completed a task, failed a task, or if this is a general message.
User Message: "${message}"

You must respond in ONLY JSON format containing exactly one key named 'outcome' with value 'completed', 'failed', or 'none'. Do not include markdown formatting or backticks. Example: {"outcome": "completed"}`;
      
      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }] as any,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        }
      });

      const rawText = response.text;
      if (!rawText) return 'none';
      const clean = rawText.trim();
      const parsed = JSON.parse(clean);
      return parsed.outcome || 'none';
    } catch (e) {
      console.error("Message outcome classification error:", e);
      return 'none';
    }
  }

  /**
   * Generates dynamic tasks leveraging Parkinson's Law and strict execution bounds.
   * Includes rigorous legal constraints.
   */
  static async generateDynamicTaskSprint(
    strategyState: any,
    frictionProfile: any,
    contextMatrix: any,
    capability: any,
    retries = 2
  ): Promise<any> {
    try {
      const isRedBand = contextMatrix.socioeconomic.runwayDays < 45;
      const isShortTimeline = contextMatrix.goalVector.timelineMonths <= 1; // 30 days or less
      const isSprintZeroActive = (isRedBand || isShortTimeline) && strategyState.currentDayNumber <= 7;
      
      const consecutiveFailures = strategyState.consecutiveFailureCount || 0;
      const consistencyScore = strategyState.consistencyScore ?? 100;
      
      const strictPrompt = `You are the FP-OS Dynamic Execution Generator.
Your job is to generate a daily task sprint for a user trying to achieve: "${contextMatrix.goalVector.declaredGoal}".

Current Day: Day ${strategyState.currentDayNumber} of ${strategyState.totalTargetDays}.
Friction Level: ${frictionProfile.frictionLevel} (Coefficient: ${frictionProfile.frictionCoefficient.toFixed(2)})
User Consistency Score: ${consistencyScore}/100.
Consecutive Failure Count: ${consecutiveFailures}.
Assigned Work Style: ${frictionProfile.assignedWorkStyle}
Runway: ${contextMatrix.socioeconomic.runwayDays} days.
Calibrated Skills: ${capability.calibratedSkills.map((s: any) => `${s.skillName} (level ${s.verifiedLevel})`).join(', ')}

YOU MUST IMPLEMENT THE FOLLOWING 5 ADAPTIVE ENGINE RULES:

1. **Sprint 0: First-Rupee Velocity** (Status: ${isSprintZeroActive ? 'ACTIVE' : 'INACTIVE'}):
   - If Sprint 0 is ACTIVE, focus 100% of tasks on rapid, direct outreach or offering services for immediate revenue (quick wins, cold calls, direct pitches) to solve survival anxiety or execute short-term goals. Do NOT suggest long-term building or research.
   - If the user has an exceptional, extreme goal (e.g., "sell an app to Physics Wallah in 20 days"), DO NOT reject it or refuse. Give them the absolute best, most direct high-risk tasks that target that goal (e.g., "Identify the VP of Engineering at PW on LinkedIn and draft a 3-sentence cold pitch showing a working demo"). Keep it open and execute.

2. **Cognitive Load Balancer (Adaptive Task Difficulty)**:
   - If consistency score is low (< 40) OR consecutive failures >= 2, adjust tasks to be ultra-simple "micro-tasks" (e.g., "Write a 3-line email body", "Create a folder and initialize git") to build immediate completion momentum.
   - If consistency score is high (> 80) and streak is strong, increase task complexity and leverage (e.g., "Book 3 customer research calls", "Ship 1 working module to production").

3. **Continuous Upskilling Injection**:
   - Identify skills needed for the user's goal where their calibrated level is low or requires AI-assisted vibecoding.
   - Inject a 30-minute micro-learning task alongside execution (e.g., "Spend 20 minutes learning how to write a fetch call, then verify it in code").

4. **Failsafe Re-routing (Execution Blockers)**:
   - If consecutive failures >= 1, analyze what the user failed. The tasks today must auto-split the failed concept into smaller sub-tasks, or pivot the outreach/building channel (e.g., shift from cold emailing to manual LinkedIn messaging).

5. **Parkinson's Law Compression**:
   - Estimate the standard hours needed for each task and apply Parkinson's Law compression (e.g., compress 4 hours to 2 hours of focused work). Detail this in the task description.

Constraints:
1. DO NOT give generic routines (e.g., "Wake up at 6am").
2. DO NOT give vague tasks (e.g., "Work on website").
3. EVERY task MUST have a strict, unambiguous "metricBound" (e.g., "Complete: 5 LinkedIn messages sent. Not drafted. Sent.").
4. LEGAL SAFETY: You are strictly forbidden from generating any task that constitutes formal financial advice, medical advice, or illegal activities.

You must respond in ONLY raw JSON format. The JSON must be an array of objects matching exactly:
[{ "title": "string", "description": "string", "metricBound": "string", "timeAllocationHours": number }]`;

      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: strictPrompt }] }] as any,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        }
      });

      const rawText = response.text;
      if (!rawText) throw new Error("Empty response from LLM Task Generator");

      let cleanOutput = rawText.trim();
      if (cleanOutput.startsWith('\`\`\`json')) cleanOutput = cleanOutput.substring(7);
      if (cleanOutput.startsWith('\`\`\`')) cleanOutput = cleanOutput.substring(3);
      if (cleanOutput.endsWith('\`\`\`')) cleanOutput = cleanOutput.substring(0, cleanOutput.length - 3);

      const parsed = JSON.parse(cleanOutput.trim());
      if (!Array.isArray(parsed)) throw new Error("Expected an array of tasks");
      return parsed;
    } catch (error) {
      if (retries > 0) {
        console.warn(`LLM Task Gen JSON parse failed. Retries left: ${retries - 1}`);
        return this.generateDynamicTaskSprint(strategyState, frictionProfile, contextMatrix, capability, retries - 1);
      }
      console.error('LLM Task Generator Error:', error);
      throw error;
    }
  }

  static async generateDynamicOpportunities(
    matrix: ContextMatrix,
    capability: CapabilityVector,
    retries = 2
  ): Promise<any[]> {
    try {
      const strictPrompt = `You are the FP-OS Universal Opportunity Generator.
Your job is to generate exactly 3 custom business/revenue opportunities for this specific user.

USER PROFILE:
Goal: "${matrix.goalVector.declaredGoal}"
Location: ${matrix.socioeconomic.city || matrix.socioeconomic.region}, Tier: ${matrix.socioeconomic.geographyTier}
Liquid Capital: INR ${matrix.socioeconomic.liquidCapital}
Top Skills: ${capability.calibratedSkills.map((s: any) => s.skillName).join(', ')}

RULES:
1. Generate opportunities that explicitly match their exact goal, skills, and capital.
2. If they have low capital (<5000 INR), DO NOT suggest capital-intensive physical businesses unless it's remote or service-based.
3. If they specified a highly specific, extreme, or exceptional goal (e.g., "sell an app to Physics Wallah in 20 days"), DO NOT reject, filter, or ignore this. Generate at least one path representing this direct attempt. Write in the "whyThisForThisUser" that this is an exceptional attempt with very low probability, but we can attempt to execute it with intense focus, without guaranteeing results.
4. If they gave a vague goal ("Make 50k"), invent the best 3 paths based on their skills.
5. LEGAL SAFETY: DO NOT suggest investing, crypto trading, gambling, MLMs, or medical advice.

You must respond in ONLY raw JSON format. The JSON must be an array of exactly 3 objects matching exactly this schema:
[{ "id": "unique_string", "title": "string", "category": "local_geo_arbitrage" | "national_digital_remote" | "trend_window_exploitation", "opportunityScore": number (0.0 to 1.0), "capitalRequired": number, "timeToFirstRevenue": number (days), "whyThisForThisUser": "string (brutal operator tone)" }]`;

      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: strictPrompt }] }] as any,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        }
      });

      const rawText = response.text;
      if (!rawText) throw new Error("Empty response from LLM Opportunity Generator");

      let cleanOutput = rawText.trim();
      if (cleanOutput.startsWith('\`\`\`json')) cleanOutput = cleanOutput.substring(7);
      if (cleanOutput.startsWith('\`\`\`')) cleanOutput = cleanOutput.substring(3);
      if (cleanOutput.endsWith('\`\`\`')) cleanOutput = cleanOutput.substring(0, cleanOutput.length - 3);

      const parsed = JSON.parse(cleanOutput.trim());
      if (!Array.isArray(parsed)) throw new Error("Expected an array of opportunities");
      return parsed;
    } catch (error) {
      if (retries > 0) {
        console.warn(`LLM Opportunity Gen JSON parse failed. Retries left: ${retries - 1}`);
        return this.generateDynamicOpportunities(matrix, capability, retries - 1);
      }
      console.error('LLM Opportunity Generator Error:', error);
      throw error;
    }
  }
}
