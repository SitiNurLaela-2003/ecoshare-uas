<template>
  <div class="login-page">
    <div class="login-box">
      <RouterLink to="/" class="back-link">← Kembali ke Beranda</RouterLink>
      <div class="login-logo">🌿 ECO-SHARE</div>
      <h2>{{ tab === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru' }}</h2>
      <p class="login-sub">Platform penyewaan elektronik bekas ramah lingkungan</p>

      <div class="tab-wrap">
        <div :class="['tab', tab === 'login' ? 'active' : '']"    @click="tab = 'login'">🔐 Masuk</div>
        <div :class="['tab', tab === 'register' ? 'active' : '']" @click="tab = 'register'">✨ Daftar</div>
      </div>

      <div v-if="tab === 'login'">
        <div class="form-group">
          <label>Alamat Email</label>
          <input type="email" v-model="loginForm.email" placeholder="email@contoh.com" @keyup.enter="handleLogin" />
        </div>
        <div class="form-group">
          <label>Kata Sandi</label>
          <input type="password" v-model="loginForm.password" placeholder="Minimal 6 karakter" @keyup.enter="handleLogin" />
        </div>
        <button class="btn btn-primary full-btn" @click="handleLogin" :disabled="loading">
          {{ loading ? '⏳ Memproses...' : '🚀 Masuk Sekarang' }}
        </button>
        <div class="test-accounts">
          <p>Akun test yang tersedia:</p>
          <p>Pemilik: <code>riandomuhamadsubakti@gmail.com</code></p>
          <p>Penyewa: <code>Siti NurLaela@gmail.com</code></p>
          <p>Kata Sandi Pemilik: <code>riando123</code></p>
          <p>Kata Sandi Penyewa: <code>siti123</code></p>
        </div>
      </div>

      <div v-if="tab === 'register'">
        <div class="form-grid">
          <div class="form-group full">
            <label>Nama Lengkap</label>
            <input type="text" v-model="regForm.nama" placeholder="Nama lengkap kamu" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="regForm.email" placeholder="email@contoh.com" />
          </div>
          <div class="form-group">
            <label>Kata Sandi</label>
            <input type="password" v-model="regForm.password" placeholder="Min. 6 karakter" />
          </div>
          <div class="form-group">
            <label>Daftar Sebagai</label>
            <select v-model="regForm.role">
              <option value="penyewa">🛍️ Penyewa</option>
              <option value="pemilik">🏷️ Pemilik Barang</option>
            </select>
          </div>
          <div class="form-group">
            <label>No. Telepon</label>
            <input type="text" v-model="regForm.no_hp" placeholder="08xxxxxxxxxx" />
          </div>
          <div class="form-group full">
            <label>Alamat</label>
            <input type="text" v-model="regForm.alamat" placeholder="Kota / Kabupaten" />
          </div>
        </div>
        <button class="btn btn-primary full-btn" @click="handleRegister" :disabled="loading">
          {{ loading ? '⏳ Memproses...' : '✨ Daftar Sekarang' }}
        </button>
      </div>

      <div v-if="errMsg" class="alert error">{{ errMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth }  from '../composables/useAuth.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { setAuth } = useAuth()
const { showToast } = useToast()

const tab     = ref('login')
const loading = ref(false)
const errMsg  = ref('')

const loginForm = ref({ email: '', password: '' })
const regForm   = ref({ nama: '', email: '', password: '', role: 'penyewa', no_hp: '', alamat: '' })

const handleLogin = async () => {
  errMsg.value = ''
  if (!loginForm.value.email || !loginForm.value.password) {
    errMsg.value = '❌ Email dan kata sandi wajib diisi!'
    return
  }
  loading.value = true
  try {
    const res  = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm.value)
    })
    const data = await res.json()
    if (!res.ok) { errMsg.value = '❌ ' + data.message; return }
    setAuth(data.data.token, data.data.user)
    showToast('Selamat datang, ' + data.data.user.nama + '! 🎉')
    router.push('/dashboard')
  } catch {
    errMsg.value = '❌ Gagal terhubung ke server! Pastikan backend berjalan di port 3000.'
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  errMsg.value = ''
  if (!regForm.value.nama || !regForm.value.email || !regForm.value.password) {
    errMsg.value = '❌ Lengkapi semua field wajib!'
    return
  }
  loading.value = true
  try {
    const res  = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm.value)
    })
    const data = await res.json()
    if (!res.ok) { errMsg.value = '❌ ' + data.message; return }
    showToast('Pendaftaran berhasil! Silakan masuk. ✅')
    tab.value = 'login'
  } catch {
    errMsg.value = '❌ Gagal terhubung ke server!'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; z-index: 1; }
.login-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 460px; box-shadow: var(--shadow); }
.back-link { font-size: 0.82rem; color: var(--text-muted); text-decoration: none; display: block; margin-bottom: 1rem; transition: color 0.2s; }
.back-link:hover { color: var(--accent); }
.login-logo { font-family: 'Syne',sans-serif; font-size: 1.3rem; font-weight: 800; background: linear-gradient(135deg,var(--primary-light),var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
h2 { font-family: 'Syne',sans-serif; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.3rem; }
.login-sub { color: var(--text-muted); font-size: 0.82rem; margin-bottom: 1.5rem; }
.tab-wrap { display: flex; background: var(--bg-card2); border-radius: 10px; padding: 4px; margin-bottom: 1.5rem; gap: 4px; }
.tab { flex: 1; padding: 0.5rem; text-align: center; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); transition: all 0.2s; }
.tab.active { background: linear-gradient(135deg,var(--primary),var(--primary-light)); color: white; }
.full-btn { width: 100%; justify-content: center; margin-top: 0.5rem; }
.test-accounts { margin-top: 1rem; padding: 0.8rem; background: var(--bg-card2); border-radius: 10px; font-size: 0.75rem; color: var(--text-muted); line-height: 2; }
.test-accounts p:first-child { font-weight: 600; color: var(--text); }
code { color: var(--accent); font-size: 0.75rem; }
</style>