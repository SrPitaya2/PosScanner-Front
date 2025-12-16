<template>
  <div class="w-100 h-100 position-relative bg-black overflow-hidden">
    <!-- Scanner Container -->
    <div id="reader" class="w-100 h-100"></div>
    
    <!-- Overlay Guide (Centered Box) -->
    <div class="position-absolute top-50 start-50 translate-middle pe-none border border-danger border-2 rounded" style="width: 70%; height: 50%; opacity: 0.5;"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const emit = defineEmits(['scan'])
let html5QrCode = null

onMounted(() => {
  startScanner()
})

onUnmounted(() => {
  stopScanner()
})

async function startScanner() {
  try {
    const devices = await Html5Qrcode.getCameras()
    if (devices && devices.length) {
      if (!document.getElementById("reader")) return
      
      html5QrCode = new Html5Qrcode("reader")
      
      await html5QrCode.start(
        { facingMode: "environment" }, 
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.777778, // 16:9 aspect ratio
          disableFlip: false
        },
        (decodedText, decodedResult) => {
          emit('scan', decodedText)
        },
        (errorMessage) => {
          // ignore scan errors
        }
      )
    }
  } catch (err) {
    console.error("Error starting scanner", err)
  }
}

async function stopScanner() {
  if (html5QrCode) {
    try {
      await html5QrCode.stop()
      html5QrCode.clear()
      html5QrCode = null
    } catch (e) {
      console.error("Failed to stop scanner", e)
    }
  }
}
</script>

<style>
/* Force video to cover the container */
#reader video {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
}
.pe-none { pointer-events: none; }
</style>
