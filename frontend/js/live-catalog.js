/**
 * Loads PostgreSQL catalog into home/detail pages when API is available.
 */
import { getAllMovies, getMovie, getRelated } from './api-client.js';
import { img } from './config.js';

function posterFor(row) {
  return img(row.poster_url || row.poster || '');
}

export async function hydrateDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title');
  if (!title) return false;

  const titleEl = document.getElementById('movie-title');
  const descEl = document.getElementById('movie-description');
  const relatedEl = document.getElementById('related-movies');
  if (!titleEl || !descEl) return false;

  try {
    const movie = await getMovie(title);
    titleEl.textContent = movie.title || title;
    descEl.textContent =
      movie.synopsis ||
      movie.long_description ||
      movie.description ||
      'No description available.';

    const banner = document.getElementById('banner');
    if (banner && (movie.poster_url || movie.poster)) {
      banner.style.backgroundImage = `url('${posterFor(movie)}')`;
    }

    if (relatedEl) {
      const related = await getRelated(title);
      relatedEl.innerHTML = '';
      related.forEach((r) => {
        const card = document.createElement('div');
        card.className = 'movie-wrapper';
        card.innerHTML = `
          <a href="movieinfo.html?title=${encodeURIComponent(r.title)}">
            <div class="movie-card" style="background-image:url('${posterFor(r)}')"></div>
          </a>`;
        relatedEl.appendChild(card);
      });
    }
    return true;
  } catch (e) {
    console.warn('API detail fallback:', e.message);
    return false;
  }
}

export async function renderDbMovieGrid(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const movies = await getAllMovies();
    container.innerHTML = '';
    movies.forEach((m) => {
      const wrap = document.createElement('div');
      wrap.className = 'movie-wrapper';
      wrap.innerHTML = `
        <a href="movieinfo.html?title=${encodeURIComponent(m.title)}">
          <div class="movie-card" style="background-image:url('${posterFor(m)}')"></div>
        </a>
        <div class="movie-info-bar">
          <div class="imdb-block">${m.rating_score ?? m.rating ?? m.imdb ?? '—'}</div>
        </div>`;
      container.appendChild(wrap);
    });
  } catch (e) {
    console.warn('API catalog fallback:', e.message);
  }
}
