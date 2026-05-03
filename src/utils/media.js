import {
  BadgeInfo,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Languages,
  Layers3,
  PlayCircle,
  Star,
  Tv,
  WalletCards,
} from 'lucide-vue-next';
import { backdropUrl, heroUrl, imageUrl, logoUrl, profileUrl } from '../constants/tmdb';

export function resolveType(item, fallback) {
  if (fallback) return fallback;
  if (item?.media_type) return item.media_type;
  return item?.first_air_date || item?.name ? 'tv' : 'movie';
}

export function formatRating(value) {
  return value ? Number(value).toFixed(1) : 'N/A';
}

export function formatDate(value) {
  if (!value) return 'Belum tersedia';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatNumber(value) {
  if (!value) return 'Tidak tersedia';
  return new Intl.NumberFormat('id-ID').format(value);
}

export function formatMoney(value) {
  if (!value) return 'Tidak tersedia';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRuntime(item) {
  const runtime = item?.runtime || item?.episode_run_time?.[0] || item?.last_episode_to_air?.runtime;
  if (!runtime) return 'Tidak tersedia';
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours ? `${hours}j ${minutes}m` : `${minutes}m`;
}

export function formatLanguage(code) {
  if (!code) return 'Tidak tersedia';
  try {
    return new Intl.DisplayNames(['id'], { type: 'language' }).of(code) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export function truncateText(value, length = 160) {
  if (!value) return 'Belum ada data.';
  return value.length > length ? `${value.slice(0, length).trim()}...` : value;
}

export function mediaTitle(item) {
  return item?.title || item?.name || 'Tanpa judul';
}

export function mediaDate(item) {
  return item?.release_date || item?.first_air_date || '';
}

export function mediaTypeLabel(item, fallback) {
  return resolveType(item, fallback) === 'tv' ? 'Serial TV' : 'Film';
}

export function posterFor(item) {
  if (item?.poster_path) return `${imageUrl}${item.poster_path}`;
  if (item?.profile_path) return `${profileUrl}${item.profile_path}`;
  return `https://placehold.co/500x750/101114/e8f5f6?text=${encodeURIComponent(mediaTitle(item))}`;
}

export function profileFor(person) {
  if (person?.profile_path) return `${profileUrl}${person.profile_path}`;
  return `https://placehold.co/185x278/101114/e8f5f6?text=${encodeURIComponent(person?.name || 'Cast')}`;
}

export function backdropFor(item) {
  if (item?.backdrop_path) return `${backdropUrl}${item.backdrop_path}`;
  return heroUrl;
}

export function logoFor(company) {
  if (company?.logo_path) return `${logoUrl}${company.logo_path}`;
  return '';
}

export function genreNames(item, type = 'movie', genres = {}) {
  if (item?.genres?.length) return item.genres.map((genre) => genre.name).filter(Boolean);
  if (!item?.genre_ids?.length) return ['Genre belum tersedia'];

  const source = type === 'tv' ? genres.tv : genres.movie;
  const names = item.genre_ids.map((id) => source?.[id]).filter(Boolean);
  return names.length ? names.slice(0, 3) : ['Genre belum tersedia'];
}

export function castFor(item, type = 'movie') {
  if (!item) return [];
  const cast = type === 'tv'
    ? item.aggregate_credits?.cast || item.credits?.cast || []
    : item.credits?.cast || [];

  return cast.map((person) => ({
    ...person,
    role:
      person.character ||
      person.roles?.map((role) => role.character).filter(Boolean).join(', ') ||
      'Pemeran',
  }));
}

export function crewFor(item, jobs = []) {
  const crew = item?.credits?.crew || item?.aggregate_credits?.crew || [];
  const loweredJobs = jobs.map((job) => job.toLowerCase());
  return crew
    .filter((person) => loweredJobs.includes(String(person.job || '').toLowerCase()))
    .map((person) => person.name)
    .filter(Boolean)
    .slice(0, 5);
}

export function creatorNames(item, type = 'movie') {
  if (!item) return [];
  if (type === 'tv' && item.created_by?.length) {
    return item.created_by.map((person) => person.name).filter(Boolean).slice(0, 5);
  }
  return crewFor(item, ['Director', 'Screenplay', 'Writer']);
}

export function keywordList(item, type = 'movie') {
  const keywords = type === 'tv' ? item?.keywords?.results : item?.keywords?.keywords;
  return (keywords || []).map((keyword) => keyword.name).filter(Boolean).slice(0, 14);
}

export function primaryTrailer(item) {
  const videos = item?.videos?.results || [];
  return videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
    videos.find((video) => video.site === 'YouTube' && video.type === 'Teaser') ||
    videos.find((video) => video.site === 'YouTube');
}

export function certificationFor(item, type = 'movie') {
  if (type === 'tv') {
    const ratings = item?.content_ratings?.results || [];
    return ratings.find((rating) => rating.iso_3166_1 === 'ID')?.rating ||
      ratings.find((rating) => rating.iso_3166_1 === 'US')?.rating ||
      'Tidak tersedia';
  }

  const releases = item?.release_dates?.results || [];
  const region = releases.find((release) => release.iso_3166_1 === 'ID') ||
    releases.find((release) => release.iso_3166_1 === 'US');
  return region?.release_dates?.find((release) => release.certification)?.certification || 'Tidak tersedia';
}

export function providerList(item) {
  const providers = item?.['watch/providers']?.results || {};
  const region = providers.ID || providers.US;
  if (!region) return [];

  const seen = new Set();
  return ['flatrate', 'rent', 'buy']
    .flatMap((group) => (region[group] || []).map((provider) => ({ ...provider, accessType: group })))
    .filter((provider) => {
      if (seen.has(provider.provider_id)) return false;
      seen.add(provider.provider_id);
      return true;
    })
    .slice(0, 8);
}

export function externalLinks(item) {
  const ids = item?.external_ids || {};
  const links = [];
  if (item?.homepage) links.push({ label: 'Website', url: item.homepage });
  if (ids.imdb_id) links.push({ label: 'IMDb', url: `https://www.imdb.com/title/${ids.imdb_id}` });
  if (ids.wikidata_id) links.push({ label: 'Wikidata', url: `https://www.wikidata.org/wiki/${ids.wikidata_id}` });
  if (ids.facebook_id) links.push({ label: 'Facebook', url: `https://www.facebook.com/${ids.facebook_id}` });
  if (ids.instagram_id) links.push({ label: 'Instagram', url: `https://www.instagram.com/${ids.instagram_id}` });
  if (ids.twitter_id) links.push({ label: 'X/Twitter', url: `https://x.com/${ids.twitter_id}` });
  return links;
}

export function detailFacts(item, type = 'movie') {
  if (!item) return [];
  const base = [
    { label: 'Rating', value: `${formatRating(item.vote_average)} / 10`, icon: Star },
    { label: type === 'tv' ? 'Tayang perdana' : 'Rilis', value: formatDate(mediaDate(item)), icon: CalendarDays },
    { label: 'Durasi', value: formatRuntime(item), icon: Clock3 },
    { label: 'Bahasa asli', value: formatLanguage(item.original_language), icon: Languages },
    { label: 'Status', value: item.status || 'Tidak tersedia', icon: BadgeInfo },
    { label: 'Sertifikasi', value: certificationFor(item, type), icon: Layers3 },
  ];

  if (type === 'tv') {
    base.push(
      { label: 'Season', value: formatNumber(item.number_of_seasons), icon: Tv },
      { label: 'Episode', value: formatNumber(item.number_of_episodes), icon: PlayCircle },
      { label: 'Tipe', value: item.type || 'Tidak tersedia', icon: BarChart3 },
    );
  } else {
    base.push(
      { label: 'Budget', value: formatMoney(item.budget), icon: CircleDollarSign },
      { label: 'Revenue', value: formatMoney(item.revenue), icon: WalletCards },
    );
  }

  return base;
}

export function recommendationItems(item) {
  const recommendations = item?.recommendations?.results || [];
  const similar = item?.similar?.results || [];
  return [...recommendations, ...similar].filter((media) => media.poster_path).slice(0, 8);
}
