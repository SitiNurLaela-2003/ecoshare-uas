<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-badge">🌱 Platform Ramah Lingkungan</div>
      <h1>Sewa Elektronik Bekas,<br><span>Hemat & Berkelanjutan</span></h1>
      <p>Kurangi limbah elektronik dengan menyewa, bukan membeli. Temukan ribuan alat elektronik berkualitas dari sesama pengguna.</p>
      <div class="hero-btns">
        <RouterLink to="/items" class="btn btn-primary">🔍 Jelajahi Barang</RouterLink>
        <RouterLink to="/login" class="btn btn-ghost">🚀 Mulai Sekarang</RouterLink>
      </div>
    </section>

    <section class="stats-bar">
      <div class="stat-item"><div class="stat-n">{{ totalBarang }}+</div><div class="stat-l">Barang Tersedia</div></div>
      <div class="stat-item"><div class="stat-n">100%</div><div class="stat-l">Aman & Terverifikasi</div></div>
      <div class="stat-item"><div class="stat-n">JWT</div><div class="stat-l">Keamanan Data</div></div>
    </section>

    <section class="features">
      <h2 class="sec-title">Mengapa Eco-Share?</h2>
      <div class="feat-grid">
        <div class="feat-card" v-for="f in features" :key="f.icon">
          <div class="feat-icon">{{ f.icon }}</div>
          <div class="feat-title">{{ f.title }}</div>
          <div class="feat-desc">{{ f.desc }}</div>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Siap Bergabung?</h2>
      <p>Daftar sekarang dan mulai sewa atau sewakan barang elektronikmu!</p>
      <div class="cta-btns">
        <RouterLink to="/login" class="btn btn-primary">🚀 Daftar Sekarang</RouterLink>
        <RouterLink to="/items" class="btn btn-ghost">📦 Lihat Barang</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const totalBarang = ref(0)
const features = [
  { icon: '🔐', title: 'Aman & Terverifikasi',  desc: 'Autentikasi JWT stateless dengan kontrol akses berbasis peran penyewa dan pemilik barang.' },
  { icon: '📦', title: 'Inventaris Lengkap',     desc: 'Kelola barang elektronik dengan pemantauan stok otomatis dan pengecekan ketersediaan real-time.' },
  { icon: '⚡', title: 'Transaksi Real-time',    desc: 'Database transaction untuk menjaga integritas data saat peminjaman terjadi secara bersamaan.' },
  { icon: '🌿', title: 'Ramah Lingkungan',       desc: 'Kurangi limbah elektronik dengan sistem sewa yang efisien, hemat, dan berkelanjutan.' },
  { icon: '📱', title: 'Mobile Responsive',      desc: 'Tampilan optimal di semua perangkat, dari desktop hingga smartphone.' },
  { icon: '🛡️', title: 'Error Handling Terpadu', desc: 'Penanganan error yang konsisten agar pengguna selalu mendapat informasi yang jelas.' },
]

onMounted(async () => {
  try {
    const res  = await fetch('/api/items')
    const data = await res.json()
    totalBarang.value = (data.data || []).length
  } catch {
    totalBarang.value = 4
  }
})
</script>

<style scoped>
.home-page { position: relative; z-index: 1; }
.hero { text-align: center; padding: 5rem 2rem 3rem; max-width: 720px; margin: 0 auto; }
.hero-badge { display: inline-block; background: rgba(124,58,237,0.15); border: 1px solid var(--border); color: var(--accent); padding: 0.35rem 1.2rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem; }
.hero h1 { font-family: 'Syne',sans-serif; font-size: clamp(2rem,5vw,3.8rem); font-weight: 800; line-height: 1.12; margin-bottom: 1.2rem; }
.hero h1 span { background: linear-gradient(135deg,var(--primary-light),var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero p { color: var(--text-muted); font-size: 1.05rem; line-height: 1.75; margin-bottom: 2rem; }
.hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.stats-bar { display: flex; justify-content: center; gap: 4rem; padding: 2rem; flex-wrap: wrap; }
.stat-item { text-align: center; }
.stat-n { font-family: 'Syne',sans-serif; font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg,var(--primary-light),var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.stat-l { color: var(--text-muted); font-size: 0.82rem; margin-top: 0.2rem; }
.features { padding: 2rem 2rem 3rem; max-width: 1100px; margin: 0 auto; }
.sec-title { font-family: 'Syne',sans-serif; font-size: 1.6rem; font-weight: 700; text-align: center; margin-bottom: 2rem; }
.feat-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap: 1.2rem; }
.feat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; transition: all 0.25s; }
.feat-card:hover { transform: translateY(-5px); box-shadow: var(--shadow); border-color: var(--primary); }
.feat-icon { font-size: 2rem; margin-bottom: 0.8rem; }
.feat-title { font-family: 'Syne',sans-serif; font-weight: 700; margin-bottom: 0.4rem; }
.feat-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.6; }
.cta { text-align: center; padding: 3rem 2rem 5rem; background: linear-gradient(135deg,rgba(124,58,237,0.08),rgba(168,85,247,0.05)); border-top: 1px solid var(--border); margin-top: 2rem; }
.cta h2 { font-family: 'Syne',sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.8rem; }
.cta p { color: var(--text-muted); margin-bottom: 2rem; }
.cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
@media(max-width:600px) { .hero { padding: 3rem 1rem 2rem; } .stats-bar { gap: 2rem; } }
</style>