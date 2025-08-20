import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceRole) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (server only)');
}

// Use for server-side operations (migrations, admin tasks, or SSR if needed)
export const supabaseAdmin = createClient(url, serviceRole);