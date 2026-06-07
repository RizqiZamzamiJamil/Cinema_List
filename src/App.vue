<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { ChevronRight, Film, PlayCircle, Tv } from 'lucide-vue-next';
import MediaDetailModal from './components/detail/MediaDetailModal.vue';
import HeroSection from './components/home/HeroSection.vue';
import AppFooter from './components/layout/AppFooter.vue';
import AppNavbar from './components/layout/AppNavbar.vue';
import CatalogSection from './components/sections/CatalogSection.vue';
import LoadMoreButton from './components/sections/LoadMoreButton.vue';
import SearchResultsSection from './components/sections/SearchResultsSection.vue';
import TmdbDataSection from './components/sections/TmdbDataSection.vue';
import AlertBanner from './components/ui/AlertBanner.vue';
import { useCinemaCatalog } from './composables/useCinemaCatalog';
import { useFlowbite } from './composables/useFlowbite';
import { useScrollSpy } from './composables/useScrollSpy';
import { sections } from './constants/navigation';

const searchResultsSection = ref(null);
const { activeSection, setActiveSection, setupActiveSectionObserver, startScrollSpy, syncHashTarget } = useScrollSpy(sections);
const { refreshFlowbite } = useFlowbite();
const {
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
  loadingMore,
  modalAccordionId,
  modalItem,
  movies,
  openDetail,
  searchMovies,
  searchQuery,
  searchResults,
  selectedItem,
  selectedPeople,
  topRated,
  tvShows,
  upcoming,
  visibleBackdrop,
} = useCinemaCatalog();

async function handleSearch() {
  const didSearch = await searchMovies();
  if (!didSearch) return;

  await nextTick();
  searchResultsSection.value?.scrollIntoView();
}

async function handleOpenDetail(item, type) {
  const detailPromise = openDetail(item, type);
  await refreshFlowbite();

  const isCurrentDetail = await detailPromise;
  if (isCurrentDetail) {
    await refreshFlowbite();
  }
}

onMounted(async () => {
  startScrollSpy();
  await bootApp();
  await refreshFlowbite();
  setupActiveSectionObserver();
  syncHashTarget();
});
</script>

<template>
  <div class="min-h-screen bg-cinema-ink text-cinema-mist">
    <AppNavbar
      :active-section="activeSection"
      :sections="sections"
      @set-active="setActiveSection"
    />

    <HeroSection
      v-model:search-query="searchQuery"
      :hero-highlight="heroHighlight"
      :is-searching="isSearching"
      :visible-backdrop="visibleBackdrop"
      @open-detail="handleOpenDetail"
      @search="handleSearch"
    />

    <main>
      <AlertBanner v-if="errors.boot" :message="errors.boot" />

      <SearchResultsSection
        v-if="hasSearch"
        ref="searchResultsSection"
        :active-query="activeQuery"
        :error="errors.search"
        :genres="genres"
        :is-searching="isSearching"
        :results="searchResults"
        @clear="clearSearch"
        @open-detail="handleOpenDetail"
      />

      <CatalogSection
        id="top-rating"
        :genres="genres"
        :items="topRated"
        kicker="Pilihan terbaik"
        title="Top Rating"
        type="movie"
        variant="date"
        @open-detail="handleOpenDetail"
      >
        <template #action>
          <a href="#film" class="section-link-dark" @click="setActiveSection('film')">
            Lihat film
            <ChevronRight class="h-4 w-4" />
          </a>
        </template>
      </CatalogSection>

      <CatalogSection
        id="upcoming"
        background-class="bg-cinema-ink"
        :genres="genres"
        :items="upcoming"
        kicker="Segera tayang"
        kicker-class="text-cinema-gold"
        title="Upcoming"
        type="movie"
        variant="upcoming"
        @open-detail="handleOpenDetail"
      />

      <CatalogSection
        id="film"
        :genres="genres"
        :items="movies"
        kicker="Bioskop pilihan"
        title="Film Populer"
        type="movie"
        variant="genres"
        @open-detail="handleOpenDetail"
      >
        <template #action>
          <div class="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-cinema-mist">
            <Film class="h-4 w-4 text-cinema-coral" />
            {{ movies.length }} judul
          </div>
        </template>
        <template #footer>
          <LoadMoreButton
            :icon="PlayCircle"
            :loading="loadingMore.movie"
            @click="loadMore('movie')"
          />
        </template>
      </CatalogSection>

      <CatalogSection
        id="tv"
        background-class="bg-cinema-panel"
        :genres="genres"
        :items="tvShows"
        kicker="Episode maraton"
        title="Serial TV"
        type="tv"
        variant="genres"
        @open-detail="handleOpenDetail"
      >
        <template #action>
          <div class="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-cinema-mist">
            <Tv class="h-4 w-4 text-cinema-teal" />
            {{ tvShows.length }} judul
          </div>
        </template>
        <template #footer>
          <LoadMoreButton
            :icon="Tv"
            :loading="loadingMore.tv"
            @click="loadMore('tv')"
          />
        </template>
      </CatalogSection>

      <TmdbDataSection />
    </main>

    <AppFooter />

    <MediaDetailModal
      v-if="selectedItem"
      :detail-error="detailError"
      :detail-loading="detailLoading"
      :genres="genres"
      :modal-accordion-id="modalAccordionId"
      :modal-item="modalItem"
      :selected-item="selectedItem"
      :selected-people="selectedPeople"
      @close="closeDetail"
      @open-detail="handleOpenDetail"
    />
  </div>
</template>
