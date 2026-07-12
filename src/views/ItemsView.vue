<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">📦 Inventaris Barang</h1>
        <p class="page-sub">Semua barang elektronik yang tersedia untuk disewa.</p>
      </div>
    </div>

    <div class="toolbar">
      <input v-model="search" type="text" placeholder="🔍 Cari barang..." class="search-inp" />
      <select v-model="filterStatus" class="filter-sel">
        <option value="">Semua Status</option>
        <option value="tersedia">Tersedia</option>
        <option value="disewa">Sedang Disewa</option>
      </select>
      <span class="total-chip">{{ filtered.length }} barang</span>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="!filtered.length" class="empty"><div class="icon">📦</div><p>Tidak ada barang ditemukan</p></div>
    <div v-else class="items-grid">
      <div class="item-card" v-for="item in filtered" :key="item.id" @click="openDetail(item)">
        <div class="item-img">{{ icons[item.id % icons.length] }}</div>
        <div class="item-body">
          <div class="item-name">{{ item.nama_barang }}</div>
          <div class="item-desc">{{ item.deskripsi || 'Tidak ada deskripsi' }}</div>
          <div class="item-footer">
            <div class="item-price">{{ formatRp(item.harga_per_hari) }}<small>/hari</small></div>
            <span :class="['badge', item.status === 'tersedia' ? 'badge-success' : 'badge-warning']">{{ item.status }}</span>
          </div>
          <p class="item-meta">Stok: {{ item.stok }} • {{ item.nama_pemilik }}</p>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="selectedItem" @click.self="selectedItem = null">
      <div class="modal">
        <div class="modal-title">{{ selectedItem.nama_barang }}</div>
        <p style="color:var(--text-muted);font-size:.87rem;line-height:1.6;margin-bottom:.8rem">{{ selectedItem.deskripsi || 'Tidak ada deskripsi' }}</p>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.8rem">
          <span :class="['badge', selectedItem.status === 'tersedia' ? 'badge-success' : 'badge-warning']">{{ selectedItem.status }}</span>
          <span class="badge badge-purple">{{ selectedItem.kondisi }}</span>
          <span class="badge badge-info">Stok: {{ selectedItem.stok }}</span>
        </div>
        <p style="font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;color:var(--accent);margin-bottom:.3rem">
          {{ formatRp(selectedItem.harga_per_hari) }}<span style="font-size:.78rem;color:var(--text-muted);font-weight:400">/hari</span>
        </p>
        <p style="font-size:.78rem;color:var(--text-muted);margin-bottom:1rem">Pemilik: {{ selectedItem.nama_pemilik }}</p>

        <div v-if="isPenyewa && selectedItem.status === 'tersedia'">
          <hr style="border-color:var(--border);margin:1rem 0" />
          <p style="font-size:.82rem;font-weight:600;color:var(--accent);margin-bottom:1rem">📅 Jadwal Peminjaman</p>
          <div class="form-grid">
            <div class="form-group">
              <label>Tanggal Mulai</label>
              <input type="date" v-model="sewaForm.tanggal_mulai" :min="today" @change="hitungEstimasi" />
            </div>
            <div class="form-group">
              <label>Tanggal Selesai</label>
              <input type="date" v-model="sewaForm.tanggal_selesai" :min="today" @change="hitungEstimasi" />
            </div>
            <div class="form-group full">
              <label>Catatan (Opsional)</label>
              <textarea v-model="sewaForm.catatan" rows="2" placeholder="Catatan untuk pemilik..." style="resize:none"></textarea>
            </div>
          </div>
          <div class="estimasi-box" v-if="estimasi > 0">
            <p style="font-size:.75rem;color:var(--text-muted)">Estimasi Total Biaya</p>
            <p style="font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:var(--accent)">
              {{ formatRp(estimasi) }} <span style="font-size:.82rem;font-weight:400;color:var(--text-muted)">({{ hariSewa }} hari)</span>
            </p>
          </div>
        </div>

        <div class="modal-footer">
          <button
            v-if="isPenyewa && selectedItem.status === 'tersedia'"
            class="btn btn-primary" style="flex:1"
            @click="handleSewa" :disabled="loadingSewa"
          >{{ loadingSewa ? '⏳ Memproses...' : '🛒 Konfirmasi Sewa' }}</button>
          <button v-else-if="!isLoggedIn" class="btn btn-primary" style="flex:1" @click="$router.push('/login')">🔐 Masuk untuk Menyewa</button>
          <button v-else-if="selectedItem.status !== 'tersedia'" class="btn btn-ghost" style="flex:1" disabled>❌ Barang Tidak Tersedia</button>
          <button class="btn btn-ghost" style="flex:1" @click="selectedItem = null">Tutup</button>
        </div>
        <div v-if="sewaMsg" :class="['alert', sewaMsgType]">{{ sewaMsg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth }  from '../composables/useAuth.js'
import { useToast } from '../composables/useToast.js'

const { isLoggedIn, isPenyewa } = useAuth()
const { showToast } = useToast()

const items        = ref([])
const loading      = ref(false)
const search       = ref('')
const filterStatus = ref('')
const selectedItem = ref(null)
const loadingSewa  = ref(false)
const sewaMsg      = ref('')
const sewaMsgType  = ref('error')
const estimasi     = ref(0)
const hariSewa     = ref(0)
const sewaForm     = ref({ tanggal_mulai: '', tanggal_selesai: '', catatan: '' })

const icons = ['💻','📷','🎮','📡','🖨️','🎬','🔋','📱','🎧','⌚']
const today = computed(() => new Date().toISOString().split('T')[0])
const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const filtered = computed(() => items.value.filter(i => {
  const s = !search.value       || i.nama_barang.toLowerCase().includes(search.value.toLowerCase())
  const f = !filterStatus.value || i.status === filterStatus.value
  return s && f
}))

const hitungEstimasi = () => {
  if (!sewaForm.value.tanggal_mulai || !sewaForm.value.tanggal_selesai || !selectedItem.value) return
  const m = new Date(sewaForm.value.tanggal_mulai)
  const s = new Date(sewaForm.value.tanggal_selesai)
  if (s > m) {
    hariSewa.value = Math.ceil((s - m) / (1000 * 60 * 60 * 24))
    estimasi.value = hariSewa.value * selectedItem.value.harga_per_hari
  } else {
    estimasi.value = 0
    hariSewa.value = 0
  }
}

const openDetail = (item) => {
  selectedItem.value = item
  sewaForm.value = { tanggal_mulai: today.value, tanggal_selesai: '', catatan: '' }
  estimasi.value = 0
  hariSewa.value = 0
  sewaMsg.value  = ''
}

const handleSewa = async () => {
  if (!sewaForm.value.tanggal_mulai || !sewaForm.value.tanggal_selesai) {
    sewaMsg.value = '❌ Isi tanggal mulai dan selesai!'
    sewaMsgType.value = 'error'
    return
  }
  loadingSewa.value = true
  sewaMsg.value = ''
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch('/api/rentals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ item_id: selectedItem.value.id, ...sewaForm.value })
    })
    const data = await res.json()
    if (!res.ok) { sewaMsg.value = '❌ ' + data.message; sewaMsgType.value = 'error'; return }
    sewaMsg.value = '✅ Sewa berhasil! Total: ' + formatRp(data.data.totalBiaya)
    sewaMsgType.value = 'success'
    showToast('Sewa berhasil! 🎉')
    loadItems()
    setTimeout(() => { selectedItem.value = null }, 2000)
  } catch {
    sewaMsg.value = '❌ Gagal terhubung ke server!'
    sewaMsgType.value = 'error'
  } finally {
    loadingSewa.value = false
  }
}

const loadItems = async () => {
  loading.value = true
  try {
    const res  = await fetch('/api/items')
    const data = await res.json()
    items.value = data.data || []
  } catch(e) { console.error(e) }
  finally { loading.value = false }
}

onMounted(loadItems)
</script>

<style scoped>
.toolbar { display: flex; gap: .75rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; }
.search-inp { background: var(--bg-card); border: 1px solid var(--border); border-radius: 50px; padding: .6rem 1.2rem; color: var(--text); font-family: 'DM Sans',sans-serif; font-size: .88rem; outline: none; width: 220px; transition: border-color .2s; }
.search-inp:focus { border-color: var(--primary); }
.filter-sel { background: var(--bg-card); border: 1px solid var(--border); border-radius: 50px; padding: .6rem 1rem; color: var(--text); font-family: 'DM Sans',sans-serif; font-size: .85rem; outline: none; }
.total-chip { font-size: .78rem; color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border); padding: .35rem .9rem; border-radius: 50px; margin-left: auto; }
.estimasi-box { background: rgba(124,58,237,.1); border: 1px solid var(--border); border-radius: 10px; padding: .9rem; margin-bottom: 1rem; }
@media(max-width:600px) { .search-inp { width: 100%; } .total-chip { margin-left: 0; } }
</style>