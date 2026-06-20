<template>
  <div class="text-sm">
    <template v-if="loading">
      <span class="text-[12px]" style="color: #c7c7cc">Chargement…</span>
    </template>
    <template v-else-if="error">
      <span class="text-[12px]" style="color: #ff3b30">{{ error }}</span>
    </template>
    <template v-else>
      <div class="flex items-baseline gap-2">
        <span
          class="text-base leading-none"
          :style="{ display: 'inline-block', transform: `rotate(${windDeg}deg)`, color: '#86868b' }"
          aria-hidden="true"
        >↑</span>
        <span class="text-xl font-semibold leading-none" style="color: #007AFF">{{ wind.speed }}<span class="text-[11px] font-medium ml-0.5" style="color: #86868b">kn</span></span>
        <span class="text-[11px] font-medium" style="color: #86868b">{{ compass }}</span>
      </div>
      <div class="mt-1 text-[11px]" style="color: #86868b">
        Raf. <span class="font-semibold" style="color: #1d1d1f">{{ wind.gusts }} kn</span>
        <span class="mx-1 opacity-40">·</span>Bf {{ bft }}
        <span class="ml-1 opacity-40">{{ wind.source }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { fetchWind, degToCompass, beaufort } from '../services/wind.js'

const props = defineProps({
  location: { type: Object, required: true },
})

const wind = ref(null)
const loading = ref(true)
const error = ref(null)
const REFRESH_MS = 5 * 60 * 1000
let timer = null

async function load() {
  try {
    wind.value = await fetchWind(props.location)
    error.value = null
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => { load(); timer = setInterval(load, REFRESH_MS) })
onUnmounted(() => clearInterval(timer))

const compass = computed(() => wind.value ? degToCompass(wind.value.direction) : '')
const bft = computed(() => wind.value ? beaufort(wind.value.speed) : '')
const windDeg = computed(() => {
  const d = Number(wind.value?.direction)
  return Number.isFinite(d) ? Math.round(d) % 360 : 0
})
</script>
