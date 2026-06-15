# FP-OS Architecture & Troubleshooting Guide

This document captures the hard-earned lessons and specific configuration requirements for the FP-OS monorepo (Next.js Frontend + Hono/Node Backend).

## 1. CORS & Connection Errors ("Strategy engine offline")
When the frontend displays `Connection error. Strategy engine offline.`, it means the `fetch` request to the backend failed entirely. This is almost always caused by one of two things:

**A. Strict CORS Requirements**
The backend `index.ts` has a strict CORS whitelist. If the frontend domain changes or has a `www.` prefix added, the backend will block it.
- *Rule:* The exact domain (e.g., `https://www.lumensky.space` AND `https://lumensky.space`) must be in the `allowedOrigins` array in `backend/src/index.ts`.
- *Error Signature:* In the browser DevTools Console: `Response to preflight request doesn't pass access control check... blocked by CORS policy`.

**B. Malformed API URLs**
If `NEXT_PUBLIC_API_URL` on the Vercel frontend is configured with a trailing slash (e.g. `https://fp-xxx.run.app/`), building the URL like `${baseUrl}/api/...` creates a double slash (`//api/...`) which causes Cloud Run to throw 400/404 errors.
- *Fix:* The frontend logic (`chat-view.tsx`, `intake/page.tsx`, etc.) strips trailing slashes dynamically using `.replace(/\/$/, "")`. Always maintain this pattern when creating new fetch requests.

## 2. Supabase Auth & Magic Links
When a user signs up using `signInWithOtp` and `shouldCreateUser: true`, Supabase triggers the **Confirm Signup** email template, not the standard OTP template.
- *Issue:* Supabase may send a Magic Link (`{{ .ConfirmationURL }}`) instead of a 6-digit OTP code (`{{ .Token }}`).
- *Fix:* Instead of forcing the user to find a 6-digit code, the UI in `auth-modal.tsx` gracefully supports clicking the Magic Link directly from their email. Clicking the link verifies the session and triggers the `onAuthStateChange` listener to log them in automatically.

## 3. Git Merge Conflicts
When merging code from the `backend` branch to `main`, be extremely careful about leftover git conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`).
- *Issue:* If a conflict marker is accidentally committed into `.ts` files, the Node/Hono server will completely crash on startup with a SyntaxError.
- *Fix:* Always run `npx tsc --noEmit` locally in the `backend/` directory after resolving merge conflicts to guarantee the code is syntactically valid before pushing to production.

## 4. LLM Service Payload Architecture
The `LLMService.generateSmartResponse` method returns an object containing `{ response_text, task_classification }`, not a raw string. 
- Ensure that anywhere `LLMService.generateSmartResponse` is called, you extract the text using `.response_text` instead of using the raw response object.
