<template>
  <div v-if="isOpen" class="modal show d-block" tabindex="-1" role="dialog" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content shadow rounded-4 border-0">
        
        <div class="modal-header border-bottom-0 pb-0">
          <h5 class="modal-title fw-bold text-dark">{{ title }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <div v-if="$slots.footer" class="modal-footer border-top-0 pt-0">
          <slot name="footer"></slot>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: String
})

defineEmits(['close'])
</script>
