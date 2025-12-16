import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import SalesPage from '../pages/SalesPage.vue'
import InventoryPage from '../pages/InventoryPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'
import ProductCheckPage from '../pages/ProductCheckPage.vue'

const routes = [
    {
        path: '/',
        component: MainLayout, // Layout wrapper
        children: [
            { path: '', component: SalesPage, name: 'Sales' },
            { path: 'inventory', component: InventoryPage, name: 'Inventory' },
            { path: 'history', component: HistoryPage, name: 'History' },
            { path: 'check', component: ProductCheckPage, name: 'Check' },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
