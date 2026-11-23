const KEY='gymman_v1',$=id=>document.getElementById(id),today=()=>new Date().toLocaleDateString('sv');
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let LS;try{LS=window.localStorage;LS.getItem(KEY);}catch(e){const m={};LS={getItem:k=>m[k]??null,setItem:(k,v)=>m[k]=v};}
const save=()=>{try{LS.setItem(KEY,JSON.stringify(S));}catch(e){}};
// ---------- default masters (id-based) ----------
function seed(){const m={gym:[],part:[],equip:[],ex:[],food:[]};
 const P=['อก','หลัง','ขา','ไหล่','แขนหน้า','แขนหลัง','ท้อง','คาร์ดิโอ'],E=['Barbell','Dumbbell','Machine','Cable','Smith Machine','Bodyweight','Kettlebell'];
 P.forEach((n,i)=>m.part.push({id:'p'+(i+1),name:n}));E.forEach((n,i)=>m.equip.push({id:'e'+(i+1),name:n}));
 [['Bench Press',1,1],['Incline DB Press',1,2],['Chest Press',1,3],['Cable Fly',1,4],['Lat Pulldown',2,4],['Seated Row',2,4],['Deadlift',2,1],['Pull Up',2,6],
  ['Squat',3,1],['Leg Press',3,3],['Leg Extension',3,3],['Leg Curl',3,3],['Shoulder Press',4,2],['Lateral Raise',4,2],['Biceps Curl',5,2],['Hammer Curl',5,2],
  ['Triceps Pushdown',6,4],['Crunch',7,6],['Treadmill',8,3]].forEach((x,i)=>m.ex.push({id:'x'+(i+1),name:x[0],partId:'p'+x[1],equipId:'e'+x[2]}));
 return m;}
let S;try{S=JSON.parse(LS.getItem(KEY)||'null');}catch(e){}
if(!S)S={ver:2,rest:90,m:seed(),logs:[],body:[],food:[]};
// migrate v1 (name-based) -> v2 (id-based)
if(!S.ver){const m={gym:[],part:[],equip:[],ex:[],food:[]};
 (S.parts||[]).forEach((n,i)=>m.part.push({id:'p'+(i+1),name:n}));(S.equip||[]).forEach((n,i)=>m.equip.push({id:'e'+(i+1),name:n}));
 const fid=(a,n)=>(a.find(x=>x.name===n)||{}).id||null;
 (S.ex||[]).forEach((x,i)=>m.ex.push({id:'x'+(i+1),name:x.n,partId:fid(m.part,x.p),equipId:fid(m.equip,x.e)}));
 const old=S.logs||[];S={ver:2,rest:S.rest||90,m,logs:[],body:S.body||[],food:[]};
 old.forEach(l=>{let ex=m.ex.find(x=>x.name===l.ex);if(!ex){ex={id:uid('x'),name:l.ex,partId:fid(m.part,l.part),equipId:fid(m.equip,l.equip)};m.ex.push(ex);}
  S.logs.push({id:l.id,date:l.date,gymId:null,exId:ex.id,partId:ex.partId,equipId:ex.equipId,w:l.w,reps:l.reps,sets:l.sets,note:l.note||''});});
 save();}
S.food=S.food||[];S.m.gym=S.m.gym||[];S.m.brand=S.m.brand||[];S.m.food=S.m.food||[];
function normEx(){S.m.ex.forEach(x=>{if(!Array.isArray(x.partIds))x.partIds=x.partId?[x.partId]:[];if(!Array.isArray(x.equipIds))x.equipIds=x.equipId?[x.equipId]:[];delete x.partId;delete x.equipId;});}normEx();
if(!S.v3){S.v3=1;const cp=S.m.part.find(x=>x.name==='คาร์ดิโอ');if(cp)cp.cardio='ใช่';
 let tm=S.m.equip.find(x=>/treadmill|ลู่วิ่ง/i.test(x.name));if(!tm){tm={id:uid('e'),name:'Treadmill'};S.m.equip.push(tm);}
 const old=S.m.ex.find(x=>x.name==='Treadmill');if(old)old.name='วิ่ง';
 ['วิ่ง','เดิน','เดินชัน','จักรยาน'].forEach(n=>{let x=S.m.ex.find(y=>y.name===n);if(!x){x={id:uid('x'),name:n,partIds:[],equipIds:[]};S.m.ex.push(x);}
  if(cp&&!x.partIds.includes(cp.id))x.partIds.push(cp.id);if(n!=='จักรยาน'&&!x.equipIds.includes(tm.id))x.equipIds.push(tm.id);});
 const bk=S.m.equip.find(x=>/bike|จักรยาน/i.test(x.name))||(()=>{const b={id:uid('e'),name:'Bike'};S.m.equip.push(b);return b;})();
 const jx=S.m.ex.find(y=>y.name==='จักรยาน');jx.equipIds=jx.equipIds.filter(i=>i!==tm.id);if(!jx.equipIds.includes(bk.id))jx.equipIds.push(bk.id);
 S.unit=S.unit||'kg';save();}
if(!S.v4){S.v4=1;const ZM={'อก':'อก','หลัง':'หลัง','ขา':'ขา','ไหล่':'ไหล่','แขนหน้า':'ไบเซ็ป','แขนหลัง':'ไตรเซ็ป','ท้อง':'ท้อง'};S.m.part.forEach(p=>{if(!p.zone&&ZM[p.name])p.zone=ZM[p.name];});save();}
(function(){const sd=window.GYM_SEED_BODY||[];S.seeded=S.seeded||[];let n=0;
 sd.forEach(b=>{if(S.seeded.includes(b.id))return;S.seeded.push(b.id);if(!S.body.some(x=>x.id===b.id)){const h=b.height??([...S.body].reverse().find(y=>y.height)||{}).height??175;S.body.push({...b,height:h});n++;}});
 if(n)save();})();
const isCar=x=>!!x&&x.partIds.some(i=>(byId('part',i)||{}).cardio==='ใช่');
const toKg=l=>l.u==='lb'?l.w*0.453592:l.w;
const fmtPace=(d,t)=>d>0&&t>0?(()=>{const m=t/d,mm=Math.floor(m),ss=Math.round((m-mm)*60);return (ss===60?mm+1:mm)+':'+String(ss===60?0:ss).padStart(2,'0')+' /กม.';})():'';
const fmtLog=l=>l.dist!=null||l.time!=null?`${l.dist??'-'} กม. · ${l.time??'-'} นาที${l.dist&&l.time?' · '+fmtPace(l.dist,l.time):''}${l.inc?' · ชัน '+l.inc+'%':''}`:`${l.w} ${l.u||'kg'} · ${l.reps}×${l.sets}`;
// ---------- master helpers ----------
const M=t=>S.m[t],byId=(t,id)=>M(t).find(x=>x.id===id),nm=(t,id)=>(byId(t,id)||{}).name||'';
const byName=(t,n)=>{n=(n||'').trim().toLowerCase();return n?M(t).find(x=>x.name.toLowerCase()===n):null;};
function getOrCreate(t,n,extra){n=(n||'').trim();if(!n)return null;let x=byName(t,n);if(!x){x={id:uid(t[0]),name:n,...extra};M(t).push(x);}return x;}
const gymName=id=>{const g=byId('gym',id);if(!g)return '';const b=nm('brand',g.brandId);return b?b+' · '+g.name:g.name;};
const findGym=(bid,n)=>{n=(n||'').trim().toLowerCase();return n?M('gym').find(g=>g.name.toLowerCase()===n&&(g.brandId||null)===(bid||null)):null;};
const dl=(id,arr)=>$(id).innerHTML=arr.map(x=>`<option value="${esc(x.name)}">`).join('');
function go(p,b){document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));$('p-'+p).classList.add('on');
 document.querySelectorAll('nav button').forEach(x=>x.classList.remove('on'));b.classList.add('on');if(p==='chart')drawCharts();}
// ---------- workout form: filter equip -> part -> ex ----------
function refreshDL(){const e=byName('equip',$('wEquip').value),p=byName('part',$('wPart').value);
 const exE=M('ex').filter(x=>!e||x.equipIds.includes(e.id));
 const br=byName('brand',$('wBrand').value);dl('dlEquip',M('equip'));dl('dlBrand',M('brand'));dl('dlGym',M('gym').filter(g=>!$('wBrand').value.trim()||(br&&g.brandId===br.id)));dl('dlFood',M('food'));
 dl('dlPart',e?M('part').filter(pp=>exE.some(x=>x.partIds.includes(pp.id))):M('part'));
 dl('dlEx',exE.filter(x=>!p||x.partIds.includes(p.id)));
 const mark=(id,t,v)=>$(id).textContent=v.trim()&&!byName(t,v)?'+ ใหม่':'';
 mark('nBrand','brand',$('wBrand').value);$('nGym').textContent=$('wGym').value.trim()&&!findGym(br?.id,$('wGym').value)?'+ ใหม่':'';mark('nEquip','equip',$('wEquip').value);mark('nPart','part',$('wPart').value);mark('nEx','ex',$('wEx').value);mark('nFood','food',$('fFood').value);renderMode();}
['wBrand','wGym','wEquip','wPart','fFood'].forEach(i=>$(i).addEventListener('input',refreshDL));
$('wEx').addEventListener('input',()=>{refreshDL();const x=byName('ex',$('wEx').value);if(!x)return;
 const cp=byName('part',$('wPart').value),ce=byName('equip',$('wEquip').value);if(!(cp&&x.partIds.includes(cp.id))&&x.partIds.length)$('wPart').value=nm('part',x.partIds[0]);if(!(ce&&x.equipIds.includes(ce.id))&&x.equipIds.length)$('wEquip').value=nm('equip',x.equipIds[0]);
 const last=[...S.logs].filter(l=>l.exId===x.id).sort((a,b)=>a.date.localeCompare(b.date)).pop();
 if(last){if(isCar(x)){['dist','time','inc','spd'].forEach(k=>$('w'+k[0].toUpperCase()+k.slice(1)).value=last[k]??'');}else{let w=last.w;if((last.u||'kg')!==S.unit)w=+(S.unit==='lb'?toKg(last)/0.453592:toKg(last)).toFixed(1);$('wW').value=w;$('wR').value=last.reps;$('wS').value=last.sets;}}
 refreshDL();});
$('wEx').addEventListener('focus',()=>{if($('wEx').value)return;const e=byName('equip',$('wEquip').value),p=byName('part',$('wPart').value);if(e||p)$('dlEx').innerHTML=$('dlEx').innerHTML;});
['wDist','wTime'].forEach(i=>$(i).addEventListener('input',calcPace));
function calcPace(){const d=+$('wDist').value,t=+$('wTime').value;$('wPace').value=fmtPace(d,t);if(d>0&&t>0)$('wSpd').placeholder=(d/(t/60)).toFixed(1);}
function clr(id){$(id).value='';refreshDL();$(id).focus();}
function newEx(){['wEquip','wPart','wEx','wW','wR','wS','wDist','wTime','wPace','wSpd','wInc','wKcal','wHR'].forEach(i=>$(i).value='');refreshDL();$('wEx').focus();}
function toggleUnit(){S.unit=S.unit==='lb'?'kg':'lb';const w=+$('wW').value;if(w)$('wW').value=+(S.unit==='lb'?w/0.453592:w*0.453592).toFixed(1);save();refreshDL();}
function renderMode(){const x=byName('ex',$('wEx').value),p=byName('part',$('wPart').value),car=isCar(x)||(!x&&p&&p.cardio==='ใช่');
 $('wStr').style.display=car?'none':'';$('wCar').style.display=car?'':'none';$('uBtn').textContent='('+(S.unit==='lb'?'lbs':'kg')+') ⇄';
 if(!x){$('wHist').innerHTML='';return;}const h=S.logs.filter(l=>l.exId===x.id).sort((a,b)=>b.date.localeCompare(a.date));
 $('wHist').innerHTML=h.length?`<div class="hist"><div class="muted">📜 ประวัติ ${esc(x.name)} (${h.length} ครั้ง)</div><table>`+h.slice(0,8).map(l=>`<tr class="ed" onclick="editLog('${l.id}')"><td>${l.date}${l.time?' <span class="muted">'+l.time+'</span>':''}</td><td>${esc(fmtLog(l))}</td><td class="muted">${esc(nm('equip',l.equipId))}</td></tr>`).join('')+'</table></div>':'<div class="muted" style="margin-top:8px">ยังไม่เคยเล่นท่านี้</div>';}
function clearFilter(){newEx();}
function addLog(){if(!$('wEx').value.trim())return alert('ใส่ท่าก่อน');
 const b=getOrCreate('brand',$('wBrand').value);let g=null;if($('wGym').value.trim()){g=findGym(b?.id,$('wGym').value);if(!g){g={id:uid('g'),name:$('wGym').value.trim(),brandId:b?.id||null};M('gym').push(g);}}const e=getOrCreate('equip',$('wEquip').value),p=getOrCreate('part',$('wPart').value);
 const x=getOrCreate('ex',$('wEx').value,{partIds:[],equipIds:[]});
 if(p&&!x.partIds.includes(p.id))x.partIds.push(p.id);if(e&&!x.equipIds.includes(e.id))x.equipIds.push(e.id);
 S.lastGym=g?.id||null;
 const rec={id:uid('w'),date:$('wDate').value||today(),time:new Date().toTimeString().slice(0,5),ts:new Date().toISOString(),gymId:g?.id||null,exId:x.id,partId:p?.id||x.partIds[0]||null,equipId:e?.id||x.equipIds[0]||null,note:$('wNote').value};
 if(isCar(x)||(p&&p.cardio==='ใช่')){const d=nv('wDist'),t=nv('wTime');Object.assign(rec,{w:0,reps:0,sets:0,dist:d,time:t,spd:nv('wSpd')??(d&&t?+(d/(t/60)).toFixed(1):null),inc:nv('wInc'),kcal:nv('wKcal'),hr:nv('wHR')});}
 else Object.assign(rec,{w:+$('wW').value||0,u:S.unit,reps:+$('wR').value||0,sets:+$('wS').value||0});
 S.logs.push(rec);
 $('wNote').value='';save();renderAll();startTimer(S.rest);}
// ---------- body map ----------
const ZN=['อก','หลัง','ไหล่','ไบเซ็ป','ไตรเซ็ป','ท้อง','ขา'];
const HD=[['circle','cx="50" cy="16" r="11"',''],['rect','x="45" y="26" width="10" height="9"',''],['ellipse','cx="31" cy="46" rx="9" ry="8"','ไหล่'],['ellipse','cx="69" cy="46" rx="9" ry="8"','ไหล่'],['rect','x="19" y="83" width="8" height="28" rx="4"',''],['rect','x="73" y="83" width="8" height="28" rx="4"',''],['rect','x="38.5" y="163" width="9.5" height="40" rx="5"','ขา'],['rect','x="52" y="163" width="9.5" height="40" rx="5"','ขา']];
const BODY={f:[...HD,['rect','x="37" y="40" width="12.5" height="22" rx="5"','อก'],['rect','x="50.5" y="40" width="12.5" height="22" rx="5"','อก'],['rect','x="39" y="64" width="22" height="36" rx="5"','ท้อง'],['rect','x="22" y="55" width="9" height="26" rx="4.5"','ไบเซ็ป'],['rect','x="69" y="55" width="9" height="26" rx="4.5"','ไบเซ็ป'],['rect','x="38" y="101" width="24" height="11" rx="4"',''],['rect','x="37" y="114" width="12" height="46" rx="6"','ขา'],['rect','x="51" y="114" width="12" height="46" rx="6"','ขา']],
 b:[...HD,['rect','x="37" y="40" width="26" height="44" rx="6"','หลัง'],['rect','x="39" y="86" width="22" height="14" rx="4"','หลัง'],['rect','x="22" y="55" width="9" height="26" rx="4.5"','ไตรเซ็ป'],['rect','x="69" y="55" width="9" height="26" rx="4.5"','ไตรเซ็ป'],['rect','x="37" y="101" width="26" height="18" rx="7"','ขา'],['rect','x="37" y="121" width="12" height="39" rx="6"','ขา'],['rect','x="51" y="121" width="12" height="39" rx="6"','ขา']]};
function bodySVG(heat,sel,click){const mx=Math.max(1,...Object.values(heat));
 const sh=(arr,dx)=>arr.map(([t,a,z])=>{const h=z?(heat[z]||0)/mx:0,fill=z&&h>0?`rgba(239,68,68,${(.25+.75*h).toFixed(2)})`:'var(--sec)',on=z&&sel.has(z);
  return `<${t} ${a} transform="translate(${dx},0)" style="fill:${fill};stroke:${on?'#eab308':'var(--line)'};stroke-width:${on?2.2:.6}${z&&click?';cursor:pointer':''}"${z&&click?` onclick="${click}('${z}')"`:''}><title>${z?z+' · '+(heat[z]||0)+' set':''}</title></${t}>`;}).join('');
 return `<svg viewBox="0 0 210 214" style="width:100%;max-width:320px;display:block;margin:auto">${sh(BODY.f,0)}${sh(BODY.b,110)}<text x="50" y="213" text-anchor="middle" style="font-size:8px;fill:var(--mu)">ด้านหน้า</text><text x="160" y="213" text-anchor="middle" style="font-size:8px;fill:var(--mu)">ด้านหลัง</text></svg>`
  +`<div class="sum" style="justify-content:center">${ZN.filter(z=>heat[z]).map(z=>`<span>${z} ${heat[z]} set</span>`).join('')||'<span class="muted">ยังไม่มีข้อมูล</span>'}</div>`;}
const zOfPart=id=>{const z=(byId('part',id)||{}).zone;return z&&z!=='-'?z:null;};
function zoneHeat(L){const h={};L.forEach(l=>{const z=zOfPart(l.partId);if(z)h[z]=(h[z]||0)+(l.sets||1);});return h;}
const daysAgo=d=>Math.round((new Date(today())-new Date(d))/864e5);
function renderWMap(){const d7=new Date();d7.setDate(d7.getDate()-6);const from=d7.toLocaleDateString('sv');
 const sel=new Set(),p=byName('part',$('wPart').value),x=byName('ex',$('wEx').value);
 if(p&&zOfPart(p.id))sel.add(zOfPart(p.id));if(x)x.partIds.forEach(i=>zOfPart(i)&&sel.add(zOfPart(i)));
 $('wMap').innerHTML=bodySVG(zoneHeat(S.logs.filter(l=>l.date>=from)),sel,'wMapClick');}
function wMapClick(z){const p=M('part').find(x=>x.zone===z);if(!p)return;$('wPart').value=p.name;$('wEx').value='';refreshDL();$('wEx').focus();}
function hMapClick(z){const p=M('part').find(x=>x.zone===z&&S.logs.some(l=>l.partId===x.id));if(p){HV.id=p.id;renderLogs();}}
// ---------- history / report ----------
const HV={m:'day',id:'',r:'90'};
function inRange(d){if(HV.r==='all')return true;const t=new Date();t.setDate(t.getDate()-+HV.r);return d>=t.toLocaleDateString('sv');}
const logRow=(l,sub)=>`<tr class="ed" onclick="editLog('${l.id}')"><td><b>${esc(sub?nm('ex',l.exId):nm('ex',l.exId))}</b><div class="muted">${l.time?'🕒 '+l.time+' · ':''}${esc(nm('part',l.partId))} · ${esc(nm('equip',l.equipId))}${l.note?' · '+esc(l.note):''}</div></td><td colspan="2">${esc(fmtLog(l))}</td><td><button class="del" onclick="event.stopPropagation();delRec('logs','${l.id}')">✕</button></td></tr>`;
const vol=a=>Math.round(a.reduce((s,l)=>s+toKg(l)*(l.reps||0)*(l.sets||0),0));
function byDate(L){const g={};[...L].sort((a,b)=>b.date.localeCompare(a.date)).forEach(l=>(g[l.date]=g[l.date]||[]).push(l));return g;}
function renderLogs(){const L=S.logs.filter(l=>inRange(l.date)),out=$('logList');$('hMap').innerHTML='';
 $('hId').style.display=HV.m==='day'?'none':'';
 if(HV.m!=='day'){const k=HV.m==='ex'?'exId':'partId',ids=new Set(L.map(l=>l[k]).filter(Boolean)),list=M(HV.m==='ex'?'ex':'part').filter(x=>ids.has(x.id)).sort((a,b)=>a.name.localeCompare(b.name,'th'));
  if(!list.some(x=>x.id===HV.id))HV.id=list[0]?.id||'';$('hId').innerHTML=list.map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('')||'<option value="">-</option>';$('hId').value=HV.id;}
 if(HV.m==='day'){const g=byDate(L);
  out.innerHTML=Object.keys(g).map(d=>{const km=+g[d].reduce((s,l)=>s+(l.dist||0),0).toFixed(2),gy=[...new Set(g[d].map(l=>gymName(l.gymId)).filter(Boolean))].join(', '),
   zs=[...new Set(g[d].map(l=>nm('part',l.partId)).filter(Boolean))].join(', ');
   return `<div class="day">${d} <span class="muted">${esc(zs)}${gy?' · '+esc(gy):''} · ${g[d].reduce((s,l)=>s+(l.sets||0),0)} set · ${vol(g[d]).toLocaleString()} กก.${km?' · '+km+' กม.':''}</span></div><table>`+g[d].map(l=>logRow(l)).join('')+'</table>';}).join('')||'<div class="muted">ยังไม่มีข้อมูล</div>';return;}
 if(HV.m==='part'){
  const A=L.filter(l=>l.partId===HV.id);if(!A.length){out.innerHTML='<div class="muted">ยังไม่มีข้อมูล</div>';return;}
  const g=byDate(A),ds=Object.keys(g),wk=Math.max(1,(daysAgo(ds[ds.length-1])+1)/7);
  out.innerHTML=`<div class="sum"><span>เล่น ${ds.length} วัน</span><span>ล่าสุด ${daysAgo(ds[0])===0?'วันนี้':daysAgo(ds[0])+' วันก่อน'}</span><span>${(ds.length/wk).toFixed(1)} ครั้ง/สัปดาห์</span><span>${A.reduce((s,l)=>s+(l.sets||0),0)} set</span><span>${vol(A).toLocaleString()} กก.</span></div>`+
   ds.map(d=>`<div class="day">${d} <span class="muted">${g[d].reduce((s,l)=>s+(l.sets||0),0)} set · ${vol(g[d]).toLocaleString()} กก.</span></div><table>`+g[d].map(l=>logRow(l)).join('')+'</table>').join('');return;}
 const x=byId('ex',HV.id),A=L.filter(l=>l.exId===HV.id).sort((a,b)=>a.date.localeCompare(b.date));if(!A.length){out.innerHTML='<div class="muted">ยังไม่มีข้อมูล</div>';return;}
 const days={};A.forEach(l=>(days[l.date]=days[l.date]||[]).push(l));const car=A.some(l=>l.dist!=null||l.time!=null);let best=-1,pr=0;
 const rows=Object.keys(days).map(d=>{const a=days[d];let v,lbl;
  if(car){const dist=a.reduce((s,l)=>s+(l.dist||0),0),tm=a.reduce((s,l)=>s+(l.time||0),0);v=dist;lbl=`${+dist.toFixed(2)} กม. · ${+tm.toFixed(1)} นาที${dist&&tm?' · '+fmtPace(dist,tm):''}`;}
  else{const w=Math.max(...a.map(toKg)),rm=Math.max(...a.map(l=>toKg(l)*(1+(l.reps||0)/30)));v=+w.toFixed(1);lbl=`สูงสุด ${v} กก. · 1RM≈${rm.toFixed(1)} · ${vol(a).toLocaleString()} กก. · ${a.map(l=>(l.reps||0)+'×'+(l.sets||0)).join(', ')}`;}
  const isPR=v>best&&best>=0;if(v>best){if(best>=0)pr++;best=v;}return {d,v,lbl,isPR,a};});
 const f=rows[0].v,lt=rows[rows.length-1].v,u=car?'กม.':'กก.';
 $('hMap').innerHTML=`<canvas id="hC" style="margin-top:8px"></canvas><div class="muted" id="hCi"></div>`;line($('hC'),rows.map(r=>({x:r.d,y:r.v})),$('hCi'),u);
 out.innerHTML=`<div class="sum"><span>${rows.length} ครั้ง</span><span>เริ่ม ${f} → ล่าสุด ${lt} ${u} (${lt-f>=0?'+':''}${+(lt-f).toFixed(1)})</span><span>สูงสุด ${best} ${u}</span><span class="pr">🏆 PR ${pr} ครั้ง</span></div><table>`+
  [...rows].reverse().map(r=>`<tr class="ed" onclick="editLog('${r.a[0].id}')"><td>${r.d}${r.isPR?' <span class="pr">🏆PR</span>':''}</td><td>${esc(r.lbl)}</td></tr>`).join('')+'</table>';}
async function delRec(k,id){if(await uiConfirm('ลบรายการนี้?')){S[k]=S[k].filter(l=>l.id!==id);save();renderAll();}}
// ---------- food ----------
$('fFood').addEventListener('input',()=>{const f=byName('food',$('fFood').value);if(f){$('fK').value=f.k??'';$('fP').value=f.p??'';$('fC').value=f.c??'';$('fF').value=f.f??'';}});
const nv=id=>$(id).value===''?null:+$(id).value;
function addFood(){const n=$('fFood').value.trim();if(!n)return alert('ใส่ชื่ออาหารก่อน');
 const f=getOrCreate('food',n);f.k=nv('fK');f.p=nv('fP');f.c=nv('fC');f.f=nv('fF');
 S.food.push({id:uid('f'),date:$('fDate').value||today(),meal:$('fMeal').value,foodId:f.id,qty:+$('fQty').value||1,k:f.k,p:f.p,c:f.c,f:f.f});
 $('fFood').value='';$('fQty').value=1;['fK','fP','fC','fF'].forEach(i=>$(i).value='');save();renderAll();}
const fsum=(arr,k)=>+arr.reduce((s,r)=>s+(r[k]||0)*r.qty,0).toFixed(1);
function renderFood(){const d=$('fDate').value||today(),l=S.food.filter(r=>r.date===d);
 $('fTot').innerHTML=`<span>🔥 ${fsum(l,'k')} kcal</span><span>P ${fsum(l,'p')} g</span><span>C ${fsum(l,'c')} g</span><span>F ${fsum(l,'f')} g</span>`;
 $('foodList').innerHTML=l.length?'<table>'+l.map(r=>`<tr class="ed" onclick="editFood('${r.id}')"><td><b>${esc(nm('food',r.foodId))}</b> ×${r.qty}<div class="muted">${r.meal}</div></td><td>${+((r.k||0)*r.qty).toFixed(0)} kcal</td><td class="muted">P${+((r.p||0)*r.qty).toFixed(1)} C${+((r.c||0)*r.qty).toFixed(1)} F${+((r.f||0)*r.qty).toFixed(1)}</td><td><button class="del" onclick="event.stopPropagation();delRec('food','${r.id}')">✕</button></td></tr>`).join('')+'</table>':'<div class="muted" style="margin-top:8px">ยังไม่มีรายการ</div>';}
// ---------- body ----------
const BF=[['g','พื้นฐาน'],['weight','น้ำหนัก (กก.)'],['height','ส่วนสูง (ซม.)'],['fat','% Fat'],['fatMass','Body Fat Mass (กก.)','ว่าง=คำนวณ'],['lbm','Lean Body Mass (กก.)','ว่าง=คำนวณ'],['muscle','Skeletal Muscle Mass (กก.)'],['visceral','Visceral Fat Level'],['waist','รอบท้อง (ซม.)'],['whr','Waist-Hip Ratio'],
 ['g','องค์ประกอบ'],['protein','Protein (กก.)'],['mineral','Mineral (กก.)'],['tbw','Total Body Water (กก.)'],['icf','ICF (กก.)'],['ecf','ECF (กก.)'],['subFat','Subcutaneous Fat (กก.)'],['visFatMass','Visceral Fat Mass (กก.)'],['vfa','Visceral Fat Area (cm²)'],
 ['muscleTotal','Muscle Mass รวม (กก.)'],['hr','Heart Rate (bpm)'],['score','Body Score'],['g','พลังงาน/คะแนน'],['bmr','BMR (kcal)'],['tee','TEE (kcal)'],['bioAge','Bio Age'],['bwi','BWI Score'],
 ['g','Segmental (Lean / Fat กก.)'],['laL','แขนซ้าย Lean'],['laF','แขนซ้าย Fat'],['raL','แขนขวา Lean'],['raF','แขนขวา Fat'],['trL','ลำตัว Lean'],['trF','ลำตัว Fat'],['llL','ขาซ้าย Lean'],['llF','ขาซ้าย Fat'],['rlL','ขาขวา Lean'],['rlF','ขาขวา Fat']];
const BK=BF.filter(f=>f[0]!=='g').map(f=>f[0]),BL=k=>BF.find(f=>f[0]===k)[1];
$('bForm').innerHTML=(()=>{let h='',o=false;BF.forEach(f=>{if(f[0]==='g'){if(o)h+='</div>';h+=`<div class="day">${f[1]}</div><div class="row">`;o=true;}else h+=`<div><label>${f[1]}</label><input type="number" step="any" id="b_${f[0]}" placeholder="${f[2]||''}"></div>`;});return h+'</div>';})();
$('cBody').insertAdjacentHTML('afterbegin',['bmi',...BK.filter(k=>k!=='height')].map(k=>`<option value="${k}">${k==='bmi'?'BMI':BL(k)}</option>`).join(''));$('cBody').value='weight';
function addBody(){const o={id:uid('b'),date:$('bDate').value||today()};BK.forEach(k=>o[k]=nv('b_'+k));
 o.height=o.height??([...S.body].reverse().find(b=>b.height)||{}).height??null;
 if(o.fatMass==null&&o.weight&&o.fat!=null)o.fatMass=+(o.weight*o.fat/100).toFixed(1);if(o.lbm==null&&o.weight&&o.fatMass!=null)o.lbm=+(o.weight-o.fatMass).toFixed(1);
 S.body.push(o);BK.forEach(k=>k!=='height'&&($('b_'+k).value=''));save();renderAll();}
const bmi=b=>b.weight&&b.height?+(b.weight/((b.height/100)**2)).toFixed(1):null,v=x=>x??'-';
const BCOL=['weight','fat','fatMass','lbm','muscle','visceral','waist'];
function renderBody(){const l=[...S.body].sort((a,b)=>b.date.localeCompare(a.date));if(l[0]?.height)$('b_height').value=l[0].height;
 $('bodyList').innerHTML=l.length?`<table><tr><th>วันที่</th><th>น้ำหนัก</th><th>BMI</th><th>%Fat</th><th>FM</th><th>LBM</th><th>SMM</th><th>VF</th><th>ท้อง</th><th></th></tr>`+
 l.map(b=>`<tr class="ed" onclick="editBody('${b.id}')"><td>${b.date}</td><td>${v(b.weight)}</td><td>${v(bmi(b))}</td>${BCOL.slice(1).map(k=>`<td>${v(b[k])}</td>`).join('')}<td><button class="del" onclick="event.stopPropagation();delRec('body','${b.id}')">✕</button></td></tr>`).join('')+'</table><div class="muted">แตะแถวเพื่อดู/แก้ไขทุกค่า</div>':'<div class="muted">ยังไม่มีข้อมูล</div>';}
function showBody(id){const b=S.body.find(x=>x.id===id);alert(b.date+'\n'+BK.filter(k=>b[k]!=null).map(k=>BL(k)+': '+b[k]).join('\n'));}
// ---------- timer ----------
let tInt,tEnd;
function startTimer(s){stopTimer();tEnd=Date.now()+s*1000;tick();tInt=setInterval(tick,250);}
function stopTimer(){clearInterval(tInt);$('timer').textContent='00:00';$('timer').style.color='';}
function tick(){const r=Math.max(0,Math.ceil((tEnd-Date.now())/1000));$('timer').textContent=String(r/60|0).padStart(2,'0')+':'+String(r%60).padStart(2,'0');
 $('timer').style.color=r<=10?'#f87171':'';if(!r){clearInterval(tInt);beep();try{navigator.vibrate&&navigator.vibrate([300,100,300]);}catch(e){}}}
function beep(){try{const c=new AudioContext();[0,.35,.7].forEach(t=>{const o=c.createOscillator();o.frequency.value=880;o.connect(c.destination);o.start(c.currentTime+t);o.stop(c.currentTime+t+.2);});}catch(e){}}
// ---------- charts ----------
function line(cv,pts,info,unit){const r=devicePixelRatio||1,W=cv.clientWidth||300,H=cv.clientHeight||220;cv.width=W*r;cv.height=H*r;const c=cv.getContext('2d');c.scale(r,r);c.clearRect(0,0,W,H);
 if(!pts.length){c.fillStyle='#94a3b8';c.fillText('ยังไม่มีข้อมูล',W/2-30,H/2);info.textContent='';return;}
 const ys=pts.map(p=>p.y);let mn=Math.min(...ys),mx=Math.max(...ys);if(mn===mx){mn-=1;mx+=1;}const pd=(mx-mn)*.1;mn-=pd;mx+=pd;
 const L=44,R=10,T=10,B=24,X=i=>L+(pts.length===1?(W-L-R)/2:i*(W-L-R)/(pts.length-1)),Y=y=>T+(mx-y)/(mx-mn)*(H-T-B);
 const cs=getComputedStyle(document.body);c.strokeStyle=cs.getPropertyValue('--line');c.fillStyle=cs.getPropertyValue('--mu');c.font='11px sans-serif';
 for(let i=0;i<=4;i++){const y=mn+(mx-mn)*i/4;c.beginPath();c.moveTo(L,Y(y));c.lineTo(W-R,Y(y));c.stroke();c.fillText(y.toFixed(1),2,Y(y)+4);}
 {const yr=pts[0].x.slice(0,4)!==pts[pts.length-1].x.slice(0,4),fd=d=>{const[y,m,dd]=d.split('-');return yr?dd+'/'+m+'/'+y.slice(2):dd+'/'+m;},
  n=Math.min(pts.length,Math.max(2,Math.floor((W-L-R)/70))),used=new Set();c.textAlign='center';
  for(let k=0;k<n;k++){const i=n===1?0:Math.round(k*(pts.length-1)/(n-1));if(used.has(i))continue;used.add(i);
   const x=Math.min(W-R-22,Math.max(L+22,X(i)));c.beginPath();c.moveTo(X(i),H-B);c.lineTo(X(i),H-B+3);c.stroke();c.fillText(fd(pts[i].x),x,H-6);}
  c.textAlign='left';}
 c.strokeStyle=cs.getPropertyValue('--ac2');c.lineWidth=2;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(X(i),Y(p.y)):c.moveTo(X(i),Y(p.y)));c.stroke();
 c.fillStyle=cs.getPropertyValue('--ac2');pts.forEach((p,i)=>{c.beginPath();c.arc(X(i),Y(p.y),3,0,7);c.fill();});
 cv._pts=pts.map((p,i)=>({x:X(i),y:Y(p.y),d:p.x,v:p.y}));cv._u=unit;
 if(!cv._tip){cv._tip=1;const tip=document.createElement('div');tip.style.cssText='position:fixed;pointer-events:none;background:var(--card);border:1px solid var(--line);color:var(--tx);border-radius:8px;padding:4px 8px;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.2);display:none;z-index:99;white-space:nowrap';document.body.appendChild(tip);
  const mv=e=>{const r=cv.getBoundingClientRect(),t=e.touches?e.touches[0]:e,mx=t.clientX-r.left;let b=null,bd=1e9;(cv._pts||[]).forEach(p=>{const dd=Math.abs(p.x-mx);if(dd<bd){bd=dd;b=p;}});
   if(!b||bd>30){tip.style.display='none';return;}tip.innerHTML=`<b>${b.d}</b><br>${b.v} ${cv._u||''}`;tip.style.display='block';tip.style.left=(r.left+b.x+10)+'px';tip.style.top=(r.top+b.y-40)+'px';};
  cv.addEventListener('mousemove',mv);cv.addEventListener('touchstart',mv,{passive:true});cv.addEventListener('mouseleave',()=>tip.style.display='none');}
 const last=pts[pts.length-1].y,d=last-pts[0].y;info.textContent=`ล่าสุด ${last} ${unit} · เปลี่ยนแปลง ${d>0?'+':''}${d.toFixed(1)} ${unit} (${pts.length} ครั้ง)`;}
function drawCharts(){const ids=[...new Set(S.logs.map(l=>l.exId))],cur=$('cEx').value;
 $('cEx').innerHTML=ids.map(id=>`<option value="${id}"${id===cur?' selected':''}>${esc(nm('ex',id))}</option>`).join('');
 const m={};S.logs.filter(l=>l.exId===$('cEx').value).forEach(l=>m[l.date]=Math.max(m[l.date]||0,l.dist!=null?l.dist:+toKg(l).toFixed(1)));
 line($('c1'),Object.keys(m).sort().map(d=>({x:d,y:m[d]})),$('c1i'),'กก.');
 const k=$('cBody').value;let pts;
 if(k.startsWith('f:')){const f=k.slice(2),g={};S.food.forEach(r=>g[r.date]=(g[r.date]||0)+(r[f]||0)*r.qty);pts=Object.keys(g).sort().map(d=>({x:d,y:+g[d].toFixed(1)}));}
 else pts=[...S.body].sort((a,b)=>a.date.localeCompare(b.date)).map(b=>({x:b.date,y:k==='bmi'?bmi(b):b[k]})).filter(p=>p.y!=null);
 line($('c2'),pts,$('c2i'),'');}
// ---------- settings (id masters) ----------
const used=(t,id)=>t==='brand'?M('gym').some(g=>g.brandId===id):t==='food'?S.food.some(r=>r.foodId===id):S.logs.some(l=>l[t+'Id']===id)||(t==='part'||t==='equip')&&M('ex').some(x=>(x[t+'Ids']||[]).includes(id));
function renderSet(){renderGymSet();['part','equip','food'].forEach(t=>$('s-'+t).innerHTML=M(t).map(x=>`<span class="chip" onclick="editM('${t}','${x.id}')">${esc(t==='gym'?gymName(x.id):x.name)}</span>`).join('')+`<div class="row"><input id="add-${t}" placeholder="เพิ่ม"><button style="margin:0" onclick="addM('${t}')">+</button></div>`);
 const so=(t,sel)=>'<option value="">-</option>'+M(t).map(x=>`<option value="${x.id}"${x.id===sel?' selected':''}>${esc(x.name)}</option>`).join('');
 renderExT();
 $('sRest').value=S.rest;}
function renderGymSet(){const nb=M('gym').filter(g=>!g.brandId||!byId('brand',g.brandId));
 const blk=(b)=>{const gs=M('gym').filter(g=>b?g.brandId===b.id:nb.includes(g));
  return `<div class="hist" style="margin-top:8px"><div style="display:flex;justify-content:space-between;align-items:center"><b ${b?`class="ed" style="cursor:pointer" onclick="editM('brand','${b.id}')"`:''}>${b?'🏢 '+esc(b.name)+' ✎':'ไม่ระบุยิม'}</b><span class="muted">${gs.length} สาขา</span></div>`+
  gs.map(g=>`<span class="chip" onclick="editM('gym','${g.id}')">📍 ${esc(g.name)}</span>`).join('')+
  (b?`<div class="row" style="margin-top:6px"><input id="addBr-${b.id}" placeholder="+ เพิ่มสาขา"><button style="margin:0" onclick="addBranch('${b.id}')">+</button></div>`:'')+'</div>';};
 $('s-brand').innerHTML=M('brand').map(blk).join('')+(nb.length?blk(null):'')+`<div class="row" style="margin-top:8px"><input id="add-brand" placeholder="เพิ่มชื่อยิม เช่น Jetts"><button style="margin:0" onclick="addM('brand')">+</button></div>`;}
function addBranch(bid){const n=$('addBr-'+bid).value.trim();if(!n)return;if(findGym(bid,n))return toast('มีสาขานี้แล้ว');M('gym').push({id:uid('g'),name:n,brandId:bid});save();renderAll();}
function addM(t){const n=$('add-'+t).value.trim();if(!n)return;if(byName(t,n))return toast('มีอยู่แล้ว');getOrCreate(t,n,t==='ex'?{partIds:[],equipIds:[]}:{});save();renderAll();}
async function delM(t,id){if(used(t,id))return alert('ลบไม่ได้: ถูกใช้งานอยู่ (เปลี่ยนชื่อได้)');if(await uiConfirm('ลบ "'+nm(t,id)+'"?')){S.m[t]=M(t).filter(x=>x.id!==id);save();renderAll();}}
function setEx(id,k,val){byId('ex',id)[k]=val||null;save();refreshDL();}
// ---------- CSV (masters + records, all by id) ----------
const COLS=['type','id','name','date','gymId','exId','partId','equipId','w','reps','sets','note','u','dist','time','spd','inc','kcal','hr','cardio','zone','brandId','partIds','equipIds',...BK,'meal','foodId','qty','k','p','c','f'];
const q=x=>{x=Array.isArray(x)?x.join('|'):String(x??'');return /[",\n]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x;};
function exportCSV(){const rows=[COLS.join(',')],put=(t,o)=>rows.push(COLS.map(c=>q(c==='type'?t:o[c])).join(','));
 ['brand','gym','part','equip','ex','food'].forEach(t=>M(t).forEach(o=>put('m:'+t,o)));
 S.logs.forEach(o=>put('workout',o));S.body.forEach(o=>put('body',o));S.food.forEach(o=>put('food',o));
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+rows.join('\n')],{type:'text/csv'}));
 a.download='gymman_'+new Date().toISOString().slice(0,16).replace(/[-:T]/g,'')+'.csv';document.body.appendChild(a);a.click();a.remove();}
function parseCSV(t){const r=[];let row=[],f='',iq=false;for(let i=0;i<t.length;i++){const ch=t[i];
 if(iq){if(ch=='"'){if(t[i+1]=='"'){f+='"';i++;}else iq=false;}else f+=ch;}
 else if(ch=='"')iq=true;else if(ch==','){row.push(f);f='';}else if(ch=='\n'){row.push(f.replace(/\r$/,''));r.push(row);row=[];f='';}else f+=ch;}
 if(f||row.length){row.push(f);r.push(row);}return r;}
const NUM=['w','reps','sets','dist','time','spd','inc','kcal','hr',...BK,'qty','k','p','c','f'];
const FIELDS={workout:['id','date','gymId','exId','partId','equipId','w','u','reps','sets','dist','time','spd','inc','kcal','hr','note'],body:['id','date',...BK],food:['id','date','meal','foodId','qty','k','p','c','f'],
 'm:brand':['id','name'],'m:gym':['id','name','brandId'],'m:part':['id','name','cardio','zone'],'m:equip':['id','name'],'m:ex':['id','name','partIds','equipIds'],'m:food':['id','name','k','p','c','f']};
async function importCSV(file){if(!file)return;const rows=parseCSV((await file.text()).replace(/^\ufeff/,''));const h=rows.shift();let n=0;
 rows.forEach(r=>{const t=r[h.indexOf('type')];if(!FIELDS[t])return;const o={};
  FIELDS[t].forEach(c=>{const i=h.indexOf(c),val=i<0?'':(r[i]??'');o[c]=c.endsWith('Ids')?(val?val.split('|'):[]):NUM.includes(c)?(val===''?null:+val):(val===''&&c.endsWith('Id')?null:val);});
  if(!o.id)return;const arr=t.startsWith('m:')?S.m[t.slice(2)]:t==='workout'?S.logs:S[t];
  const i=arr.findIndex(x=>x.id===o.id);i>=0?arr[i]=o:arr.push(o);n++;});
 normEx();save();renderAll();alert('นำเข้า '+n+' รายการ');}

// ---------- modal editor ----------
let MF=null;
const selO=(t,sel,blank=true)=>(blank?'<option value="">-</option>':'')+M(t).map(x=>`<option value="${x.id}"${x.id===sel?' selected':''}>${esc(t==='gym'?gymName(x.id):x.name)}</option>`).join('');
function openM(title,fields,val,onSave,onDel){$('mT').textContent=title;
 $('mB').innerHTML=fields.map(f=>f.g?`<div class="day">${f.g}</div>`:`<label>${f.l}</label>`+(f.t==='multi'?`<div id="m_${f.k}">${M(f.m).map(x=>`<label class="ck"><input type="checkbox" value="${x.id}"${(val[f.k]||[]).includes(x.id)?' checked':''}>${esc(x.name)}</label>`).join('')}</div>`:f.t==='sel'?`<select id="m_${f.k}">${f.o?f.o.map(o=>`<option${o===val[f.k]?' selected':''}>${o}</option>`).join(''):selO(f.m,val[f.k])}</select>`
  :`<input id="m_${f.k}" type="${f.t||'number'}" ${(f.t||'number')==='number'?'step="any" inputmode="decimal"':''} value="${esc(val[f.k]??'')}">`)).join('');
 MF={fields,onSave};$('mDel').style.display=onDel?'':'none';$('mDel').onclick=async()=>{if(await uiConfirm('ยืนยันลบ?')){onDel();closeM();}};$('modal').classList.add('show');}
function closeM(){$('modal').classList.remove('show');MF=null;}
function mSave(){const o={};MF.fields.forEach(f=>{if(f.g)return;if(f.t==='multi'){o[f.k]=[...document.querySelectorAll('#m_'+f.k+' input:checked')].map(i=>i.value);return;}const v=$('m_'+f.k).value;o[f.k]=(f.t||'number')==='number'?(v===''?null:+v):(f.t==='sel'&&f.m&&v===''?null:v);});
 if(MF.onSave(o)===false)return;save();closeM();renderAll();}
function toast(m){uiAlert(m);}
let DR=null;
function uiDlg(msg,o={}){return new Promise(r=>{$('dT').textContent=o.title||'แจ้งเตือน';$('dM').textContent=msg;$('dC').style.display=o.cancel?'':'none';
 const b=$('dO');b.textContent=o.ok||'ตกลง';b.className=o.danger?'del':'';$('dlg').classList.add('show');DR=v=>{$('dlg').classList.remove('show');DR=null;r(v);};});}
const uiAlert=m=>uiDlg(m),uiConfirm=(m,ok='ลบ')=>uiDlg(m,{title:'ยืนยัน',ok,cancel:true,danger:true});
window.alert=uiAlert;
document.addEventListener('keydown',e=>{if(DR){if(e.key==='Enter'){e.preventDefault();DR(true);}else if(e.key==='Escape')DR(false);return;}
 if($('modal').classList.contains('show')){if(e.key==='Escape')closeM();else if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'){e.preventDefault();mSave();}}});
// ---------- exercise table (filter/search/sort) ----------
const XF={q:'',p:'',e:'',k:'name',d:1};
const exP=x=>x.partIds.map(i=>nm('part',i)).join(', '),exE=x=>x.equipIds.map(i=>nm('equip',i)).join(', ');
function exSort(k){XF.d=XF.k===k?-XF.d:1;XF.k=k;renderExT();}
function renderExT(){const fo=(id,t,lab)=>{const v=$(id).value;$(id).innerHTML=`<option value="">${lab}: ทั้งหมด</option>`+M(t).map(x=>`<option value="${x.id}">${esc(x.name)}</option>`).join('');$(id).value=v;};
 fo('xp','part','ส่วน');fo('xe','equip','อุปกรณ์');XF.p=$('xp').value;XF.e=$('xe').value;
 const ws=XF.q.toLowerCase().split(/\s+/).filter(Boolean),key={name:x=>x.name,part:exP,equip:exE};
 const l=M('ex').filter(x=>(!XF.p||x.partIds.includes(XF.p))&&(!XF.e||x.equipIds.includes(XF.e))&&ws.every(w=>(x.name+' '+exP(x)+' '+exE(x)).toLowerCase().includes(w)))
  .sort((a,b)=>key[XF.k](a).localeCompare(key[XF.k](b),'th')*XF.d);
 const h=(k,t)=>`<th class="s" onclick="exSort('${k}')">${t} ${XF.k===k?(XF.d>0?'▲':'▼'):''}</th>`;
 $('s-exT').innerHTML=`<div class="muted">${l.length} / ${M('ex').length} ท่า</div><table><tr>${h('name','ท่า')}${h('part','ส่วน')}${h('equip','อุปกรณ์')}</tr>`+
  l.map(x=>`<tr class="ed" onclick="editM('ex','${x.id}')"><td>${esc(x.name)}</td><td class="muted">${esc(exP(x))||'-'}</td><td class="muted">${esc(exE(x))||'-'}</td></tr>`).join('')+'</table>';}
function editLog(id){const l=S.logs.find(x=>x.id===id);
 openM('แก้ไขการเล่น',[{k:'date',l:'วันที่',t:'date'},{k:'gymId',l:'ยิม',t:'sel',m:'gym'},{k:'exId',l:'ท่า',t:'sel',m:'ex'},{k:'equipId',l:'อุปกรณ์',t:'sel',m:'equip'},{k:'partId',l:'ส่วน',t:'sel',m:'part'},{k:'w',l:'น้ำหนัก'},{k:'u',l:'หน่วย',t:'sel',o:['kg','lb']},{k:'reps',l:'Reps'},{k:'sets',l:'Sets'},{g:'คาร์ดิโอ'},{k:'dist',l:'ระยะทาง (กม.)'},{k:'time',l:'เวลา (นาที)'},{k:'spd',l:'ความเร็ว (กม./ชม.)'},{k:'inc',l:'ความชัน (%)'},{k:'kcal',l:'kcal'},{k:'hr',l:'Avg HR'},{k:'note',l:'หมายเหตุ',t:'text'}],
 l,o=>{if(!o.exId){toast('เลือกท่า');return false;}Object.assign(l,o);},()=>{S.logs=S.logs.filter(x=>x.id!==id);save();renderAll();});}
function editFood(id){const r=S.food.find(x=>x.id===id);
 openM('แก้ไขอาหาร',[{k:'date',l:'วันที่',t:'date'},{k:'meal',l:'มื้อ',t:'sel',o:['เช้า','กลางวัน','เย็น','ว่าง','ก่อนเล่น','หลังเล่น']},{k:'foodId',l:'อาหาร',t:'sel',m:'food'},{k:'qty',l:'จำนวน'},{k:'k',l:'kcal / หน่วย'},{k:'p',l:'Protein g / หน่วย'},{k:'c',l:'Carb g / หน่วย'},{k:'f',l:'Fat g / หน่วย'}],
 r,o=>{if(!o.foodId){toast('เลือกอาหาร');return false;}Object.assign(r,o);},()=>{S.food=S.food.filter(x=>x.id!==id);save();renderAll();});}
function editBody(id){const b=S.body.find(x=>x.id===id);
 openM('แก้ไขร่างกาย',[{k:'date',l:'วันที่',t:'date'},...BF.map(f=>f[0]==='g'?{g:f[1]}:{k:f[0],l:f[1]})],b,o=>{Object.assign(b,o);},()=>{S.body=S.body.filter(x=>x.id!==id);save();renderAll();});}
const MT={brand:'ยิม',gym:'สาขา',part:'ส่วน',equip:'อุปกรณ์',ex:'ท่า',food:'อาหาร'};
function editM(t,id){const x=byId(t,id),f=[{k:'name',l:'ชื่อ',t:'text'}];if(t==='gym')f.push({k:'brandId',l:'ยิม',t:'sel',m:'brand'});if(t==='part')f.push({k:'cardio',l:'เป็นคาร์ดิโอ (กรอกระยะทาง/เวลา)',t:'sel',o:['ไม่','ใช่']});
 if(t==='ex')f.push({k:'partIds',l:'ส่วน (เลือกได้หลายอัน)',t:'multi',m:'part'},{k:'equipIds',l:'อุปกรณ์ (เลือกได้หลายอัน)',t:'multi',m:'equip'});
 if(t==='food')f.push({k:'k',l:'kcal / หน่วย'},{k:'p',l:'Protein g'},{k:'c',l:'Carb g'},{k:'f',l:'Fat g'});
 openM('แก้ไข'+MT[t],f,x,o=>{o.name=(o.name||'').trim();if(!o.name){toast('ใส่ชื่อ');return false;}const d=t==='gym'?findGym(o.brandId,o.name):byName(t,o.name);if(d&&d.id!==id){toast('ชื่อซ้ำ');return false;}Object.assign(x,o);},
 ()=>{if(used(t,id)){setTimeout(()=>toast('ลบไม่ได้: ถูกใช้งานอยู่'),0);return;}S.m[t]=M(t).filter(y=>y.id!==id);save();renderAll();});}
function toggleTheme(){S.theme=S.theme==='light'?'dark':'light';save();applyTheme();drawCharts();}
function applyTheme(){document.body.classList.toggle('light',S.theme==='light');$('thBtn').textContent=S.theme==='light'?'🌙':'☀️';}
function renderAll(){renderSet();renderLogs();renderFood();renderBody();refreshDL();}
$('wDate').value=$('bDate').value=$('fDate').value=today();if(S.lastGym){const lg=byId('gym',S.lastGym);if(lg){$('wGym').value=lg.name;$('wBrand').value=nm('brand',lg.brandId);}}
applyTheme();renderAll();
