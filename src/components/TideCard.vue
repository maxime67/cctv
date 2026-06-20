<template>
  <div class="glass-lifted rounded-2xl px-6 py-5">
    <div class="flex flex-wrap items-center gap-6">

      <!-- Coefficient -->
      <div class="flex flex-col items-center min-w-[64px]">
        <span class="text-[42px] font-bold leading-none" style="color: #007AFF">
          {{ coef ?? '–' }}
        </span>
        <span class="text-[11px] font-medium uppercase tracking-widest mt-1" style="color: #86868b">
          coeff.
        </span>
      </div>

      <!-- Divider -->
      <div class="self-stretch w-px hidden sm:block" style="background: rgba(0,0,0,0.07)" />

      <!-- Marées du jour -->
      <div class="flex-1 min-w-0">
        <p class="text-[11px] font-semibold uppercase tracking-widest mb-3" style="color: #86868b">
          Marées du jour
        </p>
        <template v-if="tides.length">
          <div class="grid grid-cols-2 gap-x-6 gap-y-2">
            <div
              v-for="e in tides"
              :key="e.time.getTime()"
              class="flex items-center gap-2"
            >
              <span
                class="text-[11px] font-bold w-7 py-0.5 px-1.5 rounded-md text-center"
                :style="e.type === 'PM'
                  ? 'background: rgba(0,122,255,0.1); color: #007AFF'
                  : 'background: rgba(0,0,0,0.05); color: #86868b'"
              >{{ e.type }}</span>
              <span class="text-sm font-mono font-medium" style="color: #1d1d1f">{{ fmt(e.time) }}</span>
            </div>
          </div>
        </template>
        <span v-else class="text-sm" style="color: #c7c7cc">–</span>
      </div>

      <!-- Divider -->
      <div class="self-stretch w-px hidden sm:block" style="background: rgba(0,0,0,0.07)" />

      <!-- Tendance -->
      <div class="flex flex-col items-center gap-1 min-w-[56px]">
        <span
          class="text-3xl leading-none"
          :style="trendArrow === '↑' ? 'color: #007AFF' : trendArrow === '↓' ? 'color: #86868b' : 'color: #c7c7cc'"
        >{{ trendArrow }}</span>
        <span class="text-[11px] font-medium" style="color: #86868b">{{ trendLabel || '–' }}</span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getDayTides } from '../services/maree.js'

const props = defineProps({
  siteId: { type: String, default: 'concarneau' },
})

const { extrema, coef } = getDayTides(props.siteId)
const tides = computed(() => extrema)

function fmt(date) {
  const [h, m] = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Paris',
  }).split(':')
  return `${h}h${m}`
}

const trendArrow = computed(() => {
  const next = tides.value.find(e => e.time.getTime() > Date.now())
  if (!next) return '↔'
  return next.type === 'PM' ? '↑' : '↓'
})

const trendLabel = computed(() => {
  const next = tides.value.find(e => e.time.getTime() > Date.now())
  if (!next) return ''
  return next.type === 'PM' ? 'Montante' : 'Descendante'
})
</script>
