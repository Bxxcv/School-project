# Discovery pasif website sekolah

**Tanggal:** 19 November 2026 UTC. **Ruang lingkup:** beranda, tautan navigasi publik, berita pilihan, halaman profil dan layanan, serta media yang dirujuk halaman tersebut. Ini bukan crawl lengkap atau pengujian keamanan.

## Hasil akses aktual

- 20 halaman HTML publik dipilih dari tautan beranda dan dapat dibaca dengan GET biasa (HTTP 200).
- 7 aset publik dapat diambil: 1 logo dan 6 foto (gerbang sekolah dua sudut/crop, SPMB, pendampingan Kejari, CKG, Haornas).
- Ekstraktor teks pertama tidak menghasilkan teks untuk beranda dan profil. Pengambilan HTML biasa berhasil dengan HTTP 200; **bukan** bukti situs mati. Tidak ada kegagalan HTTP pada 20 halaman sampel yang dicatat.
- Beberapa halaman kurikulum/kalender memiliki sedikit atau tidak ada teks substantif yang dapat diekstrak. HTTP 200 bukan verifikasi keberlakuan dokumen. Karena itu tidak disalin sebagai kurikulum/jadwal resmi terkini.
- Daftar URL, judul, status, dan pemetaan file media ada di `discovery.json`. Daftar `links_in_home` hanya inventaris tautan: tidak semua tautan tersebut dikunjungi.

## Struktur lama → kelompok baru

| Pola URL publik lama | Kelompok baru | Perlakuan |
|---|---|---|
| `/`, `/about-us/`, `/coures/` | Beranda | Identitas dan pengantar portal |
| `/profil/`, `/sejarah-singkat/`, `/visi-misi/` | Profil | Ringkasan bersumber; tidak mengarang statistik atau akreditasi |
| `/struktur-kurikulum/`, `/kriteria-ketuntasan-minimal/`, `/kalender-akademik/` | Pendidikan | Struktur dipertahankan, rincian berlaku menunggu konfirmasi |
| `/struktur-organisasi/`, tautan tenaga edukatif/nonedukatif, siswa dan alumni | Direktori | Struktur saja; tidak mengumpulkan data personal |
| `/{slug-berita}/` dan `/category/berita/` | Berita | Empat publikasi bersumber dan foto yang menyertainya |
| `/category/agenda/` | Agenda | Kategori lama juga berisi publikasi layanan, bukan seluruhnya jadwal acara. Tiga acara baru jelas berlabel demo |
| `/category/galeri/` | Galeri | Foto dipilih dari dokumentasi publik dengan tautan asal |
| `/category/prestasi/` | Direktori / informasi | Kategori teridentifikasi; tidak menambahkan pencapaian yang belum diverifikasi |
| `/profil-perpustakaan/` | Perpustakaan | Nama Cahaya Cendekia dan informasi literasi dari profil lama |
| `/maklumat-pelayanan/`, `/hasil-survei-kepuasan-masyarakatsmp-negeri-2-srandakan/` | Layanan Publik | Ringkasan dan rujukan, tidak mengarang skor survei |
| `/contact/` | Kontak | Alamat, telepon dan email publik |

`/category/berita/` dan `/category/agenda/` diidentifikasi dari tautan kategori dalam artikel yang dibaca, bukan diklaim sebagai halaman kategori yang turut di-fetch. Kategori lama ditemukan: **Berita, Agenda, Prestasi, Galeri**. Label Pendidikan, Kesehatan, dan Kegiatan Sekolah pada UI adalah pengelompokan editorial demo, bukan klaim taksonomi WordPress asli.

## Berita yang digunakan

Tanggal di bawah merupakan **tanggal publikasi**, tidak selalu tanggal pelaksanaan.

| Terbit | Topik | Pemeriksaan |
|---|---|---|
| 30 Juni 2026 | SPMB 2026/2027 | Publikasi laporan kegiatan, tidak ditampilkan sebagai pendaftaran yang sedang dibuka |
| 16 Maret 2026 | Pendampingan Kejari Bantul | Artikel menyebut kegiatan 4 Maret 2026; dipisahkan dari tanggal terbit |
| 23 September 2025 | Cek Kesehatan Gratis | Ringkasan kegiatan tanpa hasil kesehatan individu |
| 11 September 2025 | Hari Olahraga Nasional | Dokumentasi peringatan 2025, bukan agenda mendatang |

Setiap ringkasan memiliki `source` dan tautan sumber pada tampilan detail. `public/school/public-snapshot.json` merupakan ekspor data dasar setelah koreksi tautan sumber, bukan respons palsu API.

## Tidak diakses / tidak dilakukan

Tautan data peserta didik, formulir alumni, daftar personal guru dan tenaga kependidikan hanya dicatat bila ditemukan dalam navigasi; tidak diambil sebagai dataset. Tidak membuka login WordPress, dashboard CMS, endpoint privat, atau data kredensial. Tidak melakukan brute force, pemindaian, enumerasi server, submit formulir, ataupun perubahan konfigurasi. Tidak ada perubahan hosting, DNS, domain, file, atau database milik sekolah.

## Aset dan perizinan

- Logo/foto sekolah: sumber publik disimpan di `discovery.json`. Dapat diakses publik **tidak berarti** lisensi penggunaan ulang untuk produksi; minta persetujuan sekolah dan tinjau izin subjek foto sebelum penggunaan di luar demo.
- Gambar hero pertama: ilustrasi AI yang dibuat untuk presentasi. Label “Ilustrasi lingkungan sekolah” terlihat pada gambar; catatan lebih lengkap tersedia pada footer → Tentang prototype. Bukan foto nyata gedung sekolah.
- Font DM Sans: disimpan lokal dengan lisensi SIL OFL dalam `public/school/FONT-LICENSE.txt`.
- Tidak menggunakan konten maupun identitas Riverside Preparatory School. Screenshot referensi tidak tersedia dalam berkas workspace, sehingga pendekatan visual mengikuti deskripsi pengguna.
