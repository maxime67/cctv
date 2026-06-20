<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <header class="px-6 py-4 border-b border-gray-800">
      <h1 class="text-xl font-semibold tracking-wide text-gray-100">Webcams Bretagne</h1>
    </header>
    <main class="p-4 space-y-6">
      <TideCard />
      <div class="space-y-10">
        <LocationSection
          v-for="location in locations"
          :key="location.id"
          :location="location"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { locations } from './config/locations.js'
import LocationSection from './components/LocationSection.vue'
import TideCard from './components/TideCard.vue'
</script>
