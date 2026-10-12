(()=>{'use strict';
const canvas=document.createElement('canvas');
canvas.id='molotovAtmosphere';canvas.setAttribute('aria-hidden','true');
document.body.prepend(canvas);
const ctx=canvas.getContext('2d');if(!ctx)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,ratio=1,frame=0,last=0,start=0;
let sparks=[];
function seedSpark(initial){
 return {x:Math.random()*width,y:initial?height-Math.random()*Math.min(height*.48,380):height+8,
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
 const base=Math.min(115,height*.17),range=Math.min(185,height*.27);
 const glow=ctx.createRadialGradient(width*.5,height+25,10,width*.5,height+25,Math.max(width*.65,range*3));
 glow.addColorStop(0,'rgba(255,94,15,.13)');glow.addColorStop(.42,'rgba(200,50,5,.045)');glow.addColorStop(1,'rgba(100,20,0,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,Math.max(0,height-range*3),width,range*3);
 if(!moving)return;
 for(let layer=0;layer<3;layer++){
  const gradient=ctx.createLinearGradient(0,height,0,height-base-range);
  gradient.addColorStop(0,'rgba(255,105,20,'+(.105-layer*.022)+')');
  gradient.addColorStop(.45,'rgba(220,57,8,'+(.048-layer*.009)+')');
  gradient.addColorStop(1,'rgba(255,130,35,0)');
  ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(-20,height+10);
  for(let x=-20;x<=width+30;x+=6){
   const wave=(Math.sin(x*.017+t*.65+layer*1.7)+Math.sin(x*.039-t*.85+layer)*.45+Math.sin(x*.009+t*.37)*.7)/2.15;
   const tongues=Math.pow((Math.sin(x*.027+t*.52+layer*2)+1)/2,3);
   const y=height-base*(.4+layer*.13)-range*(.17+wave*.1+tongues*.48);
   ctx.lineTo(x,y);
  }
  ctx.lineTo(width+30,height+10);ctx.closePath();ctx.fill();
 }
 for(let i=0;i<sparks.length;i++){
  let p=sparks[i];p.life+=dt;p.y-=p.speed*dt;p.x+=(p.drift+Math.sin(t*1.5+p.phase)*10)*dt;
  if(p.life>p.maxLife||p.y<height-Math.min(height*.62,450)||p.x<-20||p.x>width+20){p=seedSpark(false);sparks[i]=p;}
  const fade=Math.max(0,Math.min(1,(height-p.y)/35))*(1-p.life/p.maxLife);
  ctx.fillStyle='rgba(255,153,62,'+(fade*.48)+')';
  ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(255,104,28,'+(fade*.15)+')';ctx.lineWidth=p.size*.65;
  ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.drift*.08,p.y+4+p.size*2);ctx.stroke();
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
document.addEventListener('visibilitychange',sync);
reduce.addEventListener('change',sync);
resize();sync();
})();
