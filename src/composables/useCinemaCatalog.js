import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { backdropUrl, buildTmdbUrl, heroUrl, movieAppend, tmdbSearchPath, tvAppend } from '../constants/tmdb';
import { castFor, resolveType } from '../utils/media';

export function useCinemaCatalog() {
  const topRated = ref([]);
  const upcoming = ref([]);
  const movies = ref([]);
  const tvShows = ref([]);
  const searchResults = ref([]);
  const selectedItem = ref(null);
  const selectedDetail = ref(null);
  const selectedPeople = ref([]);
  const searchQuery = ref('');
  const activeQuery = ref('');
  const moviePage = ref(1);
  const tvPage = ref(1);
  const isSearching = ref(false);
  const detailLoading = ref(false);
  const detailError = ref('');
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

  const detailCache = new Map();
  const personCache = new Map();
  let detailRequestId = 0;

  const heroHighlight = computed(() => topRated.value[0] || movies.value[0]);
  const modalItem = computed(() => selectedDetail.value || selectedItem.value);
  const hasSearch = computed(() => activeQuery.value.length > 0);
  const visibleBackdrop = computed(() => {
    const backdrop = heroHighlight.value?.backdrop_path;
    return backdrop ? `${backdropUrl}${backdrop}` : heroUrl;
  });
  const modalAccordionId = computed(() => {
    const id = selectedItem.value?.id || 'media';
    const type = selectedItem.value?.resolvedType || 'movie';
    return `${type}-${id}`;
  });

  watch(
    selectedItem,
    (item) => {
      if (typeof document === 'undefined') return;
      document.body.classList.toggle('overflow-hidden', Boolean(item));
    },
    { flush: 'post' },
  );

  onBeforeUnmount(() => {
    document.body.classList.remove('overflow-hidden');
  });

  async function tmdb(path, params = {}) {
    const url = buildTmdbUrl(path, params);
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
    try {
      const response = await tmdb(path, params);
      target.value = response.results.filter((item) => item.poster_path).slice(0, amount);
    } finally {
      loading[stateKey] = false;
    }
  }

  async function loadMore(type) {
    const isMovie = type === 'movie';
    loadingMore[type] = true;
    const nextPage = isMovie ? moviePage.value + 1 : tvPage.value + 1;
    const path = isMovie ? '/movie/popular' : '/discover/tv';

    try {
      const response = await tmdb(path, { page: nextPage });
      const cleanItems = response.results.filter((item) => item.poster_path);

      if (isMovie) {
        moviePage.value = nextPage;
        movies.value = [...movies.value, ...cleanItems];
      } else {
        tvPage.value = nextPage;
        tvShows.value = [...tvShows.value, ...cleanItems];
      }
    } finally {
      loadingMore[type] = false;
    }
  }

  async function searchMovies() {
    if (isSearching.value) return false;

    const query = searchQuery.value.trim();
    if (!query) return false;

    isSearching.value = true;
    errors.search = '';
    activeQuery.value = query;

    try {
      const response = await tmdb(tmdbSearchPath, {
        query,
        include_adult: 'false',
      });

      searchResults.value = response.results.filter((item) => {
        return ['movie', 'tv'].includes(item.media_type) && item.poster_path;
      });
    } catch {
      errors.search = 'Pencarian gagal dimuat. Coba beberapa saat lagi.';
    } finally {
      isSearching.value = false;
    }

    return true;
  }

  function clearSearch() {
    searchQuery.value = '';
    activeQuery.value = '';
    searchResults.value = [];
    errors.search = '';
  }

  async function loadPersonDetail(person) {
    if (!person?.id) return person;
    if (personCache.has(person.id)) return { ...person, ...personCache.get(person.id) };

    try {
      let detail = await tmdb(`/person/${person.id}`, {
        append_to_response: 'external_ids,images,combined_credits',
      });

      if (!detail.biography) {
        const englishDetail = await tmdb(`/person/${person.id}`, {
          language: 'en-US',
          append_to_response: 'external_ids,images,combined_credits',
        });
        detail = {
          ...detail,
          biography: englishDetail.biography,
          place_of_birth: detail.place_of_birth || englishDetail.place_of_birth,
          birthday: detail.birthday || englishDetail.birthday,
          deathday: detail.deathday || englishDetail.deathday,
        };
      }

      const compact = {
        biography: detail.biography,
        birthday: detail.birthday,
        deathday: detail.deathday,
        place_of_birth: detail.place_of_birth,
        known_for_department: detail.known_for_department,
        homepage: detail.homepage,
        personExternalIds: detail.external_ids,
      };

      personCache.set(person.id, compact);
      return { ...person, ...compact };
    } catch {
      return person;
    }
  }

  async function loadDetailedMedia(item, type) {
    const key = `${type}-${item.id}`;
    if (detailCache.has(key)) return detailCache.get(key);

    const path = type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
    const append = type === 'tv' ? tvAppend : movieAppend;
    const detail = await tmdb(path, {
      append_to_response: append,
      include_image_language: 'id,en,null',
    });

    const enrichedCast = await Promise.all(
      castFor(detail, type)
        .slice(0, 6)
        .map((person) => loadPersonDetail(person)),
    );

    const payload = { detail, people: enrichedCast };
    detailCache.set(key, payload);
    return payload;
  }

  async function openDetail(item, type) {
    const requestId = ++detailRequestId;
    const resolvedType = resolveType(item, type);

    selectedItem.value = {
      ...item,
      resolvedType,
    };
    selectedDetail.value = null;
    selectedPeople.value = [];
    detailError.value = '';
    detailLoading.value = true;

    try {
      const payload = await loadDetailedMedia(item, resolvedType);
      if (requestId !== detailRequestId) return false;

      selectedDetail.value = {
        ...payload.detail,
        resolvedType,
      };
      selectedPeople.value = payload.people;
    } catch {
      if (requestId === detailRequestId) {
        detailError.value = 'Detail lengkap belum bisa dimuat. Data ringkas tetap ditampilkan.';
      }
    } finally {
      if (requestId === detailRequestId) {
        detailLoading.value = false;
      }
    }

    return requestId === detailRequestId;
  }

  function closeDetail() {
    detailRequestId += 1;
    selectedItem.value = null;
    selectedDetail.value = null;
    selectedPeople.value = [];
    detailError.value = '';
    detailLoading.value = false;
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
    } catch {
      errors.boot = 'Data film sedang tidak bisa dimuat. Periksa koneksi atau API key TMDB.';
    } finally {
      loading.boot = false;
    }
  }

  return {
    activeQuery,
    bootApp,
    clearSearch,
    closeDetail,
    detailError,
    detailLoading,
    errors,
    genres,
    hasSearch,
    heroHighlight,
    isSearching,
    loadMore,
    loading,
    loadingMore,
    modalAccordionId,
    modalItem,
    movies,
    openDetail,
    searchMovies,
    searchQuery,
    searchResults,
    selectedDetail,
    selectedItem,
    selectedPeople,
    topRated,
    tvShows,
    upcoming,
    visibleBackdrop,
  };
}
