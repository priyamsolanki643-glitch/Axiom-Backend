import { LLMService } from './backend/src/services/llm.service';

async function run() {
  const res = await LLMService.generateSmartResponse(
    'test-user',
    'You are a mentor. Guide user naturally through goal discovery.',
    [{ role: 'user', parts: [{ text: 'i want to clear upsc' }] }],
    true
  );
  console.log("RESPONSE:", res);
}
run();
