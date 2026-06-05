import { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'FP_OS_SECURE_JWT_SECRET_KEY_2026';

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Access Denied: Missing authentication token.' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await verify(token, JWT_SECRET, 'HS256');
    // Attach credentials/userId context to the request environment
    c.set('jwtPayload', payload);
    c.set('userId', payload.sub);
    await next();
  } catch (error) {
    return c.json({ error: 'Access Denied: Invalid or expired authentication token.' }, 401);
  }
};
