<template>
  <div class="w-100 h-100 position-relative bg-black overflow-hidden">
    <!-- Scanner Container -->
    <div id="reader" class="w-100 h-100"></div>
    
    <!-- VARIANT: Default (Red/Green Box for Sales) -->
    <div 
      class="position-absolute top-50 start-50 translate-middle pe-none border border-2 rounded transition-colors" 
      :class="success ? 'border-success' : 'border-danger'"
      style="width: 70%; height: 50%; opacity: 0.8; transition: border-color 0.2s ease;">
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const props = defineProps({
    variant: {
        type: String,
        default: 'default' // 'default' | 'modal'
    },
    success: {
        type: Boolean,
        default: false
    }
})

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
      // Check if scanner is running before stopping
      if (html5QrCode.isScanning) {
         await html5QrCode.stop()
      }
      html5QrCode.clear()
    } catch (e) {
      console.warn("Scanner stop issue:", e)
    } finally {
      html5QrCode = null
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
