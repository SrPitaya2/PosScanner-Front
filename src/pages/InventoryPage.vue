<template>
  <div class="p-4 md:p-6 max-w-7xl mx-auto h-full flex flex-col pb-20 md:pb-6">
    <!-- Header Controls -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Inventario</h1>
        <p class="text-gray-500 text-sm">Gestiona tus productos</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <div class="relative flex-1 md:w-64">
           <Search class="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
           <input 
            v-model="searchQuery"
            placeholder="Buscar..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
        
        <div class="flex gap-2">
          <select 
            v-model="filterCategory"
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary truncate"
          >
            <option v-for="cat in productStore.categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <button @click="openModal()" class="btn-primary flex items-center justify-center gap-2 whitespace-nowrap px-3">
            <Plus class="w-5 h-5" />
            <span class="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop Table (Hidden on Mobile) -->
    <div class="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th class="px-6 py-4">Producto</th>
              <th class="px-6 py-4">Código</th>
              <th class="px-6 py-4">Categoría</th>
              <th class="px-6 py-4 text-right">Precio</th>
              <th class="px-6 py-4 text-center">Stock</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="product in filteredProducts" 
              :key="product.id" 
              class="hover:bg-blue-50/30 transition-colors group"
            >
              <td class="px-6 py-3 font-medium text-gray-900">{{ product.name }}</td>
              <td class="px-6 py-3 text-gray-500 fontFamily-mono text-sm">{{ product.code }}</td>
              <td class="px-6 py-3">
                <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{{ product.category }}</span>
              </td>
              <td class="px-6 py-3 text-right font-bold text-gray-700">${{ product.price.toFixed(2) }}</td>
              <td class="px-6 py-3 text-center">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-bold"
                  :class="product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-3 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openStockModal(product)" class="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Ajustar Stock">
                     <Package class="w-4 h-4" />
                  </button>
                  <button @click="openModal(product)" class="p-1 text-gray-500 hover:bg-gray-100 rounded" title="Editar">
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(product)" class="p-1 text-red-500 hover:bg-red-50 rounded" title="Eliminar">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Card List (Visible on Mobile) -->
    <div class="md:hidden space-y-3">
       <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2"
       >
         <div class="flex justify-between items-start">
           <div>
             <h3 class="font-bold text-gray-900">{{ product.name }}</h3>
             <p class="text-xs text-gray-500 font-mono">{{ product.code }}</p>
           </div>
           <span class="font-bold text-primary">${{ product.price.toFixed(2) }}</span>
         </div>
         
         <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
            <div class="flex items-center gap-2">
               <span 
                  class="px-2 py-1 rounded-full text-xs font-bold"
                  :class="product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
                >
                  {{ product.stock }} un.
                </span>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{{ product.category }}</span>
            </div>
            
            <div class="flex gap-2">
               <button @click="openStockModal(product)" class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <Package class="w-4 h-4" />
               </button>
               <button @click="openModal(product)" class="p-2 bg-gray-50 text-gray-600 rounded-lg">
                 <Edit2 class="w-4 h-4" />
               </button>
               <button @click="confirmDelete(product)" class="p-2 bg-red-50 text-red-600 rounded-lg">
                 <Trash2 class="w-4 h-4" />
               </button>
            </div>
         </div>
       </div>

       <div v-if="filteredProducts.length === 0" class="text-center py-8 text-gray-400">
          No se encontraron productos
       </div>
    </div>

    <!-- Product Modal (Add/Edit) -->
    <Modal 
      :isOpen="isProductModalOpen" 
      :title="editingProduct ? 'Editar Producto' : 'Nuevo Producto'"
      @close="isProductModalOpen = false"
    >
      <form @submit.prevent="saveProduct" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input v-model="form.name" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código Barra</label>
             <div class="relative">
              <input v-model="form.code" required class="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-primary outline-none" />
              <button type="button" class="absolute right-2 top-2 text-gray-400 hover:text-primary">
                <ScanLine class="w-5 h-5" />
              </button>
             </div>
          </div>
           <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input v-model="form.category" required list="categories" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
            <datalist id="categories">
              <option v-for="c in productStore.categories" :key="c" :value="c" />
            </datalist>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input v-model.number="form.price" type="number" step="0.50" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
            <input v-model.number="form.stock" type="number" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>

        <div class="pt-4 flex justify-end gap-3">
          <button type="button" @click="isProductModalOpen = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
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
        <h4 class="text-xl font-bold mb-1">{{ stockProduct.name }}</h4>
        <p class="text-gray-500 mb-6">Stock Actual: <span class="font-bold text-gray-900">{{ stockProduct.stock }}</span></p>

        <div class="flex items-center justify-center gap-4 mb-8">
           <button @click="stockForm.change = Math.max(-stockProduct.stock, stockForm.change - 1)" class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100">
             <Minus class="w-5 h-5" />
           </button>
           <div class="w-24">
             <input v-model.number="stockForm.change" class="w-full text-center text-3xl font-bold bg-transparent outline-none" />
             <p class="text-xs text-gray-400 mt-1 uppercase tracking-wide">Añadir/Quitar</p>
           </div>
           <button @click="stockForm.change++" class="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100">
             <Plus class="w-5 h-5" />
           </button>
        </div>

        <button @click="saveStock" class="w-full btn-primary py-3">
          Confirmar Ajuste
        </button>
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
import { Search, Plus, Edit2, Trash2, Package, ScanLine, Minus } from 'lucide-vue-next'

const productStore = useProductStore()
const toastStore = useToastStore()

const searchQuery = ref('')
const filterCategory = ref('Todos')

const isProductModalOpen = ref(false)
const isStockModalOpen = ref(false)
const editingProduct = ref(null)
const stockProduct = ref(null)

const form = reactive({
  name: '',
  code: '',
  category: '',
  price: 0,
  stock: 0
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
    Object.assign(form, { name: '', code: '', category: '', price: 0, stock: 0 })
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
</script>
