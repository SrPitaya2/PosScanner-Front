import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('products', () => {
    // Mock Data
    const products = ref([
        { id: 1, name: 'Lysol Desinfectante', code: '7501032919177', price: 70.00, category: 'Limpieza', stock: 50 },
        { id: 2, name: 'Coca Cola 600ml', code: '7501055310886', price: 18.00, category: 'Bebidas', stock: 100 },
        { id: 3, name: 'Sabritas Sal 45g', code: '7501011115609', price: 16.00, category: 'Botanas', stock: 25 },
        { id: 4, name: 'Emperador Chocolate', code: '7501000622283', price: 22.00, category: 'Galletas', stock: 40 },
        { id: 5, name: 'Leche Lala 1L', code: '7501020513123', price: 28.50, category: 'Lacteos', stock: 15 },
        { id: 6, name: 'Jabon Zote Rosa', code: '7501025400114', price: 12.00, category: 'Limpieza', stock: 200 }
    ])

    const categories = computed(() => {
        return ['Todos', ...new Set(products.value.map(p => p.category))]
    })

    function findByCode(code) {
        return products.value.find(p => p.code === code)
    }

    function searchProducts(query, category = 'Todos') {
        const lowerQuery = query.toLowerCase()
        return products.value.filter(p => {
            const matchText = p.name.toLowerCase().includes(lowerQuery) || p.code.includes(query)
            const matchCat = category === 'Todos' || p.category === category
            return matchText && matchCat
        })
    }

    // Inventory Actions
    function updateStock(id, quantity) {
        const product = products.value.find(p => p.id === id)
        if (product) {
            product.stock = Math.max(0, product.stock + quantity)
        }
    }

    function addProduct(product) {
        products.value.push({ ...product, id: Date.now() })
    }

    function updateProduct(id, updates) {
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
            products.value[index] = { ...products.value[index], ...updates }
        }
    }

    function deleteProduct(id) {
        products.value = products.value.filter(p => p.id !== id)
    }

    return {
        products,
        categories,
        findByCode,
        searchProducts,
        updateStock,
        addProduct,
        updateProduct,
        deleteProduct
    }
})
