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
const rankedMapPool=[
 ['Antarctic Peninsula','Control','dive'],['Busan','Control','mixed'],['Ilios','Control','brawl'],['Lijiang Tower','Control','brawl'],['Nepal','Control','brawl'],['Oasis','Control','mixed'],['Samoa','Control','brawl'],
 ['Circuit Royal','Escort','poke'],['Dorado','Escort','highground'],['Havana','Escort','poke'],['Junkertown','Escort','poke'],['Rialto','Escort','poke'],['Route 66','Escort','highground'],['Shambali Monastery','Escort','poke'],['Watchpoint: Gibraltar','Escort','dive'],
 ['Blizzard World','Hybrid','mixed'],['Eichenwalde','Hybrid','brawl'],['Hollywood','Hybrid','highground'],['King’s Row','Hybrid','brawl'],['Midtown','Hybrid','mixed'],['Numbani','Hybrid','dive'],['Paraíso','Hybrid','highground'],
 ['Colosseo','Push','mixed'],['Esperança','Push','dive'],['New Queen Street','Push','mixed'],['Runasapi','Push','dive'],
 ['New Junk City','Flashpoint','mobile'],['Suravasa','Flashpoint','mobile']
].map(([name,mode,style])=>({name,mode,style}));
const mapStyles={
 brawl:{label:'Engstellen & Brawl',explain:'Kurze Wege, enge Bereiche und Punktekontrolle belohnen abgestimmten Nahkampf. Auf offenen Teilabschnitten sind Alternativen sinnvoll.',Tank:[['Reinhardt','Beherrscht enge Korridore mit Nahkampfdruck'],['Junker Queen','Aggressive Kämpfe auf kurzer Distanz'],['Ramattra','Wechselt zwischen Druck und Frontline-Schutz']],Damage:[['Reaper','Starker Druck in engen Kämpfen'],['Mei','Blockiert Engstellen und trennt Gegner'],['Cassidy','Hält Flanken und mittlere Wege frei']],Support:[['Lúcio','Beschleunigt Team-Engages und Rückzüge'],['Moira','Konstanter Wert in Gruppenkämpfen'],['Baptiste','Starke Heilung bei zusammenstehenden Teams']]},
 poke:{label:'Lange Sichtlinien & Poke',explain:'Kontrolliere weite Sichtlinien und nutze Deckung. Präzision wird in höheren Rängen wichtiger.',Tank:[['Sigma','Barriere und Distanzkontrolle'],['D.Va','Sichert Highground und wechselt schnell Winkel'],['Orisa','Stabilisiert den Vormarsch auf offenen Wegen']],Damage:[['Ashe','Profitiert von langen Winkeln'],['Widowmaker','Präzisions-Pick mit hoher Mechanik-Anforderung'],['Sojourn','Wechselt zwischen Reichweite und Mobilität']],Support:[['Ana','Heilung aus sicherer Distanz'],['Baptiste','Reichweite und starke Teamrettung'],['Mercy','Verstärkt starke Distanz-Damage-Picks']]},
 highground:{label:'Highground & Flanken',explain:'Vertikale Wege, hohe Positionen und Timing beim Flankieren entscheiden viele Kämpfe.',Tank:[['D.Va','Schnelle Kontrolle von hohen Positionen'],['Winston','Springt auf isolierte Gegner'],['Sigma','Sichert defensivere Sichtlinien']],Damage:[['Soldier: 76','Flexibler Highground-Druck'],['Ashe','Kontrolliert lange Winkel von oben'],['Tracer','Stört Rückraum und zieht Aufmerksamkeit']],Support:[['Kiriko','Kann hohe Positionen und Flanken schnell erreichen'],['Ana','Wert durch sichere Fernwinkel'],['Juno','Unterstützt mobile Rotationen']]},
 dive:{label:'Dive & vertikale Mobilität',explain:'Gemeinsames Timing, Sprungwege und Ziel-Fokus sind entscheidend – besonders in hohen Elos.',Tank:[['D.Va','Mobil und stark beim Absichern von Dives'],['Winston','Springt gezielt auf schwache Rückraumziele'],['Doomfist','Mechanisch anspruchsvoller Initiator']],Damage:[['Soldier: 76','Solider, unabhängiger Mobilitäts-Pick'],['Tracer','Hoher Wert bei gutem Flanken-Timing'],['Genji','Setzt abgestimmte Dives um']],Support:[['Kiriko','Schützt und folgt mobilen Tanks'],['Ana','Eröffnet Kämpfe durch Fähigkeiten'],['Lúcio','Gibt Tempo für koordinierte Engages']]},
 mobile:{label:'Schnelle Rotationen',explain:'Wechselnde Ziele belohnen Mobilität und frühzeitiges Gruppieren. Bleib flexibel statt zu lange auf einem Punkt zu kämpfen.',Tank:[['D.Va','Schnelle Neu-Positionierung'],['Winston','Erreicht entfernte Ziele zügig'],['Junker Queen','Hält schnelle Teamkämpfe zusammen']],Damage:[['Soldier: 76','Autonome Rotation zwischen Zielen'],['Tracer','Wechselt schnell Flanken und Zielbereiche'],['Sojourn','Flexibel auf längeren Wegen']],Support:[['Juno','Mobiler Support mit Tempo-Nutzen'],['Kiriko','Teleportation und Rettung bei Rotationen'],['Lúcio','Schnelle Wege und Team-Engages']]},
 mixed:{label:'Flexible Teamkomposition',explain:'Die Karte wechselt zwischen offenen und engen Bereichen; passe Picks je nach Abschnitt und gegnerischer Komposition an.',Tank:[['D.Va','Flexibel zwischen Schutz und Angriff'],['Sigma','Sichert offene Bereiche'],['Winston','Nutzt vertikale Abschnitte']],Damage:[['Soldier: 76','Verlässlicher Allrounder'],['Sojourn','Mobil und vielseitig'],['Ashe','Kontrolliert offene Winkel']],Support:[['Kiriko','Schutz und hohe Flexibilität'],['Baptiste','Heilung und Teamrettung'],['Ana','Wert aus sicheren Winkeln']]}
};
const heroSkill={
'Reinhardt':1,'Orisa':1,'D.Va':3,'Junker Queen':3,'Ramattra':2,'Sigma':3,'Winston':5,'Doomfist':7,
'Soldier: 76':1,'Reaper':1,'Mei':2,'Cassidy':3,'Ashe':4,'Widowmaker':7,'Sojourn':5,'Tracer':7,'Genji':7,
'Moira':1,'Mercy':1,'Baptiste':3,'Lúcio':4,'Ana':5,'Kiriko':4,'Juno':3
};
const skillLabels=['','Einsteigerfreundlich','Grundlagen','Mittel','Fortgeschritten','Anspruchsvoll','Sehr anspruchsvoll','Hohe Mechanik / Timing'];
const mapDrawer=document.getElementById('owRankMapDrawer');
const mapSearch=document.getElementById('owRankMapSearch');
const mapGallery=document.getElementById('owRankMapGallery');
let selectedMapName='';
rankedMapPool.sort((a,b)=>a.mode.localeCompare(b.mode)||a.name.localeCompare(b.name));
function mapImageUrl(map){
 const fromGallery=window.owMapData?.find(item=>item.name===map.name);
 if(fromGallery?.image&&/^https:\/\//.test(fromGallery.image))return fromGallery.image;
 const slug=window.owMapSlug?.(map.name)||map.name.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
 return 'https://overfast-api.tekrop.fr/static/maps/'+slug+'.jpg';
}
function renderMapGallery(){
 const query=mapSearch.value.trim().toLocaleLowerCase('de');
 const matches=rankedMapPool.filter(map=>map.name.toLocaleLowerCase('de').includes(query));
 document.getElementById('owRankMapCount').textContent=matches.length+' von '+rankedMapPool.length+' Maps';
 mapGallery.replaceChildren();
 const createCard=(name,mode,image,selected)=>{
  const btn=document.createElement('button');btn.type='button';btn.className='ow-rank-map-item';btn.setAttribute('aria-pressed',String(selected));
  const pic=document.createElement('div');pic.className='ow-rank-map-thumb';
  const fallback=document.createElement('span');fallback.textContent='▧';fallback.className='ow-rank-map-fallback';pic.append(fallback);
  if(image){
   const img=document.createElement('img');img.src=image;img.alt='Vorschaubild '+name;img.loading='lazy';img.decoding='async';img.onerror=()=>img.remove();pic.append(img);
  }
  const info=document.createElement('div');info.className='ow-rank-map-item-info';
  const label=document.createElement('strong');label.textContent=name;
  const subtitle=document.createElement('span');subtitle.textContent=mode;
  info.append(label,subtitle);btn.append(pic,info);
  btn.addEventListener('click',()=>{selectedMapName=name==='Alle Maps'?'':name;document.getElementById('owRankChosenMap').textContent=selectedMapName||'Alle Maps · allgemeine Picks';mapDrawer.open=false;mapSearch.value='';renderMapGallery();render();document.querySelector('.ow-rank-map-toggle')?.focus()});
  return btn;
 };
 if(!query)mapGallery.append(createCard('Alle Maps','Allgemeine Elo-Picks','',!selectedMapName));
 matches.forEach(map=>mapGallery.append(createCard(map.name,map.mode,mapImageUrl(map),map.name===selectedMapName)));
 if(!matches.length){const empty=document.createElement('p');empty.className='ow-rank-map-none';empty.textContent='Keine Map gefunden. Versuche einen anderen Namen.';mapGallery.append(empty)}
}
mapSearch.addEventListener('input',renderMapGallery);
mapDrawer.addEventListener('toggle',()=>{if(mapDrawer.open){renderMapGallery()}});
renderMapGallery();

function render(){
 const step=Number(rankSlider.value),rankIndex=Math.floor(step/5),division=5-step%5,rank=ranks[rankIndex];
 root.style.setProperty('--rank-tone',rank.color);
 document.getElementById('owRankBadge').textContent=rank.code;
 document.getElementById('owRankName').textContent=rank.name+' '+division;
 document.getElementById('owRankSubtitle').textContent='Division '+division+' von 5 · '+(step+1)+' / 45';
 rankSlider.setAttribute('aria-valuetext',rank.name+' Division '+division);
 rankButtons.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===rankIndex)));
 const selectedMap=rankedMapPool.find(m=>m.name===selectedMapName);
 const style=selectedMap?mapStyles[selectedMap.style]:null;
 document.getElementById('owRankMapMode').textContent=selectedMap?selectedMap.mode:'Alle Modi';
 document.getElementById('owRankMapStyle').textContent=style?style.label:'Elo-basierte Empfehlungen';
 document.getElementById('owRankMapExplain').textContent=style?style.explain:'Wähle eine Ranked-Map, um ihre Spielweise und die passenden Picks für deinen Rang zu sehen.';
 const generalPicks=recommendations(rankIndex,division);
 const picks=style?Object.fromEntries(['Tank','Damage','Support'].map(role=>{
  const options=style[role];
  const maxDifficulty=Math.min(7,Math.max(2,rankIndex+1));
  const applicable=options.filter(([hero])=>(heroSkill[hero]||3)<=maxDifficulty);
  const lowRank=generalPicks[role].filter(([hero])=>(heroSkill[hero]||3)<=maxDifficulty);
  const selected=[...applicable,...lowRank,...options,...generalPicks[role]];
  const used=new Set();
  const unique=selected.filter(([hero])=>{if(used.has(hero))return false;used.add(hero);return true});
  return [role,unique.slice(0,3)];
 })):generalPicks;
 pickContainer.replaceChildren();
 const roles=activeRole==='all'?['Tank','Damage','Support']:[activeRole];
 roles.forEach(role=>{
  const panel=document.createElement('section');panel.className='ow-rank-role-group';
  const title=document.createElement('h3');title.textContent=role==='Damage'?'Damage / DPS':role;panel.append(title);
  picks[role].forEach(([hero,note],j)=>{
   const item=document.createElement('div');item.className='ow-rank-hero';
   const num=document.createElement('span');num.className='ow-rank-hero-index';num.textContent=hero.slice(0,1).toUpperCase();num.title='Anfangsbuchstabe: '+hero;
   const info=document.createElement('div');const name=document.createElement('b');name.textContent=hero;
   const desc=document.createElement('span');desc.textContent=note;const skill=document.createElement('small');const difficulty=heroSkill[hero]||3;skill.textContent='Skill: '+skillLabels[difficulty]+' · '+(difficulty<=rankIndex+1?'für dein Elo empfohlen':'steilere Lernkurve auf deinem Elo');info.append(name,desc,skill);item.append(num,info);panel.append(item);
  });
  pickContainer.append(panel);
 });
 document.getElementById('owRankAdvice').textContent=rank.tip+(selectedMap?' Map-Fokus: '+style.label+'.':'');
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