# 🌿 ECO-SHARE — Frontend Vue.js

> **Universitas Dian Nusantara**
> Mata Kuliah: Pemrograman Fullstack
> UAS Genap 2025/2026

## 📋 Deskripsi

Eco-Share adalah platform penyewaan alat elektronik bekas berbasis web yang bertujuan mengurangi limbah elektronik. Frontend ini dibangun menggunakan Vue.js 3 dan terintegrasi penuh dengan backend API Eco-Share. Mendukung dua peran pengguna yaitu Penyewa dan Pemilik Barang dengan tampilan mobile responsive.

## ⚙️ Stack Teknologi

- **Framework**: Vue.js 3 Composition API
- **Build Tool**: Vite v5
- **Router**: Vue Router v4
- **HTTP Client**: Fetch API native browser
- **State Management**: Composables Pattern useAuth useApi useToast
- **Styling**: CSS Variables dan Custom CSS

## 🏗️ Arsitektur Sistem

Menggunakan Component-Based Architecture dengan Composables Pattern:

- **views** — Halaman utama aplikasi
- **components** — Komponen reusable NavBar dan ToastContainer
- **composables** — Logic reusable useAuth useApi useToast
- **router** — Konfigurasi routing dan Navigation Guard
- **assets** — Global CSS variables dan styles

## 📱 Fitur Aplikasi

### Untuk Semua Pengguna
- Landing page dengan statistik platform real-time
- Inventaris barang dengan fitur pencarian dan filter status
- Login dan Register dengan validasi lengkap

### Untuk Penyewa
- Dashboard dengan statistik jumlah barang tersedia dan disewa
- Sewa barang dengan kalkulasi biaya otomatis berdasarkan tanggal
- Riwayat peminjaman dengan aksi kembalikan dan batalkan
- Profil akun dengan informasi keamanan JWT

### Untuk Pemilik Barang
- Dashboard dengan analytics nilai platform per hari
- Kelola barang tambah edit dan hapus dengan modal form
- Monitoring transaksi masuk dari penyewa beserta total pendapatan
- Profil akun dengan role access information

## 🔒 Fitur Keamanan Frontend

- **JWT Token Management** — Token disimpan di localStorage dan dikirim via Authorization header
- **Navigation Guard** — Proteksi route berdasarkan status login dan role pengguna
- **Role-Based UI** — Tampilan dan menu berbeda untuk penyewa dan pemilik
- **Unified Error Handling** — Toast notification konsisten untuk semua error
- **Auto Redirect** — Redirect otomatis ke login jika token tidak valid

## 🚀 Cara Menjalankan

Pastikan backend sudah berjalan di port 3000 terlebih dahulu.

```bash
npm install
npm run dev
```

Aplikasi berjalan di http://localhost:5173

## 📁 Environment Variables

Buat file `.env` di root folder dengan isi:

```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Eco-Share
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Platform penyewaan alat elektronik bekas
```

## 🐙 Flow Aplikasi

1. User membuka aplikasi di browser
2. Navigation Guard mengecek token JWT di localStorage
3. Jika belum login maka diarahkan ke halaman Login atau Register
4. Setelah login berhasil token disimpan dan user diarahkan ke Dashboard
5. Penyewa dapat melihat inventaris barang dan melakukan sewa dengan memilih tanggal
6. Pemilik dapat mengelola barang dan memantau transaksi masuk dari penyewa
7. Semua request ke API menyertakan token JWT di header Authorization

## 📂 Struktur Folder

```
ecoshare-uas/
├── src/
│   ├── assets/
│   │   └── main.css            (Global styles dan CSS variables)
│   ├── components/
│   │   ├── NavBar.vue          (Navigasi dengan hamburger menu mobile)
│   │   └── ToastContainer.vue  (Notifikasi toast global)
│   ├── composables/
│   │   ├── useAuth.js          (Auth state management)
│   │   ├── useApi.js           (HTTP request helper GET POST PUT DELETE)
│   │   └── useToast.js         (Toast notification sistem)
│   ├── router/
│   │   └── index.js            (Routes dan Navigation Guard)
│   └── views/
│       ├── HomeView.vue        (Landing page)
│       ├── LoginView.vue       (Login dan Register)
│       ├── DashboardView.vue   (Dashboard utama dengan statistik)
│       ├── ItemsView.vue       (Inventaris barang dan form sewa)
│       ├── RiwayatView.vue     (Riwayat sewa untuk penyewa)
│       ├── BarangSayaView.vue  (Kelola barang untuk pemilik)
│       ├── TransaksiView.vue   (Transaksi masuk untuk pemilik)
│       └── ProfilView.vue      (Profil akun dan keamanan)
├── .env                        (Environment variables)
├── .gitignore
├── index.html                  (Entry point HTML)
├── vite.config.js              (Konfigurasi Vite dan proxy API)
└── package.json

```

## 🔗 Repository Terkait

- Backend API: https://github.com/RiandoMuhamadSubakti/ecoshare-uts
- Frontend UAS: https://github.com/RiandoMuhamadSubakti/ecoshare-uas

---

*© 2026 Universitas Dian Nusantara*