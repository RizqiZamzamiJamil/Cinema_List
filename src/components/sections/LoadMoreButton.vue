<script setup>
import { Loader2 } from 'lucide-vue-next';

defineProps({
  icon: {
    type: [Object, Function],
    required: true,
  },
  label: {
    type: String,
    default: 'Muat Lagi',
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);
</script>

<template>
  <div class="mt-8 flex justify-center">
    <button
      type="button"
      class="inline-flex items-center justify-center gap-2 rounded-lg bg-cinema-blue px-5 py-3 text-sm font-bold text-white hover:bg-cinema-teal hover:text-cinema-ink focus:outline-none focus:ring-4 focus:ring-cinema-blue/30 disabled:cursor-not-allowed disabled:opacity-70"
      :disabled="loading"
      @click="emit('click')"
    >
      <Loader2 v-if="loading" class="h-5 w-5 animate-spin" />
      <component :is="icon" v-else class="h-5 w-5" />
      {{ label }}
    </button>
  </div>
</template>
