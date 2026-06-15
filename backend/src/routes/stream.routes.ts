import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { streamSSE } from 'hono/streaming';
import { LLMService } from '../services/llm.service';
import { DbService } from '../services/db.service';
import { VectorService } from '../services/vector.service';
import { requireAuth } from '../middleware/auth.middleware';
import { updateConsistencyScore } from '../engine/layer10_statelock';
import { runLegalAudit } from '../engine/layer13_legalaudit';
import { processCritiqueMessage, buildFullSystemPrompt } from '../engine/index';
import { runOmniPipeline } from '../engine/OmniPipeline';
import { analyticsWorker } from '../workers/analytics.worker';

function getAIErrorMessage(err: any): string {
  if (!err) return 'Unknown AI error';
  return (err?.message || err?.error?.message || err?.cause?.message || JSON.stringify(err));
}

function isQuotaStyleError(message: string): boolean {
  const m = message.toLowerCase();
  return (m.includes('quota exceeded') || m.includes('resource_exhausted') || m.includes('429') || m.includes('rate limit'));
}

function toUserSafeAIText(err: any): string {
  const rawMessage = getAIErrorMessage(err);
  if (isQuotaStyleError(rawMessage)) return 'Bhai teri consistency check karne mein mera engine thoda overload ho gaya hai. Ek minute ruk.';
  return 'Bhai thoda temporary network issue aa raha hai backend pe. 10 second ruk ke dobara message bhej.';
}

export const streamRoutes = new Hono<{ Variables: { userId: string, userLanguage: string } }>();

streamRoutes.use('*', requireAuth);

const messageSchema = z.object({
  user_id: z.string().optional(),
  message: z.string(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() }))
  })).optional().default([]),
  state_context: z.any().optional(),
  action: z.string().optional(),
  thread_id: z.string().nullable().optional(),
  model: z.string().optional()
});

streamRoutes.post('/message/stream', zValidator('json', messageSchema), async (c) => {
  const { message, conversationHistory, state_context, thread_id, model } = c.req.valid('json');
  const actualUserId = c.get('userId');
  const userLanguage = c.get('userLanguage') || 'Hinglish';

  if (!actualUserId) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const activeMissionPromise = DbService.getActiveMission(actualUserId);
    const similarMemoriesPromise = VectorService.searchSimilarMemories(message, 2, 0.5).catch(() => [] as any[]);
    
    let currentThreadId = thread_id;
    if (!currentThreadId) {
      const newThread = await DbService.createChatThread(actualUserId, "Conversation");
      currentThreadId = newThread.id;
    }

    let activeMission: any;
    let similarMemories: any[];
    const [retrievedMission, retrievedMemories] = await Promise.all([
      activeMissionPromise,
      similarMemoriesPromise,
      DbService.saveMessage(currentThreadId, actualUserId, 'user', message)
    ]);
    activeMission = retrievedMission;
    similarMemories = retrievedMemories;

    let finalSystemPrompt = '';
    let result: any = null;

    if (activeMission) {
      const critiqueResult = processCritiqueMessage({
        userId: actualUserId,
        userRuntime: activeMission.userRuntime,
        userMessage: message,
        tasksCompletedToDate: Math.floor(activeMission.consistencyScore / 10),
        tasksAttemptedToDate: Math.floor(activeMission.consistencyScore / 10) + activeMission.consecutiveFailureCount,
        consecutiveFailureCount: activeMission.consecutiveFailureCount,
      }, userLanguage);
      finalSystemPrompt = critiqueResult.systemPrompt;
      result = { type: 'critique_response', data: critiqueResult };
    } else {
      finalSystemPrompt = `You are Lumensky - a brutally honest, warm AI buddy helping students figure out their path in life. The student just said "${message}". 
Reply casually in the language the user is speaking or requesting (e.g. German, Spanish, English). If unsure, default to ${userLanguage}. Act like a smart older bro who's genuinely curious. Ask what's going on in their life or what they want to achieve. CRITICAL: Use very short paragraphs, hard line breaks (1-2 sentences max before a new line), and slight emojis to make it highly readable and engaging. Never write walls of text.`;
    }

    let streamData: any;
    let taskClassification: 'completed'|'failed'|'none' = 'none';

    try {
      const streamRes = await LLMService.generateSmartResponseStream(
        actualUserId,
        finalSystemPrompt,
        [...conversationHistory, { role: 'user', parts: [{ text: message }] }] as any,
        model || 'gemini-2.5-flash'
      );
      streamData = streamRes.stream;
      taskClassification = streamRes.task_classification;
    } catch (err: any) {
      const safeText = toUserSafeAIText(err);
      await DbService.saveMessage(currentThreadId, actualUserId, 'fp', safeText);
      return streamSSE(c, async (streamWriter) => {
        await streamWriter.writeSSE({ data: JSON.stringify({ type: 'metadata', data: { thread_id: currentThreadId } }) });
        await streamWriter.writeSSE({ data: JSON.stringify({ type: 'text', text: safeText }) });
      });
    }

    if (activeMission) analyticsWorker.enqueueMessageAnalysis(actualUserId, message);

    return streamSSE(c, async (streamWriter) => {
      await streamWriter.writeSSE({ data: JSON.stringify({ type: 'metadata', data: { thread_id: currentThreadId, engine_result: result } }) });
      
      let fullResponseText = "";
      for await (const chunk of streamData) {
        const textChunk = typeof chunk.text === 'function' ? chunk.text() : chunk.text;
        fullResponseText += textChunk;
        await streamWriter.writeSSE({ data: JSON.stringify({ type: 'text', text: textChunk }) });
      }

      if (activeMission && state_context?.contextMatrix) {
        const auditReport = runLegalAudit(
          state_context.contextMatrix,
          state_context.availablePaths || [],
          state_context.ambitionAssessment || { probabilityOfDeclaredGoal: 50 },
          activeMission.streakDays === 0 ? 1 : 0,
          activeMission.consistencyScore,
          fullResponseText
        );
        if (!auditReport.passedLegalGate) {
          const disc = auditReport.requiredDisclaimers.join('\\n\\n');
          await streamWriter.writeSSE({ data: JSON.stringify({ type: 'disclaimer', text: disc }) });
        } else if (auditReport.requiredDisclaimers?.length > 0) {
          const disc = "\\n\\n---\\n*Disclaimer: " + auditReport.requiredDisclaimers.join(' | ') + "*";
          fullResponseText += disc;
          await streamWriter.writeSSE({ data: JSON.stringify({ type: 'disclaimer', text: disc }) });
        }
      }

      await DbService.saveMessage(currentThreadId, actualUserId, 'fp', fullResponseText);

      if (activeMission && taskClassification !== 'none') {
        const scoreEvent = taskClassification === 'completed' ? 'task_completed' : 'task_failed';
        const { newScore } = updateConsistencyScore(activeMission.consistencyScore, scoreEvent);
        let newStreak = activeMission.streakDays;
        if (taskClassification === 'completed') newStreak += 1; else newStreak = 0;
        await DbService.saveMission({
          ...activeMission,
          consistencyScore: newScore,
          streakDays: newStreak,
          dayNumber: Math.min(activeMission.totalDays, activeMission.dayNumber + 1)
        });
        await DbService.addConsistencyLog(actualUserId, newScore);
      }
    });

  } catch (err: any) {
    const safeText = toUserSafeAIText(err);
    return streamSSE(c, async (streamWriter) => {
      await streamWriter.writeSSE({ data: JSON.stringify({ type: 'text', text: safeText }) });
    });
  }
});
