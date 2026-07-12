<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">🏷️ Barang Saya</h1>
        <p class="page-sub">Kelola semua barang yang kamu sewakan kepada penyewa.</p>
      </div>
      <button class="btn btn-primary" @click="openTambah">➕ Tambah Barang</button>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else-if="!items.length" class="empty">
      <div class="icon">📦</div>
      <p>Belum ada barang. Tambah barang pertamamu!</p>
      <button class="btn btn-primary" style="margin-top:1rem" @click="openTambah">➕ Tambah Sekarang</button>
    </div>
    <div v-else class="card">
      <div class="card-header">
        <div class="card-title">📦 Daftar Barang Milik Saya</div>
        <button class="btn btn-ghost btn-sm" @click="loadItems">🔄 Refresh</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Nama Barang</th><th>Harga/Hari</th><th>Stok</th><th>Kondisi</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="item.id">
              <td class="bold">{{ i + 1 }}</td>
              <td class="bold">{{ item.nama_barang }}</td>
              <td class="accent">{{ formatRp(item.harga_per_hari) }}</td>
              <td>{{ item.stok }} unit</td>
              <td><span class="badge badge-purple">{{ item.kondisi }}</span></td>
              <td><span :class="['badge', item.status === 'tersedia' ? 'badge-success' : 'badge-warning']">{{ item.status }}</span></td>
              <td>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-warning btn-sm" @click="openEdit(item)">✏️ Edit</button>
                  <button class="btn btn-danger btn-sm"  @click="hapusItem(item.id)">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-title">{{ isEdit ? '✏️ Edit Barang' : '➕ Tambah Barang Baru' }}</div>
        <div class="form-grid">
          <div class="form-group full">
            <label>Nama Barang</label>
            <input v-model="form.nama_barang" placeholder="Contoh: Laptop ASUS VivoBook" />
          </div>
          <div class="form-group full">
            <label>Deskripsi</label>
            <textarea v-model="form.deskripsi" rows="2" placeholder="Spesifikasi dan kondisi barang..." style="resize:none"></textarea>
          </div>
          <div class="form-group">
            <label>Harga per Hari (Rp)</label>
            <input type="number" v-model="form.harga_per_hari" placeholder="75000" />
          </div>
          <div class="form-group">
            <label>Jumlah Stok</label>
            <input type="number" v-model="form.stok" min="1" />
          </div>
          <div class="form-group full">
            <label>Kondisi Barang</label>
            <select v-model="form.kondisi">
              <option value="baik">✅ Baik</option>
              <option value="cukup">⚠️ Cukup</option>
              <option value="perlu_perbaikan">🔧 Perlu Perbaikan</option>
            </select>
          </div>
        </div>
        <div v-if="formMsg" :class="['alert', formMsgType]">{{ formMsg }}</div>
        <div class="modal-footer">
          <button class="btn btn-primary" style="flex:1" @click="handleSubmit" :disabled="loadingForm">
            {{ loadingForm ? '⏳ Memproses...' : (isEdit ? '💾 Simpan Perubahan' : '💾 Tambah Barang') }}
          </button>
          <button class="btn btn-ghost" style="flex:1" @click="showModal = false">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '../composables/useToast.js'

const { showToast } = useToast()
const items       = ref([])
const loading     = ref(false)
const showModal   = ref(false)
const isEdit      = ref(false)
const loadingForm = ref(false)
const formMsg     = ref('')
const formMsgType = ref('error')
const editId      = ref(null)
const form = ref({ nama_barang: '', deskripsi: '', harga_per_hari: '', stok: 1, kondisi: 'baik' })

const formatRp = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const openTambah = () => {
  isEdit.value = false
  editId.value = null
  formMsg.value = ''
  form.value = { nama_barang: '', deskripsi: '', harga_per_hari: '', stok: 1, kondisi: 'baik' }
  showModal.value = true
}

const openEdit = (item) => {
  isEdit.value = true
  editId.value = item.id
  formMsg.value = ''
  form.value = { nama_barang: item.nama_barang, deskripsi: item.deskripsi || '', harga_per_hari: item.harga_per_hari, stok: item.stok, kondisi: item.kondisi }
  showModal.value = true
}

const handleSubmit = async () => {
  if (!form.value.nama_barang || !form.value.harga_per_hari) {
    formMsg.value = '❌ Nama dan harga wajib diisi!'
    formMsgType.value = 'error'
    return
  }
  loadingForm.value = true
  formMsg.value = ''
  try {
    const token  = localStorage.getItem('eco_token')
    const url    = isEdit.value ? '/api/items/' + editId.value : '/api/items'
    const method = isEdit.value ? 'PUT' : 'POST'
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if (!res.ok) { formMsg.value = '❌ ' + data.message; formMsgType.value = 'error'; return }
    showToast(isEdit.value ? 'Barang berhasil diperbarui! ✅' : 'Barang berhasil ditambahkan! 🎉')
    showModal.value = false
    loadItems()
  } catch {
    formMsg.value = '❌ Gagal terhubung ke server!'
    formMsgType.value = 'error'
  } finally {
    loadingForm.value = false
  }
}

const hapusItem = async (id) => {
  if (!confirm('Yakin ingin menghapus barang ini?')) return
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch('/api/items/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
    const data  = await res.json()
    if (!res.ok) { showToast('❌ ' + data.message, 'error'); return }
    showToast('Barang berhasil dihapus!')
    loadItems()
  } catch {
    showToast('❌ Gagal menghapus!', 'error')
  }
}

const loadItems = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch('/api/items/milik-saya', { headers: { Authorization: 'Bearer ' + token } })
    const data  = await res.json()
    items.value = data.data || []
  } catch {
    showToast('Gagal memuat barang', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(loadItems)
</script>