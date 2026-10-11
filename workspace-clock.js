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
  const cell=document.createElement('span');cell.className='ws-calendar-day';
  cell.textContent=date.getDate();
  if(date.getMonth()!==month)cell.classList.add('ws-calendar-outside');
  if(date.getFullYear()===now.getFullYear()&&date.getMonth()===now.getMonth()&&date.getDate()===now.getDate()){
   cell.classList.add('ws-calendar-current');cell.setAttribute('aria-current','date');
  }
  cell.title=fullDateFormatter.format(date);
  calendarGrid.append(cell);
 }
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
 const now=new Date();shownMonth=new Date(now.getFullYear(),now.getMonth(),1);drawCalendar(now);
});
updateClock();
setInterval(updateClock,1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateClock()});
})();