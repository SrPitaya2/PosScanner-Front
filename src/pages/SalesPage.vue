<template>
  <div class="h-full flex flex-col md:flex-row bg-gray-50 overflow-hidden relative">
    
    <!-- MOBILE ONLY: Tabs to switch views -->
    <div class="md:hidden flex h-12 bg-white border-b border-gray-200 shrink-0">
      <button 
        @click="activeMobileTab = 'sell'"
        class="flex-1 font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors"
        :class="activeMobileTab === 'sell' ? 'border-primary text-primary' : 'border-transparent text-gray-500'"
      >
        <ScanLine class="w-4 h-4" />
        Escanear
      </button>
      <button 
        @click="activeMobileTab = 'cart'"
        class="flex-1 font-medium text-sm flex items-center justify-center gap-2 border-b-2 transition-colors"
        :class="activeMobileTab === 'cart' ? 'border-primary text-primary' : 'border-transparent text-gray-500'"
      >
        <ShoppingCart class="w-4 h-4" />
        Carrito ({{ cartStore.items.reduce((a,c) => a + c.quantity, 0) }})
      </button>
    </div>

    <!-- LEFT PANEL (Scanner & Products) -->
    <!-- On mobile, shown only if activeMobileTab is 'sell' -->
    <div 
      class="w-full md:w-1/2 flex flex-col h-full md:h-full border-r border-gray-200 bg-white transition-transform duration-300 absolute md:relative z-0"
      :class="[
        activeMobileTab === 'sell' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      
      <!-- Top: Scanner (Toggleable on mobile to save space?) -->
      <!-- Keeping fixed height for now but smaller on mobile -->
      <div class="h-48 md:h-1/3 bg-black relative shrink-0">
        <BarcodeScanner @scan="handleScan" />
      </div>

      <!-- Middle: Search & Filter -->
      <div class="flex-1 flex flex-col bg-white p-3 overflow-hidden">
        <div class="flex gap-2 mb-3">
          <div class="relative flex-1">
             <input 
              v-model="searchQuery"
              placeholder="Buscar..."
              class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              @keyup.enter="handleManualAdd"
            />
            <Search class="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
          </div>
          <button @click="handleManualAdd" class="btn-primary p-2 rounded-lg md:px-4 md:py-2">
            <Plus class="w-5 h-5" />
          </button>
        </div>

        <!-- Categories -->
        <div class="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide shrink-0">
          <button 
            v-for="cat in productStore.categories" 
            :key="cat"
            @click="selectedCategory = cat"
            class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border"
            :class="selectedCategory === cat ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-600 border-gray-200'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Product Grid -->
        <div class="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-2 content-start pb-20 md:pb-0">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            @click="addToCart(product)"
            class="bg-white border border-gray-100 rounded-xl p-3 shadow-sm active:scale-95 transition-transform flex flex-col items-center text-center h-min"
          >
            <div class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-1 text-xl">
              📦
            </div>
            <h3 class="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight h-8 w-full">{{ product.name }}</h3>
            <p class="text-primary font-bold text-sm mt-1">${{ product.price.toFixed(2) }}</p>
          </div>
          
          <div v-if="filteredProducts.length === 0" class="col-span-full text-center py-8 text-gray-400">
            Producto no encontrado
          </div>
        </div>
      </div>
      
      <!-- Mobile Sticky Total Bar (When in Sell Mode) -->
      <div class="md:hidden absolute bottom-0 left-0 right-0 bg-white border-t p-3 flex items-center justify-between shadow-lg z-10" v-if="cartStore.items.length > 0">
         <div>
           <p class="text-xs text-gray-500">Total</p>
           <p class="font-bold text-lg">${{ cartStore.total.toFixed(2) }}</p>
         </div>
         <button @click="activeMobileTab = 'cart'" class="btn-primary py-2 px-4 text-sm flex items-center gap-2">
           Ver Carrito <ArrowRight class="w-4 h-4" />
         </button>
      </div>
    </div>

    <!-- RIGHT PANEL (Cart & Checkout) -->
     <!-- On mobile, shown only if activeMobileTab is 'cart' -->
    <div 
      class="w-full md:w-1/2 flex flex-col h-full bg-gray-50 absolute md:relative z-10 md:z-0 transition-transform duration-300 md:transform-none"
      :class="[
        activeMobileTab === 'cart' ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      
      <!-- Mobile Cart Header (Back button) -->
      <div class="md:hidden flex items-center p-3 bg-white border-b">
        <button @click="activeMobileTab = 'sell'" class="mr-2 text-gray-600">
          <ArrowLeft class="w-6 h-6" />
        </button>
        <span class="font-bold">Carrito de Compras</span>
      </div>

      <!-- Cart List -->
      <div class="flex-1 overflow-y-auto p-4 content-start">
        <h2 class="hidden md:flex text-xl font-bold mb-4 items-center gap-2">
          <ShoppingCart class="w-6 h-6 text-primary" />
          Carrito
        </h2>

        <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400">
          <ShoppingBag class="w-16 h-16 mb-4 opacity-20" />
          <p>Carrito vacío</p>
          <button @click="activeMobileTab = 'sell'" class="mt-4 text-primary font-medium md:hidden">
            Ir a escanear
          </button>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3"
          >
            <div class="flex-1">
              <h4 class="font-semibold text-gray-800 text-sm">{{ item.name }}</h4>
              <p class="text-xs text-gray-500">${{ item.price.toFixed(2) }}</p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button 
                @click="cartStore.updateQuantity(item.id, -1)"
                class="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-red-500 font-bold active:bg-gray-100"
              >
                <Minus class="w-3 h-3" />
              </button>
              <span class="w-4 text-center text-sm font-semibold">{{ item.quantity }}</span>
              <button 
                @click="cartStore.updateQuantity(item.id, 1)"
                class="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-green-600 font-bold active:bg-gray-100"
              >
                <Plus class="w-3 h-3" />
              </button>
            </div>
            
            <div class="text-right w-16">
               <p class="font-bold text-gray-900 text-sm">${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Section -->
      <div class="bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div class="mb-4">
          <label class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">Método de Pago</label>
          <div class="grid grid-cols-4 gap-2">
            <button 
              v-for="method in paymentMethods" 
              :key="method.id"
              @click="selectedPayment = method.id"
              class="flex flex-col items-center justify-center p-2 rounded-lg border transition-all active:scale-95"
              :class="selectedPayment === method.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500'"
            >
              <component :is="method.icon" class="w-5 h-5 mb-1" />
              <span class="text-[10px] font-medium">{{ method.name }}</span>
            </button>
          </div>
        </div>

        <button 
          @click="handleCheckout"
          :disabled="cartStore.items.length === 0"
          class="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span>Cobrar ${{ cartStore.total.toFixed(2) }}</span>
          <ArrowRight class="w-5 h-5" />
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
const activeMobileTab = ref('sell') // 'sell' or 'cart'

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

  // Sweet Alert style toast could be better, but standard toast is fine
  toastStore.addToast(`Venta: $${total.toFixed(2)}`, 'success', 3000)
  cartStore.clearCart()
  
  // Go back to sell screen on mobile
  activeMobileTab.value = 'sell'
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
