<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">👤 Profil Saya</h1>
        <p class="page-sub">Informasi akun dan pengaturan profil kamu.</p>
      </div>
    </div>

    <div v-if="loading" class="spinner"></div>
    <div v-else class="profil-layout">
      <div class="card profil-card">
        <div class="profil-avatar">{{ initial }}</div>
        <div class="profil-nama">{{ profil ? profil.nama : '' }}</div>
        <span :class="['badge', isPemilik ? 'badge-purple' : 'badge-success']" style="margin-top:.5rem">
          {{ isPemilik ? '🏷️ Pemilik Barang' : '🛍️ Penyewa' }}
        </span>
        <p class="profil-email">{{ profil ? profil.email : '' }}</p>
        <p class="profil-join">Bergabung: {{ tgl(profil ? profil.created_at : null) }}</p>
        <button class="btn btn-danger" style="margin-top:1.5rem;width:100%;justify-content:center" @click="handleLogout">
          🚪 Keluar dari Akun
        </button>
      </div>

      <div>
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Informasi Akun</div></div>
          <div class="card-body">
            <div class="info-row" v-for="info in infoList" :key="info.label">
              <span class="info-label">{{ info.icon }} {{ info.label }}</span>
              <span class="info-val">{{ info.value || '-' }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">🔒 Keamanan Akun</div></div>
          <div class="card-body">
            <div class="security-item">
              <div>
                <div style="font-weight:600;margin-bottom:.2rem">Autentikasi JWT</div>
                <div style="font-size:.82rem;color:var(--text-muted)">Token aktif untuk sesi ini</div>
              </div>
              <span class="badge badge-success">✅ Aktif</span>
            </div>
            <div class="security-item" style="margin-top:.8rem">
              <div>
                <div style="font-weight:600;margin-bottom:.2rem">Role Access Control</div>
                <div style="font-size:.82rem;color:var(--text-muted)">Hak akses berbasis peran pengguna</div>
              </div>
              <span :class="['badge', isPemilik ? 'badge-purple' : 'badge-success']">
                {{ isPemilik ? 'Pemilik' : 'Penyewa' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth }  from '../composables/useAuth.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { isPemilik, clearAuth } = useAuth()
const { showToast } = useToast()

const profil  = ref(null)
const loading = ref(false)

const initial = computed(() => profil.value && profil.value.nama ? profil.value.nama.charAt(0).toUpperCase() : '?')
const tgl = s => s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'

const infoList = computed(() => [
  { icon: '📧', label: 'Email',   value: profil.value ? profil.value.email  : '' },
  { icon: '👤', label: 'Nama',    value: profil.value ? profil.value.nama   : '' },
  { icon: '🏷️', label: 'Role',    value: profil.value ? profil.value.role   : '' },
  { icon: '📱', label: 'No. HP',  value: profil.value ? profil.value.no_hp  : '' },
  { icon: '📍', label: 'Alamat',  value: profil.value ? profil.value.alamat : '' },
])

const handleLogout = () => {
  clearAuth()
  showToast('Berhasil keluar!', 'info')
  router.push('/login')
}

const loadProfil = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('eco_token')
    const res   = await fetch('/api/auth/profile', { headers: { Authorization: 'Bearer ' + token } })
    const data  = await res.json()
    profil.value = data.data
  } catch {
    showToast('Gagal memuat profil', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(loadProfil)
</script>

<style scoped>
.profil-layout { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start; }
.profil-card { text-align: center; padding: 2rem; }
.profil-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg,var(--primary),var(--primary-light)); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; margin: 0 auto 1rem; box-shadow: 0 8px 24px rgba(124,58,237,0.4); }
.profil-nama  { font-family: 'Syne',sans-serif; font-size: 1.2rem; font-weight: 700; }
.profil-email { font-size: .82rem; color: var(--text-muted); margin-top: .5rem; }
.profil-join  { font-size: .75rem; color: var(--text-muted); margin-top: .3rem; }
.info-row { display: flex; justify-content: space-between; align-items: center; padding: .7rem 0; border-bottom: 1px solid var(--border); }
.info-row:last-child { border-bottom: none; }
.info-label { font-size: .85rem; color: var(--text-muted); }
.info-val   { font-size: .85rem; font-weight: 600; }
.security-item { display: flex; justify-content: space-between; align-items: center; }
@media(max-width:768px) { .profil-layout { grid-template-columns: 1fr; } }
</style>