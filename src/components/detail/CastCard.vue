<script setup>
import { formatDate, profileFor, truncateText } from '../../utils/media';

defineProps({
  person: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article class="flex gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
    <img :src="profileFor(person)" :alt="person.name" class="h-24 w-16 rounded-lg object-cover" />
    <div>
      <h4 class="font-bold text-white">{{ person.name }}</h4>
      <p class="text-xs font-semibold text-cinema-teal">{{ person.role }}</p>
      <p class="mt-2 text-xs leading-6 text-cinema-mist">
        {{ truncateText(person.biography, 130) }}
      </p>
      <p v-if="person.birthday" class="mt-2 text-xs text-cinema-mist/70">
        Lahir: {{ formatDate(person.birthday) }}
      </p>
    </div>
  </article>
</template>
