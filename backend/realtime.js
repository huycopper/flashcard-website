// realtime.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function main() {
  console.log('Listening for new comments on public decks...');

  const channel = supabase
    .channel('comments-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
      },
      (payload) => {
        console.log('New comment:', payload.new);
      }
    )
    .subscribe((status) => {
      console.log('Channel status:', status);
    });
}

main();
