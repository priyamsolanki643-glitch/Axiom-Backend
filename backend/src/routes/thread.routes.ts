import { Hono } from 'hono';
import { DbService } from '../services/db.service';
import { requireAuth } from '../middleware/auth.middleware';

export const threadRoutes = new Hono<{ Variables: { userId: string } }>();

threadRoutes.use('*', requireAuth);

// Get all threads for the user
threadRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId') || 'test-user';
    const threads = await DbService.getChatThreads(userId);
    return c.json({ status: 'success', data: threads });
  } catch (error: any) {
    console.error('Fetch Threads Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get messages for a specific thread
threadRoutes.get('/:id/messages', async (c) => {
  try {
    const threadId = c.req.param('id');
    const messages = await DbService.getMessages(threadId);
    return c.json({ status: 'success', data: messages });
  } catch (error: any) {
    console.error('Fetch Messages Error:', error);
    return c.json({ error: error.message }, 500);
  }
});
