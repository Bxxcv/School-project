import '../school-server/demo-env.js';
import supabase from './db-client.js';
import { createHash, randomUUID } from 'node:crypto';
const table='srandakan_demo_entries';
const pages=['beranda','profil','pendidikan','direktori','berita','agenda','galeri','perpustakaan','layanan-publik','kontak'];
const pictures=['','/school/campus.webp','/school/school.webp','/school/spmb.webp','/school/pendampingan.webp','/school/sehat.webp','/school/olahraga.webp'];
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Cache-Control','no-store');
 if(req.method==='OPTIONS')return res.status(204).end();
 const token=String(req.headers.authorization||'').replace(/^Bearer /,'');
 const workspace=/^[a-f\d-]{36}$/.test(token)?createHash('sha256').update(token).digest('hex'):null;
 try {
 if(req.method==='GET'){
  const {data,error}=await supabase.from(table).select('code,page,title,body,category,image,source,is_demo,date,status,workspace').in('workspace',workspace?['seed',workspace]:['seed']).order('date',{ascending:false}).setHeader('x-school-demo',workspace?token:'');if(error)throw error;
  const entries=new Map(data.filter(r=>r.workspace==='seed').map(r=>[r.code,r]));for(const r of data.filter(r=>r.workspace===workspace))entries.set(r.code,r);
  return res.status(200).json([...entries.values()].filter(r=>r.status!=='hidden').map(({workspace:_w,...r})=>r));
 }
 if(!['POST','PUT','DELETE'].includes(req.method))return res.status(405).json({error:'Metode tidak tersedia.'});
 if(!workspace)return res.status(400).json({error:'Ruang demo tidak tersedia. Muat ulang halaman.'});
 const b=req.body||{};let code=req.method==='POST'?randomUUID():String(b.code||'');
 if(!/^[a-z0-9-]{1,90}$/.test(code))return res.status(400).json({error:'Identitas konten tidak valid.'});
 const record={id:workspace+'__'+code,workspace,code};
 if(req.method==='DELETE'){
  const {error}=await supabase.from(table).upsert({...record,page:'beranda',title:'Diarsipkan',body:'',status:'hidden',is_demo:true}).select('id').setHeader('x-school-demo',token);if(error)throw error;
 }else{
  if(!pages.includes(b.page)||typeof b.title!=='string'||!b.title.trim()||b.title.length>180||typeof b.body!=='string'||!b.body.trim()||b.body.length>12000||!['published','draft'].includes(b.status)||!/^\d{4}-\d{2}-\d{2}$/.test(b.date)||!pictures.includes(b.image||''))return res.status(400).json({error:'Periksa judul, isi, tanggal, dan gambar.'});
  const {error}=await supabase.from(table).upsert({...record,page:b.page,title:b.title.trim(),body:b.body.trim(),category:String(b.category||'Informasi').slice(0,48),image:b.image||'',source:'',is_demo:true,date:b.date,status:b.status}).select('id').setHeader('x-school-demo',token);if(error)throw error;
 }
 return res.status(req.method==='POST'?201:200).json({ok:true,code});
 }catch(err){console.error('school-demo',err.message);return res.status(503).json({error:'Penyimpanan demo belum dapat dijangkau. Coba kembali.'});}
}
