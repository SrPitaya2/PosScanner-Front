<template>
  <div class="d-flex flex-column vh-100 vw-100 bg-light text-dark overflow-hidden">
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
    </header>

    <!-- Content -->
    <main class="flex-grow-1 overflow-hidden position-relative w-100">
      <router-view></router-view>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="d-md-none bg-white border-top d-flex justify-content-around align-items-center flex-shrink-0 z-2 pb-5 pt-2">
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
import { ShoppingBag, Clock, Package, ScanLine } from 'lucide-vue-next'
</script>
