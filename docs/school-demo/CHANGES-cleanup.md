# Perubahan pembersihan (19 Nov 2026)

1. `index.html`: dihapus 3 skrip bawaan platform desain (perekam sesi rrweb, beacon page-view ke designarena.ai, element picker). Tidak ada lagi permintaan ke pihak ketiga selain Supabase sandbox milik demo.
2. `.vite-source-tags.js` dihapus; blok pemuatnya di `vite.config.ts` dihapus (tidak ada lagi atribut `data-source-loc` di DOM).
3. `src/school/school.css`: ditambah blok override di akhir file — teks minimal 11–12 px, kartu berita 1 kolom di HP, tata letak tablet disusun ulang (<=900 px), bar utilitas boleh membungkus di HP.
Belum diverifikasi: build/lint/test dan tampilan visual (lingkungan ini tanpa node_modules dan tanpa internet). Jalankan `npm install && npm run lint && npm run build && node tests/school-demo/run.mjs`, lalu periksa di HP nyata.


## Optimasi ukuran paket (19 Nov 2026)

1. Foto runtime `campus`, `olahraga`, `pendampingan`, `school`, `sehat`, dan `spmb` dikonversi dari JPEG ke WebP kualitas 82; referensi di aplikasi, snapshot, API, dan discovery diperbarui.
2. Ilustrasi hero WebP dikodekan ulang kualitas 82 tanpa mengubah dimensi.
3. Screenshot dokumentasi desktop, mobile, dan admin dikonversi ke JPEG kualitas 84; harness browser diperbarui agar screenshot berikutnya juga memakai JPEG.
4. `hero-original.png` dihapus dari paket karena tidak direferensikan oleh aplikasi; versi ringkas `hero-review.jpg` dan ilustrasi runtime tetap tersedia.
5. `crest.png` dipertahankan tanpa lossy conversion karena memiliki transparansi dan ukurannya kecil.

Verifikasi optimasi: pemeriksaan referensi aset lokal dan integritas ZIP dilakukan setelah paket dibuat. Build/lint/browser test aplikasi tidak dijalankan pada pekerjaan optimasi ini.
