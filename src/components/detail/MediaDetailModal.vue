<script setup>
import { computed } from 'vue';
import {
  AlertCircle,
  Building2,
  CalendarDays,
  Database,
  ExternalLink,
  Globe2,
  Link as LinkIcon,
  Loader2,
  PlayCircle,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-vue-next';
import {
  backdropFor,
  creatorNames,
  detailFacts,
  externalLinks,
  formatDate,
  formatNumber,
  formatRating,
  genreNames,
  keywordList,
  logoFor,
  mediaDate,
  mediaTitle,
  mediaTypeLabel,
  posterFor,
  primaryTrailer,
  providerList,
  recommendationItems,
} from '../../utils/media';
import AccordionItem from '../ui/AccordionItem.vue';
import FlowbiteAccordion from '../ui/FlowbiteAccordion.vue';
import CastCard from './CastCard.vue';
import DetailFactGrid from './DetailFactGrid.vue';

const props = defineProps({
  detailError: {
    type: String,
    default: '',
  },
  detailLoading: {
    type: Boolean,
    default: false,
  },
  genres: {
    type: Object,
    default: () => ({}),
  },
  modalAccordionId: {
    type: String,
    required: true,
  },
  modalItem: {
    type: Object,
    required: true,
  },
  selectedItem: {
    type: Object,
    required: true,
  },
  selectedPeople: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['close', 'open-detail']);
const resolvedType = computed(() => props.selectedItem.resolvedType || 'movie');
const facts = computed(() => detailFacts(props.modalItem, resolvedType.value));
const visibleGenres = computed(() => genreNames(props.modalItem, resolvedType.value, props.genres).slice(0, 4));
const creators = computed(() => creatorNames(props.modalItem, resolvedType.value));
const productionCountries = computed(() => {
  return (props.modalItem?.production_countries || []).map((country) => country.name).join(', ');
});
const companies = computed(() => (props.modalItem?.production_companies || []).slice(0, 6));
const trailer = computed(() => primaryTrailer(props.modalItem));
const providers = computed(() => providerList(props.modalItem));
const keywords = computed(() => keywordList(props.modalItem, resolvedType.value));
const links = computed(() => externalLinks(props.modalItem));
const relatedItems = computed(() => recommendationItems(props.modalItem));
</script>

<template>
  <div
    tabindex="-1"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/80 p-4"
    @click.self="emit('close')"
  >
    <div class="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0f14] text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
      <button
        type="button"
        class="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 text-cinema-mist hover:bg-white hover:text-cinema-ink"
        @click="emit('close')"
      >
        <span class="sr-only">Tutup detail</span>
        <X class="h-5 w-5" />
      </button>

      <div class="relative min-h-[340px] overflow-hidden">
        <img
          :src="backdropFor(modalItem)"
          alt=""
          class="absolute inset-0 h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,10,13,0.98),rgba(9,10,13,0.76),rgba(9,10,13,0.36))]"></div>

        <div class="relative grid gap-7 p-5 sm:p-7 lg:grid-cols-[260px_1fr]">
          <img
            :src="posterFor(modalItem)"
            :alt="mediaTitle(modalItem)"
            class="hidden aspect-[2/3] w-full rounded-2xl object-cover shadow-2xl sm:block"
          />

          <div class="flex flex-col justify-end py-5">
            <div class="mb-4 flex flex-wrap gap-2">
              <span class="inline-flex items-center rounded-lg bg-cinema-teal px-3 py-1 text-xs font-bold text-cinema-ink">
                {{ mediaTypeLabel(modalItem, resolvedType) }}
              </span>
              <span
                v-for="genre in visibleGenres"
                :key="genre"
                class="rounded-lg bg-white/10 px-3 py-1 text-xs font-bold text-cinema-mist"
              >
                {{ genre }}
              </span>
            </div>
            <h2 class="font-brand text-4xl font-extrabold leading-tight sm:text-5xl">
              {{ mediaTitle(modalItem) }}
            </h2>
            <p v-if="modalItem?.tagline" class="mt-3 text-lg font-semibold text-cinema-teal">
              {{ modalItem.tagline }}
            </p>
            <p class="mt-5 max-w-3xl leading-8 text-cinema-mist">
              {{ modalItem?.overview || 'Sinopsis belum tersedia untuk judul ini.' }}
            </p>
            <div class="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-cinema-mist">
              <span class="inline-flex items-center gap-1">
                <Star class="h-4 w-4 fill-cinema-gold text-cinema-gold" />
                {{ formatRating(modalItem?.vote_average) }}
              </span>
              <span class="inline-flex items-center gap-1">
                <CalendarDays class="h-4 w-4 text-cinema-teal" />
                {{ formatDate(mediaDate(modalItem)) }}
              </span>
              <span class="inline-flex items-center gap-1">
                <Users class="h-4 w-4 text-cinema-coral" />
                {{ formatNumber(modalItem?.vote_count) }} votes
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6 p-5 sm:p-7">
        <div v-if="detailLoading" class="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-cinema-mist">
          <Loader2 class="h-5 w-5 animate-spin text-cinema-teal" />
          Memuat detail lengkap dari TMDB...
        </div>

        <div v-if="detailError" class="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-semibold text-red-100">
          <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
          {{ detailError }}
        </div>

        <DetailFactGrid :facts="facts" />

        <FlowbiteAccordion
          :id="`detail-accordion-${modalAccordionId}`"
          :key="modalAccordionId"
          class="rounded-2xl border border-white/10 bg-white/[0.04]"
        >
          <AccordionItem
            :body-id="`detail-body-cast-${modalAccordionId}`"
            body-class="px-5 pb-5"
            button-class="border-b border-white/10 p-5"
            :heading-id="`detail-heading-cast-${modalAccordionId}`"
            :icon="Users"
            icon-class="text-cinema-teal"
            is-open
            title="Aktor Utama dan Bio Singkat"
          >
            <div class="grid gap-4 pt-5 md:grid-cols-2 xl:grid-cols-3">
              <CastCard
                v-for="person in selectedPeople"
                :key="person.id"
                :person="person"
              />
              <p v-if="!selectedPeople.length && !detailLoading" class="text-sm text-cinema-mist">
                Data aktor belum tersedia.
              </p>
            </div>
          </AccordionItem>

          <AccordionItem
            :body-id="`detail-body-production-${modalAccordionId}`"
            body-class="px-5 pb-5"
            button-class="border-b border-white/10 p-5"
            :heading-id="`detail-heading-production-${modalAccordionId}`"
            :icon="Building2"
            icon-class="text-cinema-gold"
            title="Produksi, Kreator, dan Studio"
          >
            <div class="grid gap-5 pt-5 lg:grid-cols-2">
              <div>
                <p class="mb-2 text-xs font-bold uppercase text-cinema-mist/70">Kreator / Sutradara / Penulis</p>
                <p class="leading-7 text-cinema-mist">
                  {{ creators.join(', ') || 'Tidak tersedia' }}
                </p>
              </div>
              <div>
                <p class="mb-2 text-xs font-bold uppercase text-cinema-mist/70">Negara produksi</p>
                <p class="leading-7 text-cinema-mist">
                  {{ productionCountries || 'Tidak tersedia' }}
                </p>
              </div>
              <div class="lg:col-span-2">
                <p class="mb-3 text-xs font-bold uppercase text-cinema-mist/70">Studio</p>
                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div
                    v-for="company in companies"
                    :key="company.id"
                    class="flex items-center gap-3 rounded-xl bg-white/5 p-3"
                  >
                    <img
                      v-if="logoFor(company)"
                      :src="logoFor(company)"
                      :alt="company.name"
                      class="h-9 w-16 rounded bg-white object-contain p-1"
                    />
                    <Building2 v-else class="h-6 w-6 text-cinema-teal" />
                    <span class="text-sm font-semibold text-cinema-mist">{{ company.name }}</span>
                  </div>
                  <p v-if="!companies.length" class="text-sm text-cinema-mist">
                    Studio belum tersedia.
                  </p>
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            :body-id="`detail-body-extra-${modalAccordionId}`"
            body-class="px-5 pb-5"
            button-class="border-b border-white/10 p-5"
            :heading-id="`detail-heading-extra-${modalAccordionId}`"
            :icon="Database"
            icon-class="text-cinema-coral"
            title="Trailer, Provider, Keyword, dan Link"
          >
            <div class="space-y-6 pt-5">
              <div class="grid gap-5 lg:grid-cols-2">
                <div class="rounded-xl bg-black/20 p-4">
                  <p class="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                    <PlayCircle class="h-5 w-5 text-cinema-teal" />
                    Trailer
                  </p>
                  <a
                    v-if="trailer"
                    :href="`https://www.youtube.com/watch?v=${trailer.key}`"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center gap-2 rounded-lg bg-cinema-teal px-4 py-2 text-sm font-bold text-cinema-ink hover:bg-cinema-gold"
                  >
                    Tonton {{ trailer.name }}
                    <ExternalLink class="h-4 w-4" />
                  </a>
                  <p v-else class="text-sm text-cinema-mist">Trailer belum tersedia.</p>
                </div>

                <div class="rounded-xl bg-black/20 p-4">
                  <p class="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                    <Globe2 class="h-5 w-5 text-cinema-gold" />
                    Watch Provider
                  </p>
                  <div v-if="providers.length" class="flex flex-wrap gap-2">
                    <span
                      v-for="provider in providers"
                      :key="provider.provider_id"
                      class="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-cinema-mist"
                    >
                      {{ provider.provider_name }}
                    </span>
                  </div>
                  <p v-else class="text-sm text-cinema-mist">Provider belum tersedia untuk region ID/US.</p>
                </div>
              </div>

              <div>
                <p class="mb-3 text-sm font-bold text-white">Keyword</p>
                <div v-if="keywords.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="keyword in keywords"
                    :key="keyword"
                    class="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-cinema-mist"
                  >
                    {{ keyword }}
                  </span>
                </div>
                <p v-else class="text-sm text-cinema-mist">Keyword belum tersedia.</p>
              </div>

              <div>
                <p class="mb-3 text-sm font-bold text-white">Link eksternal</p>
                <div v-if="links.length" class="flex flex-wrap gap-2">
                  <a
                    v-for="link in links"
                    :key="link.url"
                    :href="link.url"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-cinema-mist hover:border-cinema-teal hover:text-white"
                  >
                    <LinkIcon class="h-3.5 w-3.5" />
                    {{ link.label }}
                  </a>
                </div>
                <p v-else class="text-sm text-cinema-mist">Link eksternal belum tersedia.</p>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            :body-id="`detail-body-related-${modalAccordionId}`"
            body-class="px-5 pb-5"
            button-class="p-5"
            :heading-id="`detail-heading-related-${modalAccordionId}`"
            :icon="Sparkles"
            icon-class="text-cinema-teal"
            title="Rekomendasi dan Judul Serupa"
          >
            <div class="grid grid-cols-2 gap-3 pt-5 sm:grid-cols-4 lg:grid-cols-8">
              <button
                v-for="related in relatedItems"
                :key="`${related.media_type || resolvedType}-${related.id}`"
                type="button"
                class="group text-left"
                @click="emit('open-detail', related, related.media_type || resolvedType)"
              >
                <img :src="posterFor(related)" :alt="mediaTitle(related)" class="aspect-[2/3] rounded-lg object-cover transition group-hover:-translate-y-1" />
                <p class="mt-2 line-clamp-2 text-xs font-bold text-cinema-mist group-hover:text-white">
                  {{ mediaTitle(related) }}
                </p>
              </button>
              <p v-if="!relatedItems.length" class="col-span-full text-sm text-cinema-mist">
                Rekomendasi belum tersedia.
              </p>
            </div>
          </AccordionItem>
        </FlowbiteAccordion>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg bg-cinema-teal px-5 py-3 text-sm font-bold text-cinema-ink hover:bg-cinema-gold focus:outline-none focus:ring-4 focus:ring-cinema-teal/30"
          @click="emit('close')"
        >
          <X class="h-5 w-5" />
          Tutup Detail
        </button>
      </div>
    </div>
  </div>
</template>
