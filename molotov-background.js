(()=>{'use strict';
const canvas=document.createElement('canvas');
canvas.id='molotovAtmosphere';canvas.setAttribute('aria-hidden','true');
document.body.prepend(canvas);
const ctx=canvas.getContext('2d');if(!ctx)return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,ratio=1,frame=0,last=0,start=0;
let sparks=[],flames=[];
const noise=(t,p)=>Math.sin(t*1.3+p)*.5+Math.sin(t*2.7+p*1.7)*.3+Math.sin(t*4.1+p*.7)*.2;
function seedSpark(initial){
 return {x:Math.random()*width,y:initial?height-Math.random()*Math.min(height*.5,320):height+5,
 speed:16+Math.random()*30,drift:Math.random()*24-12,size:.7+Math.random()*1.3,
 life:0,maxLife:5+Math.random()*5,phase:Math.random()*Math.PI*2};
}
function resize(){
 width=window.innerWidth;height=window.innerHeight;ratio=Math.min(window.devicePixelRatio||1,1.5);
 canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
 ctx.setTransform(ratio,0,0,ratio,0,0);
 sparks=Array.from({length:width<600?22:42},()=>seedSpark(true));
 flames=Array.from({length:Math.max(28,Math.min(110,Math.ceil(width/13)))},()=>({
 x:Math.random()*width,y:height+14,w:26+Math.random()*52,
 h:35+Math.random()*Math.min(155,height*.23),phase:Math.random()*40,speed:.75+Math.random()*.7
 }));
 if(reduce.matches)paint(0,0,false);
}
function paint(t,dt,moving){
 ctx.clearRect(0,0,width,height);
 const groundHeight=Math.min(240,height*.34);
 const ambient=ctx.createLinearGradient(0,height+10,0,height-groundHeight);
 ambient.addColorStop(0,'rgba(255,72,5,.19)');
 ambient.addColorStop(.24,'rgba(220,57,4,.08)');
 ambient.addColorStop(.65,'rgba(170,38,3,.025)');
 ambient.addColorStop(1,'rgba(140,30,0,0)');
 ctx.fillStyle=ambient;ctx.fillRect(0,height-groundHeight,width,groundHeight);
 if(!moving){maskBanners();return;}
 ctx.globalCompositeOperation='screen';
 for(const flame of flames){
  const time=t*flame.speed,phase=flame.phase;
  const pulse=.8+noise(time,phase)*.18;
  const h=flame.h*pulse,w=flame.w*(.85+noise(time*.8,phase+8)*.15);
  const bend=noise(time,phase+3)*w*.85,tip=noise(time*1.15,phase+5)*w*.95;
  // Each tongue tapers independently, with a soft root and a wandering tip.
  const gradient=ctx.createLinearGradient(flame.x,flame.y+16,flame.x,flame.y-h);
  gradient.addColorStop(0,'rgba(185,32,2,0)');
  gradient.addColorStop(.16,'rgba(245,66,6,.11)');
  gradient.addColorStop(.42,'rgba(255,119,23,.08)');
  gradient.addColorStop(.68,'rgba(255,159,52,.045)');
  gradient.addColorStop(1,'rgba(255,103,12,0)');
  ctx.fillStyle=gradient;
  ctx.beginPath();ctx.moveTo(flame.x-w*.55,flame.y+12);
  ctx.bezierCurveTo(flame.x-w*.9,flame.y-h*.28,flame.x+bend-w*.5,flame.y-h*.65,flame.x+tip,flame.y-h);
  ctx.bezierCurveTo(flame.x+bend+w*.1,flame.y-h*.65,flame.x+w*.85,flame.y-h*.25,flame.x+w*.55,flame.y+12);
  ctx.closePath();ctx.fill();
  // A narrower warm core gives the flame depth without brightening the page.
  const core=ctx.createLinearGradient(0,flame.y+8,0,flame.y-h*.72);
  core.addColorStop(0,'rgba(255,120,20,0)');core.addColorStop(.3,'rgba(255,183,76,.035)');core.addColorStop(1,'rgba(255,214,128,0)');
  ctx.fillStyle=core;ctx.beginPath();ctx.moveTo(flame.x-w*.2,flame.y+8);
  ctx.bezierCurveTo(flame.x-w*.28,flame.y-h*.2,flame.x+bend*.4,flame.y-h*.4,flame.x+tip*.6,flame.y-h*.72);
  ctx.bezierCurveTo(flame.x+w*.18,flame.y-h*.3,flame.x+w*.25,flame.y-h*.12,flame.x+w*.2,flame.y+8);
  ctx.closePath();ctx.fill();
 }
 ctx.globalCompositeOperation='source-over';
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
