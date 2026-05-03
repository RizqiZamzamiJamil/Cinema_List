<script setup>
import MediaGrid from '../media/MediaGrid.vue';

defineProps({
  backgroundClass: {
    type: String,
    default: 'bg-[#090a0d]',
  },
  genres: {
    type: Object,
    default: () => ({}),
  },
  id: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  kicker: {
    type: String,
    required: true,
  },
  kickerClass: {
    type: String,
    default: '',
  },
  title: {
    type: String,
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
  <section :id="id" class="scroll-mt-24 px-4 py-14 lg:px-8" :class="backgroundClass">
    <div class="mx-auto max-w-7xl">
      <div class="section-heading">
        <div>
          <p class="section-kicker" :class="kickerClass">{{ kicker }}</p>
          <h2 class="section-title text-white">{{ title }}</h2>
        </div>
        <slot name="action" />
      </div>

      <MediaGrid
        :genres="genres"
        :items="items"
        :type="type"
        :variant="variant"
        @open-detail="(media, mediaType) => emit('open-detail', media, mediaType)"
      />

      <slot name="footer" />
    </div>
  </section>
</template>
