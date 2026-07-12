import { createRouter, createWebHistory } from 'vue-router'
import HomeView       from '../views/HomeView.vue'
import LoginView      from '../views/LoginView.vue'
import DashboardView  from '../views/DashboardView.vue'
import ItemsView      from '../views/ItemsView.vue'
import RiwayatView    from '../views/RiwayatView.vue'
import BarangSayaView from '../views/BarangSayaView.vue'
import TransaksiView  from '../views/TransaksiView.vue'
import ProfilView     from '../views/ProfilView.vue'

const routes = [
  { path: '/',            name: 'home',        component: HomeView },
  { path: '/login',       name: 'login',       component: LoginView },
  { path: '/dashboard',   name: 'dashboard',   component: DashboardView,  meta: { requiresAuth: true } },
  { path: '/items',       name: 'items',       component: ItemsView },
  { path: '/riwayat',     name: 'riwayat',     component: RiwayatView,    meta: { requiresAuth: true, role: 'penyewa' } },
  { path: '/barang-saya', name: 'barang-saya', component: BarangSayaView, meta: { requiresAuth: true, role: 'pemilik' } },
  { path: '/transaksi',   name: 'transaksi',   component: TransaksiView,  meta: { requiresAuth: true, role: 'pemilik' } },
  { path: '/profil',      name: 'profil',      component: ProfilView,     meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to) => {
  const token = localStorage.getItem('eco_token')
  const user  = JSON.parse(localStorage.getItem('eco_user') || 'null')
  if (to.meta.requiresAuth && !token) return { name: 'login' }
  if (to.meta.role && user && user.role !== to.meta.role) return { name: 'dashboard' }
  if (to.name === 'login' && token) return { name: 'dashboard' }
})

export default router