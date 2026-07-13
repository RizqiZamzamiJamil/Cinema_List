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
  <section class="bg-white py-10">
    <div class="site-container">
      <div class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" />
        <p class="text-sm font-medium">{{ message }}</p>
      </div>
    </div>
  </section>
</template>
