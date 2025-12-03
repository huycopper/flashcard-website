// authMiddleware.js
const { supabaseAnon } = require('./supabaseclient');

async function requireUser(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = data.user; // { id, email, ... }
  next();
}

module.exports = { requireUser };
