'use client';
import {useEffect,useMemo,useState} from 'react';
import {supabase} from '@/lib/supabase';

type Field={key:string;label:string;type?:string;required?:boolean;placeholder?:string;options?:{value:string;label:string}[]};

type Props={title:string;table:string;fields:Field[];order?:string;searchKeys?:string[];excludeFromTable?:string[]};

export function CrudPage({title,table,fields,order='created_at',searchKeys=[],excludeFromTable=[]}:Props){
 const [data,setData]=useState<any[]>([]),[form,setForm]=useState<any>({}),[editing,setEditing]=useState<any|null>(null);
 const [loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[query,setQuery]=useState(''),[msg,setMsg]=useState('');
 const visibleFields=useMemo(()=>fields.filter(f=>!excludeFromTable.includes(f.key)),[fields,excludeFromTable]);
 const load=async()=>{setLoading(true);let q=supabase().from(table).select('*').order(order,{ascending:false});if(query&&searchKeys.length){const safe=query.replace(/[%(),]/g,' ');q=q.or(searchKeys.map(k=>`${k}.ilike.%${safe}%`).join(','));}const r=await q;if(r.error)setMsg(r.error.message);else setData(r.data||[]);setLoading(false)};
 useEffect(()=>{load()},[query]);
 const change=(key:string,value:string)=>setForm((x:any)=>({...x,[key]:value}));
 async function save(e:React.FormEvent){e.preventDefault();setSaving(true);setMsg('');const payload={...form};for(const f of fields){if(payload[f.key]==='')payload[f.key]=null;if(f.type==='number'&&payload[f.key]!=null)payload[f.key]=Number(payload[f.key]);}
  const r=editing?await supabase().from(table).update(payload).eq('id',editing.id):await supabase().from(table).insert(payload);
  if(r.error)setMsg(r.error.message);else{setMsg('Sikeres mentés.');setForm({});setEditing(null);await load();}setSaving(false);
 }
 async function del(id:string){if(!confirm('Biztosan archiválod/törlöd ezt a rekordot?'))return;const r=await supabase().from(table).delete().eq('id',id);if(r.error)setMsg(r.error.message);else{setMsg('Rekord törölve.');await load();}}
 function edit(row:any){setEditing(row);const x={...row};fields.forEach(f=>{if(x[f.key]==null)x[f.key]=''});setForm(x);window.scrollTo({top:0,behavior:'smooth'});}
 return <>
  <div className="top"><div><div className="title">{title}</div><div className="muted">Valódi adatbázis-rekordok, módosítással és kereséssel.</div></div></div>
  {searchKeys.length>0&&<div className="toolbar"><input className="input" placeholder="Keresés…" value={query} onChange={e=>setQuery(e.target.value)}/><button className="btn secondary" type="button" onClick={()=>setQuery('')}>Keresés törlése</button></div>}
  <div className="card"><form className="form" onSubmit={save}>{fields.map(f=><label key={f.key}>{f.label}
    {f.options?<select className="select" required={f.required} value={form[f.key]??''} onChange={e=>change(f.key,e.target.value)}><option value="">Válassz…</option>{f.options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:<input className="input" placeholder={f.placeholder} type={f.type||'text'} required={f.required} value={form[f.key]??''} onChange={e=>change(f.key,e.target.value)}/>}</label>)}
    <div className="full"><button className="btn" disabled={saving}>{saving?'Mentés…':editing?'Módosítás mentése':'Új rekord mentése'}</button>{editing&&<button type="button" className="btn secondary" style={{marginLeft:8}} onClick={()=>{setEditing(null);setForm({})}}>Mégse</button>} {msg&&<span className={msg.includes('Siker')?'success':'error'} style={{marginLeft:10}}>{msg}</span>}</div>
  </form></div>
  <br/><div className="tablewrap">{loading?<p style={{padding:16}}>Betöltés…</p>:<table className="table"><thead><tr>{visibleFields.map(f=><th key={f.key}>{f.label}</th>)}<th>Műveletek</th></tr></thead><tbody>{data.map(row=><tr key={row.id}>{visibleFields.map(f=><td key={f.key}>{String(row[f.key]??'')}</td>)}<td><button className="btn secondary" onClick={()=>edit(row)}>Szerkesztés</button>{row.id&&<button className="btn danger" style={{marginLeft:6}} onClick={()=>del(row.id)}>Törlés</button>}</td></tr>)}</tbody></table>}</div>
 </>;
}
