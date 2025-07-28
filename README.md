# Frontend Website Buku Tamu
Aplikasi frontend website buku tamu dirancang untuk memudahkan pengelolaan data kunjungan tamu secara digital. Aplikasi ini membantu mengoptimalkan proses penerimaan tamu, pencatatan data, hingga pelaporan.

## Fitur Utama
- Export Data: mengunduh data yang tercatat ke dalam format Excel
- Filter Category: menyaring data tamu berdasarkan kategori tertentu
- Queue Number: sistem antrean digital untuk mengelola alur kedatangan tamu
- CSLog: pencatatan riwayat interaksi atau status penanganan tamu oleh tim layanan
- Visit Table: menampilkan daftar kunjungan tamu dalam format tabel yang mudah dibaca
- All Guest Data: Menyediakan tampilan komprehensif dari seluruh data tamu yang telah terdaftar
- Delete Guest Data: menghapus data tamu yang tidak lagi relevan atau salah input dari database
- Reset Queue: memberikan kontrol penuh untuk mengatur ulang atau mengosongkan semua nomor antrean yang sedang aktif

## Teknologi yang Digunakan
![JavaScript](https://img.shields.io/badge/JavaScript-1E293B?style=for-the-badge&logo=javascript&logoColor=FACC15)
![React](https://img.shields.io/badge/React-1E293B?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-1E293B?style=for-the-badge&logo=tailwind-css&logoColor=38BDF8)

## Instalasi dan Penggunaan
### Prasyarat
Sebelum menjalankan proyek ini, pastikan Anda telah menginstal:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [BackEnd-QueuePlatformBPS](https://github.com/ramadhan14123/Backend-QueuePlatformBPS)

### Instalasi
1. Clone repository ini:
   ```bash
   git clone https://github.com/zidankusumafirdaus/FrontEnd-QueuePlatformBPS.git
   ```
2. Masuk ke Direktori Proyek:
   ```bash
   cd FrontEnd-QueuePlatformBPS
   ```
3. Instal dependensi:
   ```bash
   npm install
   ```
4. Jalankan Proyek:
   ```
   a. Untuk pengembangan lokal:
   ```
   ```bash
   npm run dev
   ```
   ```
   b. Untuk build produksi:
   ```
   ```bash
   npm run build
   ```

## Struktur Direktori

```
FrontEnd-QueuePlatformBPS/
│
├── dist/                 # Folder build untuk file hasil build produksi
├── node_modules/         # Folder berisi dependensi proyek
├── public/               # Folder untuk file publik (misalnya favicon, gambar statis, dll.)
├── src/                  # Folder utama kode sumber
│   ├── assets/           # Folder untuk aset seperti gambar, ikon, dll.
│   ├── components/       # Folder untuk komponen React
│   ├── pages/            # Folder untuk halaman React
│   ├── service/          # Folder untuk fungsi yang berinterinteraksi dengan API backend atau layanan eksternal.
│   ├── styles/           # Folder untuk file styling global
│   ├── utils/            # Folder untuk fungsi utilitas
│   └── routes.jsx        # File yang mendefinisikan rute-rute navigasi aplikasi
├── .eslintrc.cjs         # Konfigurasi ESLint
├── .gitignore            # File untuk menentukan file/folder yang diabaikan oleh Git
├── index.html            # File HTML utama
├── package-lock.json     # File penguncian dependensi
├── package.json          # File yang berisi metadata proyek dan daftar dependensi
├── pnpm-lock.yaml        # File penguncian dependensi untuk pnpm
├── pnpm-workspace.yaml   # Konfigurasi untuk pnpm workspace
├── postcss.config.js     # Konfigurasi untuk PostCSS
├── README.md             # Dokumentasi proyek
├── tailwind.config.js    # Konfigurasi untuk Tailwind CSS
└── vite.config.js        # Konfigurasi untuk Vite (build tool)
```
