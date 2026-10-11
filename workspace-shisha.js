(()=>{'use strict';
const root=document.getElementById('wsShishaTimer');if(!root)return;
const output=document.getElementById('wsShishaRemaining');
const status=document.getElementById('wsShishaStatus');
const bar=document.getElementById('wsShishaProgress');
const start=document.getElementById('wsShishaStart');
const reset=document.getElementById('wsShishaReset');
const presets=[...root.querySelectorAll('[data-shisha-minutes]')];
let duration=12*60*1000,remaining=duration,endAt=0,running=false,finished=false;
const format=ms=>{const seconds=Math.ceil(Math.max(0,ms)/1000);return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')};
function render(){
 output.textContent=format(remaining);
 bar.style.width=(duration?Math.max(0,Math.min(100,remaining/duration*100)):0)+'%';
 status.textContent=finished?'Zeit abgelaufen':running?'Läuft':remaining===duration?'Bereit':'Pausiert';
 start.textContent=running?'Pause':finished?'Erneut starten':remaining===duration?'Start':'Fortsetzen';
 root.classList.toggle('ws-shisha-finished',finished);
}
function tick(){
 if(!running)return;
 remaining=Math.max(0,endAt-Date.now());
 if(remaining<=0){remaining=0;running=false;finished=true;}
 render();
}
presets.forEach(button=>button.addEventListener('click',()=>{
 duration=Number(button.dataset.shishaMinutes)*60*1000;
 remaining=duration;endAt=0;running=false;finished=false;
 presets.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 render();
}));
start.addEventListener('click',()=>{
 if(running){remaining=Math.max(0,endAt-Date.now());running=false;}
 else{if(finished||remaining<=0){remaining=duration;finished=false;}endAt=Date.now()+remaining;running=true;}
 render();
});
reset.addEventListener('click',()=>{remaining=duration;running=false;finished=false;endAt=0;render()});
document.addEventListener('visibilitychange',tick);
setInterval(tick,250);
render();
})();