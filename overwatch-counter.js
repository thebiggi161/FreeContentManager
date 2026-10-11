(()=>{'use strict';
const root=document.getElementById('owCounterTool');
if(!root)return;
const original=window.owHeroes;
const heroList=Array.isArray(original)?original.filter(h=>Array.isArray(h)&&typeof h[0]==='string'&&['Tank','Damage','Support'].includes(h[1])).map(h=>({name:h[0],role:h[1]})):[];
const slots=['Tank','Damage','Damage','Support','Support'];
const defaults=['Reinhardt','Soldier: 76','Reaper','Mercy','Moira'];
const allies=defaults.map((name,i)=>heroList.some(h=>h.name===name&&h.role===slots[i])?name:'');
const selects=[];
let mode='meta';
const styleName={meta:'Meta-orientiert',pro:'Pro / Teamplay',casual:'Casual'};
const styleInfo={
 meta:'Flexible, vielseitige Counter-Picks mit Schwerpunkt auf klaren Matchups. Die Auswahl ist redaktionell und nicht live mit einer Patch-Meta synchronisiert.',
 pro:'Betont abgestimmte Dives, Schutzfähigkeiten und koordiniertes Timing. Ein hohes Maß an Teamkommunikation ist vorausgesetzt.',
 casual:'Bevorzugt verständliche Fähigkeiten, zuverlässige Überlebenschancen und weniger mechanisch anspruchsvolle Picks.'
};
const matchup={
 'Reinhardt':['Orisa','Ramattra','Bastion','Junkrat','Ana','Zenyatta','Reaper'],
 'Orisa':['Zarya','Sigma','Hanzo','Sojourn','Ana','Zenyatta'],
 'D.Va':['Zarya','Symmetra','Mei','Brigitte','Moira'],
 'Winston':['Reaper','Bastion','D.Va','Brigitte','Ana','Torbjörn'],
 'Wrecking Ball':['Sombra','Cassidy','Brigitte','Ana','Junkrat'],
 'Doomfist':['Orisa','Sombra','Cassidy','Ana','Brigitte'],
 'Sigma':['Reinhardt','Winston','Symmetra','Lúcio','Mei'],
 'Zarya':['Reinhardt','Winston','Bastion','Hanzo','Zenyatta'],
 'Roadhog':['Ana','Zenyatta','Orisa','Reaper','Bastion'],
 'Mauga':['Ana','Zenyatta','Sigma','D.Va','Bastion'],
 'Junker Queen':['Orisa','Kiriko','Ana','Pharah','Ashe'],
 'Ramattra':['Orisa','Zenyatta','Bastion','Ana','Pharah'],
 'Hazard':['Orisa','Cassidy','Ana','Brigitte','Reaper'],
 'Widowmaker':['Winston','D.Va','Wrecking Ball','Tracer','Genji','Sombra','Lúcio'],
 'Hanzo':['Winston','D.Va','Tracer','Genji','Kiriko'],
 'Ashe':['Winston','D.Va','Tracer','Genji','Sombra'],
 'Cassidy':['Ashe','Widowmaker','Hanzo','Sigma','D.Va'],
 'Soldier: 76':['D.Va','Winston','Tracer','Genji','Ana'],
 'Sojourn':['D.Va','Winston','Tracer','Genji','Lúcio'],
 'Pharah':['D.Va','Ashe','Cassidy','Soldier: 76','Baptiste','Ana'],
 'Echo':['D.Va','Ashe','Cassidy','Soldier: 76','Baptiste'],
 'Junkrat':['Pharah','Echo','D.Va','Zarya','Kiriko'],
 'Bastion':['D.Va','Sigma','Genji','Hanzo','Ana'],
 'Torbjörn':['Pharah','Echo','Junkrat','Winston','Ana'],
 'Symmetra':['Pharah','Echo','Junkrat','Winston','Ashe'],
 'Mei':['Pharah','Echo','Ashe','Kiriko','Lúcio'],
 'Reaper':['Pharah','Ashe','Cassidy','Ana','D.Va'],
 'Genji':['Moira','Brigitte','Winston','Zarya','Cassidy'],
 'Tracer':['Torbjörn','Brigitte','Cassidy','Moira','Kiriko'],
 'Sombra':['Winston','Kiriko','Brigitte','Cassidy','Torbjörn'],
 'Venture':['Pharah','Echo','Cassidy','Brigitte','Kiriko'],
 'Mercy':['Soldier: 76','Ashe','Cassidy','Widowmaker','Tracer'],
 'Ana':['Kiriko','Tracer','Genji','Winston','Lúcio'],
 'Kiriko':['Winston','Tracer','Cassidy','Brigitte','Moira'],
 'Baptiste':['Winston','D.Va','Tracer','Genji','Ana'],
 'Brigitte':['Pharah','Echo','Ashe','Hanzo','Junkrat'],
 'Lúcio':['Cassidy','Mei','Torbjörn','Brigitte','Ana'],
 'Moira':['Ana','Zenyatta','Ashe','Pharah','Kiriko'],
 'Zenyatta':['Tracer','Genji','Sombra','Winston','D.Va'],
 'Lifeweaver':['Tracer','Genji','Winston','Sombra','Ana'],
 'Illari':['Winston','D.Va','Tracer','Sombra','Ana'],
 'Juno':['Cassidy','Ashe','Soldier: 76','Winston','D.Va']
};
const play={
 meta:{Tank:['D.Va','Sigma','Winston','Orisa','Ramattra','Zarya','Junker Queen'],Damage:['Sojourn','Ashe','Tracer','Cassidy','Soldier: 76','Reaper','Genji'],Support:['Kiriko','Ana','Juno','Baptiste','Lúcio','Brigitte','Moira']},
 pro:{Tank:['Winston','D.Va','Sigma','Wrecking Ball','Doomfist','Zarya'],Damage:['Tracer','Sojourn','Genji','Ashe','Echo','Sombra','Cassidy'],Support:['Ana','Lúcio','Kiriko','Brigitte','Juno','Baptiste','Zenyatta']},
 casual:{Tank:['Orisa','Reinhardt','D.Va','Sigma','Ramattra','Zarya'],Damage:['Soldier: 76','Reaper','Junkrat','Cassidy','Ashe','Bastion'],Support:['Moira','Mercy','Baptiste','Kiriko','Lúcio','Juno']}
};
const difficult=new Set(['Tracer','Genji','Widowmaker','Doomfist','Wrecking Ball','Echo','Sombra','Ana','Lúcio']);
const teamSynergy={
 'Winston':['Tracer','Genji','Ana','Kiriko','Lúcio','Brigitte'],
 'D.Va':['Tracer','Sojourn','Kiriko','Juno','Ana'],
 'Sigma':['Ashe','Sojourn','Baptiste','Zenyatta','Widowmaker'],
 'Reinhardt':['Reaper','Mei','Lúcio','Baptiste','Moira'],
 'Orisa':['Soldier: 76','Cassidy','Baptiste','Moira'],
 'Ramattra':['Mei','Reaper','Lúcio','Baptiste'],
 'Zarya':['Reaper','Genji','Lúcio','Ana'],
 'Wrecking Ball':['Tracer','Sombra','Zenyatta','Brigitte'],
 'Junker Queen':['Reaper','Mei','Lúcio','Kiriko']
};
const list=document.getElementById('owCounterAllies');
const result=document.getElementById('owCounterEnemies');
const textSummary=document.getElementById('owCounterSummary');
const textStatus=document.getElementById('owCounterStatus');
const modeBtns=[...root.querySelectorAll('[data-counter-mode]')];
function makeEl(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function roleLabel(role,i){return role==='Tank'?'Tank':role==='Damage'?'Damage '+(i===1?'1':'2'):'Support '+(i===3?'1':'2')}
function valid(){return heroList.length>0&&allies.every((n,i)=>heroList.some(h=>h.name===n&&h.role===slots[i]))&&new Set(allies).size===5}
function refreshOptions(){
 selects.forEach((select,i)=>{
  const previous=allies[i];select.replaceChildren();
  const placeholder=new Option('Held auswählen …','');select.add(placeholder);
  heroList.filter(h=>h.role===slots[i]).sort((a,b)=>a.name.localeCompare(b.name,'de')).forEach(h=>{
   const option=new Option(h.name,h.name);option.disabled=allies.some((n,j)=>j!==i&&n===h.name);select.add(option);
  });
  select.value=previous;
 });
}
slots.forEach((role,i)=>{
 const box=makeEl('div','ow-counter-slot');const label=makeEl('label',null,roleLabel(role,i));label.htmlFor='owCounterSlot'+i;
 const icon=makeEl('div','ow-counter-slot-icon',allies[i]?.charAt(0)||'?');icon.setAttribute('aria-hidden','true');
 const select=makeEl('select');select.id='owCounterSlot'+i;select.setAttribute('aria-label',roleLabel(role,i)+' wählen');
 select.addEventListener('change',()=>{allies[i]=select.value;icon.textContent=select.value?.charAt(0)||'?';refreshOptions();render()});
 box.append(label,icon,select);list.append(box);selects.push(select);
});
function suggest(){
 const enemies=[];
 const outputSlots=['Tank','Damage','Damage','Support','Support'];
 for(let i=0;i<outputSlots.length;i++){
  const role=outputSlots[i];
  const available=heroList.filter(h=>h.role===role&&!enemies.some(e=>e.hero===h.name));
  const scored=available.map(h=>{
   const matchAll=allies.filter(enemy=>matchup[enemy]?.includes(h.name));
   const preference=play[mode][role]||[];
   let score=matchAll.length*9;
   const order=preference.indexOf(h.name);
   if(order>=0)score+=14-order*1.2;
   if(mode==='casual'&&difficult.has(h.name))score-=12;
   if(mode==='pro'&&difficult.has(h.name))score+=3;
   if(mode==='meta'&&difficult.has(h.name))score-=1;
   const chosenTank=enemies.find(e=>e.role==='Tank')?.hero;
   if(chosenTank&&teamSynergy[chosenTank]?.includes(h.name))score+=mode==='pro'?8:4;
   if(role==='Support'){
    const supports=enemies.filter(e=>e.role==='Support').map(e=>e.hero);
    if(supports.includes('Mercy')&&h.name==='Lúcio')score-=5;
    if(supports.includes('Lúcio')&&h.name==='Mercy')score-=5;
   }
   return {hero:h.name,role,score,counters:matchAll,preferred:order>=0};
  });
  scored.sort((a,b)=>b.score-a.score||a.hero.localeCompare(b.hero,'de'));
  enemies.push(scored[0]);
 }
 return enemies;
}
function explain(pick){
 const target=pick.counters.slice(0,2);
 if(target.length)return 'Konter-Pick gegen '+target.join(' und ')+'. Die Wirkung hängt von Timing und Ausführung ab.';
 if(mode==='pro')return 'Für abgestimmtes Teamplay und gemeinsame Initiationen ausgewählt.';
 if(mode==='casual')return 'Verlässlicher Pick mit vergleichsweise zugänglicher Spielweise.';
 return 'Vielseitige Option mit Nutzen für unterschiedliche Situationen.';
}
function render(){
 result.replaceChildren();
 if(!valid()){
  textStatus.textContent='Bitte wähle fünf unterschiedliche Helden: 1 Tank, 2 Damage, 2 Support.';
  textSummary.textContent='Sobald dein Team vollständig ist, werden passende gegnerische Vorschläge angezeigt.';
  return;
 }
 const enemies=suggest();
 textStatus.textContent='5 gegnerische Picks · '+styleName[mode]+' · ohne Map-Abhängigkeit';
 enemies.forEach((enemy,i)=>{
  const card=makeEl('article','ow-counter-enemy');
  const label=makeEl('span','ow-counter-enemy-role',roleLabel(enemy.role,i));const initial=makeEl('div','ow-counter-slot-icon',enemy.hero.charAt(0));initial.setAttribute('aria-hidden','true');
  const title=makeEl('strong',null,enemy.hero);
  const reason=makeEl('p',null,explain(enemy));
  const small=makeEl('span','ow-counter-score',enemy.counters.length?'Direkte Matchups: '+enemy.counters.length:'Team-/Spielstil-Pick');
  card.append(label,initial,title,small,reason);result.append(card);
 });
 textSummary.textContent=styleInfo[mode]+' '+enemies.filter(e=>e.counters.length).length+' von 5 Vorschlägen berücksichtigen mindestens ein hinterlegtes direktes Matchup gegen dein Team. Die übrigen sind passende Rollen-/Spielstiloptionen.';
}
modeBtns.forEach(btn=>btn.addEventListener('click',()=>{
 mode=btn.dataset.counterMode;modeBtns.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));render();
}));
document.getElementById('owCounterReset').addEventListener('click',()=>{
 defaults.forEach((n,i)=>allies[i]=heroList.some(h=>h.name===n&&h.role===slots[i])?n:'');
 selects.forEach((sel,i)=>sel.closest('.ow-counter-slot').querySelector('.ow-counter-slot-icon').textContent=allies[i]?.charAt(0)||'?');
 refreshOptions();render();
});
refreshOptions();render();
})();