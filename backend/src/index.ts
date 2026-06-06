import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { interactionRoutes } from './routes/interaction.routes';
import { authRoutes } from './routes/auth.routes';
import { threadRoutes } from './routes/thread.routes';
import { DbService } from './services/db.service';
import { VectorService } from './services/vector.service';
import { WebSocketService } from './services/websocket.service';
import { requireIdempotency } from './middleware/idempotency.middleware';

const app = new Hono();

// Enable CORS for all routes so Vercel frontend can connect
app.use('*', cors());
app.use('*', requireIdempotency);


app.get('/', (c) => c.text('FP-OS Core Runtime Active'));
app.get('/health', (c) => c.json({ status: 'ok' }));

// Mount specific domains
app.route('/api/v1/interaction', interactionRoutes);
app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/threads', threadRoutes);

// Cloud Run sets PORT env var to 8080 — always read directly from process.env
const port = parseInt(process.env.PORT || '8080', 10);

console.log(`Starting FP-OS Backend on port ${port}...`);

// Initialize database, vector storage & seeding
DbService.init().catch(console.error);
VectorService.init().catch(console.error);

const server = serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0'
});

// Attach WebSocket Server
WebSocketService.init(server);


