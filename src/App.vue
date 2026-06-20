<template>
  <div class="app-bg">
    <!-- Frosted glass nav bar -->
    <header class="glass-nav sticky top-0 z-40">
      <div class="max-w-screen-2xl mx-auto px-5 sm:px-8">
        <!-- Top row -->
        <div class="h-[52px] flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm"
                 style="background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0369a1 100%)">
              ≋
            </div>
            <span class="font-semibold text-[15px] tracking-tight" style="color: #1d1d1f">
              Cams Bretagne
            </span>
          </div>
          <span class="text-xs font-medium" style="color: #86868b">{{ today }}</span>
        </div>

        <!-- Location tabs -->
        <div class="flex gap-1.5 pb-3 overflow-x-auto no-scrollbar">
          <RouterLink
            v-for="loc in locations"
            :key="loc.id"
            :to="`/${loc.id}`"
            class="location-tab"
            :class="{ 'location-tab--active': currentId === loc.id }"
          >
            {{ loc.name }}
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="max-w-screen-2xl mx-auto px-4 sm:px-8 pt-8 pb-16">
      <RouterView :key="currentId" />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { locations } from './config/locations.js'

const route = useRoute()
const currentId = computed(() => route.params.id)

const today = computed(() =>
  new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'Europe/Paris',
  })
)
</script>
