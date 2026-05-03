<script setup>
import { ChevronRight } from 'lucide-vue-next';

defineProps({
  bodyClass: {
    type: [String, Array, Object],
    default: '',
  },
  bodyId: {
    type: String,
    required: true,
  },
  buttonClass: {
    type: [String, Array, Object],
    default: '',
  },
  headingId: {
    type: String,
    required: true,
  },
  icon: {
    type: [Object, Function],
    default: null,
  },
  iconClass: {
    type: String,
    default: 'text-cinema-teal',
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <h3 :id="headingId">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-3 rounded-xl text-left font-bold transition duration-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cinema-teal/40"
      :class="buttonClass"
      :data-accordion-target="`#${bodyId}`"
      :aria-expanded="String(isOpen)"
      :aria-controls="bodyId"
    >
      <span class="inline-flex min-w-0 items-center gap-3">
        <component
          :is="icon"
          v-if="icon"
          class="h-5 w-5 shrink-0"
          :class="iconClass"
        />
        <span class="min-w-0">{{ title }}</span>
      </span>
      <ChevronRight class="h-5 w-5 shrink-0" />
    </button>
  </h3>
  <div
    :id="bodyId"
    :class="[{ hidden: !isOpen }, bodyClass]"
    :aria-labelledby="headingId"
  >
    <slot />
  </div>
</template>
