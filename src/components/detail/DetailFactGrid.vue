<script setup>
defineProps({
  facts: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="fact in facts"
      :key="fact.label"
      class="rounded-xl border border-white/10 bg-white/[0.04] p-4"
    >
      <component :is="fact.icon" class="mb-3 h-5 w-5 text-cinema-teal" />
      <p class="text-xs font-bold uppercase text-cinema-mist/70">{{ fact.label }}</p>
      <p class="mt-1 text-base font-bold text-white">{{ fact.value }}</p>
    </div>
  </div>
</template>
