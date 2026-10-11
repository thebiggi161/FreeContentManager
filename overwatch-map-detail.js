(()=>{'use strict';
const grid=document.getElementById('owMapGrid');if(!grid)return;
const el=document.createElement('div');el.className='ow-detail';el.hidden=true;
el.innerHTML='<section class="ow-detail-box" role="dialog" aria-modal="true" aria-labelledby="ow-detail-title"><header class="ow-detail-head"><div><div class="eyebrow">OVERWATCH · MAP GUIDE</div><h2 id="ow-detail-title"></h2></div><button type="button" class="ow-detail-close" id="ow-detail-close" aria-label="Schließen">✕ Schließen</button></header><div class="ow-detail-inner"><div><div class="ow-detail-map" id="ow-detail-map" aria-label="Kartenbild mit selbst markierten Punkten"><img id="ow-detail-image" alt=""></div><p class="ow-detail-help" id="ow-detail-image-note"></p><div class="ow-detail-bar"><label class="ow-upload-label">Draufsicht auswählen<input type="file" id="ow-detail-upload" accept="image/*"></label><button id="ow-detail-callout" type="button">+ Callout setzen</button><button id="ow-detail-shortcut" type="button">+ Shortcut setzen</button><button id="ow-detail-clear" type="button">Markierungen löschen</button></div><p class="ow-detail-tip" id="ow-detail-status">Wähle „Callout setzen“ oder „Shortcut setzen“ und klicke dann auf die Draufsicht. Angelegte Punkte bleiben lokal in diesem Browser gespeichert.</p><div class="ow-detail-card"><h3>Callouts und Shortcuts</h3><ul class="ow-notes" id="ow-detail-annotations"></ul></div></div><div class="ow-detail-side"><section class="ow-detail-card"><h3>Team-Auswahl · 5v5</h3><label for="ow-detail-tier">Spielstil</label><select id="ow-detail-tier"><option value="casual">Casual · zugängliche Komposition</option><option value="pro">Pro · koordinierte Beispiel-Komposition</option></select><div class="ow-team" id="ow-detail-team"></div><p class="ow-map-statsnote">Strategische Beispiel-Picks, keine live geprüfte Patch-Meta oder Statistik.</p></section><section class="ow-detail-card"><h3>Strategie und Wege</h3><p id="ow-detail-tips"></p><p>Callouts und Abkürzungen brauchen genaue Ortsdaten. Markiere sie auf einer selbst hochgeladenen Draufsicht, statt auf einem Perspektivbild ungenaue Punkte zu setzen.</p></section><section class="ow-detail-card"><h3>Externe Draufsichten</h3><p>Für ausgewählte klassische Maps gibt es Draufsicht-Bilder und annotierte Varianten bei StatBanana.</p><a href="https://overwatch.statbanana.com/images" target="_blank" rel="noopener noreferrer">Draufsicht-Archiv öffnen ↗</a></section></div></div></section>';
document.body.append(el);
const $=id=>document.getElementById(id);
const modalTitle=$('ow-detail-title'), mapImage=$('ow-detail-image'), board=$('ow-detail-map'), help=$('ow-detail-image-note'), status=$('ow-detail-status'), notes=$('ow-detail-annotations');
let current=null,adding='',returnFocus=null;
const localImages=new Map();
function readMarkers(name){try{const data=JSON.parse(localStorage.getItem('ow-annotations-v1:'+name)||'[]');return Array.isArray(data)?data.filter(x=>x&&typeof x.label==='string'&&Number.isFinite(x.x)&&Number.isFinite(x.y)).slice(0,100):[]}catch{return[]}}
function saveMarkers(name,items){try{localStorage.setItem('ow-annotations-v1:'+name,JSON.stringify(items))}catch{status.textContent='Speichern im Browser nicht möglich (Speicherzugriff oder Kapazität).'}}
const compositions={
control:{casual:['Reinhardt','Soldier: 76','Mei','Moira','Lúcio'],pro:['Winston','Tracer','Genji','Ana','Lúcio'],tips:'Punktzugang, Rotationen und Kontrolle von Highground priorisieren. Die Unterkarten können sehr unterschiedliche Wege besitzen.'},
escort:{casual:['Sigma','Soldier: 76','Ashe','Mercy','Baptiste'],pro:['Winston','Tracer','Sojourn','Ana','Brigitte'],tips:'Payload-Ecken, Highground und sichere Rotationen beachten. Angreifer und Verteidiger können andere Picks benötigen.'},
hybrid:{casual:['Reinhardt','Cassidy','Soldier: 76','Moira','Lúcio'],pro:['Winston','Tracer','Sojourn','Ana','Brigitte'],tips:'Erst den Eroberungspunkt, danach Payload-Abschnitte getrennt planen. Engstellen und Flankenrouten auf der Draufsicht markieren.'},
push:{casual:['D.Va','Soldier: 76','Reaper','Kiriko','Lúcio'],pro:['Winston','Tracer','Sojourn','Kiriko','Lúcio'],tips:'Lange Rotationen um den Roboter; Spawnvorteile, Rückwege und Highground im Blick behalten.'},
flashpoint:{casual:['D.Va','Soldier: 76','Reaper','Moira','Lúcio'],pro:['Winston','Tracer','Genji','Kiriko','Lúcio'],tips:'Mobilität und schnelle Wege zwischen wechselnden Punkten sind oft wichtiger als statische Aufstellungen.'},
clash:{casual:['Reinhardt','Reaper','Mei','Moira','Lúcio'],pro:['Winston','Tracer','Sojourn','Ana','Brigitte'],tips:'Verschiebende Ziele: Rückzug und erneutes Gruppieren nach jedem eroberten oder verlorenen Punkt planen.'},
other:{casual:['D.Va','Soldier: 76','Cassidy','Kiriko','Lúcio'],pro:['Winston','Tracer','Sojourn','Ana','Brigitte'],tips:'Sondermodus: Die 5v5-Auswahl ist ein allgemeines Beispiel und möglicherweise nicht zum tatsächlichen Spielmodus passend.'}
};
const keyForMode=m=>{const v=(m||'').toLowerCase();return ['control','escort','hybrid','push','flashpoint','clash'].find(x=>v.includes(x))||'other'};
function teamRender(){
 if(!current)return;
 const mode=keyForMode(current.mode),kind=$('ow-detail-tier').value;
 const selection=compositions[mode][kind];
 const roles=['Tank','Damage','Damage','Support','Support'];
 $('ow-detail-team').replaceChildren();
 selection.forEach((name,i)=>{const card=document.createElement('div');card.className='ow-team-unit';const label=document.createElement('strong');label.textContent=name;const sub=document.createElement('span');sub.textContent=roles[i];card.append(label,sub);$('ow-detail-team').append(card)});
 $('ow-detail-tips').textContent=compositions[mode].tips;
}
function drawMarkers(){
 board.querySelectorAll('.ow-pin').forEach(n=>n.remove());
 notes.replaceChildren();
 if(!current)return;
 const points=readMarkers(current.name);
 if(!points.length){const li=document.createElement('li');li.textContent='Noch keine eigenen Markierungen für diese Karte.';notes.append(li)}
 points.forEach((item,index)=>{
  const btn=document.createElement('button');btn.type='button';btn.className='ow-pin '+(item.type==='shortcut'?'shortcut':'');btn.style.left=item.x+'%';btn.style.top=item.y+'%';btn.textContent=item.label;btn.title='Markierung entfernen: '+item.label;
  btn.addEventListener('click',e=>{e.stopPropagation();if(!confirm('Markierung „'+item.label+'“ löschen?'))return;const next=readMarkers(current.name);next.splice(index,1);saveMarkers(current.name,next);drawMarkers()});
  board.append(btn);
  const li=document.createElement('li');li.textContent=(item.type==='shortcut'?'Shortcut: ':'Callout: ')+item.label;notes.append(li);
 });
}
function openMap(name,focus){
 const data=window.owMapData?.find(m=>m.name===name);
 if(!data)return;
 current=data;adding='';returnFocus=focus;
 modalTitle.textContent=data.name+' · '+data.mode;
 const custom=localImages.get(name);
 const slug=typeof window.owMapSlug==='function'?window.owMapSlug(name):name.toLowerCase().replace(/[^a-z0-9]+/g,'_');
 mapImage.src=custom||data.image||'https://overfast-api.tekrop.fr/static/maps/'+slug+'.jpg';
 mapImage.alt=(custom?'Eigene Draufsicht für ':'Perspektiv-Vorschaubild für ')+name;
 help.textContent=custom?'Eigene Draufsicht geladen (nur für diese Browsersitzung). Markierungen liegen relativ zu diesem Bild.':'Das Bild ist eine perspektivische Vorschau, KEIN geografisch korrektes Kartenoverlay. Lade für exakte Callouts eine Draufsicht hoch.';
 status.textContent='Zum Markieren zunächst Callout oder Shortcut wählen. Punkte werden lokal im Browser gespeichert.';
 mapImage.onerror=()=>{mapImage.removeAttribute('src');help.textContent='Vorschaubild nicht erreichbar. Bitte eine passende Draufsicht hochladen.'};
 $('ow-detail-tier').value='casual';el.hidden=false;document.body.style.overflow='hidden';teamRender();drawMarkers();$('ow-detail-close').focus();
}
function close(){adding='';el.hidden=true;current=null;document.body.style.overflow='';if(returnFocus&&returnFocus.isConnected)returnFocus.focus();}
grid.addEventListener('click',e=>{const card=e.target.closest('.ow-map-card');if(!card)return;const name=card.querySelector('h3')?.textContent;if(name)openMap(name,card)});
grid.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const card=e.target.closest('.ow-map-card');if(!card)return;e.preventDefault();const name=card.querySelector('h3')?.textContent;if(name)openMap(name,card)});
/* New cards created by filtering remain keyboard accessible. */
const obs=new MutationObserver(()=>grid.querySelectorAll('.ow-map-card').forEach(card=>{card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Details zu '+(card.querySelector('h3')?.textContent||'Karte')+' öffnen')}));
obs.observe(grid,{childList:true});
$('ow-detail-close').addEventListener('click',close);
el.addEventListener('click',e=>{if(e.target===el)close()});
document.addEventListener('keydown',e=>{if(el.hidden)return;if(e.key==='Escape')close()});
$('ow-detail-tier').addEventListener('change',teamRender);
$('ow-detail-callout').addEventListener('click',()=>{adding='callout';status.textContent='Klicke auf die exakte Position des Callouts im Kartenbild.'});
$('ow-detail-shortcut').addEventListener('click',()=>{adding='shortcut';status.textContent='Klicke auf die Shortcut-Position im Kartenbild.'});
board.addEventListener('click',e=>{
 if(!adding||!current||e.target.closest('.ow-pin'))return;
 if(!localImages.has(current.name)){status.textContent='Bitte zuerst eine echte Draufsicht hochladen. Auf einem Perspektivbild werden keine falschen Positionen gesetzt.';return;}
 const bounds=board.getBoundingClientRect(),x=Math.max(0,Math.min(100,(e.clientX-bounds.left)/bounds.width*100)),y=Math.max(0,Math.min(100,(e.clientY-bounds.top)/bounds.height*100));
 const type=adding;adding='';
 const label=prompt(type==='shortcut'?'Bezeichnung des Shortcuts:':'Name des Callouts:');
 if(!label||!label.trim())return;
 const arr=readMarkers(current.name);if(arr.length>=100){status.textContent='Maximal 100 Punkte pro Map.';return;}
 arr.push({type,label:label.trim().slice(0,70),x:+x.toFixed(2),y:+y.toFixed(2)});saveMarkers(current.name,arr);drawMarkers();status.textContent='Markierung gespeichert. Zum Löschen auf die Markierung klicken.';
});
$('ow-detail-upload').addEventListener('change',e=>{
 const file=e.target.files?.[0];if(!file||!current)return;
 if(!file.type.startsWith('image/')){status.textContent='Bitte eine Bilddatei wählen.';return;}
 if(file.size>15*1024*1024){status.textContent='Bitte ein Bild unter 15 MB wählen.';return;}
 const reader=new FileReader();const name=current.name;
 reader.onload=()=>{const value=reader.result;if(typeof value!=='string')return;localImages.set(name,value);if(current?.name===name){mapImage.src=value;help.textContent='Eigene Draufsicht aktiv. Du kannst jetzt Callouts und Shortcuts positionsgenau setzen.';status.textContent='Draufsicht geladen – für diese Sitzung. Markierungen werden lokal gespeichert.';}};
 reader.readAsDataURL(file);e.target.value='';
});
$('ow-detail-clear').addEventListener('click',()=>{if(!current||!confirm('Alle eigenen Markierungen für '+current.name+' löschen?'))return;saveMarkers(current.name,[]);drawMarkers()});
})();