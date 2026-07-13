<script setup>
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import MediaGrid from '../media/MediaGrid.vue';

defineProps({
  activeQuery: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: '',
  },
  genres: {
    type: Object,
    default: () => ({}),
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
  results: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['clear', 'open-detail']);
const root = ref(null);

function scrollIntoView() {
  root.value?.scrollIntoView({ behavior: 'smooth' });
}

defineExpose({ scrollIntoView });
</script>

<template>
  <section
    id="hasil-pencarian"
    ref="root"
    class="bg-[#0b1018] py-12"
  >
    <div class="site-container">
      <div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="section-kicker">Hasil pencarian</p>
          <h2 class="mt-2 text-3xl font-extrabold text-white">
            "{{ activeQuery }}"
          </h2>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-cinema-mist hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-cinema-teal/20"
          @click="emit('clear')"
        >
          <X class="h-4 w-4" />
          Bersihkan
        </button>
      </div>

      <div v-if="error" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
        {{ error }}
      </div>

      <MediaGrid
        v-if="results.length"
        :genres="genres"
        :items="results"
        variant="search"
        @open-detail="(media, mediaType) => emit('open-detail', media, mediaType)"
      />

      <div v-else-if="!isSearching" class="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
        <p class="font-semibold text-cinema-mist">Tidak ada hasil yang cocok.</p>
      </div>
    </div>
  </section>
</template>
