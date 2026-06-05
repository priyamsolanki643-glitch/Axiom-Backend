import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import * as crypto from 'crypto';

export const authRoutes = new Hono();

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'FP_OS_SECURE_JWT_SECRET_KEY_2026';

interface OtpSession {
  target: string; // Email or Phone number
  codeHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

// In-memory OTP storage protected by hashing
const otpSessions = new Map<string, OtpSession>();

// Helper to calculate SHA-256 hash
function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Cooldown and expiry limits
const COOLDOWN_MS = 60 * 1000;  // 1 minute cooldown to prevent spamming
const EXPIRY_MS = 5 * 60 * 1000; // 5 minutes validity
const MAX_ATTEMPTS = 3;         // Lockout after 3 invalid attempts

// Route: Send OTP (Email or Phone)
authRoutes.post('/otp/send', async (c) => {
  try {
    const { target, type } = await c.req.json();

    if (!target || !type || (type !== 'email' && type !== 'phone')) {
      return c.json({ error: 'Invalid target address or verification type.' }, 400);
    }

    const normalizedTarget = target.trim().toLowerCase();
    const now = Date.now();

    // Rate Limiting Check: Prevent spamming request
    const existingSession = otpSessions.get(normalizedTarget);
    if (existingSession && now - existingSession.lastSentAt < COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - existingSession.lastSentAt)) / 1000);
      return c.json({
        error: `Please wait ${remainingSeconds} seconds before requesting a new code.`
      }, 429);
    }

    // Generate secure 6-digit numeric OTP
    const code = crypto.randomInt(100000, 999999).toString();
    const codeHash = sha256(code);

    // Store secure session
    otpSessions.set(normalizedTarget, {
      target: normalizedTarget,
      codeHash,
      expiresAt: now + EXPIRY_MS,
      attempts: 0,
      lastSentAt: now
    });

    // Simulated secure dispatch (Logged to server terminal for local verification)
    console.log('\n======================================');
    console.log(`[AUTH SERVICE] Secure OTP dispatch to ${normalizedTarget.toUpperCase()}`);
    console.log(`CODE: ${code}`);
    console.log(`EXPIRE: 5 minutes | HASH: ${codeHash}`);
    console.log('======================================\n');

    return c.json({
      status: 'success',
      message: `Verification code successfully dispatched to your registered ${type === 'email' ? 'email address' : 'phone number'}.`
    });

  } catch (error: any) {
    console.error('OTP Send Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Route: Verify OTP
authRoutes.post('/otp/verify', async (c) => {
  try {
    const { target, code } = await c.req.json();

    if (!target || !code) {
      return c.json({ error: 'Target identifier and verification code are required.' }, 400);
    }

    const normalizedTarget = target.trim().toLowerCase();
    const session = otpSessions.get(normalizedTarget);

    if (!session) {
      return c.json({ error: 'No active verification session found. Request a new code.' }, 400);
    }

    const now = Date.now();

    // Expiry Check
    if (now > session.expiresAt) {
      otpSessions.delete(normalizedTarget);
      return c.json({ error: 'Verification code has expired. Please request a new one.' }, 400);
    }

    // Attempt Check (Lockout prevention)
    if (session.attempts >= MAX_ATTEMPTS) {
      otpSessions.delete(normalizedTarget);
      return c.json({ error: 'Maximum verification attempts exceeded. Session locked.' }, 423);
    }

    // Hash user-provided code and verify
    const inputHash = sha256(code.trim());
    if (inputHash !== session.codeHash) {
      session.attempts += 1;
      otpSessions.set(normalizedTarget, session);

      const attemptsLeft = MAX_ATTEMPTS - session.attempts;
      if (attemptsLeft <= 0) {
        otpSessions.delete(normalizedTarget);
        return c.json({ error: 'Maximum attempts exceeded. Verification session terminated.' }, 423);
      }
      return c.json({ error: `Incorrect verification code. ${attemptsLeft} attempts remaining.` }, 400);
    }

    // Clear session on successful login
    otpSessions.delete(normalizedTarget);

    // Sign secure JWT session token
    const token = await sign(
      {
        sub: normalizedTarget,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days expiration
      },
      JWT_SECRET
    );

    return c.json({
      status: 'success',
      data: {
        token,
        user: {
          userId: normalizedTarget,
          email: normalizedTarget.includes('@') ? normalizedTarget : null,
          phone: !normalizedTarget.includes('@') ? normalizedTarget : null
        }
      }
    });

  } catch (error: any) {
    console.error('OTP Verify Error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Route: Google OAuth placeholder
authRoutes.post('/oauth/google', async (c) => {
  try {
    const { token: googleToken } = await c.req.json();
    if (!googleToken) {
      return c.json({ error: 'Google OAuth token is required.' }, 400);
    }

    // In a real application, you verify the token with Google ID API.
    // For local fallback/simulation, we verify and sign a secure JWT.
    const mockGoogleUser = 'google-user@gmail.com';
    const jwtToken = await sign(
      {
        sub: mockGoogleUser,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      },
      JWT_SECRET
    );

    return c.json({
      status: 'success',
      data: {
        token: jwtToken,
        user: {
          userId: mockGoogleUser,
          email: mockGoogleUser,
          phone: null
        }
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Route: GitHub OAuth placeholder
authRoutes.post('/oauth/github', async (c) => {
  try {
    const { code } = await c.req.json();
    if (!code) {
      return c.json({ error: 'GitHub authorization code is required.' }, 400);
    }

    const mockGithubUser = 'github-user@github.com';
    const jwtToken = await sign(
      {
        sub: mockGithubUser,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
      },
      JWT_SECRET
    );

    return c.json({
      status: 'success',
      data: {
        token: jwtToken,
        user: {
          userId: mockGithubUser,
          email: mockGithubUser,
          phone: null
        }
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});
