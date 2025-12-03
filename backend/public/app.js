// public/app.js

const API_BASE = 'http://localhost:4000/api';
let accessToken = localStorage.getItem('accessToken') || null;
let currentDeckId = null;

updateAuthStatus();

function log(msg) {
  const logEl = document.getElementById('log');
  const time = new Date().toLocaleTimeString();
  logEl.textContent += `[${time}] ${msg}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

function updateAuthStatus() {
  const el = document.getElementById('authStatus');
  if (accessToken) {
    el.textContent = 'Logged in';
  } else {
    el.textContent = 'Not logged in';
  }
}

// helper fetch có tự thêm Bearer token
async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const errorMsg = data && data.error ? data.error : res.statusText;
    throw new Error(errorMsg);
  }

  return data;
}

// ========== AUTH ==========

async function signup() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const displayName = document.getElementById('displayName').value.trim();

  if (!email || !password) {
    alert('Email and password are required');
    return;
  }

  try {
    const data = await apiFetch('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    log(`Signup success: ${data.user.email}`);
    alert('Signup ok. Check email if confirmation is enabled.');
  } catch (err) {
    log(`Signup error: ${err.message}`);
    alert('Signup error: ' + err.message);
  }
}

async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('Email and password are required');
    return;
  }

  try {
    const data = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    accessToken = data.access_token;
    localStorage.setItem('accessToken', accessToken);
    updateAuthStatus();
    log(`Login success: ${data.user.email}`);
    await loadMe();
    await loadMyDecks();
  } catch (err) {
    log(`Login error: ${err.message}`);
    alert('Login error: ' + err.message);
  }
}

function logout() {
  accessToken = null;
  localStorage.removeItem('accessToken');
  updateAuthStatus();
  document.getElementById('profileInfo').textContent = '';
  currentDeckId = null;
  document.getElementById('currentDeckLabel').textContent = 'No deck selected';
  document.getElementById('reloadDeckBtn').disabled = true;
  document.getElementById('deckStatsBtn').disabled = true;
  document.getElementById('cardList').innerHTML = '';
  log('Logged out');
}

// ========== PROFILE / ME ==========

async function loadMe() {
  if (!accessToken) {
    alert('You must login first');
    return;
  }

  try {
    const data = await apiFetch('/me');
    const p = data.profile;
    document.getElementById('profileInfo').innerHTML =
      `ID: ${p.id}<br>` +
      `Email: ${p.email}<br>` +
      `Name: ${p.display_name}<br>` +
      `Role: ${p.role}<br>` +
      (p.avatar_url ? `<img src="${p.avatar_url}" width="80" />` : '');
    log('Loaded profile info');
  } catch (err) {
    log(`Load profile error: ${err.message}`);
    alert('Load profile error: ' + err.message);
  }
}

// ========== STORAGE (AVATAR) ==========

async function uploadAvatar() {
  if (!accessToken) {
    alert('You must login first');
    return;
  }

  const fileInput = document.getElementById('avatarFile');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please choose an image file');
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const base64 = reader.result.split(',')[1]; // data:image/...;base64,XXXX
      const data = await apiFetch('/avatar-upload', {
        method: 'POST',
        body: JSON.stringify({ base64 }),
      });
      log('Avatar uploaded: ' + data.url);
      document.getElementById('avatarPreview').innerHTML =
        `<img src="${data.url}" width="80" />`;
    } catch (err) {
      log('Avatar upload error: ' + err.message);
      alert('Avatar upload error: ' + err.message);
    }
  };
  reader.readAsDataURL(file);
}

// ========== DECKS ==========

async function loadMyDecks() {
  if (!accessToken) {
    alert('You must login first');
    return;
  }

  try {
    const decks = await apiFetch('/decks');
    const container = document.getElementById('myDeckList');
    container.innerHTML = '';

    if (!decks.length) {
      container.textContent = 'No decks yet.';
      return;
    }

    decks.forEach((d) => {
      const div = document.createElement('div');
      div.className = 'deck-item';
      div.textContent = `${d.title} ${d.is_public ? '(public)' : '(private)'}`;
      div.onclick = () => selectDeck(d.id, d.title);
      container.appendChild(div);
    });

    log(`Loaded ${decks.length} decks.`);
  } catch (err) {
    log('Load decks error: ' + err.message);
    alert('Load decks error: ' + err.message);
  }
}

function selectDeck(id, title) {
  currentDeckId = id;
  document.getElementById('currentDeckLabel').textContent =
    `Current deck: ${title} (${id})`;
  document.getElementById('reloadDeckBtn').disabled = false;
  document.getElementById('deckStatsBtn').disabled = false;
  loadCurrentDeck();
  loadDeckStats();
}

async function createDeck() {
  if (!accessToken) {
    alert('You must login first');
    return;
  }

  const title = document.getElementById('deckTitle').value.trim();
  const description = document.getElementById('deckDescription').value.trim();
  const is_public = document.getElementById('deckIsPublic').checked;

  if (!title) {
    alert('Title is required');
    return;
  }

  try {
    const d = await apiFetch('/decks', {
      method: 'POST',
      body: JSON.stringify({ title, description, is_public }),
    });
    log('Deck created: ' + d.id);
    document.getElementById('deckTitle').value = '';
    document.getElementById('deckDescription').value = '';
    document.getElementById('deckIsPublic').checked = false;
    await loadMyDecks();
  } catch (err) {
    log('Create deck error: ' + err.message);
    alert('Create deck error: ' + err.message);
  }
}

async function loadCurrentDeck() {
  if (!currentDeckId) {
    alert('No deck selected');
    return;
  }
  if (!accessToken) {
    alert('You must login first');
    return;
  }

  try {
    const data = await apiFetch(`/decks/${currentDeckId}`);
    const cards = data.cards;
    const container = document.getElementById('cardList');
    container.innerHTML = '';

    if (!cards.length) {
      container.textContent = 'No cards yet.';
      return;
    }

    cards.forEach((c) => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML =
        `<b>Front:</b> ${c.front}<br>` +
        `<b>Back:</b> ${c.back}`;
      container.appendChild(div);
    });

    log(`Loaded ${cards.length} cards for current deck.`);
  } catch (err) {
    log('Load deck error: ' + err.message);
    alert('Load deck error: ' + err.message);
  }
}

async function addCard() {
  if (!currentDeckId) {
    alert('Select a deck first');
    return;
  }
  if (!accessToken) {
    alert('You must login first');
    return;
  }

  const front = document.getElementById('cardFront').value.trim();
  const back = document.getElementById('cardBack').value.trim();

  if (!front || !back) {
    alert('Front and back are required');
    return;
  }

  try {
    await apiFetch(`/decks/${currentDeckId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ front, back }),
    });
    log('Card added');
    document.getElementById('cardFront').value = '';
    document.getElementById('cardBack').value = '';
    await loadCurrentDeck();
  } catch (err) {
    log('Add card error: ' + err.message);
    alert('Add card error: ' + err.message);
  }
}

// ========== PUBLIC DECKS (catalog) ==========

async function loadPublicDecks() {
  const q = document.getElementById('searchText').value.trim();
  let url = '/public-decks';
  if (q) url += `?q=${encodeURIComponent(q)}`;

  try {
    const decks = await apiFetch(url, { method: 'GET' });
    const container = document.getElementById('publicDeckList');
    container.innerHTML = '';

    if (!decks.length) {
      container.textContent = 'No public decks found.';
      return;
    }

    decks.forEach((d) => {
      const div = document.createElement('div');
      div.className = 'deck-item';
      div.style.background = '#333';
      div.style.color = '#eee';
      div.innerHTML =
        `<b>${d.title}</b><br>` +
        `<span class="small">By: ${d.owner.display_name}</span>`;
      container.appendChild(div);
    });

    log(`Loaded ${decks.length} public decks.`);
  } catch (err) {
    log('Load public decks error: ' + err.message);
    alert('Load public decks error: ' + err.message);
  }
}

// ========== EDGE FUNCTION (Deck stats) ==========

async function loadDeckStats() {
  if (!currentDeckId) return;
  if (!accessToken) {
    alert('You must login first');
    return;
  }

  try {
    const data = await apiFetch(`/decks/${currentDeckId}/stats`, {
      method: 'GET',
    });

    const el = document.getElementById('deckStats');
    el.innerHTML =
      `Card count: ${data.card_count}<br>` +
      `Rating count: ${data.rating_count}<br>` +
      `Average rating: ${
        data.avg_rating === null ? 'N/A' : data.avg_rating.toFixed(2)
      }`;

    log('Loaded deck stats via Edge Function');
  } catch (err) {
    log('Load deck stats error: ' + err.message);
    alert('Load deck stats error: ' + err.message);
  }
}

// Tự động nếu có token sẵn thì load profile + deck
if (accessToken) {
  loadMe().catch(() => {});
  loadMyDecks().catch(() => {});
  loadPublicDecks().catch(() => {});
} else {
  loadPublicDecks().catch(() => {});
}
