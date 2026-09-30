'use client';
import {useEffect,useState} from 'react';
import {supabase} from '@/lib/supabase';
export default function MediaManager({dogId}:{dogId:string}){
 const [files,setFiles]=useState<any[]>([]),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');
 async function load(){const r=await supabase().from('documents').select('*').eq('dog_id',dogId).order('created_at',{ascending:false});setFiles(r.data||[])}
 useEffect(()=>{if(dogId)load()},[dogId]);
 async function upload(e:React.ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];if(!file||!dogId)return;setBusy(true);setMsg('Feltöltés…');const path=`${dogId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;const s=supabase();const up=await s.storage.from('private-media').upload(path,file,{upsert:false});if(up.error){setMsg(up.error.message);setBusy(false);return}const ins=await s.from('documents').insert({dog_id:dogId,name:file.name,path,mime_type:file.type}).select().single(); if(!ins.error && file.type.startsWith('image/')) await s.from('photos').insert({dog_id:dogId,path,is_primary:false}); if(!ins.error && file.type.startsWith('video/')) await s.from('videos').insert({dog_id:dogId,path});if(ins.error)setMsg(ins.error.message);else{setMsg('Fájl feltöltve.');await load()}setBusy(false);e.target.value='';}
 async function openFile(path:string){const r=await supabase().storage.from('private-media').createSignedUrl(path,300);if(r.data?.signedUrl)window.open(r.data.signedUrl,'_blank');}
 return <div className="card"><h3>Dokumentumok és fájlok</h3><input type="file" onChange={upload} disabled={busy}/><p className="muted">A fájlok privát Storage-ban vannak; csak bejelentkezett admin érheti el.</p>{msg&&<p className={msg.includes('feltöltve')?'success':'error'}>{msg}</p>}<div>{files.map(f=><div key={f.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #eee'}}><span>{f.name}</span><button className="btn secondary" onClick={()=>openFile(f.path)}>Megnyitás</button></div>)}</div></div>
}
