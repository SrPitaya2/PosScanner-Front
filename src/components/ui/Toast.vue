<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id"
        class="toast show align-items-center border-0 text-white mb-2"
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
        :class="{
          'bg-success': toast.type === 'success',
          'bg-danger': toast.type === 'error',
          'bg-primary': toast.type === 'info',
          'bg-warning text-dark': toast.type === 'warning'
        }"
      >
        <div class="d-flex">
          <div class="toast-body fw-medium">
            {{ toast.message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="toastStore.removeToast(toast.id)" aria-label="Close"></button>
        </div>
      </div>
  </div>
</template>

<script setup>
import { useToastStore } from '../../stores/toastStore'
const toastStore = useToastStore()
</script>
