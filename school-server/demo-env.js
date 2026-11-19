// The shared starter connector expects this slot. A sandbox may only provide
// the anonymous key, which retains its limited privileges and uses demo RLS.
// This fallback does not create or elevate credentials or change .env.
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
