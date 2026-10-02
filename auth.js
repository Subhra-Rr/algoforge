'use strict';
/* =====================================================================
   ALGOFORGE — auth.js   (load this BEFORE script.js)
   ---------------------------------------------------------------------
   Local multi-account system for a frontend-only app.
   What this IS:   separate profiles on one device, each with its own
                   saved progress; passwords hashed with PBKDF2-SHA256
                   (Web Crypto) + per-user random salt.
   What this is NOT: server-grade security or cross-device sync. For
                   that you need a real backend (with the JWT secret
                   kept server-side) — ask and I'll build it.
===================================================================== */

const AFData = {
  key: user => 'algoforge_u_' + user,
  load(user) {
    try { return JSON.parse(localStorage.getItem(this.key(user)) || '{}'); }
    catch (e) { return {}; }
  },
  save(user, st) {
    try { localStorage.setItem(this.key(user), JSON.stringify(st)); } catch (e) {}
  }
};

const AFAuth = (() => {
  const USERS_KEY = 'algoforge_users';
  const SESSION_KEY = 'algoforge_session';
  const LEGACY_KEY = 'algoforge_v1';   // pre-account progress

  let currentUser = null;
  let onAuthDone = null;
  let mode = 'login';

  /* ---------- helpers ---------- */
  const readUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch (e) { return {}; } };
  const writeUsers = u => { try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch (e) {} };
  const enc = new TextEncoder();
  const toHex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  const fromHex = h => new Uint8Array((h.match(/.{2}/g) || []).map(x => parseInt(x, 16)));
  const randomSalt = () => toHex(crypto.getRandomValues(new Uint8Array(16)));

  async function hashPassword(password, saltHex) {
    if (crypto.subtle && crypto.subtle.importKey) {
      const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
      const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt: fromHex(saltHex), iterations: 120000, hash: 'SHA-256' }, key, 256);
      return toHex(bits);
    }
    // Rare fallback (non-secure context) — weaker, but keeps the app usable.
    console.warn('[AlgoForge] Web Crypto unavailable — using fallback hash.');
    let h = 2166136261;
    const s = saltHex + ':' + password;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return 'fb' + h.toString(16);
  }

  /* ---------- accounts ---------- */
  async function signup(username, password, importLegacy) {
    username = (username || '').trim();
    if (!/^[a-zA-Z0-9_ .-]{2,24}$/.test(username))
      throw new Error('Username: 2–24 characters (letters, numbers, space . _ -).');
    if ((password || '').length < 4)
      throw new Error('Password must be at least 4 characters.');
    const users = readUsers();
    const key = username.toLowerCase();
    if (users[key]) throw new Error('That username already exists on this device.');
    const salt = randomSalt();
    const hash = await hashPassword(password, salt);
    users[key] = { username, salt, hash, created: Date.now() };
    writeUsers(users);
    if (importLegacy && localStorage.getItem(LEGACY_KEY)) {
      localStorage.setItem(AFData.key(key), localStorage.getItem(LEGACY_KEY));
    } else {
      localStorage.setItem(AFData.key(key), localStorage.getItem(AFData.key(key)) || '{}');
    }
    startSession(key);
    return key;
  }

  async function login(username, password) {
    const key = (username || '').trim().toLowerCase();
    const rec = readUsers()[key];
    if (!rec) throw new Error('No account with that name on this device.');
    const hash = await hashPassword(password, rec.salt);
    if (hash !== rec.hash) throw new Error('Incorrect password.');
    startSession(key);
    return key;
  }

  /* ---------- session ---------- */
  function startSession(key) {
    currentUser = key;
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ user: key, t: Date.now() })); } catch (e) {}
  }
  function init() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (s && s.user && readUsers()[s.user]) currentUser = s.user;
    } catch (e) {}
    return Promise.resolve(currentUser);
  }
  function logout() {
    currentUser = null;
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    location.reload();
  }

  /* ---------- UI ---------- */
  function showLogin(done) {
    onAuthDone = done;
    if (document.getElementById('authOverlay')) return;
    const ov = document.createElement('div');
    ov.id = 'authOverlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Sign in to AlgoForge');
    ov.innerHTML = `
      <div class="auth-blob b1"></div><div class="auth-blob b2"></div><div class="auth-blob b3"></div>
      <div class="auth-card">
        <div class="auth-logo">⚡ Algo<em>Forge</em></div>
        <p class="auth-sub">Log in so your progress, streaks and badges save to your own profile — right here on this device.</p>
        <div class="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button type="button" class="auth-tab active" data-authmode="login" role="tab" aria-selected="true">Log in</button>
          <button type="button" class="auth-tab" data-authmode="signup" role="tab" aria-selected="false">Create account</button>
        </div>
        <form id="authForm" novalidate>
          <div class="auth-field">
            <label for="authUser">Username</label>
            <input id="authUser" maxlength="24" autocomplete="username" placeholder="e.g. priya_dsa" required>
          </div>
          <div class="auth-field">
            <label for="authPass">Password</label>
            <input id="authPass" type="password" autocomplete="current-password" placeholder="••••••••" required>
            <div class="auth-strength" id="authStrength" hidden aria-hidden="true"><i></i></div>
          </div>
          <div class="auth-field" id="authConfirmWrap" hidden>
            <label for="authPass2">Confirm password</label>
            <input id="authPass2" type="password" autocomplete="new-password" placeholder="••••••••" required>
          </div>
          <label class="auth-check" id="authImportWrap" hidden>
            <input type="checkbox" id="authImport"> Import existing local progress into this account
          </label>
          <div class="auth-err" id="authErr" role="alert" aria-live="polite"></div>
          <button class="btn primary auth-submit" id="authSubmit" type="submit">Log in</button>
        </form>
        <button type="button" class="auth-guest" id="authGuest">Continue without an account →</button>
        <p class="auth-note">Accounts never leave this browser — passwords are hashed (PBKDF2, per-user salt).<br>Separate profiles for each student on a shared computer.</p>
      </div>`;
    document.body.appendChild(ov);
    wire(ov);
    setTimeout(() => { const f = ov.querySelector('#authUser'); if (f) f.focus(); }, 80);
  }

  function hide() {
    const ov = document.getElementById('authOverlay');
    if (!ov) return;
    ov.classList.add('leaving');
    setTimeout(() => ov.remove(), 500);
  }

  function setMode(ov, m) {
    mode = m;
    ov.querySelectorAll('.auth-tab').forEach(t => {
      const on = t.dataset.authmode === m;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
    });
    const signup = m === 'signup';
    ov.querySelector('#authConfirmWrap').hidden = !signup;
    ov.querySelector('#authImportWrap').hidden = !signup;
    ov.querySelector('#authStrength').hidden = !signup;
    ov.querySelector('#authPass').setAttribute('autocomplete', signup ? 'new-password' : 'current-password');
    ov.querySelector('#authSubmit').textContent = signup ? 'Create account' : 'Log in';
    ov.querySelector('#authErr').textContent = '';
  }

  function wire(ov) {
    const card = ov.querySelector('.auth-card');
    const err = ov.querySelector('#authErr');
    const pass = ov.querySelector('#authPass');
    const meter = ov.querySelector('#authStrength i');

    ov.querySelectorAll('.auth-tab').forEach(t =>
      t.addEventListener('click', () => setMode(ov, t.dataset.authmode)));

    pass.addEventListener('input', () => {
      if (mode !== 'signup') return;
      let s = 0; const p = pass.value;
      if (p.length >= 4) s++;
      if (p.length >= 8) s++;
      if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
      if (/\d/.test(p) || /[^A-Za-z0-9]/.test(p)) s++;
      meter.style.width = (s * 25) + '%';
      meter.style.background = s <= 1 ? 'var(--bad)' : s === 2 ? 'var(--warn)' : 'var(--ok)';
    });

    ov.querySelector('#authForm').addEventListener('submit', async e => {
      e.preventDefault();
      err.textContent = '';
      const btn = ov.querySelector('#authSubmit');
      btn.classList.add('busy'); btn.disabled = true;
      try {
        const u = ov.querySelector('#authUser').value;
        const p = pass.value;
        let user;
        if (mode === 'signup') {
          if (p !== ov.querySelector('#authPass2').value) throw new Error('Passwords don\u2019t match.');
          user = await signup(u, p, ov.querySelector('#authImport').checked);
        } else {
          user = await login(u, p);
        }
        btn.classList.remove('busy');
        const ok = document.createElement('div');
        ok.className = 'auth-success';
        ok.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        card.appendChild(ok);
        if (typeof Confetti !== 'undefined') Confetti.burst(90);
        setTimeout(() => { hide(); if (onAuthDone) onAuthDone(user); }, 750);
      } catch (ex) {
        btn.classList.remove('busy'); btn.disabled = false;
        err.textContent = ex.message || 'Something went wrong.';
        card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      }
    });

    ov.querySelector('#authGuest').addEventListener('click', () => {
      hide(); if (onAuthDone) onAuthDone(null);
    });

    setMode(ov, 'login');
  }

  return { init, showLogin, logout, currentUser: () => currentUser };
})();