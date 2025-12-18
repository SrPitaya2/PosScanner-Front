import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSalesStore = defineStore('sales', () => {
    const sales = ref([])
    const payments = ref([]) // NEW: Track payments/abonos

    // Load from local storage on init
    const stored = localStorage.getItem('pos_sales_history')
    if (stored) {
        const data = JSON.parse(stored)
        // Backwards compatibility check
        if (Array.isArray(data)) {
            sales.value = data
        } else {
            sales.value = data.sales || []
            payments.value = data.payments || []
        }
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

    function addPayment(payment) {
        payments.value.unshift({
            ...payment,
            id: Date.now(),
            date: new Date().toISOString()
        })
        save()
    }

    function save() {
        localStorage.setItem('pos_sales_history', JSON.stringify({
            sales: sales.value,
            payments: payments.value
        }))
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
        payments,
        addSale,
        addPayment,
        getSalesByDateRange,
        todayTotal
    }
})
