<template>
  <div class="h-100 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden bg-dark text-white p-3">
    <!-- Scanner Background -->
    <div class="position-absolute top-0 start-0 w-100 h-100 opacity-50 z-0">
       <BarcodeScanner @scan="handleScan" />
    </div>

    <!-- Overlay Content -->
    <div class="z-1 w-100 h-100 d-flex flex-column justify-content-end align-items-center pb-5" style="max-width: 400px; pointer-events: none;">
      
      <!-- Result Card (Only shows when scanned) -->
      <div v-if="scannedProduct" class="bg-white text-dark p-4 p-md-5 rounded-4 shadow-lg animate-fade-up" style="pointer-events: auto;">
        <div class="mb-3">
          <span class="badge bg-primary-subtle text-primary text-uppercase tracking-wide">
            {{ scannedProduct.category }}
          </span>
        </div>
        
        <h1 class="h3 fw-bold mb-2 lh-sm">{{ scannedProduct.name }}</h1>
        <p class="text-secondary font-monospace mb-4">{{ scannedProduct.code }}</p>
        
        <div class="display-3 fw-bold text-primary mb-4">
          ${{ scannedProduct.price.toFixed(2) }}
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.backdrop-blur { backdrop-filter: blur(10px); }
.animate-fade-up { animation: fadeUp 0.3s ease-out; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<script setup>
import { ref } from 'vue'
import { useProductStore } from '../stores/productStore'
import BarcodeScanner from '../components/BarcodeScanner.vue'
import { ScanLine } from 'lucide-vue-next'

const productStore = useProductStore()
const scannedProduct = ref(null)

function handleScan(code) {
  if (scannedProduct.value) return 

  const product = productStore.findByCode(code)
  if (product) {
    scannedProduct.value = product
    setTimeout(() => {
       scannedProduct.value = null 
    }, 3000)
  }
}
</script>
