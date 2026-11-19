"""Browser checks only against the prototype. Never sends requests to the school."""
import sys, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
base=sys.argv[1]; results=[]; errors=[]
output=Path('docs/school-demo'); output.mkdir(exist_ok=True)
def passed(title): results.append(title);print('PASS',title,flush=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True)
 ctx=browser.new_context(viewport={'width':1440,'height':1000},locale='id-ID')
 page=ctx.new_page();page.set_default_timeout(10000)
 page.on('pageerror',lambda e: errors.append(str(e)))
 page.goto(base);expect(page.locator('.news-grid .content-card')).to_have_count(2)
 expect(page.locator('.offline')).to_have_count(0)
 passed('Beranda membaca database demo lewat API')
 page.evaluate('document.fonts.ready');page.screenshot(path=str(output/'desktop.jpg'), type='jpeg', quality=84)
 assert page.locator('img').evaluate_all('(els)=>els.every(i=>i.complete && i.naturalWidth>0)');passed('Semua gambar beranda dimuat')
 page.get_by_role('button',name='Foto berikutnya').click();expect(page.locator('.photo-caption')).to_contain_text('Gerbang');page.get_by_role('button',name='Foto sebelumnya').click();passed('Karusel foto berikutnya dan sebelumnya')
 page.get_by_role('button',name='Informasi',exact=True).click();page.locator('.dropdown').get_by_text('Berita Sekolah').click();expect(page.locator('h1')).to_have_text('Berita Sekolah');passed('Dropdown navigasi desktop')
 page.get_by_role('button',name='Cari di website').click();page.get_by_role('textbox',name='Kata kunci pencarian').fill('Hukum');expect(page.locator('.search-list a')).to_have_count(1);page.locator('.search-list a').click();expect(page.locator('.article h1')).to_contain_text('Hukum');expect(page.locator('.source')).to_be_visible();passed('Pencarian global dan detail bersumber')
 mods=['beranda','profil','pendidikan','direktori','berita','agenda','galeri','perpustakaan','layanan-publik','kontak']
 for m in mods:
  page.goto(base+'/#/'+('' if m=='beranda' else m));expect(page.locator('h1')).to_be_visible();assert page.locator('.not-found').count()==0
  if m!='beranda':assert page.locator('.content-card,.agenda-page-list .agenda-row').count()>0
 passed('10 kelompok halaman publik menampilkan konten')
 page.goto(base+'/#/berita');page.get_by_role('button',name='Kesehatan',exact=True).click();expect(page.locator('.listing-grid .content-card')).to_have_count(1);page.get_by_role('textbox',name='Cari Berita Sekolah').fill('zzzz');expect(page.locator('.empty')).to_be_visible();passed('Filter dan keadaan pencarian kosong')
 for width in [375,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':900});page.goto(base+'/#/');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  if width==375:page.screenshot(path=str(output/'mobile.jpg'), type='jpeg', quality=84);page.get_by_role('button',name='Buka menu navigasi').click();expect(page.locator('.mobile-menu a')).to_have_count(10);page.locator('.mobile-menu').get_by_text('Perpustakaan').click();expect(page.locator('h1')).to_have_text('Perpustakaan')
 passed('Beranda responsif 375, 768, 1024, 1440 px; menu ponsel')
 page.goto(base+'/#/admin');expect(page.locator('h1')).to_have_text('Dashboard');page.screenshot(path=str(output/'admin.jpg'), type='jpeg', quality=84)
 for m in mods:
  page.goto(base+'/#/admin/'+m);expect(page.locator('tbody tr').first).to_be_visible()
 passed('Dashboard dan tabel 10 modul admin')
 page.goto(base+'/#/admin/berita');page.get_by_role('button',name='Tambah konten').click();form=page.locator('.edit-form')
 form.get_by_role('button',name='Simpan konten').click();assert page.locator('input:invalid').count()>0;passed('Validasi kolom wajib')
 title='Uji UI — konten sementara';form.get_by_label('Judul konten').fill(title);form.get_by_label('Isi konten').fill('Teks contoh pengujian prototype, bukan berita resmi.');form.get_by_role('button',name='Pratinjau').click();expect(page.locator('.article h1')).to_have_text(title);page.get_by_role('button',name='Tutup pratinjau').click();passed('Pratinjau sebelum simpan tidak menutup formulir')
 form.get_by_role('button',name='Simpan konten').click();expect(page.locator('.success')).to_contain_text('tersimpan');page.reload();expect(page.locator('.table-link',has_text=title)).to_be_visible();passed('Buat draf dan persistensi setelah reload')
 page.goto(base+'/#/berita');expect(page.locator('.content-card',has_text=title)).to_have_count(0);passed('Draf tidak tampil di website publik')
 page.goto(base+'/#/admin/berita');page.get_by_role('button',name='Ubah '+title,exact=True).click();form=page.locator('.edit-form');form.get_by_label('Status',exact=True).select_option('published');form.get_by_label('Judul konten').fill(title+' terbit');form.get_by_role('button',name='Simpan konten').click();expect(page.locator('.success')).to_be_visible();page.goto(base+'/#/berita');expect(page.locator('.content-card',has_text=title+' terbit')).to_be_visible();passed('Edit, publikasi demo, dan sinkronisasi tampilan publik')
 fresh=browser.new_context();other=fresh.new_page();other.goto(base+'/#/berita');expect(other.locator('.listing-grid .content-card')).to_have_count(4);expect(other.locator('.content-card',has_text=title)).to_have_count(0);fresh.close();passed('Browser berbeda tidak membaca perubahan ruang demo lain')
 page.goto(base+'/#/admin/berita');page.get_by_role('button',name='Arsipkan '+title+' terbit',exact=True).click();page.get_by_role('button',name='Batal',exact=True).click();expect(page.locator('.table-link',has_text=title)).to_be_visible();page.get_by_role('button',name='Arsipkan '+title+' terbit',exact=True).click();page.get_by_role('button',name='Ya, arsipkan').click();expect(page.locator('.success')).to_contain_text('diarsipkan');expect(page.locator('.table-link',has_text=title)).to_have_count(0);passed('Batal arsip dan konfirmasi arsip')
 page.set_viewport_size({'width':375,'height':812});page.goto(base+'/#/admin');page.get_by_role('button',name='Menu modul').click();page.locator('.admin-side').get_by_text('Agenda Sekolah',exact=True).click();expect(page.locator('h1')).to_have_text('Agenda Sekolah');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');passed('Navigasi dan tabel admin di ponsel')
 page.route('**/api/school-content',lambda route:route.fulfill(status=503,body='{}'));page.reload();expect(page.locator('.offline')).to_contain_text('Mode baca');expect(page.locator('tbody tr').first).to_be_visible();passed('Fallback membaca snapshot saat API tidak tersedia')
 assert not errors,errors;passed('Tidak ada JavaScript page error pada alur uji');browser.close()
(output/'test-results.json').write_text(json.dumps({'passed':len(results),'checks':results,'page_errors':errors},indent=2,ensure_ascii=False));print('TOTAL',len(results),'checks passed')
