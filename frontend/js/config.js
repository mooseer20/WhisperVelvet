/**
 * Paths for Velvet Whispers (images at project root, API in /backend).
 */
export const IMG_BASE = '../';

export function img(path) {
  if (!path) return `${IMG_BASE}placeholder.jpg`;
  if (/^https?:\/\//i.test(path) || path.startsWith('/')) return path;
  return `${IMG_BASE}${path.replace(/^\.\.?\//, '')}`;
}

export function apiUrl(path) {
  if (location.protocol === 'file:') {
    console.warn('API needs a web server. Open http://localhost/WhispVelvet/ instead of file://');
  }
  const base = window.VW_API_BASE || detectApiBase();
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
function detectApiBase() {
  // Hardcoding the bridge directly to your PHP server for local testing
  return 'http://localhost:8000/backend';
}
