<template>
  <div class="h-100 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden bg-dark text-white p-3">
    <!-- Scanner Background -->
    <div class="position-absolute top-0 start-0 w-100 h-100 opacity-50 z-0">
       <BarcodeScanner @scan="handleScan" />
    </div>

    <!-- Overlay Content -->
    <div class="z-1 w-100 text-center" style="max-width: 400px;">
      
      <div v-if="!scannedProduct" class="bg-black bg-opacity-75 p-4 p-md-5 rounded-4 border border-secondary shadow-lg">
        <ScanLine class="d-block mx-auto mb-3 text-primary" style="width: 64px; height: 64px;" />
        <h2 class="h4 fw-bold mb-2">Verificador de Precios</h2>
        <p class="text-secondary small m-0">Escanea el código de barras del producto para consultar su precio.</p>
      </div>

      <div v-else class="bg-white text-dark p-4 p-md-5 rounded-4 shadow-lg">
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

        <button 
          @click="scannedProduct = null"
          class="btn btn-dark w-100 py-3 rounded-3 fw-bold"
        >
          Escanear Otro
        </button>
      </div>

    </div>
  </div>
</template>

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
      // scannedProduct.value = null 
    }, 5000)
  }
}
</script>
