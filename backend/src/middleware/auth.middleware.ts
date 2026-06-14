import { MiddlewareHandler } from 'hono';
import { DbService } from '../services/db.service';

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Access denied: missing authentication token.' }, 401);
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return c.json({ error: 'Access denied: missing authentication token.' }, 401);
  }



  try {
    const { data: { user }, error } = await DbService.supabase.auth.getUser(token);

    if (error || !user) {
      return c.json({ error: 'Access denied: invalid authentication token.' }, 401);
    }

    c.set('userId', user.id);
    
    // Extract language from Supabase user_metadata if it exists
    const language = user.user_metadata?.preferred_language || 'Hinglish';
    c.set('userLanguage', language);
    
    await next();
  } catch (error) {
    return c.json({ error: 'Access denied: invalid or expired authentication token.' }, 401);
  }
};
