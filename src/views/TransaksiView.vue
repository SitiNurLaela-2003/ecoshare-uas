<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">💼 Transaksi Masuk</h1>
        <p class="page-sub">Semua permintaan sewa barang dari penyewa.</p>
      </div>
      <button class="btn btn-ghost btn-sm" @click="loadData">🔄 Refresh</button>
    </div>

    <div class="stats-grid" style="margin-bottom:1.5rem">
      <div class="stat-card" style="--clr:#22d3a0"><div class="stat-icon">✅</div><div class="stat-label">Aktif</div><div class="stat-value" style="color:#22d3a0">{{ sum.aktif }}</div></div>
      <div class="stat-card" style="--clr:#38bdf8"><div class="stat-icon">📦</div><div class="stat-label">Selesai</div><div class="stat-value" style="color:#38bdf8">{{ sum.selesai }}</div></div>
      <div class="stat-card" style="--clr:#a855f7"><div class="stat-icon">💰</div><div class="stat-label">Total Pendapatan</div><div class="stat-value" style="color:#a855f7;font-size:1rem">{{ formatRp(sum.pendapatan) }}</div></div>
      <div class="stat-card" style="--clr:#fbbf24"><div class="stat-icon">📊</div><div class="stat-label">Total Transaksi</div><div class="stat-value" style="color:#fbbf24">{{ rentals.length }}</div></div>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="!rentals.length" class="empty"><div class="icon">💼</div><p>Belum ada transaksi masuk</p></div>
    <div v-else class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Nama Barang</th><th>Penyewa</th><th>Mulai</th><th>Selesai</th><th>Total Biaya</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in rentals" :key="r.id">
              <td class="bold">{{ i + 1 }}</td>
              <td class="bold">{{ r.nama_barang }}</td>
              <td>{{ r.nama_penyewa }}</td>
              <td>{{ tgl(r.tanggal_mulai) }}</td>
              <td>{{ tgl(r.tanggal_selesai) }}</td>
              <td class="accent">{{ formatRp(r.total_biaya) }}</td>
              <td><span :class="['badge', stClass(r.status)]">{{ r.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '../composables/useToast.js'

const { showToast } = useToast()
const rentals = ref([])
const loading = ref(false)

const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
const tgl = s => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const stClass = s => ({ aktif: 'badge-success', selesai: 'badge-info', dibatalkan: 'badge-danger', pending: 'badge-warning' }[s] || '')

const sum = computed(() => ({
  aktif:      rentals.value.filter(r => r.status === 'aktif').length,
  selesai:    rentals.value.filter(r => r.status === 'selesai').length,
  pendapatan: rentals.value.filter(r => r.status !== 'dibatalkan').reduce((s, r) => s + Number(r.total_biaya), 0)
}))

const loadData = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch('/api/rentals/semua', { headers: { Authorization: 'Bearer ' + token } })
    const data  = await res.json()
    rentals.value = data.data || []
  } catch {
    showToast('Gagal memuat transaksi', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>