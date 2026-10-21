(() => {
  'use strict';
  const config = window.MINDORA_AUTH_CONFIG || {};
  const $ = id => document.getElementById(id);
  const form = $('authForm');
  const emailInput = $('authEmail');
  const passwordInput = $('authPassword');
  const nameInput = $('authName');
  const confirmInput = $('authConfirm');
  const submitButton = $('authSubmit');
  const notice = $('authNotice');
  const passwordWrap = $('passwordWrap');
  const confirmWrap = $('confirmWrap');
  const nameWrap = $('nameWrap');
  const forgotLink = $('forgotLink');
  const switchText = $('authSwitchText');
  const switchButton = $('authSwitch');
  const signoutButton = $('authSignOut');
  const modeTitle = $('authTitle');
  const modeEyebrow = $('authEyebrow');
  const modeCopy = $('authCopy');
  const SESSION_KEY = 'mindora_auth_session_v1';
  let mode = 'signin';
  let session = readSession();

  function configured() {
    return typeof config.supabaseUrl === 'string' && /^https:\/\//.test(config.supabaseUrl) &&
      !config.supabaseUrl.includes('YOUR_SUPABASE') &&
      typeof config.supabaseAnonKey === 'string' && config.supabaseAnonKey.length > 20 &&
      !config.supabaseAnonKey.includes('YOUR_SUPABASE');
  }
  function readSession() {
    try { const value = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); return value && value.access_token ? value : null; }
    catch { return null; }
  }
  function saveSession(value) {
    session = value && value.access_token ? value : null;
    try { if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session)); else localStorage.removeItem(SESSION_KEY); } catch {}
    renderAccount();
  }
  function showNotice(message, kind = 'info') {
    notice.textContent = message;
    notice.className = 'auth-notice show ' + kind;
  }
  function clearNotice() { notice.textContent = ''; notice.className = 'auth-notice'; }
  function setBusy(busy, label) {
    submitButton.disabled = busy;
    submitButton.textContent = busy ? 'Please wait…' : label;
  }
  function setMode(next) {
    mode = next;
    clearNotice();
    const isSignin = mode === 'signin';
    const isSignup = mode === 'signup';
    const isForgot = mode === 'forgot';
    const isReset = mode === 'reset';
    passwordWrap.hidden = isForgot;
    confirmWrap.hidden = !isSignup;
    nameWrap.hidden = !isSignup;
    forgotLink.hidden = !isSignin;
    passwordInput.required = !isForgot;
    confirmInput.required = isSignup;
    nameInput.required = isSignup;
    if (isSignin) {
      modeEyebrow.textContent = 'WELCOME BACK'; modeTitle.textContent = 'Sign in to Mindora';
      modeCopy.textContent = 'Pick up where your learning left off.'; submitButton.textContent = 'Sign in securely';
      switchText.textContent = 'New to Mindora?'; switchButton.textContent = 'Create account';
    } else if (isSignup) {
      modeEyebrow.textContent = 'YOUR LEARNING SPACE'; modeTitle.textContent = 'Create your account';
      modeCopy.textContent = 'A personal space for your learning journey.'; submitButton.textContent = 'Create account';
      switchText.textContent = 'Already have an account?'; switchButton.textContent = 'Sign in';
    } else if (isForgot) {
      modeEyebrow.textContent = 'ACCOUNT RECOVERY'; modeTitle.textContent = 'Reset your password';
      modeCopy.textContent = 'We’ll send a recovery link to your email.'; submitButton.textContent = 'Send recovery link';
      switchText.textContent = 'Remember your password?'; switchButton.textContent = 'Back to sign in';
    } else {
      modeEyebrow.textContent = 'SECURE YOUR ACCOUNT'; modeTitle.textContent = 'Choose a new password';
      modeCopy.textContent = 'Set a new password for your Mindora account.'; submitButton.textContent = 'Update password';
      switchText.textContent = 'Need to sign in instead?'; switchButton.textContent = 'Back to sign in';
      passwordInput.required = true;
    }
    confirmInput.value = '';
    $('authPasswordLabel').textContent = isReset ? 'New password' : 'Password';
    passwordInput.autocomplete = isSignup ? 'new-password' : (isReset ? 'new-password' : 'current-password');
  }
  function renderAccount() {
    const signedIn = Boolean(session);
    $('accountPanel').hidden = !signedIn;
    $('authFormPanel').hidden = signedIn;
    if (signedIn) {
      $('accountEmail').textContent = session.user?.email || 'Mindora account';
      $('accountId').textContent = session.user?.id ? 'Account connected' : 'Signed in';
    }
  }
  async function api(path, options = {}, token = '') {
    if (!configured()) throw new Error('Authentication setup is incomplete. Add your Supabase Project URL and anon/public key in auth-config.js first.');
    const headers = { 'Content-Type': 'application/json', 'apikey': config.supabaseAnonKey, ...(options.headers || {}) };
    if (token) headers.Authorization = 'Bearer ' + token;
    const response = await fetch(config.supabaseUrl.replace(/\/$/, '') + '/auth/v1/' + path, { ...options, headers });
    let data = {};
    try { data = await response.json(); } catch {}
    if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || 'Request failed. Please try again.');
    return data;
  }
  function cleanRedirect() {
    const url = new URL(location.href);
    url.searchParams.delete('mode'); url.hash = '';
    return url.origin + url.pathname;
  }
  async function submit(event) {
    event.preventDefault();
    clearNotice();
    if (!configured()) {
      showNotice('One-time setup required: create a Supabase project and add its Project URL + anon/public key to auth-config.js. This form will not pretend to create accounts before that.', 'warning');
      return;
    }
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    try {
      setBusy(true, 'Continue');
      if (mode === 'signup') {
        if (password.length < 8) throw new Error('Use a password with at least 8 characters.');
        if (password !== confirmInput.value) throw new Error('The passwords do not match.');
        const data = await api('signup', { method: 'POST', body: JSON.stringify({ email, password, data: { full_name: nameInput.value.trim() } }) });
        if (data.access_token) { saveSession(data); showNotice('Account created successfully. Welcome to Mindora!', 'success'); }
        else showNotice('Account request received. Check your email to verify the account, then sign in.', 'success');
      } else if (mode === 'signin') {
        const data = await api('token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
        saveSession(data); showNotice('You are signed in. Your Mindora account is connected.', 'success');
      } else if (mode === 'forgot') {
        await api('recover', { method: 'POST', body: JSON.stringify({ email, redirect_to: cleanRedirect() }) });
        showNotice('If an account exists for that email, a recovery link will be sent. Check your inbox.', 'success');
      } else if (mode === 'reset') {
        if (password.length < 8) throw new Error('Use a password with at least 8 characters.');
        const data = await api('user', { method: 'PUT', body: JSON.stringify({ password }) }, session?.access_token || new URLSearchParams(location.hash.slice(1)).get('access_token') || '');
        if (data.id) showNotice('Password updated. You can now sign in with your new password.', 'success');
        setMode('signin');
      }
    } catch (error) {
      showNotice(error.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setBusy(false, mode === 'signin' ? 'Sign in securely' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send recovery link' : 'Update password');
    }
  }
  switchButton.addEventListener('click', () => {
    if (mode === 'signin') setMode('signup');
    else if (mode === 'signup') setMode('signin');
    else setMode('signin');
  });
  forgotLink.addEventListener('click', event => { event.preventDefault(); setMode('forgot'); });
  form.addEventListener('submit', submit);
  signoutButton.addEventListener('click', async () => {
    try { if (session?.access_token && configured()) await api('logout', { method: 'POST' }, session.access_token); }
    catch {}
    saveSession(null); setMode('signin'); showNotice('You have signed out of Mindora.', 'success');
  });
  $('goDashboard').addEventListener('click', () => location.href = '/dashboard.html');
  $('passwordToggle').addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    $('passwordToggle').textContent = show ? 'Hide' : 'Show';
    $('passwordToggle').setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get('access_token') && hash.get('type') === 'recovery') {
    saveSession({ access_token: hash.get('access_token'), refresh_token: hash.get('refresh_token') || '', user: null });
    setMode('reset');
    showNotice('Recovery link accepted. Enter your new password below.', 'success');
  } else if (new URLSearchParams(location.search).get('mode') === 'signup') setMode('signup');
  else setMode('signin');
  renderAccount();
  if (!configured()) showNotice('Preview mode: the premium login screen is ready, but real account creation needs Supabase keys in auth-config.js.', 'warning');
})();