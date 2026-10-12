(()=>{'use strict';
const canvas=document.createElement('canvas');
canvas.id='molotovAtmosphere';canvas.setAttribute('aria-hidden','true');
document.body.prepend(canvas);
const ctx=canvas.getContext('2d');if(!ctx)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,ratio=1,frame=0,last=0,start=0;
let sparks=[];
function seedSpark(initial){
 return {x:Math.random()*width,y:initial?Math.random()*height:Math.random()*height,
 speed:16+Math.random()*30,drift:Math.random()*24-12,size:.7+Math.random()*1.3,
 life:0,maxLife:5+Math.random()*5,phase:Math.random()*Math.PI*2};
}
function resize(){
 width=window.innerWidth;height=window.innerHeight;ratio=Math.min(window.devicePixelRatio||1,1.5);
 canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
 ctx.setTransform(ratio,0,0,ratio,0,0);
 sparks=Array.from({length:width<600?22:42},()=>seedSpark(true));
 if(reduce.matches)paint(0,0,false);
}
function paint(t,dt,moving){
 ctx.clearRect(0,0,width,height);
 const bandHeight=Math.max(180,height*.38);
 for(let band=0;band<4;band++){
  const baseline=height*(band+1)/4+bandHeight*.22;
  const cx=width*(.25+.5*((Math.sin(t*.12+band*2)+1)/2));
  const glow=ctx.createRadialGradient(cx,baseline-bandHeight*.4,0,cx,baseline-bandHeight*.4,Math.max(width*.55,bandHeight));
  glow.addColorStop(0,'rgba(255,94,15,.055)');glow.addColorStop(.5,'rgba(200,50,5,.025)');glow.addColorStop(1,'rgba(100,20,0,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  if(!moving)continue;
  for(let layer=0;layer<2;layer++){
   const gradient=ctx.createLinearGradient(0,baseline+bandHeight*.15,0,baseline-bandHeight);
   gradient.addColorStop(0,'rgba(255,95,15,0)');
   gradient.addColorStop(.28,'rgba(255,105,20,'+(.085-layer*.025)+')');
   gradient.addColorStop(.62,'rgba(220,57,8,.035)');
   gradient.addColorStop(1,'rgba(255,130,35,0)');
   ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(-20,baseline+bandHeight*.15);
   for(let x=-20;x<=width+30;x+=8){
    const wave=(Math.sin(x*.017+t*.65+layer*1.7+band)+Math.sin(x*.039-t*.85+layer+band)*.45)/1.45;
    const tongues=Math.pow((Math.sin(x*.027+t*.52+layer*2+band*1.8)+1)/2,3);
    ctx.lineTo(x,baseline-bandHeight*(.25+wave*.11+tongues*.65));
   }
   ctx.lineTo(width+30,baseline+bandHeight*.15);ctx.closePath();ctx.fill();
  }
 }
 if(!moving){maskBanners();return;}
 for(let i=0;i<sparks.length;i++){
  let p=sparks[i];p.life+=dt;p.y-=p.speed*dt;p.x+=(p.drift+Math.sin(t*1.5+p.phase)*10)*dt;
  if(p.life>p.maxLife||p.y<-10||p.x<-20||p.x>width+20){p=seedSpark(false);sparks[i]=p;}
  const fade=Math.sin(Math.PI*Math.min(1,p.life/p.maxLife));
  ctx.fillStyle='rgba(255,153,62,'+(fade*.48)+')';
  ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(255,104,28,'+(fade*.15)+')';ctx.lineWidth=p.size*.65;
  ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.drift*.08,p.y+4+p.size*2);ctx.stroke();
 }
 maskBanners();
}
function maskBanners(){
 for(const el of document.querySelectorAll('header,.shell aside')){
  const r=el.getBoundingClientRect();if(r.width&&r.height)ctx.clearRect(r.left,r.top,r.width,r.height);
 }
}
function animate(now){
 if(document.hidden||reduce.matches){frame=0;return;}
 if(!start)start=now;
 if(now-last>=1000/30){paint((now-start)/1000,Math.min((now-last)/1000,.06),true);last=now;}
 frame=requestAnimationFrame(animate);
}
function sync(){
 if(frame)cancelAnimationFrame(frame);frame=0;last=0;
 if(reduce.matches){paint(0,0,false);return;}
 if(!document.hidden)frame=requestAnimationFrame(animate);
}
window.addEventListener('resize',resize,{passive:true});
window.addEventListener('scroll',()=>{if(reduce.matches)paint(0,0,false);},{passive:true});
document.addEventListener('visibilitychange',sync);
reduce.addEventListener('change',sync);
resize();sync();
})();
