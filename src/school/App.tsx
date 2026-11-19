import { useCallback, useEffect, useState } from 'react';
import PublicSite from './Public';
import Admin from './Admin';
import { type Entry, type Mutate, label } from './types';
import { readEntries } from './entries';

function workspace() {
  const key = 'esperada-demo-workspace-v1';
  const fresh = () => crypto.randomUUID();
  try {
    const token = localStorage.getItem(key) || fresh();
    localStorage.setItem(key, token);
    return token;
  } catch { return fresh(); }
}
const session = workspace();
const headers = { Authorization: `Bearer ${session}` };

export default function App() {
  const [route, setRoute] = useState(location.hash);
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, page = 'beranda', code = ''] = route.replace(/^#/, '').split('/');
  const current = page || 'beranda';
  const refresh = useCallback(async () => {
    const response = await fetch('/api/school-content', { headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw Error('Penyimpanan demo tidak tersedia.');
    const entries = await response.json();
    setItems(readEntries(entries));
    setError('');
  }, []);
  const load = useCallback(async () => {
    try { await refresh(); }
    catch {
      try {
        const response = await fetch('/school/public-snapshot.json');
        if (!response.ok) throw Error();
        setItems(readEntries(await response.json()));
        setError('Mode baca: salinan konten publik. Penyimpanan demo belum terhubung.');
      } catch { setError('Informasi belum dapat dimuat. Silakan coba lagi.'); }
    } finally { setLoading(false); }
  }, [refresh]);
  useEffect(() => {
    const initialLoad = window.setTimeout(() => { void load(); }, 0);
    const update = () => { setRoute(location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', update);
    return () => { window.clearTimeout(initialLoad); window.removeEventListener('hashchange', update); };
  }, [load]);
  useEffect(() => {
    document.title = `${current === 'admin' ? 'Panel Admin' : label(current)} — SMP Negeri 2 Srandakan`;
  }, [current]);
  const mutate: Mutate = async (method, entry) => {
    const response = await fetch('/api/school-content', {
      method, headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(entry), signal: AbortSignal.timeout(20000),
    }).catch(() => { throw Error('Koneksi gagal. Periksa daftar konten sebelum mencoba kembali.'); });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw Error(result.error || 'Penyimpanan demo belum tersedia. Coba lagi tanpa menutup formulir.');
    }
    await refresh().catch(() => { throw Error('Konten telah tersimpan, tetapi daftar belum termuat. Tutup formulir dan muat ulang halaman.'); });
  };
  return <>
    {loading && <div className="loading-line" role="status" aria-label="Memuat informasi sekolah"/>}
    {error && <div className="offline" role="status">{error}<button onClick={() => {setLoading(true); void load();}}>Coba lagi</button></div>}
    {current === 'admin' ? <Admin key={code} section={code} items={items} mutate={mutate}/>
      : <PublicSite page={current} code={code} items={items}/>}
  </>;
}
