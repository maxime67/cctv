<template>
  <div class="relative w-full overflow-hidden" style="aspect-ratio: 16/9;">
    <iframe
      :src="src"
      :title="title"
      class="absolute"
      :style="iframeStyle"
      frameborder="0"
      allowfullscreen
      loading="lazy"
    />
    <!-- Blocks platform UI interaction; click opens the expand overlay -->
    <div
      v-if="crop > 0"
      class="absolute inset-0 z-10 cursor-zoom-in"
      @click="emit('expand')"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['expand'])

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, required: true },
  // Percentage (0–20) to crop from each edge to hide corner overlays
  crop: { type: Number, default: 8 },
})

const iframeStyle = computed(() => {
  if (props.crop <= 0) return { inset: '0', width: '100%', height: '100%' }
  const c = props.crop
  return {
    top: `-${c}%`,
    left: `-${c}%`,
    width: `${100 + c * 2}%`,
    height: `${100 + c * 2}%`,
  }
})
</script>
