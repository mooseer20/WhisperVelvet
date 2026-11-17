import { loginUser, registerUser } from './api-client.js';

const USER_KEY = 'vw_user';

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function storeUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

function bindAuthForm(form, handler) {
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    try {
      await handler(form);
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

export function initLoginForm() {
  bindAuthForm(document.querySelector('.login-form'), async (form) => {
    const email = form.querySelector('#email')?.value?.trim();
    const password = form.querySelector('#password')?.value || '';
    const data = await loginUser({ email, password });
    storeUser(data.user);
    window.location.href = 'whoiswatch.html';
  });
}

export function initRegisterForm() {
  bindAuthForm(document.querySelector('.login-form'), async (form) => {
    const username = form.querySelector('#username')?.value?.trim();
    const email = form.querySelector('#email')?.value?.trim();
    const password = form.querySelector('#password')?.value || '';
    const confirm = form.querySelector('#confirm-password')?.value || '';
    if (password !== confirm) {
      throw new Error('Passwords do not match');
    }
    const data = await registerUser({ username, email, password });
    storeUser(data.user);
    window.location.href = 'whoiswatch.html';
  });
}
