<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4">
    <div class="flex flex-wrap items-start gap-6">
      <!-- Coefficient -->
      <div class="flex flex-col items-center justify-center min-w-[72px]">
        <span class="text-4xl font-bold text-blue-300">{{ coef ?? '–' }}</span>
        <span class="text-xs text-gray-500 uppercase tracking-wider mt-1">coeff.</span>
      </div>

      <div class="w-px self-stretch bg-gray-800 hidden sm:block" />

      <!-- Extrema du jour -->
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Marées du jour</p>
        <template v-if="tides.length">
          <div class="grid grid-cols-2 gap-x-6 gap-y-1">
            <div
              v-for="e in tides"
              :key="e.time.getTime()"
              class="flex items-baseline gap-2"
            >
              <span
                class="text-xs font-semibold w-6"
                :class="e.type === 'PM' ? 'text-blue-400' : 'text-gray-400'"
              >{{ e.type }}</span>
              <span class="text-sm font-mono text-white">{{ fmt(e.time) }}</span>
            </div>
          </div>
        </template>
        <span v-else class="text-gray-600 text-sm">–</span>
      </div>

      <!-- Tendance actuelle -->
      <div class="flex flex-col items-center justify-center min-w-[56px]">
        <span class="text-2xl" :title="trendLabel">{{ trendArrow }}</span>
        <span class="text-xs text-gray-500 mt-1">{{ trendLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDayTides } from '../services/maree.js'

// Concarneau = référence centrale pour la zone fouesnant / carnac / pornichet
const { extrema, coef } = getDayTides('concarneau')

const tides = computed(() => extrema)

function fmt(date) {
  const [h, m] = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Paris',
  }).split(':')
  return `${h}h${m}`
}

const trendArrow = computed(() => {
  const now = Date.now()
  // Find the next extremum after now
  const next = tides.value.find(e => e.time.getTime() > now)
  if (!next) return '↔'
  return next.type === 'PM' ? '↑' : '↓'
})

const trendLabel = computed(() => {
  const now = Date.now()
  const next = tides.value.find(e => e.time.getTime() > now)
  if (!next) return ''
  return next.type === 'PM' ? 'Montante' : 'Descendante'
})
</script>
