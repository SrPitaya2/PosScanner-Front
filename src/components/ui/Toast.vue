<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <transition-group name="toast">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id"
        class="px-4 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 min-w-[200px]"
        :class="{
          'bg-green-600': toast.type === 'success',
          'bg-red-600': toast.type === 'error',
          'bg-blue-600': toast.type === 'info',
          'bg-yellow-500': toast.type === 'warning'
        }"
      >
        <span>{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '../../stores/toastStore'
const toastStore = useToastStore()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
