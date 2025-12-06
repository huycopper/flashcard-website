// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

console.log('=== SUPABASE CLIENT INIT ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'exists' : 'missing');

const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Cho những tác vụ admin (Edge, seed, bypass RLS nếu cần)
const supabaseService = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = {
  supabaseAnon,
  supabaseService,
};
