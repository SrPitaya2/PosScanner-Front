<template>
  <div class="relative w-full h-full bg-black rounded-lg overflow-hidden">
    <!-- Scanner Container -->
    <div id="reader" class="w-full h-full"></div>
    
    <!-- Overlay UI -->
    <div class="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
      <div class="w-64 h-48 border-2 border-primary/50 rounded-lg relative">
        <div class="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary"></div>
      </div>
      <p class="mt-4 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
        Escanea un código de barras
      </p>
    </div>

    <!-- Error/Status -->
    <div v-if="error" class="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-2 rounded text-center text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const emit = defineEmits(['scan'])
const error = ref(null)
let html5QrCode = null

onMounted(async () => {
  try {
    const devices = await Html5Qrcode.getCameras()
    if (devices && devices.length) {
      const cameraId = devices[0].id
      html5QrCode = new Html5Qrcode("reader")
      
      await html5QrCode.start(
        cameraId, 
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0, 
        },
        (decodedText, decodedResult) => {
          // Success
          emit('scan', decodedText)
        },
        (errorMessage) => {
          // Parse error, ignore common failures during scanning
        }
      )
    } else {
      error.value = "No se encontraron cámaras."
    }
  } catch (err) {
    console.error(err)
    error.value = "Error al iniciar la cámara (Permisos?)"
  }
})

onUnmounted(() => {
  if (html5QrCode) {
    html5QrCode.stop().catch(err => console.error(err))
  }
})
</script>

<style>
#reader video {
  object-fit: cover;
  width: 100% !important;
  height: 100% !important;
}
</style>
