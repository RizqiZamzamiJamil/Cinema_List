const directTmdbApiUrl = 'https://api.themoviedb.org/3';
const centralizedTmdbApiUrl = 'https://api.rizam.fun/tmdb';

// API
const defaultTmdbApiUrl = centralizedTmdbApiUrl;

// FALLBACK API ASLI TMDB:
// const defaultTmdbApiUrl = directTmdbApiUrl;

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function normalizePath(path) {
  return path.startsWith('/') ? path : `/${path}`;
}

function browserOrigin() {
  return typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
}

export const apiUrl = trimTrailingSlash(
  import.meta.env.VITE_TMDB_API_BASE_URL || defaultTmdbApiUrl,
);
export const isDirectTmdbApi = apiUrl.includes('api.themoviedb.org');
export const apiKey = import.meta.env.VITE_TMDB_API_KEY || '';
export const tmdbSearchPath = import.meta.env.VITE_TMDB_SEARCH_PATH
  || (isDirectTmdbApi ? '/search/multi' : '/search');

export function buildTmdbUrl(path, params = {}) {
  const url = new URL(`${apiUrl}${normalizePath(path)}`, browserOrigin());
  const searchParams = {
    language: 'id-ID',
    ...params,
  };

  if (isDirectTmdbApi && apiKey) {
    searchParams.api_key = apiKey;
  }

  url.search = new URLSearchParams(
    Object.entries(searchParams).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ).toString();

  return url;
}

export const imageUrl = 'https://image.tmdb.org/t/p/w500';
export const profileUrl = 'https://image.tmdb.org/t/p/w185';
export const logoUrl = 'https://image.tmdb.org/t/p/original';
export const backdropUrl = 'https://image.tmdb.org/t/p/original';
export const heroUrl = new URL('../../img/hero.jpeg', import.meta.url).href;

export const movieAppend = [
  'credits',
  'videos',
  'images',
  'release_dates',
  'watch/providers',
  'external_ids',
  'keywords',
  'reviews',
  'recommendations',
  'similar',
].join(',');

export const tvAppend = [
  'aggregate_credits',
  'credits',
  'videos',
  'images',
  'content_ratings',
  'watch/providers',
  'external_ids',
  'keywords',
  'reviews',
  'recommendations',
  'similar',
].join(',');
