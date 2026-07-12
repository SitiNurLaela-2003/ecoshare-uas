<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">📋 Riwayat Peminjaman</h1>
        <p class="page-sub">Semua riwayat sewa barang yang pernah kamu lakukan.</p>
      </div>
      <button class="btn btn-ghost btn-sm" @click="loadRiwayat">🔄 Refresh</button>
    </div>

    <div class="stats-grid" style="margin-bottom:1.5rem">
      <div class="stat-card" style="--clr:#22d3a0"><div class="stat-icon">✅</div><div class="stat-label">Aktif</div><div class="stat-value" style="color:#22d3a0">{{ sum.aktif }}</div></div>
      <div class="stat-card" style="--clr:#38bdf8"><div class="stat-icon">📦</div><div class="stat-label">Selesai</div><div class="stat-value" style="color:#38bdf8">{{ sum.selesai }}</div></div>
      <div class="stat-card" style="--clr:#f43f5e"><div class="stat-icon">❌</div><div class="stat-label">Dibatalkan</div><div class="stat-value" style="color:#f43f5e">{{ sum.dibatalkan }}</div></div>
      <div class="stat-card" style="--clr:#a855f7"><div class="stat-icon">💰</div><div class="stat-label">Total Pengeluaran</div><div class="stat-value" style="color:#a855f7;font-size:1rem">{{ formatRp(sum.total) }}</div></div>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="!riwayat.length" class="empty"><div class="icon">📋</div><p>Belum ada riwayat peminjaman</p></div>
    <div v-else class="card">
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Nama Barang</th><th>Mulai</th><th>Selesai</th><th>Hari</th><th>Total Biaya</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in riwayat" :key="r.id">
              <td class="bold">{{ i + 1 }}</td>
              <td class="bold">{{ r.nama_barang }}</td>
              <td>{{ tgl(r.tanggal_mulai) }}</td>
              <td>{{ tgl(r.tanggal_selesai) }}</td>
              <td>{{ r.jumlah_hari }} hari</td>
              <td class="accent">{{ formatRp(r.total_biaya) }}</td>
              <td><span :class="['badge', stClass(r.status)]">{{ r.status }}</span></td>
              <td>
                <div v-if="r.status === 'aktif'" style="display:flex;flex-direction:column;gap:4px">
                  <button class="btn btn-success btn-sm" @click="aksi(r.id, 'selesai')">✅ Kembalikan</button>
                  <button class="btn btn-danger btn-sm"  @click="aksi(r.id, 'batalkan')">❌ Batalkan</button>
                </div>
                <span v-else style="color:var(--text-muted);font-size:.75rem">-</span>
              </td>
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
const riwayat = ref([])
const loading = ref(false)

const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
const tgl = s => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const stClass = s => ({ aktif: 'badge-success', selesai: 'badge-info', dibatalkan: 'badge-danger', pending: 'badge-warning' }[s] || '')

const sum = computed(() => ({
  aktif:      riwayat.value.filter(r => r.status === 'aktif').length,
  selesai:    riwayat.value.filter(r => r.status === 'selesai').length,
  dibatalkan: riwayat.value.filter(r => r.status === 'dibatalkan').length,
  total:      riwayat.value.reduce((s, r) => s + Number(r.total_biaya), 0)
}))

const loadRiwayat = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch('/api/rentals/riwayat', { headers: { Authorization: 'Bearer ' + token } })
    const data  = await res.json()
    riwayat.value = data.data || []
  } catch {
    showToast('Gagal memuat riwayat', 'error')
  } finally {
    loading.value = false
  }
}

const aksi = async (id, tipe) => {
  if (!confirm('Yakin ingin ' + (tipe === 'selesai' ? 'mengembalikan' : 'membatalkan') + ' peminjaman ini?')) return
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch('/api/rentals/' + id + '/' + tipe, { method: 'PUT', headers: { Authorization: 'Bearer ' + token } })
    const data  = await res.json()
    if (!res.ok) { showToast('❌ ' + data.message, 'error'); return }
    showToast(data.message, 'success')
    loadRiwayat()
  } catch {
    showToast('❌ Gagal melakukan aksi!', 'error')
  }
}

onMounted(loadRiwayat)
</script>