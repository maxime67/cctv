<template>
  <div class="glass cam-tile rounded-2xl overflow-hidden cursor-zoom-in" @click="expanded = true">
    <IframePlayer :src="camera.embedUrl" :title="camera.name" />
    <div class="px-4 py-3">
      <p class="text-[13px] font-semibold leading-snug" style="color: #1d1d1f">{{ camera.name }}</p>
      <p class="text-[11px] mt-0.5" style="color: #86868b">{{ camera.location }}</p>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="expanded"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px)"
        @click.self="expanded = false"
        @keydown.esc.window="expanded = false"
      >
        <Transition name="modal">
          <div v-if="expanded" class="relative w-full max-w-5xl">
            <!-- Close button -->
            <button
              class="absolute -top-11 right-0 flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm font-medium"
              @click="expanded = false"
            >
              <span class="text-[18px] leading-none font-light">✕</span>
              Fermer
            </button>

            <!-- Expanded player -->
            <div class="rounded-2xl overflow-hidden"
                 style="box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)">
              <IframePlayer :src="camera.embedUrl" :title="camera.name" :crop="15" :interactive="true" />
            </div>

            <!-- Caption -->
            <p class="mt-3 text-center text-sm font-medium text-white/70">
              {{ camera.name }}
              <span class="mx-1.5 opacity-40">·</span>
              {{ camera.location }}
            </p>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import IframePlayer from './IframePlayer.vue'

defineProps({
  camera: { type: Object, required: true },
})

const expanded = ref(false)
</script>
