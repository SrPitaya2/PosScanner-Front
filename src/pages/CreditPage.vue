<template>
  <div class="container-fluid py-4 h-100 d-flex flex-column">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 fw-bold m-0 text-dark">Fiados y Deudas</h1>
        <p class="text-secondary small m-0">Gestiona las cuentas por cobrar</p>
      </div>
      <div class="bg-primary-subtle text-primary px-3 py-2 rounded-3 fw-bold">
        Total por Cobrar: ${{ totalDebt.toFixed(2) }}
      </div>
    </div>

    <!-- Clients List -->
    <div class="row g-3">
      <div v-for="(debt, client) in groupedDebts" :key="client" class="col-12 col-md-6 col-lg-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-light rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                  <User class="text-secondary" style="width: 24px; height: 24px;" />
                </div>
                <div>
                  <h5 class="fw-bold m-0 text-dark">{{ client }}</h5>
                  <small class="text-secondary">
                    {{ debt.count }} ticket(s) 
                    <span v-if="debt.payments.length > 0" class="text-success ms-1">· {{ debt.payments.length }} abono(s)</span>
                  </small>
                </div>
              </div>
              <div class="text-end">
                <span class="d-block small text-secondary">Deuda Pendiente</span>
                <span class="h5 fw-bold m-0" :class="debt.balance > 0.01 ? 'text-danger' : 'text-success'">
                  ${{ debt.balance.toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Mini Summary -->
            <div class="bg-light rounded p-2 d-flex justify-content-between small text-secondary">
                 <span>Total Fiado: ${{ debt.totalDebt.toFixed(2) }}</span>
                 <span class="text-success">Pagado: ${{ debt.totalPaid.toFixed(2) }}</span>
            </div>
          </div>
          <div class="card-footer bg-white border-top-0 pt-0 pb-3 d-flex justify-content-end gap-2">
             <button @click="openDetails(client)" class="btn btn-sm btn-outline-primary fw-medium d-flex align-items-center gap-1">
               <List style="width: 16px;" /> Detalles
             </button>
             <button @click="openPayment(client)" class="btn btn-sm btn-primary fw-medium d-flex align-items-center gap-1" :disabled="debt.balance <= 0.01">
               <Plus style="width: 16px;" /> Abonar
             </button>
          </div>
        </div>
      </div>

      <div v-if="Object.keys(groupedDebts).length === 0" class="col-12 text-center py-5">
        <div class="text-secondary">
          <UserCheck style="width: 48px; height: 48px; opacity: 0.2;" class="mb-3" />
          <p>No hay cuentas por cobrar pendientes.</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    
    <!-- Details Modal -->
    <Modal :isOpen="showDetailsModal" :title="'Historial: ' + selectedClient" @close="showDetailsModal = false">
        <div v-if="currentClientDetails" class="d-flex flex-column gap-3">
             <div class="row text-center mb-2">
                 <div class="col-4 border-end">
                     <small class="d-block text-secondary">Deuda Total</small>
                     <span class="fw-bold text-danger">${{ currentClientDetails.totalDebt.toFixed(2) }}</span>
                 </div>
                 <div class="col-4 border-end">
                     <small class="d-block text-secondary">Abonado</small>
                     <span class="fw-bold text-success">${{ currentClientDetails.totalPaid.toFixed(2) }}</span>
                 </div>
                 <div class="col-4">
                     <small class="d-block text-secondary">Pendiente</small>
                     <span class="fw-bold text-primary">${{ currentClientDetails.balance.toFixed(2) }}</span>
                 </div>
             </div>

             <h6 class="fw-bold m-0 border-bottom pb-2">Movimientos</h6>
             <div class="overflow-auto" style="max-height: 300px;">
                 <div v-for="sale in currentClientDetails.sales" :key="'s'+sale.id" class="d-flex justify-content-between align-items-center border-bottom py-2">
                     <div>
                         <span class="badge bg-danger-subtle text-danger me-2">Fiado</span>
                         <small class="text-secondary">{{ new Date(sale.date).toLocaleDateString() }} {{ new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</small>
                     </div>
                     <span class="fw-bold text-danger">-${{ sale.total.toFixed(2) }}</span>
                 </div>
                 <div v-for="pay in currentClientDetails.payments" :key="'p'+pay.id" class="d-flex justify-content-between align-items-center border-bottom py-2">
                     <div>
                         <span class="badge bg-success-subtle text-success me-2">Abono</span>
                         <small class="text-secondary">{{ new Date(pay.date).toLocaleDateString() }} {{ new Date(pay.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</small>
                     </div>
                     <span class="fw-bold text-success">+${{ pay.amount.toFixed(2) }}</span>
                 </div>
             </div>
        </div>
    </Modal>

    <!-- Payment Modal -->
    <Modal :isOpen="showPaymentModal" :title="'Abonar a ' + selectedClient" @close="showPaymentModal = false">
        <div class="mb-3">
            <label class="form-label small fw-bold">Monto a Abonar</label>
            <div class="input-group input-group-lg">
                <span class="input-group-text bg-white border-end-0 fw-bold text-success">$</span>
                <input v-model.number="paymentAmount" type="number" class="form-control border-start-0 fs-3 fw-bold text-success" @keyup.enter="confirmPayment" />
            </div>
            <div v-if="currentClientDetails" class="form-text text-end">
                Deuda actual: <span class="fw-bold">${{ currentClientDetails.balance.toFixed(2) }}</span>
            </div>
        </div>
        <div class="mb-4">
            <label class="form-label small fw-bold">Nota (Opcional)</label>
            <input v-model="paymentNote" class="form-control" placeholder="Ej: Pago parcial efectivo" />
        </div>
        
        <button @click="confirmPayment" class="btn btn-success w-100 py-3 fw-bold rounded-3">
            Registrar Abono
        </button>
    </Modal>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSalesStore } from '../stores/salesStore'
import { useToastStore } from '../stores/toastStore'
import { User, UserCheck, Plus, List } from 'lucide-vue-next'
import Modal from '../components/ui/Modal.vue'

const salesStore = useSalesStore()
const toastStore = useToastStore()

// Modals State
const showDetailsModal = ref(false)
const showPaymentModal = ref(false)
const selectedClient = ref(null)
const paymentAmount = ref(0)
const paymentNote = ref('')

const groupedDebts = computed(() => {
  const groups = {}
  
  // 1. Calculate Debts from Sales
  salesStore.sales.filter(s => s.method === 'Fiado').forEach(sale => {
    const client = sale.client || 'Desconocido'
    if (!groups[client]) {
      groups[client] = {
        totalDebt: 0,
        totalPaid: 0,
        count: 0,
        sales: [],
        payments: []
      }
    }
    groups[client].totalDebt += sale.total
    groups[client].count++
    groups[client].sales.push(sale)
  })

  // 2. Subtract Payments
  salesStore.payments.forEach(pay => {
     const client = pay.client
     if (groups[client]) {
         groups[client].totalPaid += pay.amount
         groups[client].payments.push(pay)
     }
  })

  // 3. Cleanup & Calculate Balance
  Object.keys(groups).forEach(key => {
      groups[key].balance = groups[key].totalDebt - groups[key].totalPaid
      // Optional: Remove if balance is 0? For now keep to show history.
  })

  return groups
})

const totalDebt = computed(() => {
  return Object.values(groupedDebts.value).reduce((sum, client) => sum + client.balance, 0)
})

const currentClientDetails = computed(() => {
    if (!selectedClient.value) return null
    return groupedDebts.value[selectedClient.value]
})

function openDetails(client) {
    selectedClient.value = client
    showDetailsModal.value = true
}

function openPayment(client) {
    selectedClient.value = client
    paymentAmount.value = 0
    showPaymentModal.value = true
}

function confirmPayment() {
    if (paymentAmount.value <= 0) {
        toastStore.addToast('Monto inválido', 'warning')
        return
    }
    
    salesStore.addPayment({
        client: selectedClient.value,
        amount: paymentAmount.value,
        note: paymentNote.value
    })

    toastStore.addToast(`Abono de $${paymentAmount.value} registrado`, 'success')
    showPaymentModal.value = false
    paymentNote.value = ''
}
</script>
