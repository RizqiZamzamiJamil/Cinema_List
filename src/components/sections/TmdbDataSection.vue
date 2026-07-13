<script setup>
import { BadgeInfo, Database, Globe2 } from 'lucide-vue-next';
import AccordionItem from '../ui/AccordionItem.vue';
import FlowbiteAccordion from '../ui/FlowbiteAccordion.vue';
</script>

<template>
  <section id="data-source" class="scroll-mt-24 bg-cinema-ink py-14">
    <div class="site-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div>
        <div class="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cinema-teal text-cinema-ink">
          <Database class="h-7 w-7" />
        </div>
        <p class="section-kicker">Sumber data</p>
        <h2 class="section-title text-white">Disclaimer TMDB</h2>
        <p class="mt-4 max-w-xl text-base leading-8 text-cinema-mist">
          Website ini mengambil data film dan serial TV dari The Movie Database (TMDB).
          Karena memakai API publik, jumlah data, detail bahasa Indonesia, poster, provider,
          aktor, dan sinopsis mengikuti ketersediaan data TMDB serta batas request API.
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
        <FlowbiteAccordion id="tmdb-accordion">
          <AccordionItem
            body-id="tmdb-body-source"
            button-class="border-b border-white/10 px-3 py-4"
            heading-id="tmdb-heading-source"
            :icon="Database"
            icon-class="text-cinema-teal"
            is-open
            title="Data berasal dari TMDB"
          >
            <p class="px-3 py-4 text-sm leading-7 text-cinema-mist">
              Konten yang tampil seperti rating, trailer, cast, provider, keyword, dan rekomendasi
              diambil dari endpoint TMDB. Website ini bukan produk resmi TMDB.
            </p>
          </AccordionItem>

          <AccordionItem
            body-id="tmdb-body-limit"
            button-class="border-b border-white/10 px-3 py-4"
            heading-id="tmdb-heading-limit"
            :icon="BadgeInfo"
            icon-class="text-cinema-gold"
            title="Data bisa terbatas"
          >
            <p class="px-3 py-4 text-sm leading-7 text-cinema-mist">
              Tidak semua judul punya sinopsis, biografi aktor, sertifikasi umur, provider streaming,
              budget, revenue, atau trailer. Kalau TMDB belum punya data itu, website akan menampilkan
              penanda bahwa data belum tersedia.
            </p>
          </AccordionItem>

          <AccordionItem
            body-id="tmdb-body-usage"
            button-class="px-3 py-4"
            heading-id="tmdb-heading-usage"
            :icon="Globe2"
            icon-class="text-cinema-coral"
            title="Bahasa dan region"
          >
            <p class="px-3 py-4 text-sm leading-7 text-cinema-mist">
              Aplikasi memprioritaskan bahasa Indonesia dan region Indonesia. Untuk biografi aktor,
              aplikasi mencoba mengambil bahasa Inggris jika versi Indonesia belum tersedia.
            </p>
          </AccordionItem>
        </FlowbiteAccordion>
      </div>
    </div>
  </section>
</template>
