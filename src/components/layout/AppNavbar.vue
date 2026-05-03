<script setup>
import { Clapperboard } from 'lucide-vue-next';

defineProps({
  activeSection: {
    type: String,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['set-active']);
</script>

<template>
  <nav class="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-cinema-ink shadow-2xl">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 lg:px-8">
      <a href="#home" class="flex min-w-0 items-center gap-3" @click="emit('set-active', 'home')">
        <span class="grid h-11 w-11 place-items-center rounded-xl bg-cinema-teal text-cinema-ink shadow-[0_0_30px_rgba(48,213,200,0.35)]">
          <Clapperboard class="h-6 w-6" />
        </span>
        <span class="font-brand text-2xl font-extrabold text-white sm:text-3xl">
          Cinema<span class="text-cinema-teal">List</span>
        </span>
      </a>

      <button
        data-collapse-toggle="navbar-menu"
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-cinema-mist hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cinema-teal lg:hidden"
        aria-controls="navbar-menu"
        aria-expanded="false"
      >
        <span class="sr-only">Buka menu</span>
        <Clapperboard class="h-5 w-5" />
      </button>

      <div id="navbar-menu" class="hidden w-full lg:block lg:w-auto">
        <ul class="mt-4 flex flex-col rounded-lg border border-white/10 bg-cinema-panel p-3 font-semibold lg:mt-0 lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0">
          <li v-for="section in sections" :key="section.id">
            <a
              :href="`#${section.id}`"
              class="block rounded-lg px-3 py-2 text-sm transition duration-200 lg:px-4"
              :class="activeSection === section.id
                ? 'bg-cinema-teal text-cinema-ink shadow-[0_0_20px_rgba(48,213,200,0.22)]'
                : 'text-cinema-mist hover:bg-white/10 hover:text-white'"
              @click="emit('set-active', section.id)"
            >
              {{ section.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
