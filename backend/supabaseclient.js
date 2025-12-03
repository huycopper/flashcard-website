// supabaseClient.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

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
