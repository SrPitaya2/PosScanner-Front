import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSalesStore = defineStore('sales', () => {
    const sales = ref([])

    // Load from local storage on init
    const stored = localStorage.getItem('pos_sales_history')
    if (stored) {
        sales.value = JSON.parse(stored)
    }

    function addSale(sale) {
        const newSale = {
            ...sale,
            id: Date.now(),
            date: new Date().toISOString()
        }
        sales.value.unshift(newSale) // Add to top
        save()
    }

    function save() {
        localStorage.setItem('pos_sales_history', JSON.stringify(sales.value))
    }

    function getSalesByDateRange(start, end) {
        if (!start && !end) return sales.value

        const startDate = start ? new Date(start) : new Date(0)
        const endDate = end ? new Date(end) : new Date()
        // Adjust end date to end of day if it's just a date string
        if (end && end.length === 10) endDate.setHours(23, 59, 59, 999)

        return sales.value.filter(s => {
            const d = new Date(s.date)
            return d >= startDate && d <= endDate
        })
    }

    const todayTotal = computed(() => {
        const today = new Date().toDateString()
        return sales.value
            .filter(s => new Date(s.date).toDateString() === today)
            .reduce((sum, s) => sum + s.total, 0)
    })

    return {
        sales,
        addSale,
        getSalesByDateRange,
        todayTotal
    }
})
