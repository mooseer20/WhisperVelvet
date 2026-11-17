/**
 * Posters live in project root; HTML pages are in /frontend/.
 * Include this script before any inline catalog scripts.
 */
(function (global) {
  function assetUrl(path) {
    if (!path) return '../placeholder.jpg';
    if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
    if (path.startsWith('../') || path.startsWith('/')) return path;
    return '../' + path.replace(/^\.\//, '');
  }

  global.assetUrl = assetUrl;
})(typeof window !== 'undefined' ? window : globalThis);
