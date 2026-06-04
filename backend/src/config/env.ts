/**
 * FP-OS :: Environment Configuration
 * Reads directly from process.env with safe fallbacks.
 * No validation library — server starts regardless of missing vars.
 */

export const env = {
  PORT: process.env.PORT || '8080',
  AI_PROVIDER_KEY: process.env.AI_PROVIDER_KEY || '',
  SYSTEM_REALISM_MODE: (process.env.SYSTEM_REALISM_MODE as 'BRUTAL_EXPLICIT' | 'SAFE') || 'BRUTAL_EXPLICIT',
  // Optional — only needed if Supabase features are enabled
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || '',
  REDIS_URL: process.env.REDIS_URL || '',
};
