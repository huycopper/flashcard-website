// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');   

require('dotenv').config();

const { supabaseAnon } = require('./supabaseclient');
const { requireUser } = require('./authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

// phục vụ file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// route trả về giao diện chính
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * Authentication với Supabase
 */

// Đăng ký user mới
app.post('/api/signup', async (req, res) => {
  const { email, password, displayName } = req.body;

  const { data, error } = await supabaseAnon.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }

  res.json({ user: data.user });
});

// Đăng nhập
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }

  // trả về access_token để client gửi kèm cho các request khác
  res.json({
    user: data.user,
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});

// Lấy thông tin user hiện tại + profile
app.get('/api/me', requireUser, async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabaseAnon
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ user: req.user, profile: data });
});

/**
 * Decks & Cards
 */

// Lấy danh sách deck của user (RLS sẽ filter)
app.get('/api/decks', requireUser, async (req, res) => {
  const { data, error } = await supabaseAnon
    .from('decks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Tạo deck mới
app.post('/api/decks', requireUser, async (req, res) => {
  const userId = req.user.id;
  const { title, description, is_public } = req.body;

  const { data, error } = await supabaseAnon
    .from('decks')
    .insert({
      owner_id: userId,
      title,
      description,
      is_public: !!is_public,
    })
    .select('*')
    .single();

  if (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

// Lấy detail 1 deck + cards
app.get('/api/decks/:id', requireUser, async (req, res) => {
  const deckId = req.params.id;

  const { data: deck, error: deckError } = await supabaseAnon
    .from('decks')
    .select('*')
    .eq('id', deckId)
    .single();

  if (deckError) {
    console.error(deckError);
    return res.status(404).json({ error: 'Deck not found' });
  }

  const { data: cards, error: cardsError } = await supabaseAnon
    .from('cards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: true });

  if (cardsError) {
    console.error(cardsError);
    return res.status(500).json({ error: cardsError.message });
  }

  res.json({ deck, cards });
});

// Thêm card vào deck
app.post('/api/decks/:id/cards', requireUser, async (req, res) => {
  const deckId = req.params.id;
  const { front, back } = req.body;

  const { data, error } = await supabaseAnon
    .from('cards')
    .insert({
      deck_id: deckId,
      front,
      back,
    })
    .select('*')
    .single();

  if (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

/**
 * Public catalog (browse + search)
 */

// List public decks + author label
app.get('/api/public-decks', async (req, res) => {
  const { q } = req.query;

  let query = supabaseAnon
    .from('decks')
    .select(
      `
      id,
      title,
      description,
      is_public,
      created_at,
      owner:owner_id (
        id,
        display_name
      )
      `
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

/**
 * Storage demo: upload avatar
 * (ở đây demo kiểu rất đơn giản: client gửi base64, backend upload lên Supabase Storage)
 */

app.post('/api/avatar-upload', requireUser, async (req, res) => {
  const { base64 } = req.body;
  const userId = req.user.id;

  if (!base64) {
    return res.status(400).json({ error: 'Missing base64 image' });
  }

  const buffer = Buffer.from(base64, 'base64');
  const filePath = `avatars/${userId}-${Date.now()}.png`;

  const { data, error } = await supabaseAnon.storage
    .from('avatars')
    .upload(filePath, buffer, {
      contentType: 'image/png',
    });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  // Lấy public URL (nếu bucket để public)
  const {
    data: { publicUrl },
  } = supabaseAnon.storage.from('avatars').getPublicUrl(filePath);

  // cập nhật profile.avatar_url
  await supabaseAnon
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId);

  res.json({ url: publicUrl });
});

/**
 * Edge Function: gọi function 'deck-stats'
 */

app.get('/api/decks/:id/stats', requireUser, async (req, res) => {
  const deckId = req.params.id;

  const { data, error } = await supabaseAnon.functions.invoke('deck-stats', {
    body: { deck_id: deckId },
  });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
