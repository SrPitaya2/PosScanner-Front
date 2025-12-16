<template>
  <div class="h-full flex flex-col items-center justify-center p-6 bg-gray-900 text-white relative overflow-hidden">
    <!-- Scanner Background -->
    <div class="absolute inset-0 z-0 opacity-50">
       <BarcodeScanner @scan="handleScan" />
    </div>

    <!-- Overlay Content -->
    <div class="z-10 w-full max-w-md text-center">
      
      <div v-if="!scannedProduct" class="bg-black/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
        <ScanLine class="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
        <h2 class="text-2xl font-bold mb-2">Verificador de Precios</h2>
        <p class="text-gray-400">Escanea el código de barras del producto para consultar su precio.</p>
      </div>

      <div v-else class="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <div class="mb-4">
          <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
            {{ scannedProduct.category }}
          </span>
        </div>
        
        <h1 class="text-3xl font-extrabold mb-2 leading-tight">{{ scannedProduct.name }}</h1>
        <p class="text-gray-500 font-mono mb-6">{{ scannedProduct.code }}</p>
        
        <div class="text-6xl font-black text-primary mb-6">
          ${{ scannedProduct.price.toFixed(2) }}
        </div>

        <button 
          @click="scannedProduct = null"
          class="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
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
  // Prevent re-scanning while showing result
  if (scannedProduct.value) return 

  const product = productStore.findByCode(code)
  if (product) {
    scannedProduct.value = product
    // Auto-clear after 5 seconds
    setTimeout(() => {
      // scannedProduct.value = null 
    }, 5000)
  }
}
</script>
