// API adapter for local Vite development and preview; no connection to the school's server.
import { loadEnv } from 'vite';
export default function schoolApi(){
 const configure=server=>{const env=loadEnv('development',process.cwd(),'');for(const k of ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY'])if(!process.env[k]&&env[k])process.env[k]=env[k];server.middlewares.use('/api/school-content',async(req,res)=>{try{let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>40000){res.statusCode=413;return res.end();}}req.body=raw?JSON.parse(raw):{};res.status=n=>{res.statusCode=n;return res};res.json=obj=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(obj))};const {default:handler}=await import('./api/school-content.js');await handler(req,res)}catch{res.statusCode=500;res.end(JSON.stringify({error:'API demo tidak tersedia.'}))}})};
 return {name:'school-demo-api',configureServer:configure,configurePreviewServer:configure};
}
