import { IncomingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from '@supabase/supabase-js';
import * as url from 'url';

const supabaseUrl = process.env.SUPABASE_URL || 'https://kscqvigvcfjdulonvdxa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzY3F2aWd2Y2ZqZHVsb252ZHhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY2MjAxMywiZXhwIjoyMDk2MjM4MDEzfQ.lNlB6nnfaeP9UADMPrMLBh0NzXr_EK6GYZB8TszR_KM';

const isLocalFallback = false;

const supabase = !isLocalFallback ? createClient(supabaseUrl, supabaseKey) : null;

export class WebSocketService {
  private static wss: WebSocketServer | null = null;
  private static clients = new Map<string, WebSocket>(); // userId -> WebSocket

  /**
   * Initializes the WebSocket Server and attaches it to the HTTP server
   */
  static init(server: any) {
    console.log('WS_SERVICE: Initializing WebSocket server...');
    this.wss = new WebSocketServer({ noServer: true });

    // Handle HTTP upgrade request
    server.on('upgrade', async (request: IncomingMessage, socket: any, head: any) => {
      try {
        const parsedUrl = url.parse(request.url || '', true);
        const query = parsedUrl.query;
        
        let userId = '';

        if (isLocalFallback) {
          userId = (query['x-device-id'] as string) || 'test-user';
        } else {
          const token = query['token'] as string;
          if (!token || !supabase) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
          const { data: { user }, error } = await supabase.auth.getUser(token);
          if (error || !user) {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
          userId = user.id;
        }

        this.wss?.handleUpgrade(request, socket, head, (ws) => {
          this.wss?.emit('connection', ws, request, userId);
        });

      } catch (err) {
        console.error('WS_SERVICE: Upgrade authorization error:', err);
        socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
        socket.destroy();
      }
    });

    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage, userId: string) => {
      console.log(`WS_SERVICE: Connection established for user: ${userId}`);
      
      // Store socket
      this.clients.set(userId, ws);

      ws.send(JSON.stringify({
        event: 'connected',
        data: { userId, message: 'Secure execution channel active.' }
      }));

      ws.on('message', (message: string) => {
        try {
          const parsed = JSON.parse(message);
          console.log(`WS_SERVICE: Received message from user ${userId}:`, parsed);
          // Echo or handle simple messages
          ws.send(JSON.stringify({
            event: 'acknowledge',
            data: { received: true, time: new Date().toISOString() }
          }));
        } catch (e) {
          ws.send(JSON.stringify({ event: 'error', error: 'Invalid JSON payload' }));
        }
      });

      ws.on('close', () => {
        console.log(`WS_SERVICE: Connection closed for user: ${userId}`);
        this.clients.delete(userId);
      });

      ws.on('error', (error) => {
        console.error(`WS_SERVICE: Error on socket for user ${userId}:`, error);
        this.clients.delete(userId);
      });
    });
  }

  /**
   * Pushes a structured event to a connected user.
   */
  static sendToUser(userId: string, event: string, data: any): boolean {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event, data }));
      return true;
    }
    return false;
  }

  /**
   * Streams a text token to the user for building real-time dynamic AI typewriter effects.
   */
  static streamTokenToUser(userId: string, event: string, token: string, isLast = false) {
    this.sendToUser(userId, event, { token, isLast });
  }

  /**
   * Broadcasts a message to all active operators.
   */
  static broadcast(event: string, data: any) {
    if (!this.wss) return;
    const payload = JSON.stringify({ event, data });
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  /**
   * Returns active connections count.
   */
  static getActiveConnectionsCount(): number {
    return this.clients.size;
  }
}
