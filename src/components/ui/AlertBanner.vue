<script setup>
import { AlertCircle } from 'lucide-vue-next';

defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <section class="bg-white px-4 py-10 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
        <p class="text-sm font-medium">{{ message }}</p>
      </div>
    </div>
  </section>
</template>
