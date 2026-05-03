<script setup>
import MediaCard from './MediaCard.vue';

defineProps({
  genres: {
    type: Object,
    default: () => ({}),
  },
  items: {
    type: Array,
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
</script>

<template>
  <div class="media-grid">
    <MediaCard
      v-for="item in items"
      :key="`${item.media_type || type}-${item.id}`"
      :genres="genres"
      :item="item"
      :type="type"
      :variant="variant"
      @open-detail="(media, mediaType) => emit('open-detail', media, mediaType)"
    />
  </div>
</template>
