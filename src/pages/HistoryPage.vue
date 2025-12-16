<template>
  <div class="p-4 md:p-6 max-w-7xl mx-auto h-full flex flex-col pb-20 md:pb-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Historial</h1>
        <p class="text-gray-500 text-sm">Registro de transacciones</p>
      </div>
      
      <div class="w-full md:w-auto bg-green-50 p-3 rounded-xl border border-green-100 flex items-center justify-between gap-4">
        <span class="text-sm font-medium text-green-700">Ventas de Hoy</span>
        <span class="text-xl font-bold text-green-700">${{ salesStore.todayTotal.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-end">
      <div class="flex gap-2 w-full md:w-auto">
        <div class="flex-1">
          <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Desde</label>
          <input type="date" v-model="filters.start" class="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <div class="flex-1">
          <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Hasta</label>
          <input type="date" v-model="filters.end" class="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
      </div>
      
      <div class="flex-1"></div>

      <button @click="exportData" class="w-full md:w-auto btn-primary flex items-center justify-center gap-2 text-sm px-4 py-2 bg-gray-800 hover:bg-gray-900">
        <Download class="w-4 h-4" />
        <span>Exportar</span>
      </button>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <div 
        v-for="sale in filteredSales" 
        :key="sale.id" 
        class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2"
        @click="viewSale(sale)"
      >
        <div class="flex justify-between items-start">
           <div>
             <p class="text-sm text-gray-500">{{ formatDate(sale.date) }}</p>
             <p class="text-xs font-bold text-blue-600 uppercase mt-1">{{ sale.method }}</p>
           </div>
           <p class="text-lg font-bold text-gray-900">${{ sale.total.toFixed(2) }}</p>
        </div>
        <div class="border-t border-gray-50 pt-2 flex justify-between items-center text-sm text-gray-500">
           <span>{{ sale.items.length }} Productos</span>
           <button class="text-primary flex items-center gap-1">Ver Detalle <ArrowRight class="w-3 h-3" /></button>
        </div>
      </div>
      
      <div v-if="filteredSales.length === 0" class="text-center py-8 text-gray-400">
        No hay ventas
      </div>
    </div>

    <!-- Desktop Table (Hidden Mobile) -->
    <div class="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
       <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th class="px-6 py-4">Fecha y Hora</th>
              <th class="px-6 py-4">Método Pago</th>
              <th class="px-6 py-4 text-center">Productos</th>
              <th class="px-6 py-4 text-right">Total</th>
              <th class="px-6 py-4 text-center">Detalles</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="sale in filteredSales" 
              :key="sale.id" 
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-3 text-gray-900 font-medium">
                {{ formatDate(sale.date) }}
              </td>
              <td class="px-6 py-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ sale.method }}
                </span>
              </td>
              <td class="px-6 py-3 text-center text-gray-500">
                {{ sale.items.reduce((acc, item) => acc + item.quantity, 0) }}
              </td>
              <td class="px-6 py-3 text-right font-bold text-gray-900">
                ${{ sale.total.toFixed(2) }}
              </td>
              <td class="px-6 py-3 text-center">
                <button @click="viewSale(sale)" class="text-gray-400 hover:text-primary transition-colors p-1">
                  <Eye class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <Modal
      :isOpen="!!selectedSale"
      title="Detalle de Venta"
      @close="selectedSale = null"
    >
      <div v-if="selectedSale">
        <div class="mb-4 flex justify-between text-sm text-gray-500">
          <span>{{ formatDate(selectedSale.date) }}</span>
          <span class="font-bold text-gray-900">{{ selectedSale.method }}</span>
        </div>

        <div class="border rounded-lg overflow-hidden mb-4">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Producto</th>
                <th class="px-4 py-2 text-center">Cant.</th>
                <th class="px-4 py-2 text-right">Precio</th>
                <th class="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedSale.items" :key="item.id" class="border-t border-gray-100">
                <td class="px-4 py-2">{{ item.name }}</td>
                <td class="px-4 py-2 text-center">{{ item.quantity }}</td>
                <td class="px-4 py-2 text-right">${{ item.price.toFixed(2) }}</td>
                <td class="px-4 py-2 text-right font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end border-t pt-4">
          <div class="text-right">
            <p class="text-sm text-gray-500">Total Pagado</p>
            <p class="text-2xl font-bold text-gray-900">${{ selectedSale.total.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useSalesStore } from '../stores/salesStore'
import Modal from '../components/ui/Modal.vue'
import { Eye, Download, ArrowRight } from 'lucide-vue-next'

const salesStore = useSalesStore()
const selectedSale = ref(null)

const filters = reactive({
  start: '',
  end: ''
})

const filteredSales = computed(() => {
  return salesStore.getSalesByDateRange(filters.start, filters.end)
})

function formatDate(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

function viewSale(sale) {
  selectedSale.value = sale
}

function exportData() {
  const data = JSON.stringify(filteredSales.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ventas_${new Date().toISOString().slice(0,10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
