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
      sandbox="allow-same-origin allow-scripts allow-presentation"
    />
    <!-- Invisible click overlay to capture expand event when not interactive -->
    <div
      v-if="!interactive"
      class="absolute inset-0 z-10"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, required: true },
  crop: { type: Number, default: 15 },
  interactive: { type: Boolean, default: false },
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
