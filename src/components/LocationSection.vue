<template>
  <section>
    <!-- Zone header: nom + marée + vent -->
    <div class="flex flex-wrap items-start justify-between gap-4 mb-3 px-1">
      <h2 class="text-lg font-semibold text-gray-100">{{ location.name }}</h2>
      <div>
        <p class="text-xs text-gray-500 mb-1 uppercase tracking-wider">Vent</p>
        <WindWidget :location="location" />
      </div>
    </div>

    <!-- Cameras for this location -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
      <WebcamTile v-for="camera in cameras" :key="camera.id" :camera="camera" />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { cameras as allCameras } from '../config/cameras.js'
import WindWidget from './WindWidget.vue'
import WebcamTile from './WebcamTile.vue'

const props = defineProps({
  location: { type: Object, required: true },
})

const cameras = computed(() =>
  props.location.cameraIds.map(id => allCameras.find(c => c.id === id)).filter(Boolean)
)
</script>
