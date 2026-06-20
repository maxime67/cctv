<template>
  <div v-if="location" class="space-y-8">
    <TideCard :site-id="location.tideSite" />
    <LocationSection :location="location" />
  </div>
  <div v-else class="text-center py-24" style="color: #86868b">
    Spot introuvable.
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { locations } from '../config/locations.js'
import TideCard from '../components/TideCard.vue'
import LocationSection from '../components/LocationSection.vue'

const route = useRoute()
const location = computed(() => locations.find(l => l.id === route.params.id))
</script>
