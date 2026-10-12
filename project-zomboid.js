(()=>{'use strict';
const list=document.getElementById('pzDayOneChecklist');if(!list)return;
const key='freecontentmanager-pz-dayone-v1';
const checks=[...list.querySelectorAll('input[data-pz-task]')];
const progress=document.getElementById('pzChecklistProgress');
let stored={};
try{stored=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch(e){stored={}}
checks.forEach(input=>{input.checked=stored[input.dataset.pzTask]===true});
function update(save=true){
 const state={};checks.forEach(input=>{state[input.dataset.pzTask]=input.checked});
 progress.textContent=checks.filter(i=>i.checked).length+' von '+checks.length+' erledigt';
 if(save){try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}}
}
checks.forEach(input=>input.addEventListener('change',()=>update()));
document.getElementById('pzResetChecklist').addEventListener('click',()=>{checks.forEach(input=>input.checked=false);update()});
update(false);
})();