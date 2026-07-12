<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">📊 Dashboard</h1>
        <p class="page-sub">Selamat datang, <strong style="color:var(--accent)">{{ user ? user.nama : '' }}</strong>! 👋</p>
      </div>
      <span :class="['badge', isPemilik ? 'badge-purple' : 'badge-success']">
        {{ isPemilik ? '🏷️ Pemilik Barang' : '🛍️ Penyewa' }}
      </span>
    </div>

    <div class="stats-grid">
      <div class="stat-card" style="--clr:#a855f7">
        <div class="stat-icon">📦</div>
        <div class="stat-label">Total Barang</div>
        <div class="stat-value" style="color:#a855f7">{{ stats.total }}</div>
        <div class="stat-change">↑ Di platform</div>
      </div>
      <div class="stat-card" style="--clr:#22d3a0">
        <div class="stat-icon">✅</div>
        <div class="stat-label">Tersedia</div>
        <div class="stat-value" style="color:#22d3a0">{{ stats.tersedia }}</div>
        <div class="stat-change">↑ Siap disewa</div>
      </div>
      <div class="stat-card" style="--clr:#fbbf24">
        <div class="stat-icon">🔄</div>
        <div class="stat-label">Sedang Disewa</div>
        <div class="stat-value" style="color:#fbbf24">{{ stats.disewa }}</div>
        <div class="stat-change">↑ Transaksi aktif</div>
      </div>
      <div class="stat-card" style="--clr:#38bdf8">
        <div class="stat-icon">💰</div>
        <div class="stat-label">Nilai Platform</div>
        <div class="stat-value" style="color:#38bdf8;font-size:1rem">{{ formatRp(stats.nilai) }}</div>
        <div class="stat-change">↑ Per hari</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">🕐 Barang Terbaru di Platform</div>
        <button class="btn btn-ghost btn-sm" @click="loadData">🔄 Refresh</button>
      </div>
      <div v-if="loading" class="spinner"></div>
      <div v-else-if="!items.length" class="empty"><div class="icon">📦</div><p>Belum ada data barang</p></div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Nama Barang</th><th>Pemilik</th><th>Harga/Hari</th><th>Stok</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items.slice(0, 8)" :key="item.id">
              <td class="bold">{{ i + 1 }}</td>
              <td class="bold">{{ item.nama_barang }}</td>
              <td>{{ item.nama_pemilik }}</td>
              <td class="accent">{{ formatRp(item.harga_per_hari) }}</td>
              <td>{{ item.stok }} unit</td>
              <td><span :class="['badge', item.status === 'tersedia' ? 'badge-success' : 'badge-warning']">{{ item.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="quick-menu">
      <div style="font-family:'Syne',sans-serif;font-weight:700;margin-bottom:1rem;font-size:1rem">⚡ Menu Cepat</div>
      <div class="quick-grid">
        <RouterLink to="/items"       class="quick-card"><div class="quick-icon">📦</div><div class="quick-label">Lihat Barang</div></RouterLink>
        <RouterLink v-if="isPenyewa" to="/riwayat"     class="quick-card"><div class="quick-icon">📋</div><div class="quick-label">Riwayat Sewa</div></RouterLink>
        <RouterLink v-if="isPemilik" to="/barang-saya" class="quick-card"><div class="quick-icon">🏷️</div><div class="quick-label">Barang Saya</div></RouterLink>
        <RouterLink v-if="isPemilik" to="/transaksi"   class="quick-card"><div class="quick-icon">💼</div><div class="quick-label">Transaksi Masuk</div></RouterLink>
        <RouterLink to="/profil"      class="quick-card"><div class="quick-icon">👤</div><div class="quick-label">Profil Saya</div></RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const { user, isPenyewa, isPemilik } = useAuth()
const items   = ref([])
const loading = ref(false)

const stats = computed(() => ({
  total:    items.value.length,
  tersedia: items.value.filter(i => i.status === 'tersedia').length,
  disewa:   items.value.filter(i => i.status === 'disewa').length,
  nilai:    items.value.reduce((s, i) => s + Number(i.harga_per_hari), 0)
}))

const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const loadData = async () => {
  loading.value = true
  try {
    const res  = await fetch('/api/items')
    const data = await res.json()
    items.value = data.data || []
  } catch(e) { console.error(e) }
  finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.quick-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(140px,1fr)); gap: 1rem; }
.quick-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.2rem; text-align: center; text-decoration: none; transition: all 0.22s; display: block; }
.quick-card:hover { border-color: var(--primary); box-shadow: var(--shadow); transform: translateY(-3px); }
.quick-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.quick-label { font-size: 0.82rem; font-weight: 600; color: var(--text-muted); }
</style>