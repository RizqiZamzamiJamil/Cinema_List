export const apiKey = import.meta.env.VITE_TMDB_API_KEY || '12e2810e5d9b614ae49a5485cd26921c';
export const apiUrl = 'https://api.themoviedb.org/3';
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
