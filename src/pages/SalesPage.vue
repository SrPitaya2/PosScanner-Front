<template>
  <div class="h-100 d-flex flex-column flex-md-row bg-light overflow-hidden position-relative">
    
    <!-- MOBILE ONLY: Tabs -->
    <div class="d-md-none d-flex flex-shrink-0 bg-white border-bottom" style="height: 48px;">
      <button 
        @click="activeMobileTab = 'sell'"
        class="flex-fill border-0 bg-transparent fw-bold small d-flex align-items-center justify-content-center gap-2"
        :class="activeMobileTab === 'sell' ? 'text-primary border-bottom border-primary border-3 border-opacity-100' : 'text-secondary'"
      >
        <ScanLine style="width: 16px; height: 16px;" />
        Escanear
      </button>
      <button 
        @click="activeMobileTab = 'cart'"
        class="flex-fill border-0 bg-transparent fw-bold small d-flex align-items-center justify-content-center gap-2"
        :class="activeMobileTab === 'cart' ? 'text-primary border-bottom border-primary border-3 border-opacity-100' : 'text-secondary'"
      >
        <ShoppingCart style="width: 16px; height: 16px;" />
        Carrito ({{ cartStore.items.reduce((a,c) => a + c.quantity, 0) }})
      </button>
    </div>

    <!-- NEW: Top Sticky Total Bar -->
    <div v-if="cartStore.items.length > 0" class="d-md-none bg-primary text-white p-2 px-3 d-flex align-items-center justify-content-between shadow-sm flex-shrink-0">
         <div class="d-flex align-items-center gap-2">
            <span class="badge bg-white text-primary rounded-pill">{{ cartStore.items.length }}</span>
            <span class="fw-bold">Total: ${{ cartStore.total.toFixed(2) }}</span>
         </div>
         <button @click="activeMobileTab = 'cart'" class="btn btn-sm btn-white bg-white text-primary fw-bold d-flex align-items-center gap-1 rounded-pill px-3">
           Ver Carrito <ArrowRight style="width: 14px;" />
         </button>
    </div>

    <!-- LEFT PANEL (Scanner & Products) -->
    <div 
      class="w-100 w-md-50 d-flex flex-column flex-grow-1 overflow-hidden border-end border-light-subtle bg-white position-relative"
      :class="{'d-none d-md-flex': activeMobileTab === 'cart'}"
    >
      
      <!-- Top: Scanner -->
      <div class="bg-black position-relative flex-shrink-0 overflow-hidden" style="height: 25vh; max-height: 250px; min-height: 150px;">
        <BarcodeScanner @scan="handleScan" />
      </div>

      <!-- Middle: Search & Filter -->
      <div class="flex-grow-1 d-flex flex-column p-3 overflow-hidden position-relative">
        <div class="d-flex gap-2 mb-3">
          <div class="position-relative flex-grow-1">
             <input 
              v-model="searchQuery"
              placeholder="Buscar..."
              class="form-control ps-5"
              @keyup.enter="handleManualAdd"
            />
            <Search class="position-absolute text-secondary" style="left: 12px; top: 10px; width: 16px; height: 16px;" />
          </div>
          <button @click="handleManualAdd" class="btn btn-primary d-flex align-items-center justify-content-center px-3">
            <Plus style="width: 20px; height: 20px;" />
          </button>
        </div>

        <!-- Categories -->
        <div class="d-flex gap-2 overflow-auto pb-2 mb-2 flex-shrink-0" style="scrollbar-width: none;">
          <button 
            v-for="cat in productStore.categories" 
            :key="cat"
            @click="selectedCategory = cat"
            class="btn btn-sm rounded-pill text-nowrap"
            :class="selectedCategory === cat ? 'btn-primary' : 'btn-light border'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Product Grid -->
        <div class="flex-grow-1 overflow-auto">
          <div class="row g-2 m-0 align-content-start">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="col-6 col-lg-4 p-1"
            >
              <div 
                @click="addToCart(product)"
                class="card h-100 border-0 shadow-sm text-center p-2"
                style="cursor: pointer;"
              >
                <div class="mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center mb-1" style="width: 40px; height: 40px; font-size: 1.2rem;">
                  📦
                </div>
                <h6 class="card-title small fw-bold text-dark text-truncate mb-1" style="max-width: 100%;">{{ product.name }}</h6>
                <p class="card-text text-primary fw-bold small m-0">${{ product.price.toFixed(2) }}</p>
              </div>
            </div>
          </div>
          
          <div v-if="filteredProducts.length === 0" class="text-center py-5 text-secondary">
            Producto no encontrado
          </div>
        </div>
      </div>
      
      <!-- REMOVED BOTTOM BAR -->
    </div>

    <!-- RIGHT PANEL (Cart & Checkout) -->
    <div 
      class="w-100 w-md-50 d-flex flex-column h-100 bg-light"
      :class="{'d-none d-md-flex': activeMobileTab === 'sell'}"
    >
      
      <!-- Mobile Cart Header -->
      <div class="d-md-none d-flex align-items-center p-3 bg-white border-bottom">
        <button @click="activeMobileTab = 'sell'" class="btn p-0 me-2 text-dark border-0">
          <ArrowLeft style="width: 24px; height: 24px;" />
        </button>
        <span class="fw-bold">Carrito de Compras</span>
      </div>

      <!-- Cart List -->
      <div class="flex-grow-1 overflow-auto p-3">
        <h2 class="d-none d-md-flex h5 fw-bold mb-3 align-items-center gap-2">
          <ShoppingCart class="text-primary" style="width: 24px; height: 24px;" />
          Carrito
        </h2>

        <div v-if="cartStore.items.length === 0" class="d-flex flex-column align-items-center justify-content-center h-50 text-secondary">
          <ShoppingBag style="width: 64px; height: 64px; opacity: 0.2;" class="mb-3" />
          <p>Carrito vacío</p>
          <button @click="activeMobileTab = 'sell'" class="btn btn-link text-primary d-md-none text-decoration-none">
            Ir a escanear
          </button>
        </div>

        <div v-else class="d-flex flex-column gap-2">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="card border-0 shadow-sm p-2 d-flex flex-row align-items-center gap-2"
          >
            <div class="flex-grow-1">
              <h6 class="mb-0 small fw-bold text-dark">{{ item.name }}</h6>
              <small class="text-secondary">${{ item.price.toFixed(2) }}</small>
            </div>

            <!-- Quantity Controls -->
            <div class="d-flex align-items-center gap-2 bg-light rounded p-1">
              <button 
                @click="cartStore.updateQuantity(item.id, -1)"
                class="btn btn-light btn-sm p-0 d-flex align-items-center justify-content-center border shadow-sm text-danger"
                style="width: 28px; height: 28px;"
              >
                <Minus style="width: 14px; height: 14px;" />
              </button>
              <span class="small fw-bold text-center" style="width: 20px;">{{ item.quantity }}</span>
              <button 
                @click="cartStore.updateQuantity(item.id, 1)"
                class="btn btn-light btn-sm p-0 d-flex align-items-center justify-content-center border shadow-sm text-success"
                style="width: 28px; height: 28px;"
              >
                <Plus style="width: 14px; height: 14px;" />
              </button>
            </div>
            
            <div class="text-end" style="width: 60px;">
               <p class="m-0 fw-bold small text-dark">${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Section -->
      <div class="bg-white border-top p-3 shadow-lg z-3">
        <div class="mb-3">
          <label class="small fw-bold text-secondary text-uppercase mb-2 d-block">Método de Pago</label>
          <div class="row g-2">
            <div class="col-3" v-for="method in paymentMethods" :key="method.id">
               <button 
                @click="selectedPayment = method.id"
                class="btn w-100 p-2 d-flex flex-column align-items-center justify-content-center gap-1 border"
                :class="selectedPayment === method.id ? 'btn-primary-subtle text-primary border-primary' : 'btn-light border-light text-secondary'"
              >
                <component :is="method.icon" style="width: 20px; height: 20px;" />
                <span style="font-size: 10px;" class="fw-medium">{{ method.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <button 
          @click="handleCheckout"
          :disabled="cartStore.items.length === 0"
          class="btn btn-success w-100 py-3 rounded-3 fw-bold shadow d-flex align-items-center justify-content-center gap-2"
        >
          <span>Cobrar ${{ cartStore.total.toFixed(2) }}</span>
          <ArrowRight style="width: 20px; height: 20px;" />
        </button>
      </div>
    </div>
  </div>
  
  <Toast />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'
import { useToastStore } from '../stores/toastStore'
import { useSalesStore } from '../stores/salesStore'
import BarcodeScanner from '../components/BarcodeScanner.vue'
import Toast from '../components/ui/Toast.vue'
import { 
  Search, Plus, Minus, Trash2, ShoppingCart, ShoppingBag, 
  ArrowRight, ArrowLeft, CreditCard, Banknote, FileText, UserCheck, ScanLine 
} from 'lucide-vue-next'

const productStore = useProductStore()
const cartStore = useCartStore()
const toastStore = useToastStore()
const salesStore = useSalesStore()

const searchQuery = ref('')
const selectedCategory = ref('Todos')
const selectedPayment = ref('cash')
const activeMobileTab = ref('sell') 

const paymentMethods = [
  { id: 'cash', name: 'Efectivo', icon: Banknote },
  { id: 'card', name: 'Tarjeta', icon: CreditCard },
  { id: 'transfer', name: 'Transf.', icon: FileText },
  { id: 'credit', name: 'Fiado', icon: UserCheck },
]

const filteredProducts = computed(() => {
  return productStore.searchProducts(searchQuery.value, selectedCategory.value)
})

function addToCart(product) {
  cartStore.addToCart(product)
  if (navigator.vibrate) navigator.vibrate(50)
  toastStore.addToast(`+ ${product.name}`, 'success', 1000)
}

function handleScan(code) {
  const product = productStore.findByCode(code)
  if (product) {
    addToCart(product)
  } else {
    toastStore.addToast(`No encontrado: ${code}`, 'error')
    searchQuery.value = code 
  }
}

function handleManualAdd() {
  const productByCode = productStore.findByCode(searchQuery.value)
  if (productByCode) {
    addToCart(productByCode)
    searchQuery.value = ''
    return
  }
   toastStore.addToast(`No se encontró "${searchQuery.value}"`, 'warning')
}

function handleCheckout() {
  if (cartStore.items.length === 0) return

  const total = cartStore.total
  const method = paymentMethods.find(m => m.id === selectedPayment.value).name
  
  salesStore.addSale({
    total: total,
    method: method,
    items: [...cartStore.items]
  })

  toastStore.addToast(`Venta: $${total.toFixed(2)}`, 'success', 3000)
  cartStore.clearCart()
  
  activeMobileTab.value = 'sell'
}
</script>
