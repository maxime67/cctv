<template>
  <div class="text-sm">
    <template v-if="!tides.length">
      <span style="color: #c7c7cc">–</span>
    </template>
    <template v-else>
      <div class="flex items-baseline gap-2">
        <span class="text-lg font-bold leading-none" style="color: #007AFF">{{ coef }}</span>
        <span class="text-[11px] font-medium" style="color: #86868b">coef</span>
      </div>
      <div class="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
        <div v-for="e in tides" :key="e.time.getTime()" class="flex items-center gap-1.5 text-[11px]">
          <span
            class="font-bold w-6 text-center py-0.5 rounded"
            :style="e.type === 'PM'
              ? 'background: rgba(0,122,255,0.1); color: #007AFF'
              : 'background: rgba(0,0,0,0.05); color: #86868b'"
          >{{ e.type }}</span>
          <span class="font-mono font-medium" style="color: #1d1d1f">{{ fmt(e.time) }}</span>
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
  const [h, m] = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Paris',
  }).split(':')
  return `${h}h${m}`
}
</script>
