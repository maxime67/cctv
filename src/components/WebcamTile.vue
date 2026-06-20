<template>
  <div class="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
    <IframePlayer :src="camera.embedUrl" :title="camera.name" @expand="expanded = true" />
    <div class="px-3 py-2">
      <p class="text-sm font-medium text-gray-100">{{ camera.name }}</p>
      <p class="text-xs text-gray-500">{{ camera.location }}</p>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="expanded"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="expanded = false"
        @keydown.esc.window="expanded = false"
      >
        <div class="relative w-full max-w-5xl">
          <button
            class="absolute -top-9 right-0 text-gray-300 hover:text-white text-sm"
            @click="expanded = false"
          >
            Fermer ✕
          </button>
          <div class="rounded-xl overflow-hidden shadow-2xl">
            <IframePlayer :src="camera.embedUrl" :title="camera.name" :crop="0" />
          </div>
          <p class="mt-2 text-center text-sm font-medium text-gray-300">
            {{ camera.name }} — {{ camera.location }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import IframePlayer from './IframePlayer.vue'

defineProps({
  camera: {
    type: Object,
    required: true,
  },
})

const expanded = ref(false)
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
