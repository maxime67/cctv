<template>
  <div class="text-sm">
    <template v-if="!tides.length">
      <span class="text-gray-500">–</span>
    </template>
    <template v-else>
      <div class="flex items-baseline gap-3">
        <span class="text-lg font-semibold text-blue-300">{{ coef }}</span>
        <span class="text-xs text-gray-500">coef</span>
      </div>
      <div class="mt-1 space-y-0.5">
        <div v-for="e in tides" :key="e.time.getTime()" class="flex gap-2 text-xs">
          <span :class="e.type === 'PM' ? 'text-blue-400' : 'text-gray-400'">
            {{ e.type }}
          </span>
          <span class="text-white font-mono">{{ fmt(e.time) }}</span>
          <span class="text-gray-400">{{ e.height.toFixed(2) }}m</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDayTides } from '../services/maree.js'

const props = defineProps({
  siteId: { type: String, required: true },
})

const { extrema, coef } = getDayTides(props.siteId)

const tides = computed(() => extrema)

function fmt(date) {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Paris',
  })
}
</script>
