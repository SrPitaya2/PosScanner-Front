<template>
  <div class="container-fluid py-4 h-100 d-flex flex-column pb-5 mb-5 md-mb-0">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h1 class="h3 fw-bold m-0 text-dark">Historial</h1>
        <p class="text-secondary small m-0">Registro de transacciones</p>
      </div>
      
      <div class="alert alert-success d-flex align-items-center justify-content-between gap-4 m-0 py-2">
        <span class="small fw-medium text-success-emphasis">Ventas de Hoy</span>
        <span class="h5 fw-bold text-success m-0">${{ salesStore.todayTotal.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-3 d-flex flex-column flex-md-row gap-3 align-items-end">
         <div class="d-flex gap-2 w-100 w-md-auto">
          <div class="flex-fill">
            <label class="form-label text-uppercase small fw-bold text-secondary mb-1" style="font-size: 0.7rem;">Desde</label>
            <input type="date" v-model="filters.start" class="form-control form-control-sm" />
          </div>
          <div class="flex-fill">
            <label class="form-label text-uppercase small fw-bold text-secondary mb-1" style="font-size: 0.7rem;">Hasta</label>
            <input type="date" v-model="filters.end" class="form-control form-control-sm" />
          </div>
         </div>
         
         <div class="w-100 flex-md-grow-0 d-md-flex justify-content-end">
            <button @click="exportData" class="btn btn-dark btn-sm d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto">
              <Download style="width: 16px;" />
              <span>Exportar</span>
            </button>
         </div>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="d-md-none d-flex flex-column gap-3">
      <div 
        v-for="sale in filteredSales" 
        :key="sale.id" 
        class="card border-0 shadow-sm cursor-pointer"
        @click="viewSale(sale)"
      >
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
             <div>
               <p class="small text-secondary mb-1">{{ formatDate(sale.date) }}</p>
               <span class="badge bg-primary-subtle text-primary border border-primary-subtle">{{ sale.method }}</span>
             </div>
             <p class="h6 fw-bold text-dark m-0">${{ sale.total.toFixed(2) }}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center pt-2 border-top mt-2 text-secondary small">
             <span>{{ sale.items.length }} Productos</span>
             <button class="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1 small">
                Ver Detalle <ArrowRight style="width: 12px;" />
             </button>
          </div>
        </div>
      </div>
      
      <div v-if="filteredSales.length === 0" class="text-center py-5 text-secondary">
        No hay ventas
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="d-none d-md-block card shadow-sm border-0 flex-grow-1 overflow-hidden">
       <div class="card-body p-0 overflow-auto">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light sticky-top">
            <tr class="small text-uppercase text-secondary">
              <th class="ps-4 py-3 border-0">Fecha y Hora</th>
              <th class="py-3 border-0">Método Pago</th>
              <th class="text-center py-3 border-0">Productos</th>
              <th class="text-end py-3 border-0">Total</th>
              <th class="text-center py-3 border-0">Detalles</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="sale in filteredSales" 
              :key="sale.id" 
            >
              <td class="ps-4 fw-medium text-dark">
                {{ formatDate(sale.date) }}
              </td>
              <td>
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle">
                  {{ sale.method }}
                </span>
              </td>
              <td class="text-center text-secondary">
                {{ sale.items.reduce((acc, item) => acc + item.quantity, 0) }}
              </td>
              <td class="text-end fw-bold text-dark">
                ${{ sale.total.toFixed(2) }}
              </td>
              <td class="text-center">
                <button @click="viewSale(sale)" class="btn btn-light btn-sm text-secondary">
                  <Eye style="width: 18px;" />
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
        <div class="d-flex justify-content-between text-secondary small mb-3">
          <span>{{ formatDate(selectedSale.date) }}</span>
          <span class="fw-bold text-dark">{{ selectedSale.method }}</span>
        </div>

        <div class="table-responsive border rounded mb-3">
          <table class="table table-sm mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-3">Producto</th>
                <th class="text-center">Cant.</th>
                <th class="text-end">Precio</th>
                <th class="text-end pe-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedSale.items" :key="item.id">
                <td class="ps-3">{{ item.name }}</td>
                <td class="text-center">{{ item.quantity }}</td>
                <td class="text-end">${{ item.price.toFixed(2) }}</td>
                <td class="text-end pe-3 fw-medium">${{ (item.price * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-end border-top pt-3">
          <div class="text-end">
            <p class="small text-secondary m-0">Total Pagado</p>
            <p class="h4 fw-bold text-dark m-0">${{ selectedSale.total.toFixed(2) }}</p>
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
