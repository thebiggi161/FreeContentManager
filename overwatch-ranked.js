(()=>{'use strict';
const root=document.getElementById('owRankedTool');
if(!root)return;
const ranks=[
 {name:'Bronze',color:'#bb7c4b',code:'B',tip:'Konzentriere dich auf Überleben, Positionierung und Helden mit klaren, selbstständigen Fähigkeiten.'},
 {name:'Silber',color:'#b9c1cd',code:'S',tip:'Stabile Helden, einfache Ult-Kombinationen und konstante Team-Unterstützung helfen beim Aufstieg.'},
 {name:'Gold',color:'#dfb74c',code:'G',tip:'Trainiere Fokusfeuer, kürzere Wege zum Team und das Erkennen gewinnbarer Kämpfe.'},
 {name:'Platin',color:'#82a5d7',code:'P',tip:'Nutze Highground, Counter-Switches und achte auf Ressourcen der Gegner.'},
 {name:'Emerald',color:'#42c89b',code:'E',tip:'Koordinierte Rotationen und gutes Cooldown-Management werden immer wichtiger.'},
 {name:'Diamant',color:'#8cb7f0',code:'D',tip:'Kontrolliere Raum und Tempo; spiele um Win Conditions statt nur um Eliminierungen.'},
 {name:'Master',color:'#c187eb',code:'M',tip:'Wähle Helden nach Map-Geometrie, Teamkomposition und eigenem Hero-Pool.'},
 {name:'Grandmaster',color:'#f58d91',code:'GM',tip:'Setze auf abgestimmte Initiationen, Ultimate-Economy und saubere Teamfight-Pläne.'},
 {name:'Champion',color:'#ffe29c',code:'C',tip:'Gute Picks sind situationsabhängig. Teamkoordination, Meta-Kenntnis und gegnerische Anpassungen entscheiden.'}
];
const pickSets={
low:{
 Tank:[['Reinhardt','Klarer Nahkampf- und Schutzstil'],['Orisa','Robuste Frontline mit verlässlicher Präsenz'],['D.Va','Mobiles Eingreifen und Team-Schutz']],
 Damage:[['Soldier: 76','Konstanter Schaden, eigenständige Heilung'],['Reaper','Stark gegen nahe Ziele und Tanks'],['Junkrat','Druck auf Engstellen und Kontrollpunkte']],
 Support:[['Moira','Einfacher Heilstil und gute Eigenrettung'],['Mercy','Direkte Unterstützung und Wiederbelebung'],['Baptiste','Hoher Nutzen durch Heilung und Rettungsfähigkeit']]
},
mid:{
 Tank:[['D.Va','Mobilität und Defense Matrix'],['Sigma','Kontrolle von Sichtlinien und Distanzen'],['Junker Queen','Aggressives Tempo und Druck']],
 Damage:[['Ashe','Highground und mittlere bis lange Distanz'],['Sojourn','Mobilität und Duellpotenzial'],['Cassidy','Verlässliche Duelle und Flankenschutz']],
 Support:[['Kiriko','Schutz, Mobilität und flexible Positionen'],['Ana','Heilungsunterbrechung und starke Fernunterstützung'],['Juno','Tempo und flexible Teamunterstützung']]
},
high:{
 Tank:[['Winston','Initiationen und koordinierte Dives'],['D.Va','Highground-Kontrolle und schnelle Rotationen'],['Sigma','Stabile Fernkampfkompositionen']],
 Damage:[['Tracer','Flanken, Timing und Backline-Druck'],['Sojourn','Wert durch präzise Duelle'],['Genji','Koordinierter Dive und Cleanup']],
 Support:[['Ana','Spielentscheidende Cooldowns'],['Kiriko','Mobilität, Rettung und Tempo'],['Lúcio','Speed-Rotationen und kontrollierte Engages']]
},
elite:{
 Tank:[['Winston','Koordinierte Dive-Fenster'],['D.Va','Flexible Counter-Dives und Raumkontrolle'],['Sigma','Strukturierter Poke auf geeigneten Maps']],
 Damage:[['Tracer','Hoher Wert bei perfektem Timing'],['Sojourn','Präzise Abschlüsse und flexible Winkel'],['Genji','Situative Dive-Option mit Teamsetup']],
 Support:[['Lúcio','Tempo und Engage-Kontrolle'],['Ana','Großer Einfluss durch Antiheal und Sleep'],['Kiriko','Schutz entscheidender Spielzüge']]
}
};
const rankSlider=document.getElementById('owRankSlider');
const rankButtons=document.getElementById('owRankButtons');
const pickContainer=document.getElementById('owRankPicks');
const roleBtns=[...document.querySelectorAll('[data-ow-rank-role]')];
let activeRole='all';
function bucket(i){return i<=1?'low':i<=3?'mid':i<=5?'high':'elite'}
function recommendations(rankIndex,div){
 const base=pickSets[bucket(rankIndex)];
 if(rankIndex===4)return {
  Tank:[['D.Va','Raumkontrolle und schnelle Flankenabwehr'],['Winston','Engage bei Teamunterstützung'],['Sigma','Stabil auf offenen Sichtlinien']],
  Damage:[['Sojourn','Variable Distanzen und Mobilität'],['Ashe','Kontrollierter Druck auf Highground'],['Tracer','Gezieltes Flankentiming']],
  Support:[['Kiriko','Rettung und flexible Winkel'],['Ana','Cooldowns für koordinierte Fights'],['Juno','Mobilität und Teamtempo']]
 };
 if(rankIndex===8&&div<=2)return base;
 return base;
}
function render(){
 const step=Number(rankSlider.value),rankIndex=Math.floor(step/5),division=5-step%5,rank=ranks[rankIndex];
 root.style.setProperty('--rank-tone',rank.color);
 document.getElementById('owRankBadge').textContent=rank.code;
 document.getElementById('owRankName').textContent=rank.name+' '+division;
 document.getElementById('owRankSubtitle').textContent='Division '+division+' von 5 · '+(step+1)+' / 45';
 document.getElementById('owRankRange').setAttribute('aria-valuetext',rank.name+' Division '+division);
 rankButtons.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===rankIndex)));
 const picks=recommendations(rankIndex,division);
 pickContainer.replaceChildren();
 const roles=activeRole==='all'?['Tank','Damage','Support']:[activeRole];
 roles.forEach(role=>{
  const panel=document.createElement('section');panel.className='ow-rank-role-group';
  const title=document.createElement('h3');title.textContent=role==='Damage'?'Damage / DPS':role;panel.append(title);
  picks[role].forEach(([hero,note],j)=>{
   const item=document.createElement('div');item.className='ow-rank-hero';
   const num=document.createElement('span');num.className='ow-rank-hero-index';num.textContent=j+1;
   const info=document.createElement('div');const name=document.createElement('b');name.textContent=hero;
   const desc=document.createElement('span');desc.textContent=note;info.append(name,desc);item.append(num,info);panel.append(item);
  });
  pickContainer.append(panel);
 });
 document.getElementById('owRankAdvice').textContent=rank.tip;
}
ranks.forEach((r,i)=>{
 const btn=document.createElement('button');btn.type='button';btn.className='ow-rank-tab';
 btn.innerHTML='<strong></strong><small>5 – 1</small>';
 btn.querySelector('strong').textContent=r.name;
 btn.title=r.name+' auswählen';
 btn.addEventListener('click',()=>{rankSlider.value=i*5;render()});
 rankButtons.append(btn);
});
roleBtns.forEach(btn=>btn.addEventListener('click',()=>{
 activeRole=btn.dataset.owRankRole;
 roleBtns.forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
 render();
}));
rankSlider.addEventListener('input',render);
render();
})();