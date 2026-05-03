<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { initFlowbite } from 'flowbite';
import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Clapperboard,
  Film,
  Loader2,
  Mail,
  MessageSquare,
  PlayCircle,
  Search,
  Send,
  Sparkles,
  Star,
  Tv,
  X,
} from 'lucide-vue-next';

const apiKey = import.meta.env.VITE_TMDB_API_KEY || '12e2810e5d9b614ae49a5485cd26921c';
const apiUrl = 'https://api.themoviedb.org/3';
const imageUrl = 'https://image.tmdb.org/t/p/w500';
const backdropUrl = 'https://image.tmdb.org/t/p/original';
const logoUrl = new URL('../img/logo.png', import.meta.url).href;
const heroUrl = new URL('../img/hero.jpeg', import.meta.url).href;

const sections = [
  { label: 'Home', href: '#home' },
  { label: 'Film', href: '#film' },
  { label: 'Serial TV', href: '#tv' },
  { label: 'Tanya', href: '#tanya' },
];

const topRated = ref([]);
const upcoming = ref([]);
const movies = ref([]);
const tvShows = ref([]);
const searchResults = ref([]);
const selectedItem = ref(null);
const searchQuery = ref('');
const activeQuery = ref('');
const moviePage = ref(1);
const tvPage = ref(1);
const isSearching = ref(false);
const questionSent = ref(false);
const loadingMore = reactive({
  movie: false,
  tv: false,
});
const loading = reactive({
  boot: true,
  topRated: false,
  upcoming: false,
  movies: false,
  tv: false,
});
const errors = reactive({
  boot: '',
  search: '',
});
const genres = reactive({
  movie: {},
  tv: {},
});
const questionForm = reactive({
  name: '',
  email: '',
  message: '',
});

const heroHighlight = computed(() => topRated.value[0] || movies.value[0]);
const hasSearch = computed(() => activeQuery.value.length > 0);
const visibleBackdrop = computed(() => {
  const backdrop = heroHighlight.value?.backdrop_path;
  return backdrop ? `${backdropUrl}${backdrop}` : heroUrl;
});

function formatRating(value) {
  return value ? Number(value).toFixed(1) : 'N/A';
}

function formatDate(value) {
  if (!value) return 'Belum tersedia';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function mediaTitle(item) {
  return item?.title || item?.name || 'Tanpa judul';
}

function mediaDate(item) {
  return item?.release_date || item?.first_air_date || '';
}

function mediaTypeLabel(item) {
  return item?.media_type === 'tv' || item?.name ? 'Serial TV' : 'Film';
}

function posterFor(item) {
  if (item?.poster_path) return `${imageUrl}${item.poster_path}`;
  return `https://placehold.co/500x750/18191f/e8f5f6?text=${encodeURIComponent(mediaTitle(item))}`;
}

function backdropFor(item) {
  if (item?.backdrop_path) return `${backdropUrl}${item.backdrop_path}`;
  return heroUrl;
}

function genreNames(item, type = 'movie') {
  if (!item?.genre_ids?.length) return ['Genre belum tersedia'];
  const source = type === 'tv' ? genres.tv : genres.movie;
  return item.genre_ids.map((id) => source[id]).filter(Boolean).slice(0, 3);
}

async function tmdb(path, params = {}) {
  const url = new URL(`${apiUrl}${path}`);
  url.search = new URLSearchParams({
    api_key: apiKey,
    language: 'id-ID',
    ...params,
  }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB gagal merespon ${response.status}`);
  }
  return response.json();
}

async function loadGenres() {
  const [movieGenre, tvGenre] = await Promise.all([
    tmdb('/genre/movie/list'),
    tmdb('/genre/tv/list'),
  ]);

  Object.assign(
    genres.movie,
    Object.fromEntries(movieGenre.genres.map((genre) => [genre.id, genre.name])),
  );
  Object.assign(
    genres.tv,
    Object.fromEntries(tvGenre.genres.map((genre) => [genre.id, genre.name])),
  );
}

async function loadCollection(target, path, amount, stateKey, params = {}) {
  loading[stateKey] = true;
  const response = await tmdb(path, params);
  target.value = response.results.filter((item) => item.poster_path).slice(0, amount);
  loading[stateKey] = false;
}

async function loadMore(type) {
  const isMovie = type === 'movie';
  loadingMore[type] = true;
  const nextPage = isMovie ? moviePage.value + 1 : tvPage.value + 1;
  const path = isMovie ? '/movie/popular' : '/discover/tv';
  const response = await tmdb(path, { page: nextPage });
  const cleanItems = response.results.filter((item) => item.poster_path);

  if (isMovie) {
    moviePage.value = nextPage;
    movies.value = [...movies.value, ...cleanItems];
  } else {
    tvPage.value = nextPage;
    tvShows.value = [...tvShows.value, ...cleanItems];
  }

  loadingMore[type] = false;
}

async function searchMovies() {
  if (isSearching.value) return;

  const query = searchQuery.value.trim();
  if (!query) return;

  isSearching.value = true;
  errors.search = '';
  activeQuery.value = query;

  try {
    const response = await tmdb('/search/multi', {
      query,
      include_adult: 'false',
    });

    searchResults.value = response.results.filter((item) => {
      return ['movie', 'tv'].includes(item.media_type) && item.poster_path;
    });

    await nextTick();
    document.querySelector('#hasil-pencarian')?.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    errors.search = 'Pencarian gagal dimuat. Coba beberapa saat lagi.';
  } finally {
    isSearching.value = false;
  }
}

function clearSearch() {
  searchQuery.value = '';
  activeQuery.value = '';
  searchResults.value = [];
  errors.search = '';
}

function openDetail(item, type = 'movie') {
  selectedItem.value = {
    ...item,
    resolvedType: item.media_type || type,
  };
  document.body.classList.add('overflow-hidden');
}

function closeDetail() {
  selectedItem.value = null;
  document.body.classList.remove('overflow-hidden');
}

function submitQuestion() {
  questionSent.value = true;
  questionForm.name = '';
  questionForm.email = '';
  questionForm.message = '';
}

async function bootApp() {
  try {
    await loadGenres();
    await Promise.all([
      loadCollection(topRated, '/movie/top_rated', 8, 'topRated'),
      loadCollection(upcoming, '/movie/upcoming', 8, 'upcoming'),
      loadCollection(movies, '/movie/popular', 12, 'movies', { page: moviePage.value }),
      loadCollection(tvShows, '/discover/tv', 12, 'tv', { page: tvPage.value }),
    ]);
  } catch (error) {
    errors.boot = 'Data film sedang tidak bisa dimuat. Periksa koneksi atau API key TMDB.';
  } finally {
    loading.boot = false;
    await nextTick();
    initFlowbite();
  }
}

onMounted(bootApp);
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-cinema-ink">
    <nav class="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-cinema-ink/92 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 lg:px-8">
        <a href="#home" class="flex min-w-0 items-center gap-3">
          <img :src="logoUrl" class="h-11 w-11 rounded object-cover" alt="Logo MyCinemaList" />
          <span class="font-brand text-2xl text-cinema-teal sm:text-3xl">MyCinemaList</span>
        </a>

        <button
          data-collapse-toggle="navbar-menu"
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-cinema-mist hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cinema-teal lg:hidden"
          aria-controls="navbar-menu"
          aria-expanded="false"
        >
          <span class="sr-only">Buka menu</span>
          <Clapperboard class="h-5 w-5" />
        </button>

        <div id="navbar-menu" class="hidden w-full lg:block lg:w-auto">
          <ul class="mt-4 flex flex-col rounded-lg border border-white/10 bg-cinema-panel p-3 font-medium lg:mt-0 lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0">
            <li v-for="section in sections" :key="section.href">
              <a
                :href="section.href"
                class="block rounded-lg px-4 py-2 text-cinema-mist hover:bg-white/10 hover:text-cinema-teal lg:hover:bg-transparent"
              >
                {{ section.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <header
      id="home"
      class="relative isolate flex min-h-[92vh] items-center overflow-hidden pt-24 text-white"
    >
      <img
        :src="visibleBackdrop"
        alt=""
        class="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(16,17,20,0.92),rgba(16,17,20,0.62),rgba(16,17,20,0.28))]"></div>
      <div class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-stone-50 to-transparent"></div>

      <div class="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-20 pt-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div class="max-w-3xl">
          <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cinema-mist backdrop-blur">
            <Sparkles class="h-4 w-4 text-cinema-gold" />
            Katalog film dan serial TV favorit
          </div>
          <h1 class="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
            MyCinemaList
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-8 text-cinema-mist sm:text-lg">
            Temukan film populer, serial TV, jadwal tayang, rating, genre, dan sinopsis
            dalam satu halaman Vue yang lebih cepat dan rapi.
          </p>

          <form class="mt-8 max-w-2xl" @submit.prevent="searchMovies">
            <label for="search" class="mb-2 block text-sm font-medium text-cinema-mist">
              Cari film atau serial TV
            </label>
            <div class="flex flex-col gap-3 sm:flex-row">
              <div class="relative flex-1">
                <Search class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="search"
                  v-model="searchQuery"
                  type="search"
                  @keyup.enter="searchMovies"
                  class="block w-full rounded-lg border border-white/20 bg-white/95 p-4 pl-12 text-sm text-cinema-ink focus:border-cinema-teal focus:ring-cinema-teal"
                  placeholder="Contoh: Interstellar, Naruto, The Last of Us"
                />
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-cinema-teal px-6 py-3 text-sm font-bold text-cinema-ink hover:bg-cinema-gold focus:outline-none focus:ring-4 focus:ring-cinema-teal/40"
                :disabled="isSearching"
                @click="searchMovies"
              >
                <Loader2 v-if="isSearching" class="h-5 w-5 animate-spin" />
                <Search v-else class="h-5 w-5" />
                Cari
              </button>
            </div>
          </form>
        </div>

        <button
          v-if="heroHighlight"
          type="button"
          class="hidden overflow-hidden rounded-lg border border-white/15 bg-white/10 text-left shadow-poster backdrop-blur transition hover:-translate-y-1 hover:bg-white/15 lg:block"
          @click="openDetail(heroHighlight, 'movie')"
        >
          <img
            :src="posterFor(heroHighlight)"
            :alt="mediaTitle(heroHighlight)"
            class="h-[500px] w-full object-cover"
          />
          <div class="space-y-3 p-4">
            <div class="flex items-center justify-between gap-3 text-sm text-cinema-mist">
              <span class="inline-flex items-center gap-2">
                <Star class="h-4 w-4 fill-cinema-gold text-cinema-gold" />
                {{ formatRating(heroHighlight.vote_average) }}
              </span>
              <span>{{ formatDate(mediaDate(heroHighlight)) }}</span>
            </div>
            <h2 class="line-clamp-2 text-xl font-bold text-white">
              {{ mediaTitle(heroHighlight) }}
            </h2>
          </div>
        </button>
      </div>
    </header>

    <main>
      <section v-if="errors.boot" class="bg-white px-4 py-10 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
            <p class="text-sm font-medium">{{ errors.boot }}</p>
          </div>
        </div>
      </section>

      <section
        v-if="hasSearch"
        id="hasil-pencarian"
        class="bg-white px-4 py-12 lg:px-8"
      >
        <div class="mx-auto max-w-7xl">
          <div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-sm font-bold uppercase text-cinema-coral">
                Hasil pencarian
              </p>
              <h2 class="mt-2 text-3xl font-extrabold text-cinema-ink">
                "{{ activeQuery }}"
              </h2>
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
              @click="clearSearch"
            >
              <X class="h-4 w-4" />
              Bersihkan
            </button>
          </div>

          <div v-if="errors.search" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            {{ errors.search }}
          </div>

          <div v-if="searchResults.length" class="media-grid">
            <article
              v-for="item in searchResults"
              :key="`${item.media_type}-${item.id}`"
              class="media-card"
            >
              <button type="button" class="block w-full text-left" @click="openDetail(item, item.media_type)">
                <img :src="posterFor(item)" :alt="mediaTitle(item)" class="poster-image" />
                <div class="space-y-3 p-4">
                  <div class="flex items-center justify-between gap-3 text-xs font-semibold text-gray-500">
                    <span>{{ mediaTypeLabel(item) }}</span>
                    <span class="inline-flex items-center gap-1 text-amber-600">
                      <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {{ formatRating(item.vote_average) }}
                    </span>
                  </div>
                  <h3 class="line-clamp-2 min-h-[3rem] text-base font-bold text-cinema-ink">
                    {{ mediaTitle(item) }}
                  </h3>
                </div>
              </button>
            </article>
          </div>

          <div v-else-if="!isSearching" class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p class="font-semibold text-gray-700">Tidak ada hasil yang cocok.</p>
          </div>
        </div>
      </section>

      <section class="bg-stone-50 px-4 py-14 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="section-heading">
            <div>
              <p class="section-kicker">Pilihan terbaik</p>
              <h2 class="section-title">Top Rating</h2>
            </div>
            <a href="#film" class="section-link">
              Lihat film
              <ChevronRight class="h-4 w-4" />
            </a>
          </div>

          <div class="media-grid">
            <article v-for="item in topRated" :key="item.id" class="media-card">
              <button type="button" class="block w-full text-left" @click="openDetail(item, 'movie')">
                <img :src="posterFor(item)" :alt="mediaTitle(item)" class="poster-image" />
                <div class="space-y-3 p-4">
                  <div class="flex items-center justify-between gap-3 text-xs font-semibold text-gray-500">
                    <span>{{ formatDate(mediaDate(item)) }}</span>
                    <span class="inline-flex items-center gap-1 text-amber-600">
                      <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {{ formatRating(item.vote_average) }}
                    </span>
                  </div>
                  <h3 class="line-clamp-2 min-h-[3rem] text-base font-bold text-cinema-ink">
                    {{ mediaTitle(item) }}
                  </h3>
                </div>
              </button>
            </article>
          </div>
        </div>
      </section>

      <section class="bg-cinema-ink px-4 py-14 text-white lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="section-heading">
            <div>
              <p class="section-kicker text-cinema-gold">Segera tayang</p>
              <h2 class="section-title text-white">Upcoming</h2>
            </div>
          </div>

          <div class="media-grid">
            <article v-for="item in upcoming" :key="item.id" class="media-card border-white/10 bg-white/10 text-white">
              <button type="button" class="block w-full text-left" @click="openDetail(item, 'movie')">
                <img :src="posterFor(item)" :alt="mediaTitle(item)" class="poster-image" />
                <div class="space-y-3 p-4">
                  <div class="flex items-center gap-2 text-xs font-semibold text-cinema-mist">
                    <CalendarDays class="h-3.5 w-3.5 text-cinema-teal" />
                    {{ formatDate(mediaDate(item)) }}
                  </div>
                  <h3 class="line-clamp-2 min-h-[3rem] text-base font-bold text-white">
                    {{ mediaTitle(item) }}
                  </h3>
                </div>
              </button>
            </article>
          </div>
        </div>
      </section>

      <section id="film" class="bg-white px-4 py-14 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="section-heading">
            <div>
              <p class="section-kicker">Bioskop pilihan</p>
              <h2 class="section-title">Film Populer</h2>
            </div>
            <div class="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-3 py-2 text-sm font-semibold text-gray-700">
              <Film class="h-4 w-4 text-cinema-coral" />
              {{ movies.length }} judul
            </div>
          </div>

          <div class="media-grid">
            <article v-for="item in movies" :key="item.id" class="media-card">
              <button type="button" class="block w-full text-left" @click="openDetail(item, 'movie')">
                <img :src="posterFor(item)" :alt="mediaTitle(item)" class="poster-image" />
                <div class="space-y-3 p-4">
                  <div class="flex items-center justify-between gap-3 text-xs font-semibold text-gray-500">
                    <span>{{ genreNames(item, 'movie').join(', ') }}</span>
                    <span class="inline-flex items-center gap-1 text-amber-600">
                      <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {{ formatRating(item.vote_average) }}
                    </span>
                  </div>
                  <h3 class="line-clamp-2 min-h-[3rem] text-base font-bold text-cinema-ink">
                    {{ mediaTitle(item) }}
                  </h3>
                </div>
              </button>
            </article>
          </div>

          <div class="mt-8 flex justify-center">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-cinema-ink px-5 py-3 text-sm font-bold text-white hover:bg-cinema-panel focus:outline-none focus:ring-4 focus:ring-gray-300"
              :disabled="loadingMore.movie"
              @click="loadMore('movie')"
            >
              <Loader2 v-if="loadingMore.movie" class="h-5 w-5 animate-spin" />
              <PlayCircle v-else class="h-5 w-5" />
              Muat Lagi
            </button>
          </div>
        </div>
      </section>

      <section id="tv" class="bg-stone-100 px-4 py-14 lg:px-8">
        <div class="mx-auto max-w-7xl">
          <div class="section-heading">
            <div>
              <p class="section-kicker">Episode maraton</p>
              <h2 class="section-title">Serial TV</h2>
            </div>
            <div class="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              <Tv class="h-4 w-4 text-cinema-teal" />
              {{ tvShows.length }} judul
            </div>
          </div>

          <div class="media-grid">
            <article v-for="item in tvShows" :key="item.id" class="media-card">
              <button type="button" class="block w-full text-left" @click="openDetail(item, 'tv')">
                <img :src="posterFor(item)" :alt="mediaTitle(item)" class="poster-image" />
                <div class="space-y-3 p-4">
                  <div class="flex items-center justify-between gap-3 text-xs font-semibold text-gray-500">
                    <span>{{ genreNames(item, 'tv').join(', ') }}</span>
                    <span class="inline-flex items-center gap-1 text-amber-600">
                      <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {{ formatRating(item.vote_average) }}
                    </span>
                  </div>
                  <h3 class="line-clamp-2 min-h-[3rem] text-base font-bold text-cinema-ink">
                    {{ mediaTitle(item) }}
                  </h3>
                </div>
              </button>
            </article>
          </div>

          <div class="mt-8 flex justify-center">
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-cinema-teal px-5 py-3 text-sm font-bold text-cinema-ink hover:bg-cinema-gold focus:outline-none focus:ring-4 focus:ring-cinema-teal/30"
              :disabled="loadingMore.tv"
              @click="loadMore('tv')"
            >
              <Loader2 v-if="loadingMore.tv" class="h-5 w-5 animate-spin" />
              <Tv v-else class="h-5 w-5" />
              Muat Lagi
            </button>
          </div>
        </div>
      </section>

      <section id="tanya" class="bg-white px-4 py-14 lg:px-8">
        <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p class="section-kicker">Butuh rekomendasi?</p>
            <h2 class="section-title">Ajukan Pertanyaan</h2>
            <p class="mt-4 max-w-xl text-base leading-8 text-gray-600">
              Kirim pertanyaan tentang film, serial TV, atau daftar tontonan yang ingin
              kamu susun berikutnya.
            </p>
            <div class="mt-8 flex items-center gap-4">
              <img :src="logoUrl" class="h-20 w-20 rounded-lg object-cover" alt="Logo MyCinemaList" />
              <div>
                <p class="font-brand text-3xl text-cinema-teal">MyCinemaList</p>
                <p class="text-sm font-medium text-gray-500">Cinema notes, made cleaner.</p>
              </div>
            </div>
          </div>

          <form class="rounded-lg border border-gray-200 bg-stone-50 p-5 shadow-sm sm:p-7" @submit.prevent="submitQuestion">
            <div v-if="questionSent" class="mb-5 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm font-semibold text-teal-900">
              Pertanyaan berhasil disiapkan. Terima kasih sudah mengirim pesan.
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="name" class="mb-2 block text-sm font-medium text-gray-900">Nama</label>
                <input
                  id="name"
                  v-model="questionForm.name"
                  type="text"
                  required
                  class="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-cinema-teal focus:ring-cinema-teal"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label for="email" class="mb-2 block text-sm font-medium text-gray-900">Email</label>
                <div class="relative">
                  <Mail class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    v-model="questionForm.email"
                    type="email"
                    required
                    class="block w-full rounded-lg border border-gray-300 bg-white p-3 pl-10 text-sm text-gray-900 focus:border-cinema-teal focus:ring-cinema-teal"
                    placeholder="email@contoh.com"
                  />
                </div>
              </div>
            </div>

            <div class="mt-5">
              <label for="message" class="mb-2 block text-sm font-medium text-gray-900">Pertanyaan</label>
              <div class="relative">
                <MessageSquare class="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="message"
                  v-model="questionForm.message"
                  required
                  rows="5"
                  class="block w-full rounded-lg border border-gray-300 bg-white p-3 pl-10 text-sm text-gray-900 focus:border-cinema-teal focus:ring-cinema-teal"
                  placeholder="Tulis pertanyaan kamu di sini"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cinema-coral px-5 py-3 text-sm font-bold text-white hover:bg-cinema-ink focus:outline-none focus:ring-4 focus:ring-red-200 sm:w-auto"
            >
              <Send class="h-5 w-5" />
              Kirim Pertanyaan
            </button>
          </form>
        </div>
      </section>
    </main>

    <footer class="bg-cinema-ink px-4 py-8 text-center text-sm text-cinema-mist lg:px-8">
      <p>
        Created by
        <a class="font-bold text-cinema-teal hover:text-cinema-gold" href="#">Rizqi Zamzami Jamil</a>.
        Data from
        <a
          class="font-bold text-cinema-teal hover:text-cinema-gold"
          href="https://developer.themoviedb.org/docs/getting-started"
          target="_blank"
          rel="noreferrer"
        >
          The Movie DB
        </a>
      </p>
    </footer>

    <div
      v-if="selectedItem"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/70 p-4"
      @click.self="closeDetail"
    >
      <div class="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow">
        <button
          type="button"
          class="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          @click="closeDetail"
        >
          <span class="sr-only">Tutup detail</span>
          <X class="h-5 w-5" />
        </button>

        <div class="grid md:grid-cols-[280px_1fr]">
          <img
            :src="posterFor(selectedItem)"
            :alt="mediaTitle(selectedItem)"
            class="h-full min-h-[420px] w-full object-cover"
          />
          <div>
            <div class="relative min-h-44 overflow-hidden rounded-tr-lg">
              <img
                :src="backdropFor(selectedItem)"
                alt=""
                class="absolute inset-0 h-full w-full object-cover"
              />
              <div class="absolute inset-0 bg-cinema-ink/75"></div>
              <div class="relative p-6 text-white">
                <span class="inline-flex items-center rounded-lg bg-cinema-teal px-3 py-1 text-xs font-bold text-cinema-ink">
                  {{ mediaTypeLabel(selectedItem) }}
                </span>
                <h2 class="mt-4 text-3xl font-extrabold leading-tight">
                  {{ mediaTitle(selectedItem) }}
                </h2>
                <div class="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-cinema-mist">
                  <span class="inline-flex items-center gap-1">
                    <Star class="h-4 w-4 fill-cinema-gold text-cinema-gold" />
                    {{ formatRating(selectedItem.vote_average) }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <CalendarDays class="h-4 w-4 text-cinema-teal" />
                    {{ formatDate(mediaDate(selectedItem)) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-6 p-6">
              <div>
                <p class="mb-2 text-sm font-bold uppercase text-gray-500">Genre</p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="genre in genreNames(selectedItem, selectedItem.resolvedType)"
                    :key="genre"
                    class="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-bold text-gray-700"
                  >
                    {{ genre }}
                  </span>
                </div>
              </div>

              <div>
                <p class="mb-2 text-sm font-bold uppercase text-gray-500">Sinopsis</p>
                <p class="leading-8 text-gray-700">
                  {{ selectedItem.overview || 'Sinopsis belum tersedia untuk judul ini.' }}
                </p>
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg bg-cinema-ink px-5 py-3 text-sm font-bold text-white hover:bg-cinema-panel focus:outline-none focus:ring-4 focus:ring-gray-300"
                @click="closeDetail"
              >
                <X class="h-5 w-5" />
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
