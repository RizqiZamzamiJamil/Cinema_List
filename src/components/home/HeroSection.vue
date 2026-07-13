<script setup>
import { Loader2, Search, Sparkles, Star } from 'lucide-vue-next';
import { formatDate, formatRating, mediaDate, mediaTitle, posterFor } from '../../utils/media';

defineProps({
  heroHighlight: {
    type: Object,
    default: null,
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
  visibleBackdrop: {
    type: String,
    required: true,
  },
});

const searchQuery = defineModel('searchQuery', {
  type: String,
  default: '',
});
const emit = defineEmits(['open-detail', 'search']);
</script>

<template>
  <header
    id="home"
    class="relative isolate flex min-h-[92vh] scroll-mt-24 items-center overflow-hidden pt-24 text-white"
  >
    <img
      :src="visibleBackdrop"
      alt=""
      class="absolute inset-0 -z-20 h-full w-full object-cover"
    />
    <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,10,16,0.97),rgba(7,10,16,0.76),rgba(7,10,16,0.34))]"></div>
    <div class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-cinema-ink to-transparent"></div>

    <div class="site-container grid items-center gap-10 pb-20 pt-10 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="max-w-3xl">
        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-cinema-mist">
          <Sparkles class="h-4 w-4 text-cinema-gold" />
          Katalog film dan serial TV favorit
        </div>
        <h1 class="font-brand text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
          <span class="brand-word-cinema">Cinema</span><span class="brand-word-list">List</span>
        </h1>
        <p class="mt-5 max-w-2xl text-base leading-8 text-cinema-mist sm:text-lg">
          Temukan film populer, serial TV, jadwal tayang, rating, genre, aktor utama,
          trailer, provider, dan detail produksi dari TMDB dalam tampilan Vue yang lebih modern.
        </p>

        <form class="mt-8 max-w-2xl" @submit.prevent="emit('search')">
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
                class="block w-full rounded-lg border border-white/20 bg-white/95 p-4 pl-12 text-sm text-cinema-ink focus:border-cinema-teal focus:ring-cinema-teal"
                placeholder="Contoh: Interstellar, Naruto, The Last of Us"
              />
            </div>
            <button
              type="submit"
              class="inline-flex items-center justify-center gap-2 rounded-lg bg-cinema-blue px-6 py-3 text-sm font-bold text-white hover:bg-cinema-teal hover:text-cinema-ink focus:outline-none focus:ring-4 focus:ring-cinema-blue/40 disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="isSearching"
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
        class="group hidden overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-left shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-2 hover:bg-white/15 xl:block"
        @click="emit('open-detail', heroHighlight, 'movie')"
      >
        <div class="relative">
          <img
            :src="posterFor(heroHighlight)"
            :alt="mediaTitle(heroHighlight)"
            class="h-[500px] w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 space-y-3 p-5">
            <div class="flex items-center justify-between gap-3 text-sm text-cinema-mist">
              <span class="inline-flex items-center gap-2">
                <Star class="h-4 w-4 fill-cinema-gold text-cinema-gold" />
                {{ formatRating(heroHighlight.vote_average) }}
              </span>
              <span>{{ formatDate(mediaDate(heroHighlight)) }}</span>
            </div>
            <h2 class="line-clamp-2 text-2xl font-bold text-white">
              {{ mediaTitle(heroHighlight) }}
            </h2>
          </div>
        </div>
      </button>
    </div>
  </header>
</template>
