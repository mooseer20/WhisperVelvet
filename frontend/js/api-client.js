import { apiUrl } from './config.js';

async function request(path, options = {}) {
  const res = await fetch(apiUrl(path), {
    headers: { Accept: 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function getAllMovies() {
  return request('api/movies.php');
}

export async function getAllSeries() {
  return request('api/series.php');
}

export async function getMovie(title) {
  return request(`api/movie.php?title=${encodeURIComponent(title)}`);
}

export async function searchMovies(query) {
  return request(`api/search.php?q=${encodeURIComponent(query)}`);
}

export async function getRelated(title) {
  return request(`api/related.php?title=${encodeURIComponent(title)}`);
}

export async function getBooks(title) {
  return request(`api/books.php?title=${encodeURIComponent(title)}`);
}

export async function registerUser(payload) {
  return request('auth/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return request('auth/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
