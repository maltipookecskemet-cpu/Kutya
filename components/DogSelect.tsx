'use client';
import {useEffect,useState} from 'react';
import {supabase} from '@/lib/supabase';
export default function DogSelect({value,onChange,adultOnly=false,sex}:{value:string;onChange:(v:string)=>void;adultOnly?:boolean;sex?:'female'|'male'}){
 const [dogs,setDogs]=useState<any[]>([]);
 useEffect(()=>{(async()=>{let q=supabase().from('dogs').select('id,name,breed,chip_number,is_adult,is_female,is_male').neq('status','ARCHIVED').order('name');if(adultOnly)q=q.eq('is_adult',true);if(sex==='female')q=q.eq('is_female',true);if(sex==='male')q=q.eq('is_male',true);const r=await q;setDogs(r.data||[])})()},[adultOnly,sex]);
 return <select className="select" value={value||''} onChange={e=>onChange(e.target.value)}><option value="">Válassz kutyát…</option>{dogs.map(d=><option key={d.id} value={d.id}>{d.name}{d.chip_number?` · ${d.chip_number}`:''}{d.breed?` · ${d.breed}`:''}</option>)}</select>;
}
