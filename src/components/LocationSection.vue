<template>
  <section>
    <!-- Section header -->
    <div class="flex flex-wrap items-end justify-between gap-4 mb-5">
      <div>
        <h2 class="text-xl font-semibold tracking-tight" style="color: #1d1d1f">
          {{ location.name }}
        </h2>
        <div class="mt-0.5 h-[2px] w-8 rounded-full" style="background: linear-gradient(90deg, #38bdf8, #0ea5e9)" />
      </div>

      <!-- Wind badge -->
      <div class="glass rounded-xl px-4 py-2.5">
        <p class="text-[10px] font-semibold uppercase tracking-widest mb-1" style="color: #86868b">Vent</p>
        <WindWidget :location="location" />
      </div>
    </div>

    <!-- Camera grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
