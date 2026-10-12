(()=>{'use strict';
const root=document.getElementById('wsTimeboard');if(!root)return;
const clock=document.getElementById('wsDigitalClock');
const seconds=document.getElementById('wsDigitalSeconds');
const dateLine=document.getElementById('wsClockDate');
const zoneLine=document.getElementById('wsClockZone');
const calendarHeading=document.getElementById('wsCalendarHeading');
const calendarGrid=document.getElementById('wsCalendarDays');
const monthFormatter=new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric'});
const fullDateFormatter=new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const weekdayFormatter=new Intl.DateTimeFormat('de-DE',{weekday:'long'});
const two=n=>String(n).padStart(2,'0');
let shownMonth=null;
let lastDay='';

const storageKey='fcm-calendar-events-v1';
const dateKey=d=>d.getFullYear()+'-'+two(d.getMonth()+1)+'-'+two(d.getDate());
let selectedDay=dateKey(new Date()),editingId=null,events=[],storageError='';
function validEvent(e){return e&&typeof e.id==='string'&&typeof e.title==='string'&&e.title.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(e.date)&&typeof e.time==='string'&&(!e.time||/^([01]\d|2[0-3]):[0-5]\d$/.test(e.time))&&typeof e.notes==='string';}
function loadEvents(){
 try{const raw=localStorage.getItem(storageKey);const parsed=raw?JSON.parse(raw):[];if(!Array.isArray(parsed)||!parsed.every(validEvent))throw new Error();events=parsed;storageError='';}
 catch{storageError='Gespeicherte Termine konnten nicht gelesen werden. Änderungen werden nicht gespeichert.';}
}
loadEvents();
const agenda=document.createElement('section');agenda.className='ws-agenda';agenda.setAttribute('aria-label','Termine verwalten');
agenda.innerHTML='<div class="ws-agenda-head"><h3 id="wsAgendaHeading"></h3><button type="button" class="btn" id="wsEventAdd">+ Termin</button></div><p class="ws-agenda-hint">Tag auswählen · Termine werden nur in diesem Browser gespeichert.</p><p id="wsEventStatus" role="status" aria-live="polite"></p><div id="wsEventList"></div><form id="wsEventForm" hidden><h4 id="wsEventFormHeading">Neuer Termin</h4><label>Titel<input id="wsEventTitle" type="text" maxlength="120" required placeholder="Zum Beispiel: Gaming-Abend"></label><div class="ws-event-fields"><label>Datum<input id="wsEventDate" type="date" min="0001-01-01" max="9999-12-31" required></label><label>Uhrzeit (optional)<input id="wsEventTime" type="time"></label></div><label>Notizen (optional)<textarea id="wsEventNotes" rows="2" maxlength="1000" placeholder="Weitere Infos zum Termin"></textarea></label><div class="ws-event-actions"><button class="btn primary" type="submit">Speichern</button><button class="btn" id="wsEventCancel" type="button">Abbrechen</button></div></form>';
calendarGrid.parentElement.append(agenda);
const byId=id=>document.getElementById(id),form=byId('wsEventForm'),status=byId('wsEventStatus');
function parseDay(key){const [y,m,d]=key.split('-').map(Number);const date=new Date(0);date.setFullYear(y,m-1,d);date.setHours(12,0,0,0);return date;}
function saveEvents(next){
 if(storageError){status.textContent=storageError;return false;}
 try{localStorage.setItem(storageKey,JSON.stringify(next));events=next;return true;}
 catch{status.textContent='Speichern nicht möglich. Bitte erlaube Browser-Speicher oder schaffe freien Speicherplatz. Deine Eingaben bleiben erhalten.';return false;}
}
function openForm(event){
 editingId=event?.id||null;form.hidden=false;
 byId('wsEventFormHeading').textContent=event?'Termin bearbeiten':'Neuer Termin';
 byId('wsEventTitle').value=event?.title||'';byId('wsEventDate').value=event?.date||selectedDay;
 byId('wsEventTime').value=event?.time||'';byId('wsEventNotes').value=event?.notes||'';
 byId('wsEventTitle').focus();
}
function closeForm(){form.hidden=true;editingId=null;byId('wsEventAdd').focus();}
function renderAgenda(){
 byId('wsAgendaHeading').textContent=fullDateFormatter.format(parseDay(selectedDay));
 const list=byId('wsEventList');list.replaceChildren();
 const daily=events.filter(e=>e.date===selectedDay).sort((a,b)=>a.time.localeCompare(b.time)||a.title.localeCompare(b.title,'de'));
 if(!daily.length){const empty=document.createElement('p');empty.className='ws-agenda-empty';empty.textContent='Noch keine Termine an diesem Tag.';list.append(empty);}
 daily.forEach(event=>{
  const row=document.createElement('article');row.className='ws-event';
  const details=document.createElement('div'),title=document.createElement('strong'),time=document.createElement('span');
  title.textContent=event.title;time.textContent=event.time?event.time+' Uhr':'Ganztägig';time.className='ws-event-time';details.append(time,title);
  if(event.notes){const note=document.createElement('p');note.textContent=event.notes;details.append(note);}
  const actions=document.createElement('div');actions.className='ws-event-actions';
  const edit=document.createElement('button');edit.type='button';edit.className='btn';edit.textContent='Bearbeiten';edit.setAttribute('aria-label',event.title+' bearbeiten');edit.addEventListener('click',()=>openForm(event));
  const remove=document.createElement('button');remove.type='button';remove.className='btn';remove.textContent='Löschen';remove.setAttribute('aria-label',event.title+' löschen');remove.addEventListener('click',()=>{
   if(!confirm('Termin „'+event.title+'“ löschen?'))return;
   if(saveEvents(events.filter(e=>e.id!==event.id))){if(editingId===event.id)closeForm();drawCalendar(new Date());status.textContent='Termin gelöscht.';}
  });
  actions.append(edit,remove);row.append(details,actions);list.append(row);
 });
 if(storageError)status.textContent=storageError;
}
byId('wsEventAdd').addEventListener('click',()=>openForm());
byId('wsEventCancel').addEventListener('click',closeForm);
form.addEventListener('submit',event=>{
 event.preventDefault();const title=byId('wsEventTitle').value.trim(),date=byId('wsEventDate').value,time=byId('wsEventTime').value,notes=byId('wsEventNotes').value.trim();
 if(!title){byId('wsEventTitle').setCustomValidity('Bitte einen Titel eingeben.');byId('wsEventTitle').reportValidity();return;}
 if(!date||dateKey(parseDay(date))!==date){status.textContent='Bitte ein gültiges Datum eingeben.';return;}
 const item={id:editingId||crypto.randomUUID(),title,date,time,notes};
 if(!validEvent(item)){status.textContent='Bitte Datum und Uhrzeit prüfen.';return;}
 if(!saveEvents([...events.filter(e=>e.id!==item.id),item]))return;
 selectedDay=date;const d=parseDay(date);shownMonth=new Date(d.getFullYear(),d.getMonth(),1);
 closeForm();drawCalendar(new Date());status.textContent='Termin gespeichert.';
});
byId('wsEventTitle').addEventListener('input',()=>byId('wsEventTitle').setCustomValidity(''));
window.addEventListener('storage',event=>{if(event.key===storageKey||event.key===null){loadEvents();drawCalendar(new Date());}});

function zoneLabel(now){
 const zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'Lokale Gerätezeit';
 const shortZone=new Intl.DateTimeFormat('de-DE',{timeZoneName:'short'}).formatToParts(now).find(p=>p.type==='timeZoneName')?.value||'';
 return zone.replaceAll('_',' ') + (shortZone?' · '+shortZone:'');
}
function drawCalendar(now){
 const year=shownMonth.getFullYear(),month=shownMonth.getMonth();
 calendarHeading.textContent=monthFormatter.format(shownMonth);
 calendarGrid.replaceChildren();
 const firstDay=(new Date(year,month,1).getDay()+6)%7;
 const days=new Date(year,month+1,0).getDate();
 const cells=Math.ceil((firstDay+days)/7)*7;
 for(let i=0;i<cells;i++){
  const day=i-firstDay+1;
  const date=new Date(year,month,day);
  const cell=document.createElement('button');cell.type='button';cell.className='ws-calendar-day';
  cell.textContent=date.getDate();
  if(date.getMonth()!==month)cell.classList.add('ws-calendar-outside');
  if(date.getFullYear()===now.getFullYear()&&date.getMonth()===now.getMonth()&&date.getDate()===now.getDate()){
   cell.classList.add('ws-calendar-current');cell.setAttribute('aria-current','date');
  }
  const key=dateKey(date),count=events.filter(e=>e.date===key).length;
  cell.title=fullDateFormatter.format(date);
  cell.setAttribute('aria-label',cell.title+' · '+count+' Termine');
  cell.setAttribute('aria-pressed',String(key===selectedDay));
  if(key===selectedDay)cell.classList.add('ws-calendar-selected');
  if(count){const badge=document.createElement('small');badge.className='ws-calendar-event-count';badge.textContent=count;cell.append(badge);}
  cell.addEventListener('click',()=>{selectedDay=key;if(date.getMonth()!==month)shownMonth=new Date(date.getFullYear(),date.getMonth(),1);form.hidden=true;editingId=null;drawCalendar(new Date());});
  calendarGrid.append(cell);
 }
 renderAgenda();
 document.getElementById('wsCalendarLegend').textContent=shownMonth.getFullYear()===now.getFullYear()&&shownMonth.getMonth()===now.getMonth()?'Heute ist orange markiert':'Zum aktuellen Monat mit „Heute“ zurückkehren';
}
function updateClock(){
 const now=new Date();
 clock.textContent=two(now.getHours())+':'+two(now.getMinutes());
 seconds.textContent=':'+two(now.getSeconds());
 dateLine.textContent=fullDateFormatter.format(now);
 zoneLine.textContent=zoneLabel(now);
 const today=now.getFullYear()+'-'+two(now.getMonth()+1)+'-'+two(now.getDate());
 if(shownMonth===null){shownMonth=new Date(now.getFullYear(),now.getMonth(),1);drawCalendar(now)}
 else if(lastDay!==today){drawCalendar(now)}
 lastDay=today;
}
document.getElementById('wsCalendarPrev').addEventListener('click',()=>{
 shownMonth=new Date(shownMonth.getFullYear(),shownMonth.getMonth()-1,1);drawCalendar(new Date());
});
document.getElementById('wsCalendarNext').addEventListener('click',()=>{
 shownMonth=new Date(shownMonth.getFullYear(),shownMonth.getMonth()+1,1);drawCalendar(new Date());
});
document.getElementById('wsCalendarToday').addEventListener('click',()=>{
 const now=new Date();selectedDay=dateKey(now);shownMonth=new Date(now.getFullYear(),now.getMonth(),1);drawCalendar(now);
});
updateClock();
setInterval(updateClock,1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateClock()});
})();