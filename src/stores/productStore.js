import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductStore = defineStore('products', () => {
    // Mock Data
    // Load initialization from localStorage
    const savedProducts = localStorage.getItem('products')
    const savedCategories = localStorage.getItem('categories')

    const products = ref(savedProducts ? JSON.parse(savedProducts) : [
        { id: 1, name: 'Lysol Desinfectante', code: '7501032919177', price: 70.00, category: 'Limpieza', stock: 50, unit: 'pza', useInventory: true },
        { id: 2, name: 'Coca Cola 600ml', code: '7501055310886', price: 18.00, category: 'Bebidas', stock: 100, unit: 'pza', useInventory: true },
        { id: 3, name: 'Sabritas Sal 45g', code: '7501011115609', price: 16.00, category: 'Botanas', stock: 25, unit: 'pza', useInventory: true },
        { id: 4, name: 'Emperador Chocolate', code: '7501000622283', price: 22.00, category: 'Galletas', stock: 40, unit: 'pza', useInventory: true },
        { id: 5, name: 'Leche Lala 1L', code: '7501020513123', price: 28.50, category: 'Lacteos', stock: 15, unit: 'pza', useInventory: true },
        { id: 6, name: 'Jabon Zote Rosa', code: '7501025400114', price: 12.00, category: 'Limpieza', stock: 200, unit: 'pza', useInventory: true }
    ])

    const categories = ref(savedCategories ? JSON.parse(savedCategories) : ['Limpieza', 'Bebidas', 'Botanas', 'Galletas', 'Lacteos', 'Frutas y Verduras'])

    const allCategories = computed(() => {
        return ['Todos', ...categories.value]
    })

    function saveToLocale() {
        localStorage.setItem('products', JSON.stringify(products.value))
        localStorage.setItem('categories', JSON.stringify(categories.value))
    }

    function findByCode(code) {
        if (!code) return null
        return products.value.find(p => p.code === code)
    }

    function searchProducts(query, category = 'Todos') {
        const lowerQuery = query.toLowerCase()
        return products.value.filter(p => {
            const matchText = p.name.toLowerCase().includes(lowerQuery) || (p.code && p.code.includes(query))
            const matchCat = category === 'Todos' || p.category === category
            return matchText && matchCat
        })
    }

    // Inventory Actions
    function updateStock(id, quantity) {
        const product = products.value.find(p => p.id === id)
        if (product && product.useInventory) {
            product.stock = Math.max(0, Number((product.stock + quantity).toFixed(3)))
            saveToLocale()
        }
    }

    function addProduct(product) {
        products.value.push({
            ...product,
            id: Date.now(),
            unit: product.unit || 'pza',
            useInventory: product.useInventory !== undefined ? product.useInventory : true
        })
        saveToLocale()
    }

    function updateProduct(id, updates) {
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
            products.value[index] = { ...products.value[index], ...updates }
            saveToLocale()
        }
    }

    function deleteProduct(id) {
        products.value = products.value.filter(p => p.id !== id)
        saveToLocale()
    }

    // Category Actions
    function addCategory(name) {
        if (name && !categories.value.includes(name)) {
            categories.value.push(name)
            saveToLocale()
        }
    }

    function deleteCategory(name) {
        categories.value = categories.value.filter(c => c !== name)
        saveToLocale()
    }

    return {
        products,
        categories,
        allCategories,
        findByCode,
        searchProducts,
        updateStock,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory
    }
})
