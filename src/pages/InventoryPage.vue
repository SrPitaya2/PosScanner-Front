<template>
  <div class="container-fluid py-4 h-100 d-flex flex-column pb-5 mb-5 md-mb-0">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h1 class="h3 fw-bold m-0 text-dark">Inventario</h1>
        <p class="text-secondary small m-0">Gestiona tus productos</p>
      </div>
      
      <div class="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
        <div class="position-relative flex-grow-1" style="min-width: 250px;">
           <Search class="position-absolute text-secondary" style="left: 10px; top: 10px; width: 18px;" />
           <input 
            v-model="searchQuery"
            placeholder="Buscar..."
            class="form-control ps-5"
          />
        </div>
        
        <div class="d-flex gap-2">
          <select 
            v-model="filterCategory"
            class="form-select w-auto"
          >
            <option v-for="cat in productStore.allCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <button @click="isCategoryModalOpen = true" class="btn btn-outline-secondary d-flex align-items-center gap-2">
            <Tag style="width: 18px;" />
            <span class="d-none d-lg-inline">Categorías</span>
          </button>

          <button @click="openModal()" class="btn btn-primary d-flex align-items-center gap-2 text-nowrap">
            <Plus style="width: 20px; height: 20px;" />
            <span class="d-none d-sm-inline">Nuevo</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="d-none d-md-block card shadow-sm border-0 flex-grow-1 overflow-hidden">
      <div class="card-body p-0 overflow-auto">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light sticky-top">
            <tr class="text-uppercase small text-secondary">
              <th class="ps-4 py-3 border-bottom-0">Producto</th>
              <th class="py-3 border-bottom-0">Código</th>
              <th class="py-3 border-bottom-0">Categoría</th>
              <th class="text-end py-3 border-bottom-0">Precio</th>
              <th class="text-center py-3 border-bottom-0">Stock</th>
              <th class="text-end pe-4 py-3 border-bottom-0">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="product in filteredProducts" 
              :key="product.id" 
            >
              <td class="ps-4 fw-medium text-dark">{{ product.name }}</td>
              <td class="text-secondary small font-monospace">{{ product.code }}</td>
              <td>
                <span class="badge bg-light text-dark border">{{ product.category }}</span>
              </td>
              <td class="text-end fw-bold text-dark">${{ product.price.toFixed(2) }}</td>
              <td class="text-center">
                <span 
                  class="badge rounded-pill"
                  :class="product.useInventory ? (product.stock < 10 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success') : 'bg-secondary-subtle text-secondary'"
                >
                  {{ product.useInventory ? product.stock + ' ' + product.unit : 'S/I' }}
                </span>
              </td>
              <td class="text-end pe-4">
                <div class="btn-group btn-group-sm">
                  <button @click="openStockModal(product)" class="btn btn-light text-primary" title="Ajustar Stock">
                     <Package style="width: 16px;" />
                  </button>
                  <button @click="openModal(product)" class="btn btn-light text-secondary" title="Editar">
                    <Edit2 style="width: 16px;" />
                  </button>
                  <button @click="confirmDelete(product)" class="btn btn-light text-danger" title="Eliminar">
                    <Trash2 style="width: 16px;" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card List -->
    <div class="d-md-none d-flex flex-column flex-grow-1 overflow-auto gap-3 pb-5">
       <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="card border-0 shadow-sm"
       >
         <div class="card-body p-3">
           <div class="d-flex justify-content-between align-items-start mb-2">
             <div>
               <h6 class="fw-bold text-dark mb-1">{{ product.name }}</h6>
               <code class="text-secondary small">{{ product.code }}</code>
             </div>
             <span class="fw-bold text-primary h6 m-0">${{ product.price.toFixed(2) }}</span>
           </div>
           
           <div class="d-flex justify-content-between align-items-center pt-2 border-top">
              <div class="d-flex gap-2">
                 <span 
                    class="badge rounded-pill"
                    :class="product.useInventory ? (product.stock < 10 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success') : 'bg-secondary-subtle text-secondary'"
                  >
                    {{ product.useInventory ? product.stock + ' ' + product.unit : 'Sin Inventario' }}
                  </span>
                  <span class="badge bg-light text-dark border">{{ product.category }}</span>
              </div>
              
              <div class="btn-group btn-group-sm">
                 <button @click="openStockModal(product)" class="btn btn-outline-primary border-0 bg-primary-subtle text-primary rounded-2 me-1 p-2">
                   <Package style="width: 16px; height: 16px;" />
                 </button>
                 <button @click="openModal(product)" class="btn btn-outline-secondary border-0 bg-light text-secondary rounded-2 me-1 p-2">
                   <Edit2 style="width: 16px; height: 16px;" />
                 </button>
                 <button @click="confirmDelete(product)" class="btn btn-outline-danger border-0 bg-danger-subtle text-danger rounded-2 p-2">
                   <Trash2 style="width: 16px; height: 16px;" />
                 </button>
              </div>
           </div>
         </div>
       </div>
       
       <div v-if="filteredProducts.length === 0" class="text-center py-5 text-secondary">
          No se encontraron productos
       </div>
    </div>

    <!-- Modals (Reusing components, assuming they are clean) -->
    <Modal 
      :isOpen="isProductModalOpen" 
      :title="editingProduct ? 'Editar Producto' : 'Nuevo Producto'"
      @close="isProductModalOpen = false"
    >
      <form @submit.prevent="saveProduct" class="d-flex flex-column gap-3">
        <div>
          <label class="form-label small fw-bold">Nombre</label>
          <input v-model="form.name" required class="form-control" />
        </div>
        
        <div class="row g-3">
          <div class="col-6">
            <label class="form-label small fw-bold">Código Barra (Opcional)</label>
             <div class="position-relative">
              <input v-model="form.code" class="form-control pe-5" placeholder="Escanea o escribe..." />
              <button type="button" @click="isScannerOpen = true" class="btn btn-sm btn-link position-absolute top-0 end-0 text-secondary">
                <ScanLine style="width: 18px;" />
              </button>
             </div>
          </div>
          <div class="col-6">
            <label class="form-label small fw-bold">Categoría</label>
            <select v-model="form.category" required class="form-select">
              <option v-for="c in productStore.allCategories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-6">
            <label class="form-label small fw-bold">Precio</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input v-model.number="form.price" type="number" step="0.01" required class="form-control" />
            </div>
          </div>
          <div class="col-6">
            <label class="form-label small fw-bold">Vendido por</label>
            <select v-model="form.unit" class="form-select">
              <option value="pza">Pieza (u)</option>
              <option value="kg">Kilo (kg)</option>
              <option value="lt">Litro (l)</option>
            </select>
          </div>
        </div>

        <div class="row g-3">
          <div class="col-6">
            <label class="form-label small fw-bold">Stock Inicial</label>
            <input v-model.number="form.stock" type="number" step="0.001" :disabled="!form.useInventory" required class="form-control" />
          </div>
          <div class="col-6 d-flex align-items-end pb-1">
            <div class="form-check form-switch mb-1">
              <input class="form-check-input" type="checkbox" v-model="form.useInventory" id="useInventory">
              <label class="form-check-label small fw-bold" for="useInventory">Controlar Stock</label>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-2">
          <button type="button" @click="isProductModalOpen = false" class="btn btn-light">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>

    <!-- Stock Modal -->
    <Modal
      :isOpen="isStockModalOpen"
      title="Ajustar Inventario"
      @close="isStockModalOpen = false"
    >
      <div v-if="stockProduct" class="text-center">
        <h4 class="h5 fw-bold mb-1">{{ stockProduct.name }}</h4>
        <p class="text-secondary mb-4">Stock Actual: <span class="fw-bold text-dark">{{ stockProduct.stock }} {{ stockProduct.unit }}</span></p>

        <div class="d-flex align-items-center justify-content-center gap-3 mb-4">
           <button @click="stockForm.change = Number((stockForm.change - (stockProduct.unit === 'pza' ? 1 : 0.1)).toFixed(3))" class="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0" style="width: 48px; height: 48px;">
             <Minus style="width: 20px;" />
           </button>
           <div style="width: 120px;">
             <input v-model.number="stockForm.change" type="number" step="0.001" class="form-control border-0 text-center fs-3 fw-bold bg-transparent shadow-none" />
             <p class="small text-secondary text-uppercase mb-0">Añadir/Quitar</p>
           </div>
           <button @click="stockForm.change = Number((stockForm.change + (stockProduct.unit === 'pza' ? 1 : 0.1)).toFixed(3))" class="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0" style="width: 48px; height: 48px;">
             <Plus style="width: 20px;" />
           </button>
        </div>

        <button @click="saveStock" class="btn btn-primary w-100 py-2">
          Confirmar Ajuste
        </button>
      </div>
    </Modal>

    <!-- Category Modal -->
    <Modal
      :isOpen="isCategoryModalOpen"
      title="Gestionar Categorías"
      @close="isCategoryModalOpen = false"
    >
      <div class="d-flex flex-column gap-3">
        <div class="input-group">
          <input v-model="newCategoryName" placeholder="Nueva categoría..." class="form-control" @keyup.enter="addNewCategory" />
          <button @click="addNewCategory" class="btn btn-primary">
            <Plus style="width: 18px;" />
          </button>
        </div>

        <div class="list-group list-group-flush border rounded overflow-auto" style="max-height: 300px;">
          <div v-for="cat in productStore.categories" :key="cat" class="list-group-item d-flex justify-content-between align-items-center">
            <span>{{ cat }}</span>
            <button @click="productStore.deleteCategory(cat)" class="btn btn-sm btn-link text-danger p-0 border-0">
               <Trash2 style="width: 16px;" />
            </button>
          </div>
        </div>
      </div>
    </Modal>

    <!-- Scanner Modal -->
    <Modal
      :isOpen="isScannerOpen"
      title="Escanear Código"
      @close="isScannerOpen = false"
    >
      <div class="overflow-hidden bg-black rounded" style="height: 300px;">
        <BarcodeScanner @scan="handleScan" />
      </div>
    </Modal>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useToastStore } from '../stores/toastStore'
import Modal from '../components/ui/Modal.vue'
import Toast from '../components/ui/Toast.vue'
import BarcodeScanner from '../components/BarcodeScanner.vue'
import { Search, Plus, Edit2, Trash2, Package, ScanLine, Minus, Tag } from 'lucide-vue-next'

const productStore = useProductStore()
const toastStore = useToastStore()

const searchQuery = ref('')
const filterCategory = ref('Todos')

const isProductModalOpen = ref(false)
const isStockModalOpen = ref(false)
const isCategoryModalOpen = ref(false)
const isScannerOpen = ref(false)
const editingProduct = ref(null)
const stockProduct = ref(null)
const newCategoryName = ref('')

const form = reactive({
  name: '',
  code: '',
  category: '',
  price: 0,
  stock: 0,
  unit: 'pza',
  useInventory: true
})

const stockForm = reactive({ change: 0 })

const filteredProducts = computed(() => {
  return productStore.searchProducts(searchQuery.value, filterCategory.value)
})

function openModal(product = null) {
  editingProduct.value = product
  if (product) {
    Object.assign(form, product)
  } else {
    Object.assign(form, { 
      name: '', 
      code: '', 
      category: productStore.categories[0] || '', 
      price: 0, 
      stock: 0,
      unit: 'pza',
      useInventory: true
    })
  }
  isProductModalOpen.value = true
}

function saveProduct() {
  if (editingProduct.value) {
    productStore.updateProduct(editingProduct.value.id, { ...form })
    toastStore.addToast('Producto actualizado', 'success')
  } else {
    productStore.addProduct({ ...form })
    toastStore.addToast('Producto creado', 'success')
  }
  isProductModalOpen.value = false
}

function confirmDelete(product) {
  if (confirm(`¿Eliminar ${product.name}?`)) {
    productStore.deleteProduct(product.id)
    toastStore.addToast('Producto eliminado', 'info')
  }
}

function openStockModal(product) {
  stockProduct.value = product
  stockForm.change = 0
  isStockModalOpen.value = true
}

function saveStock() {
  if (stockForm.change !== 0 && stockProduct.value) {
    productStore.updateStock(stockProduct.value.id, stockForm.change)
    const type = stockForm.change > 0 ? 'success' : 'warning'
    const msg = stockForm.change > 0 ? `Stock añadido (+${stockForm.change})` : `Stock reducido (${stockForm.change})`
    toastStore.addToast(msg, type)
  }
  isStockModalOpen.value = false
}

const lastScan = ref(0)
function handleScan(code) {
  const now = Date.now()
  if (now - lastScan.value < 1500) return
  lastScan.value = now

  form.code = code
  isScannerOpen.value = false
  if (navigator.vibrate) navigator.vibrate(50)
  toastStore.addToast(`Código capturado: ${code}`, 'success')
}

function addNewCategory() {
  if (newCategoryName.value.trim()) {
    productStore.addCategory(newCategoryName.value.trim())
    newCategoryName.value = ''
    toastStore.addToast('Categoría añadida', 'success')
  }
}
</script>
