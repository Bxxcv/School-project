# Pemeriksaan stack — 19 November 2026

## Proposal Laravel / Filament

Tidak dilakukan instalasi PHP, Composer, Laravel, Filament, Alpine, maupun dependency baru. Pemeriksaan berikut membandingkan persyaratan deklaratif upstream sebelum memutuskan implementasi demo.

| Komponen | Bukti | Keputusan |
|---|---|---|
| Laravel 13.x | `laravel/framework` cabang `13.x`, composer.json: `php: ^8.3`, `composer-runtime-api: ^2.2` | Memerlukan runtime PHP/Composer yang tidak tersedia di workspace ini |
| Filament 5.x | Dokumentasi instalasi: PHP 8.2+, Laravel 11.28+, Tailwind 4.1+ | Kompatibilitas major Laravel 13 diperiksa lagi pada manifest, tidak sekadar diasumsikan |
| filament/support 5.x | Manifest: `illuminate/contracts: ^11.28\|^12.0\|^13.0`, `php: ^8.2`, `ext-intl`, `livewire/livewire: ^4.4.8` saat pemeriksaan | Batas `^13.0` mencakup Laravel 13. Kombinasi perlu memenuhi batas PHP Laravel yang lebih ketat dan seluruh extension |
| Blade dan Alpine.js | Bagian proposal implementasi PHP | Tidak diinstal; tidak ada klaim bahwa demo React menjalankan Blade/Filament. Pada tahap Laravel, periksa bundel Alpine dari Livewire agar tidak memuatnya dua kali |
| PostgreSQL | Target database yang diusulkan | Demo memakai tabel terpisah dalam Supabase/Postgres sandbox yang sudah tersedia. Tidak membuat database produksi atau menghubungkan sistem sekolah |

Sumber primer yang dibaca:
- https://raw.githubusercontent.com/laravel/framework/13.x/composer.json
- https://raw.githubusercontent.com/filamentphp/filament/5.x/packages/support/composer.json
- https://filamentphp.com/docs/5.x/introduction/installation

Kesimpulan **terbatas** pada manifest yang dibaca. Bukan jaminan seluruh versi patch kompatibel. Tidak ada `composer install`, resolver run, Artisan, atau PHPUnit yang diklaim berhasil. Perlu lockfile reproducible, PHP 8.3 yang sesuai, `ext-intl`, driver `pdo_pgsql`, serta pemeriksaan platform requirements pada host staging tujuan.

## Stack prototype aktual

Diperiksa dari package yang terpasang, bukan asumsi versi terbaru: Node 24.19.0, React dan React DOM 19.3.0, TypeScript 5.9.3, Vite 7.3.6, Tailwind CSS 4.2.1, Lucide React 0.577.0. Tidak ada `npm install` maupun perubahan manifest/lockfile. Tailwind diproses oleh plugin yang sudah tersedia dan styling editorial diletakkan di `src/school/school.css`.

`command -v php` dan `command -v composer` tidak menemukan executable pada PATH. Rencana React + TypeScript yang terpisah disetujui sebelum implementasi. Aplikasi frontend mengambil data dari adapter API demo; client Supabase yang sudah tersedia dipakai kembali. Tidak dibuat produk backend produksi ataupun autentikasi pegawai.
