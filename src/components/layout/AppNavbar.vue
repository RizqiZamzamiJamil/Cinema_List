<script setup>
import { Menu } from 'lucide-vue-next';

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
const logoUrl = new URL('../../../img/logo.png', import.meta.url).href;
</script>

<template>
  <nav class="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-cinema-ink shadow-2xl">
    <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3 lg:px-8">
      <a href="#home" class="flex min-w-0 items-center gap-3" @click="emit('set-active', 'home')">
        <span class="grid h-12 w-12 place-items-center rounded-lg border border-cinema-teal/30 bg-white/5 p-1.5 shadow-[0_0_32px_rgba(11,143,255,0.32)]">
          <img :src="logoUrl" alt="" class="h-full w-full object-contain" />
        </span>
        <span class="font-brand text-2xl font-extrabold text-white sm:text-3xl">
          <span class="brand-word-cinema">Cinema</span><span class="brand-word-list">List</span>
        </span>
      </a>

      <button
        data-collapse-toggle="navbar-menu"
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-cinema-mist hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cinema-blue lg:hidden"
        aria-controls="navbar-menu"
        aria-expanded="false"
      >
        <span class="sr-only">Buka menu</span>
        <Menu class="h-5 w-5" />
      </button>

      <div id="navbar-menu" class="hidden w-full lg:block lg:w-auto">
        <ul class="mt-4 flex flex-col rounded-lg border border-white/10 bg-cinema-panel p-3 font-semibold lg:mt-0 lg:flex-row lg:items-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0">
          <li v-for="section in sections" :key="section.id">
            <a
              :href="`#${section.id}`"
              class="block rounded-lg px-3 py-2 text-sm transition duration-200 lg:px-4"
              :class="activeSection === section.id
                ? 'bg-cinema-blue text-white shadow-[0_0_20px_rgba(11,143,255,0.32)]'
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
