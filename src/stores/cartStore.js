import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])
    const currentSaleId = ref(null)

    const total = computed(() => {
        return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    })

    function addToCart(product, quantity = 1) {
        const existing = items.value.find(i => i.id === product.id)
        if (existing) {
            existing.quantity = Number((existing.quantity + quantity).toFixed(3))
        } else {
            items.value.push({
                ...product,
                quantity: quantity
            })
        }
    }

    function removeFromCart(productId) {
        items.value = items.value.filter(i => i.id !== productId)
    }

    function updateQuantity(productId, delta) {
        const item = items.value.find(i => i.id === productId)
        if (item) {
            item.quantity += delta
            if (item.quantity <= 0) {
                removeFromCart(productId)
            }
        }
    }

    function clearCart() {
        items.value = []
    }

    function setQuantity(productId, qty) {
        const item = items.value.find(i => i.id === productId)
        if (item) {
            item.quantity = qty
            if (item.quantity <= 0) removeFromCart(productId)
        }
    }

    return {
        items,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        clearCart
    }
})
