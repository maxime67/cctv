<template>
  <div class="text-sm">
    <template v-if="loading">
      <span class="text-gray-500">Vent…</span>
    </template>
    <template v-else-if="error">
      <span class="text-red-400 text-xs">{{ error }}</span>
    </template>
    <template v-else>
      <div class="flex items-baseline gap-2">
        <span
          class="text-lg leading-none"
          :style="{ display: 'inline-block', transform: `rotate(${wind.direction}deg)` }"
          aria-hidden="true"
        >↑</span>
        <span class="text-2xl font-semibold text-green-300">{{ wind.speed }} kn</span>
        <span class="text-xs text-gray-400">{{ compass }}</span>
      </div>
      <div class="mt-1 text-xs text-gray-400">
        Rafales <span class="text-white">{{ wind.gusts }} kn</span>
        · Bf {{ bft }}
        <span class="ml-1 opacity-50">{{ wind.source }}</span>
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

const REFRESH_MS = 5 * 60 * 1000 // Windguru stations se mettent à jour fréquemment
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

onMounted(() => {
  load()
  timer = setInterval(load, REFRESH_MS)
})
onUnmounted(() => clearInterval(timer))

const compass = computed(() => wind.value ? degToCompass(wind.value.direction) : '')
const bft = computed(() => wind.value ? beaufort(wind.value.speed) : '')
</script>
