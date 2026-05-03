<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: 'collapse',
  },
  activeClasses: {
    type: String,
    default: 'bg-white/5 text-white',
  },
  inactiveClasses: {
    type: String,
    default: 'bg-transparent text-cinema-mist',
  },
});
</script>

<template>
  <div
    :id="id"
    :data-accordion="mode"
    :data-active-classes="activeClasses"
    :data-inactive-classes="inactiveClasses"
  >
    <slot />
  </div>
</template>
