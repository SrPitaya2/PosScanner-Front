<template>
  <div class="d-flex flex-column vh-100 vw-100 bg-light text-dark overflow-hidden" style="height: 100dvh;">
    <!-- Desktop Header -->
    <header class="d-none d-md-flex bg-white shadow-sm border-bottom px-3 py-2 align-items-center justify-content-between z-1" style="height: 60px;">
      <div class="d-flex align-items-center gap-2">
        <h1 class="h5 fw-bold m-0 text-primary">
          Mi Tienda
        </h1>
      </div>
      
      <nav class="d-flex align-items-center gap-2">
        <router-link to="/" class="btn btn-sm fw-medium border-0" active-class="btn-primary-subtle text-primary" :class="$route.path !== '/' ? 'text-secondary bg-transparent' : ''">Vender</router-link>
        <router-link to="/history" class="btn btn-sm fw-medium border-0" active-class="btn-primary-subtle text-primary" :class="$route.path !== '/history' ? 'text-secondary bg-transparent' : ''">Historial</router-link>
        <router-link to="/inventory" class="btn btn-sm fw-medium border-0" active-class="btn-primary-subtle text-primary" :class="$route.path !== '/inventory' ? 'text-secondary bg-transparent' : ''">Inventario</router-link>
        <router-link to="/check" class="btn btn-sm fw-medium border-0" active-class="btn-primary-subtle text-primary" :class="$route.path !== '/check' ? 'text-secondary bg-transparent' : ''">Verificar</router-link>
      </nav>
    </header>

    <!-- Mobile Header -->
    <header class="d-md-none bg-white shadow-sm px-3 py-2 d-flex align-items-center justify-content-between z-1 flex-shrink-0" style="height: 56px;">
       <h1 class="h6 fw-bold m-0 text-primary">Mi Tienda</h1>
       <button @click="isMenuOpen = true" class="btn p-0 text-dark border-0">
         <Menu style="width: 24px; height: 24px;" />
       </button>
    </header>

    <!-- Mobile Sidebar (Offcanvas) -->
    <div v-if="isMenuOpen" class="position-fixed top-0 start-0 w-100 h-100 z-3" style="background: rgba(0,0,0,0.5);" @click="isMenuOpen = false"></div>
    <div 
      class="position-fixed top-0 end-0 h-100 bg-white shadow-lg z-3 d-flex flex-column transition-transform"
      style="width: 280px; transition: transform 0.3s ease-out;"
      :style="{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)' }"
    >
      <div class="p-3 border-bottom d-flex align-items-center justify-content-between">
         <h5 class="fw-bold m-0 text-primary">Menú</h5>
         <button @click="isMenuOpen = false" class="btn p-0 text-secondary">
           <X style="width: 24px; height: 24px;" />
         </button>
      </div>
      <nav class="d-flex flex-column p-3 gap-2">
         <router-link to="/" @click="isMenuOpen = false" class="btn btn-light text-start d-flex align-items-center gap-2" active-class="btn-primary-subtle text-primary font-weight-bold">
           <ShoppingBag style="width: 18px;" /> Vender
         </router-link>
         <router-link to="/history" @click="isMenuOpen = false" class="btn btn-light text-start d-flex align-items-center gap-2" active-class="btn-primary-subtle text-primary font-weight-bold">
           <Clock style="width: 18px;" /> Historial
         </router-link>
         <router-link to="/inventory" @click="isMenuOpen = false" class="btn btn-light text-start d-flex align-items-center gap-2" active-class="btn-primary-subtle text-primary font-weight-bold">
           <Package style="width: 18px;" /> Inventario
         </router-link>
         <router-link to="/check" @click="isMenuOpen = false" class="btn btn-light text-start d-flex align-items-center gap-2" active-class="btn-primary-subtle text-primary font-weight-bold">
           <ScanLine style="width: 18px;" /> Verificador
         </router-link>
         <hr class="my-2">
         <div class="small text-secondary px-2">Versión 1.0.0</div>
      </nav>
    </div>

    <!-- Content -->
    <main class="flex-grow-1 overflow-hidden position-relative w-100">
      <router-view></router-view>
    </main>

    <!-- Mobile Bottom Navigation (With Safe Area) -->
    <nav 
      class="d-md-none bg-white border-top d-flex justify-content-around align-items-center flex-shrink-0 z-2 pt-2"
      style="padding-bottom: calc(16px + env(safe-area-inset-bottom));"
    >
      <router-link to="/" class="d-flex flex-column align-items-center justify-content-center w-100 p-2 text-decoration-none" active-class="text-primary" :class="$route.path !== '/' ? 'text-secondary' : ''">
        <ShoppingBag style="width: 24px; height: 24px;" />
        <span class="small fw-medium mt-1" style="font-size: 10px;">Venta</span>
      </router-link>
      
      <router-link to="/history" class="d-flex flex-column align-items-center justify-content-center w-100 p-2 text-decoration-none" active-class="text-primary" :class="$route.path !== '/history' ? 'text-secondary' : ''">
        <Clock style="width: 24px; height: 24px;" />
        <span class="small fw-medium mt-1" style="font-size: 10px;">Historial</span>
      </router-link>

      <router-link to="/inventory" class="d-flex flex-column align-items-center justify-content-center w-100 p-2 text-decoration-none" active-class="text-primary" :class="$route.path !== '/inventory' ? 'text-secondary' : ''">
        <Package style="width: 24px; height: 24px;" />
        <span class="small fw-medium mt-1" style="font-size: 10px;">Inventario</span>
      </router-link>

      <router-link to="/check" class="d-flex flex-column align-items-center justify-content-center w-100 p-2 text-decoration-none" active-class="text-primary" :class="$route.path !== '/check' ? 'text-secondary' : ''">
        <ScanLine style="width: 24px; height: 24px;" />
        <span class="small fw-medium mt-1" style="font-size: 10px;">Check</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShoppingBag, Clock, Package, ScanLine, Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)
</script>
