<template>
  <div class="flex flex-col h-screen w-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
    <!-- Desktop Header -->
    <header class="hidden md:flex bg-white shadow-sm border-b border-gray-200 px-4 py-3 items-center justify-between z-10">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Mi Tienda
        </h1>
      </div>
      
      <nav class="flex items-center gap-4">
        <router-link to="/" class="nav-item-desktop" active-class="active">Vender</router-link>
        <router-link to="/history" class="nav-item-desktop" active-class="active">Historial</router-link>
        <router-link to="/inventory" class="nav-item-desktop" active-class="active">Inventario</router-link>
        <router-link to="/check" class="nav-item-desktop" active-class="active">Verificar</router-link>
      </nav>
    </header>

    <!-- Mobile Header (Minimal) -->
    <header class="md:hidden bg-white shadow-sm px-4 py-2 flex items-center justify-between z-10 shrink-0 h-14">
       <h1 class="text-lg font-bold text-primary">Mi Tienda</h1>
       <!-- Space for extra actions if needed -->
    </header>

    <!-- Content -->
    <main class="flex-1 overflow-hidden relative w-full">
      <router-view></router-view>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden bg-white border-t border-gray-200 flex justify-around items-center shrink-0 z-20 pb-safe pt-2">
      <router-link to="/" class="nav-item-mobile" active-class="text-primary">
        <ShoppingBag class="w-6 h-6" />
        <span class="text-[10px] font-medium mt-1">Venta</span>
      </router-link>
      
      <router-link to="/history" class="nav-item-mobile" active-class="text-primary">
        <Clock class="w-6 h-6" />
        <span class="text-[10px] font-medium mt-1">Historial</span>
      </router-link>

      <router-link to="/inventory" class="nav-item-mobile" active-class="text-primary">
        <Package class="w-6 h-6" />
        <span class="text-[10px] font-medium mt-1">Inventario</span>
      </router-link>

      <router-link to="/check" class="nav-item-mobile" active-class="text-primary">
        <ScanLine class="w-6 h-6" />
        <span class="text-[10px] font-medium mt-1">Check</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ShoppingBag, Clock, Package, ScanLine } from 'lucide-vue-next'
</script>

<style scoped>
.nav-item-desktop {
  @apply px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 text-gray-600;
}
.nav-item-desktop.active {
  @apply bg-blue-50 text-blue-700 border border-blue-200;
}

.nav-item-mobile {
  @apply flex flex-col items-center justify-center w-full p-2 text-gray-400 active:scale-95 transition-all;
}
.pb-safe {
  padding-bottom: calc(env(safe-area-inset-bottom) + 16px);
}
</style>
