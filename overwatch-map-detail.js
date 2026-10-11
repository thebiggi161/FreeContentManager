(()=>{'use strict';
const grid=document.getElementById('owMapGrid');if(!grid)return;
const annotatedOverlays={"Blizzard World":"1cS_lsov7DDUTs-9nSmvswGVF8UHy9cBB","Busan":"1yw_kd6vKjX1GLsCSsDoxQBWlw_7wz9OW","Dorado":"1Bvm5o0HgTMlSj1owbHnl_zKiLfFzfbt8","Eichenwalde":"1A4OmlwHcUDgkxSSu8T3NWYpn2WnaKnMt","Hanamura":"1SYJ27oSEFQAJMRIsvYO0Cl5lmqn34OZp","Hollywood":"1HnxJwohJDNIBrzKHl1rg3w_hNhutJN1B","Horizon Lunar Colony":"1E8vvo5ieeCEkbCHIu3EhNiWwVm9qobGw","Ilios":"1uVCt2Ca1jN66fxPLFepB1uiZyHDCph-4","Junkertown":"1e8YQs_xvw-vd7Hqb31C0_u-j0u8-Po0r","King’s Row":"1qPwiAqEIASVYw_IYFvQQVh3V4SY5kFSi","Lijiang Tower":"1CTyxkuRunbTaZdIoZDrsvIvy-fV9Gu2s","Nepal":"1IWsiUNOosuzSzykxewR9xALDGL_W8b7d","Numbani":"1ijNOop_eg5rEfNI4XVpFfpDTQ8BvzaMf","Oasis":"1UhY0KZnOtFohma4waOxlQ71L93hCx-Pm","Paris":"1aC_3IXKel5pmrpvCSM8xdmIzNa4wTXD-","Rialto":"1VXgJ6CIVT7WM8HCxoajXLWHo_Bs37UJP","Route 66":"1QkWzk6St0u9IBl58Z5bGm7-poVIaBFkq","Temple of Anubis":"11TQDaVuBdOchR_jTvEW3tpW254-oGCVN","Volskaya Industries":"1qhKYXPb1WoKNpZ1uw4d0oQiRFE_Rdt-4","Watchpoint: Gibraltar":"17mTCjFlJnsgevWDWMO0gxav3gEPc-Hng"};
const el=document.createElement('div');el.className='ow-detail';el.hidden=true;
el.innerHTML='<section class="ow-detail-box" role="dialog" aria-modal="true" aria-labelledby="ow-detail-title"><div class="ow-detail-head"><div><div class="eyebrow">OVERWATCH · MAP GUIDE</div><h2 id="ow-detail-title"></h2></div><button type="button" class="ow-detail-close" id="ow-detail-close" aria-label="Schließen">✕ Schließen</button></div><div class="ow-detail-inner"><div><div class="ow-detail-map" id="ow-detail-map" aria-label="Draufsicht mit eingezeichneten Kartenpunkten"><img id="ow-detail-image" alt="" hidden><div id="ow-detail-empty" class="ow-detail-empty" hidden></div></div><p class="ow-detail-help" id="ow-detail-image-note"></p><p class="ow-detail-credit" id="ow-detail-credit"></p><div class="ow-detail-bar"><a id="ow-detail-fullmap" target="_blank" rel="noopener noreferrer" hidden>Overlay in voller Größe ansehen ↗</a></div></div><div class="ow-detail-side"><section class="ow-detail-card"><h3>Team-Auswahl · 5v5</h3><label for="ow-detail-tier">Spielstil</label><select id="ow-detail-tier"><option value="casual">Casual · zugängliche Komposition</option><option value="pro">Pro · koordinierte Beispiel-Komposition</option></select><div class="ow-team" id="ow-detail-team"></div><p class="ow-map-statsnote">Strategische Beispiel-Picks – keine verifizierte Live-Meta.</p></section><section class="ow-detail-card"><h3>Spielweise und Kartenwege</h3><p id="ow-detail-tips"></p><p>Die verfügbaren annotierten Draufsichten zeigen bereits wichtige Ziele und Kartenpunkte. Zusätzliche Team-Callouts können von Szene zu Szene abweichen.</p></section></div></div></section>';
document.body.append(el);
const $=id=>document.getElementById(id);
const modalTitle=$('ow-detail-title'), board=$('ow-detail-map'), mapImage=$('ow-detail-image'), empty=$('ow-detail-empty'), help=$('ow-detail-image-note'), credit=$('ow-detail-credit'), fullmap=$('ow-detail-fullmap');
let current=null,returnFocus=null;
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
 current=data;returnFocus=focus;modalTitle.textContent=data.name+' · '+data.mode;
 const id=annotatedOverlays[data.name];
 mapImage.hidden=true;mapImage.removeAttribute('src');
 mapImage.onerror=null;
 empty.hidden=true;fullmap.hidden=true;
 if(id){
  board.style.aspectRatio=(['Busan','Ilios','Lijiang Tower','Nepal','Oasis'].includes(data.name))?'2 / 1':'1 / 1';
  const file='https://drive.google.com/file/d/'+encodeURIComponent(id)+'/view';
  fullmap.href=file;
  fullmap.hidden=false;fullmap.textContent='Original-Overlay öffnen ↗';
  empty.hidden=false;empty.textContent='Overlay-Bild wird geladen …';
  mapImage.alt='Beschriftete Draufsicht: '+data.name;
  mapImage.onload=()=>{if(current?.name!==data.name)return;empty.hidden=true;mapImage.hidden=false;};
  mapImage.onerror=()=>{if(current?.name!==data.name)return;mapImage.hidden=true;empty.hidden=false;empty.textContent='Das externe Bild kann hier nicht angezeigt werden. Mit „Original-Overlay öffnen“ kannst du die Datei direkt aufrufen.';};
  mapImage.src='https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1600';
  help.textContent='Bereits annotierte Draufsicht mit Zielen und Kartenmarkierungen (älterer Kartenstand). Die Ansicht kann je nach Google-Drive-Freigabe eingeschränkt sein.';
  credit.textContent='Overhead map courtesy of StatBanana / Coggle · Originalbild extern bei Google Drive.';
 }else{
  board.style.aspectRatio='16 / 9';
  empty.hidden=false;
  empty.textContent='Für '+data.name+' ist aktuell keine überprüfte, bereits beschriftete Draufsicht verfügbar.';
  help.textContent='Hier wird bewusst kein normales Vorschaubild als Overlay angezeigt. Die Karte bleibt in der Übersicht verfügbar.';
  credit.textContent='Weitere Kartenoverlays werden ergänzt, sobald eine passende Quelle geprüft ist.';
 }
 $('ow-detail-tier').value='casual';
 el.hidden=false;document.body.style.overflow='hidden';
 teamRender();$('ow-detail-close').focus();
}
function close(){
 el.hidden=true;current=null;document.body.style.overflow='';
 mapImage.onload=null;mapImage.onerror=null;mapImage.removeAttribute('src');
 if(returnFocus&&returnFocus.isConnected)returnFocus.focus();
}
grid.addEventListener('click',e=>{const card=e.target.closest('.ow-map-card');if(!card)return;const name=card.querySelector('h3')?.textContent;if(name)openMap(name,card)});
grid.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const card=e.target.closest('.ow-map-card');if(!card)return;e.preventDefault();const name=card.querySelector('h3')?.textContent;if(name)openMap(name,card)});
const labelMapCards=()=>grid.querySelectorAll('.ow-map-card').forEach(card=>{const name=card.querySelector('h3')?.textContent||'';card.tabIndex=0;card.setAttribute('role','button');card.classList.toggle('ow-has-overlay',Object.prototype.hasOwnProperty.call(annotatedOverlays,name));card.setAttribute('aria-label','Details zu '+name+(Object.prototype.hasOwnProperty.call(annotatedOverlays,name)?' · Overlay hinterlegt':' · kein Overlay hinterlegt')+' öffnen')});
const obs=new MutationObserver(labelMapCards);
obs.observe(grid,{childList:true});
labelMapCards();
$('ow-detail-close').addEventListener('click',close);
el.addEventListener('click',e=>{if(e.target===el)close()});
document.addEventListener('keydown',e=>{if(el.hidden)return;if(e.key==='Escape')close()});
$('ow-detail-tier').addEventListener('change',teamRender);
})();