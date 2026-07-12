<template>
  <nav class="navbar">
    <RouterLink to="/dashboard" class="nav-logo">🌿 ECO-SHARE</RouterLink>

    <button class="hamburger" @click="menuOpen = !menuOpen">
      {{ menuOpen ? '✕' : '☰' }}
    </button>

    <div :class="['nav-menu', menuOpen ? 'open' : '']">
      <RouterLink to="/dashboard"  class="nav-link" @click="menuOpen=false">📊 Dashboard</RouterLink>
      <RouterLink to="/items"      class="nav-link" @click="menuOpen=false">📦 Inventaris</RouterLink>
      <RouterLink v-if="isPenyewa" to="/riwayat"     class="nav-link" @click="menuOpen=false">📋 Riwayat</RouterLink>
      <RouterLink v-if="isPemilik" to="/barang-saya" class="nav-link" @click="menuOpen=false">🏷️ Barang Saya</RouterLink>
      <RouterLink v-if="isPemilik" to="/transaksi"   class="nav-link" @click="menuOpen=false">💼 Transaksi</RouterLink>
      <RouterLink to="/profil"     class="nav-link" @click="menuOpen=false">👤 Profil</RouterLink>
    </div>

    <div class="nav-user">
      <div class="user-chip">
        <div class="user-ava">{{ userInitial }}</div>
        <div class="user-detail">
          <div class="user-nm">{{ userName }}</div>
          <div class="user-rl">{{ user ? user.role : '' }}</div>
        </div>
      </div>
      <button class="btn btn-danger btn-sm" @click="handleLogout">🚪</button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth }  from '../composables/useAuth.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const { user, isPenyewa, isPemilik, clearAuth } = useAuth()
const { showToast } = useToast()
const menuOpen    = ref(false)
const userName    = computed(() => user.value ? user.value.nama : '-')
const userInitial = computed(() => user.value && user.value.nama ? user.value.nama.charAt(0).toUpperCase() : '?')

const handleLogout = () => {
  clearAuth()
  showToast('Berhasil keluar!', 'info')
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  position: sticky; top: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 2rem;
  background: rgba(8,8,26,0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  z-index: 100; gap: 0.75rem; flex-wrap: wrap;
}
.nav-logo {
  font-family: 'Syne',sans-serif; font-size: 1.15rem; font-weight: 800;
  background: linear-gradient(135deg,var(--primary-light),var(--accent));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hamburger {
  display: none; background: transparent;
  border: 1px solid var(--border); color: var(--text);
  border-radius: 8px; padding: 0.4rem 0.7rem;
  cursor: pointer; font-size: 1.1rem;
}
.nav-menu { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.nav-link {
  padding: 0.45rem 0.9rem; border-radius: 50px;
  font-size: 0.85rem; font-weight: 500; color: var(--text-muted);
  transition: all 0.2s; border: 1px solid transparent; text-decoration: none;
}
.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(124,58,237,0.15); color: var(--accent); border-color: var(--border);
}
.nav-user { display: flex; align-items: center; gap: 0.6rem; }
.user-chip {
  display: flex; align-items: center; gap: 0.5rem;
  background: rgba(124,58,237,0.12); border: 1px solid var(--border);
  border-radius: 50px; padding: 0.3rem 0.8rem 0.3rem 0.3rem;
}
.user-ava {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg,var(--primary),var(--primary-light));
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 700;
}
.user-nm { font-size: 0.8rem; font-weight: 600; line-height: 1.2; }
.user-rl { font-size: 0.65rem; color: var(--text-muted); }
@media(max-width:768px) {
  .hamburger { display: block; }
  .nav-menu { display: none; width: 100%; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 0.5rem; gap: 0.2rem; }
  .nav-menu.open { display: flex; }
  .nav-link { border-radius: 8px; }
  .user-detail { display: none; }
}
</style>