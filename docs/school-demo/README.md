# SMP Negeri 2 Srandakan — Prototype presentasi

**Status:** demo fungsional, bukan aplikasi operasional sekolah. Pemeriksaan: 19 November 2026 UTC.

## Menjalankan di workspace yang disediakan

Dependency sudah tersedia. Tidak perlu menjalankan instalasi, membuat database, atau membuat akun.

```sh
npm run dev
```

Buka alamat lokal yang dicetak Vite. Website publik menggunakan `#/`; panel pengelola menggunakan `#/admin` dan tersedia melalui **Panel Admin** pada bilah atas. Tidak ada login WordPress atau autentikasi produksi. Hash routing memungkinkan halaman dibuka langsung dan dimuat ulang tanpa konfigurasi rewrite server sekolah.

Untuk memeriksa hasil kompilasi:

```sh
npm run build
npm run preview
```

Adapter `school-vite.mjs` menyediakan endpoint API yang sama pada mode development dan preview. Gunakan runtime Node/npm dan konfigurasi sandbox yang sudah tersedia. Jangan menyalin kredensial sekolah ke proyek ini. API memerlukan koneksi ke **database sandbox**, bukan database sekolah. Tanpa koneksi tersebut, snapshot publik memungkinkan demonstrasi baca saja; kegagalan menyimpan ditampilkan, bukan dianggap berhasil.

## Skenario presentasi ±5 menit

1. **Beranda:** lihat identitas Esperada, ganti foto hero, dan buka salah satu akses cepat. Foto pertama merupakan ilustrasi AI, ditandai pada gambar; foto berikutnya adalah dokumentasi publik sekolah.
2. **Konten publik:** buka Informasi → Berita Sekolah, pilih kategori, lalu buka berita dan periksa tautan sumber. Coba pencarian global dengan kata “hukum”.
3. **Periksa batas data:** buka Agenda Sekolah dan Direktori. Jadwal contoh dan informasi yang belum dikonfirmasi diberi label. Tidak ada daftar pribadi siswa, alumni, atau pegawai.
4. **Panel Admin:** buka modul Berita Sekolah → Tambah konten. Masukkan **data contoh**, tinjau Pratinjau, lalu simpan sebagai Draf. Isi draf belum tampil di halaman publik.
5. **Publikasi demo:** ubah status ke Publikasi demo, simpan, kemudian buka website pada browser yang sama. Berita baru tampil dengan label demo. Coba pencarian, ubah isi, dan arsipkan dengan konfirmasi.
6. **Versi ponsel:** semua modul tersedia melalui menu navigasi. Tabel admin dapat digeser horizontal tanpa membuat seluruh halaman melebar.

## Struktur halaman

| Kelompok | Rute | Isi demo |
|---|---|---|
| Beranda | `#/` | Hero, karusel tiga foto, akses cepat, berita, agenda, pengantar profil |
| Profil | `#/profil` | Identitas, sejarah, visi dan misi |
| Pendidikan | `#/pendidikan` | Struktur kurikulum dan kalender; dokumen berjalan menunggu verifikasi |
| Direktori | `#/direktori` | Struktur direktori pendidik dan organisasi, tanpa identitas pribadi |
| Berita | `#/berita` | Empat ringkasan berita bersumber, kategori, pencarian, detail |
| Agenda | `#/agenda` | Tiga contoh agenda bertanggal, jelas berlabel demo |
| Galeri | `#/galeri` | Foto publik sekolah, filter, tampilan detail dan keterangan |
| Perpustakaan | `#/perpustakaan` | Profil Cahaya Cendekia, ruang baca, dan Pojok Batik |
| Layanan Publik | `#/layanan-publik` | Maklumat pelayanan dan rujukan hasil survei |
| Kontak | `#/kontak` | Alamat, telepon, email dari situs publik; tanpa formulir pengiriman |
| Admin | `#/admin` | Ringkasan yang dihitung dari data, tabel seluruh konten |
| Admin modul | `#/admin/{kelompok}` | Pencarian, filter status, tambah, ubah, detail, pratinjau, arsip |

Detail publik menggunakan `#/{kelompok}/{kode-konten}`. Konten draf, diarsipkan, atau alamat yang tidak ada tidak ditampilkan sebagai artikel publik. Browser Back/Forward mendukung perjalanan antarhalaman.

## Data dan batas operasional

- Satu tabel sandbox `srandakan_demo_entries`: `id`, `workspace`, `code`, `page`, `title`, `body`, `category`, `image`, `source`, `is_demo`, `date`, `status`.
- 23 rekaman dasar; jumlah pada dashboard berasal dari API, bukan angka statis.
- Konten sumber disimpan dalam ruang `seed`. Semua perubahan melalui API menulis salinan pada ruang demo browser. Arsip membuat penanda tersembunyi, tidak menghapus rekaman dasar.
- Browser menyimpan **pengenal ruang demo**, bukan kredensial pegawai. Backend membatasi pembacaan dan penulisan berdasarkan ruang tersebut. RLS mengizinkan pembacaan seed dan akses ke ruang milik token demo. Ini bukan sistem akun, RBAC, atau autentikasi produksi.
- Pengunjung yang menggunakan browser/profil yang sama berbagi ruang demo. Gunakan profil browser privat baru untuk presentasi bersih. Jangan masukkan data pribadi. Membagikan alamat halaman tidak membagikan token ruang.
- Perubahan isi sumber oleh admin otomatis menjadi konten demo dan kehilangan klaim sumber asli. Data tanpa tanggal tidak diberikan tanggal publikasi rekaan.
- Semua media dilayani dari aset lokal. Tidak ada hotlink foto, analytics, pengiriman email, form enrollment, akses admin WordPress, atau permintaan runtime ke server sekolah.
- Tautan “Baca sumber” membuka publikasi publik atas tindakan pengguna. Alamat `mailto:` dan `tel:` hanya membuka aplikasi perangkat, tidak mengirim pesan secara otomatis.
- Metadata `noindex,nofollow` dipasang. Ini bukan pembatas akses dan bukan alasan untuk menyimpan informasi sensitif.

## File proyek

**Baru:**
- `src/school/main.tsx`, `App.tsx`, `Public.tsx`, `Admin.tsx`, `UI.tsx`, `types.ts`, `entries.ts`, `school.css`: entry terpisah, tampilan publik/admin, komponen, tipe, normalisasi, desain responsif.
- `api/school-content.js`: endpoint CRUD konten demo; validasi server dan pembatasan workspace.
- `school-server/demo-env.js`: adaptor kredensial sandbox yang mempertahankan hak akses kunci anon ketika hanya kunci itu yang tersedia.
- `school-vite.mjs`, `school-vite.d.mts`: adapter API lokal untuk development dan preview.
- `public/school/`: enam foto dokumentasi dan satu logo sekolah, hero ilustrasi WebP, font DM Sans beserta lisensi OFL, snapshot publik hasil ekspor 23 rekaman dasar.
- `public/favicon.svg`: ikon generik prototype, bukan lambang resmi pengganti.
- `tests/school-demo/`: pengujian browser Chromium dengan server preview sementara yang otomatis ditutup.
- `docs/school-demo/`: hasil discovery, keputusan stack, hasil test, dan screenshot desktop/ponsel/admin (JPEG terkompresi).

**Perubahan minimal pada file penghubung:** `index.html` (bahasa, judul, favicon, meta, entry prototype) dan `vite.config.ts` (adaptor API lokal dan perapian dua peringatan lint bawaan).

`src/App.tsx`, `src/main.tsx`, starter CSS, README asli, `api/db-client.js`, `api/db-wake.js`, `.env`, `vercel.json`, `package.json`, dan lockfile asli dipertahankan. Tidak ada source sekolah yang diunggah, ditimpa, atau dihapus. Berkas `kerja-coding (1).md` dan screenshot referensi Riverside tidak ditemukan di workspace; desain memakai arahan navy–gold–putih, bukan meniru identitas sekolah lain.

## Pemeriksaan yang dapat diulang

```sh
npm run lint
npm run build
node tests/school-demo/run.mjs
```

Harness menggunakan Python Playwright dan Chromium yang sudah tersedia. Membuka server preview lokal hanya selama proses test, lalu menutupnya. Seluruh pengujian interaktif ditujukan ke **prototype**, tidak ke website sekolah. Uji buat–ubah–arsip memakai ruang acak tersendiri. File `test-results.json` merupakan hasil aktual, bukan daftar target.

Ringkasan hasil: lint lulus; TypeScript dan build Vite lulus; 19 kelompok pemeriksaan browser lulus, tanpa exception JavaScript pada alur tersebut. Beranda diperiksa pada 375, 768, 1024, dan 1440 px. Hasil ini bukan audit aksesibilitas menyeluruh, uji semua browser, pengujian performa produksi, ataupun sertifikasi keamanan.

## Langkah berikutnya (tidak dikerjakan pada task ini)

1. Presentasikan alur pencarian informasi kepada siswa/orang tua dan alur publikasi kepada pegawai. Catat masukan sebelum migrasi teknis.
2. Minta sekolah meninjau kebenaran konten, persetujuan penggunaan foto/logo, masa berlaku kebijakan, dan hak publikasi. Ganti ilustrasi dengan foto kampus terbaru yang disetujui.
3. Isi agenda resmi, kalender dan kurikulum, serta direktori yang sudah mendapat persetujuan. Rancang skema data khusus per modul berdasarkan kebutuhan yang disetujui.
4. Bila disetujui sebagai pekerjaan lanjutan, buat proyek **staging terpisah** untuk Laravel/Filament. Periksa Composer resolution, platform extensions, dan driver PostgreSQL pada runtime tujuan sebelum instalasi.
5. Autentikasi pegawai, otorisasi, audit log, backup, retensi data, migrasi konten, dan rollout produksi perlu persetujuan dan lingkup tersendiri.
