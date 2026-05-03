<script setup>
import { computed } from 'vue';
import { CalendarDays, Star } from 'lucide-vue-next';
import {
  formatDate,
  formatRating,
  genreNames,
  mediaDate,
  mediaTitle,
  mediaTypeLabel,
  posterFor,
  resolveType,
} from '../../utils/media';

const props = defineProps({
  genres: {
    type: Object,
    default: () => ({}),
  },
  item: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'date',
  },
});

const emit = defineEmits(['open-detail']);
const resolvedType = computed(() => resolveType(props.item, props.type));
const genreLabel = computed(() => genreNames(props.item, resolvedType.value, props.genres).join(', '));
const detailType = computed(() => props.item.media_type || props.type || resolvedType.value);

function openDetail() {
  emit('open-detail', props.item, detailType.value);
}
</script>

<template>
  <article class="media-card">
    <button type="button" class="media-card-button" @click="openDetail">
      <img :src="posterFor(item)" :alt="mediaTitle(item)" class="poster-image" />
      <div class="media-card-info">
        <div
          v-if="variant === 'upcoming'"
          class="flex items-center gap-2 text-xs font-semibold text-cinema-mist"
        >
          <CalendarDays class="h-3.5 w-3.5 text-cinema-teal" />
          {{ formatDate(mediaDate(item)) }}
        </div>

        <div
          v-else
          class="flex items-center justify-between gap-3 text-xs font-semibold text-cinema-mist"
        >
          <span v-if="variant === 'search'">{{ mediaTypeLabel(item, item.media_type) }}</span>
          <span v-else-if="variant === 'genres'" class="line-clamp-1">{{ genreLabel }}</span>
          <span v-else>{{ formatDate(mediaDate(item)) }}</span>
          <span class="inline-flex items-center gap-1 text-cinema-gold">
            <Star class="h-3.5 w-3.5 fill-cinema-gold text-cinema-gold" />
            {{ formatRating(item.vote_average) }}
          </span>
        </div>

        <h3 class="line-clamp-2 text-base font-bold text-white">
          {{ mediaTitle(item) }}
        </h3>
      </div>
    </button>
  </article>
</template>
