import { modules, type Entry } from './types';

/** Normalise optional database fields. Missing dates remain missing, not invented. */
export function readEntries(value: unknown): Entry[] {
  if (!Array.isArray(value)) throw Error('Format konten tidak dikenali.');
  return value.filter((row) => row && typeof row.code === 'string' &&
    typeof row.title === 'string' && typeof row.body === 'string' &&
    modules.some(m => m.id === row.page) && ['draft','published'].includes(row.status)
  ).map(row => ({
    code: row.code, page: row.page, title: row.title, body: row.body,
    date: typeof row.date === 'string' ? row.date : '',
    status: row.status, is_demo: Boolean(row.is_demo),
    image: /^\/school\/[a-z-]+\.jpg$/.test(row.image || '') ? row.image : '',
    source: /^https:\/\/smpn2srandakan\.sch\.id\//.test(row.source || '') ? row.source : '',
    category: row.category || 'Informasi',
  }));
}
