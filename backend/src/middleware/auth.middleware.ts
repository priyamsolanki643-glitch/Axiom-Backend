import { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'lumensky-fallback-secret-2026';

type JwtPayload = {
  sub?: string;
  exp?: number;
  [key: string]: any;
};

export const requireAuth: MiddlewareHandler = async (c, next) => {
  if (!JWT_SECRET) {
    console.error('AUTH_MIDDLEWARE: JWT_SECRET is missing.');
    return c.json({ error: 'Server authentication is not configured.' }, 500);
  }

  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Access denied: missing authentication token.' }, 401);
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return c.json({ error: 'Access denied: missing authentication token.' }, 401);
  }



  try {
    const payload = (await verify(token, JWT_SECRET, 'HS256')) as JwtPayload;

    if (!payload?.sub || typeof payload.sub !== 'string') {
      return c.json({ error: 'Access denied: invalid authentication token.' }, 401);
    }

    c.set('jwtPayload', payload);
    c.set('userId', payload.sub);
    await next();
  } catch (error) {
    return c.json({ error: 'Access denied: invalid or expired authentication token.' }, 401);
  }
};
