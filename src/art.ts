import Phaser from 'phaser';

// Original pixel artwork. Every sprite is painted locally at its native resolution.
type Brush = CanvasRenderingContext2D;
const P = { ink:'#182827', dark:'#233c37', pine:'#284d41', moss:'#447452', leaf:'#72935c', grass:'#668360', sage:'#8b9a67', dirt:'#a18e67', sand:'#c5b187', wood:'#775238', lightwood:'#ac8050', gold:'#d8b66c', cream:'#efdfb1', river:'#367d8b', foam:'#9dc9b7', rock:'#536961', steel:'#91aaa3', snow:'#d9e1d4' };
let randSeed=717;
function random(){ randSeed=(Math.imul(randSeed,1664525)+1013904223)>>>0;return randSeed/4294967296; }
function rect(c:Brush,x:number,y:number,w:number,h:number,color:string){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function poly(c:Brush,points:number[][],color:string){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function ellipse(c:Brush,x:number,y:number,rx:number,ry:number,color:string){ // stepped contours preserve the deliberately pixelled silhouette
 for(let yy=-Math.ceil(ry); yy<=ry; yy++){const xx=Math.floor(rx*Math.sqrt(Math.max(0,1-(yy*yy)/(ry*ry))));rect(c,x-xx,y+yy,xx*2+1,1,color);}
}
function stamp(scene:Phaser.Scene,key:string,w:number,h:number,paint:(c:Brush)=>void){
 if(scene.textures.exists(key))return;
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const c=canvas.getContext('2d')!;c.imageSmoothingEnabled=false;paint(c);scene.textures.addCanvas(key,canvas);
}
function dots(c:Brush,n:number,w:number,h:number,colors:string[],size=1){for(let i=0;i<n;i++)rect(c,Math.floor(random()*w),Math.floor(random()*h),size,1,colors[i%colors.length]);}
function tree(c:Brush,x=0,y=0,s=1){c.save();c.translate(x,y);c.scale(s,s);ellipse(c,32,87,27,7,'#244c3d');rect(c,27,56,10,36,P.ink);rect(c,29,57,5,33,P.wood);rect(c,29,70,2,17,P.lightwood);
 for(let i=0;i<4;i++){const yy=7+i*15,half=11+i*6;poly(c,[[32,yy-6],[32-half,yy+24],[32-half+5,yy+24],[32-half-3,yy+31],[32+half+3,yy+31],[32+half-4,yy+23],[32+half,yy+23]],i%2?P.dark:P.ink);poly(c,[[31,yy],[32-half+4,yy+24],[29,yy+20],[32+half-2,yy+27]],P.pine);poly(c,[[31,yy+2],[32-half+7,yy+22],[31,yy+17]],P.moss);rect(c,25-i*3,yy+19,5,2,P.leaf);rect(c,32+i*3,yy+24,5,2,'#3b6148');}
 c.restore();}
function windowPaint(c:Brush,x:number,y:number,w=21,h=26){rect(c,x-3,y-3,w+6,h+6,P.ink);rect(c,x-1,y-1,w+2,h+2,P.lightwood);rect(c,x,y,w,h,'#554c34');rect(c,x+2,y+2,w-4,h-4,'#d8ac60');rect(c,x+3,y+3,w-8,h-8,'#efce85');rect(c,x+w/2-1,y,3,h,P.wood);rect(c,x,y+h/2, w,3,P.wood);rect(c,x-5,y+h+2,w+10,4,P.wood);}
function building(c:Brush,w:number,h:number,kind:string){
 const roofH=Math.floor(h*.52), wallTop=roofH-13, base=h-10;
 ellipse(c,w/2,h-6,w/2-6,6,'#354b38');rect(c,13,wallTop,w-26,base-wallTop,P.ink);rect(c,17,wallTop+3,w-34,base-wallTop-3,P.wood);
 for(let y=wallTop+6;y<base;y+=8){rect(c,18,y,w-36,2,'#a27649');rect(c,18,y+5,w-36,2,'#513b2d');for(let x=19;x<w-20;x+=24){rect(c,x+((y%16)?7:0),y+2,9,1,'#895e3b');}}
 for(const x of [16,w-22]){rect(c,x,wallTop,7,base-wallTop,P.ink);rect(c,x+2,wallTop+3,3,base-wallTop-4,P.lightwood);}
 rect(c,12,base-8,w-24,11,'#4b574e');for(let x=14;x<w-16;x+=16){rect(c,x,base-7,13,4,'#839084');rect(c,x+5,base-2,13,4,'#69776b');}
 const cx=w/2;
 // Long northern A-frame roof, ornamented ridge, staggered cedar shingles.
 poly(c,[[cx,3],[w-5,roofH],[w-9,roofH+8],[5,roofH+8],[1,roofH]],P.ink);
 poly(c,[[cx,8],[w-13,roofH],[12,roofH]],'#48635c');
 for(let y=17;y<roofH;y+=7){const half=(y-8)/(roofH-8)*(w/2-13);for(let x=Math.ceil(cx-half)+3;x<cx+half-4;x+=12){rect(c,x,y,10,3,((x+y)%3)?'#708376':'#859384');rect(c,x,y+3,10,2,'#344b44');rect(c,x,y,1,5,'#8c9a87');}}
 for(let i=0;i<roofH-6;i+=3){const xx=cx-i*(w/2-9)/(roofH-6);rect(c,xx,7+i,5,4,P.lightwood);rect(c,w-xx-5,7+i,5,4,P.wood);}
 rect(c,5,roofH+1,w-10,5,'#3d3128');rect(c,9,roofH+1,w-18,2,'#b18b57');
 // Carved dragon-like finials, each silhouette cut into hooked segments.
 poly(c,[[cx-5,13],[cx-11,8],[cx-13,0],[cx-8,2],[cx-6,7],[cx,9],[cx+6,7],[cx+8,2],[cx+13,0],[cx+11,8],[cx+5,13]],P.gold);
 const doorW=24,doorH=35,dy=base-doorH;
 rect(c,cx-doorW/2-4,dy-5,doorW+8,doorH+6,P.ink);rect(c,cx-doorW/2,dy,doorW,doorH,'#493b2d');
 for(let x=cx-doorW/2+2;x<cx+doorW/2;x+=6)rect(c,x,dy+2,3,doorH-3,'#795636');rect(c,cx-doorW/2,dy+8,doorW,3,'#2c352e');rect(c,cx-doorW/2,dy+25,doorW,3,'#2c352e');rect(c,cx+6,dy+18,3,3,P.gold);
 rect(c,cx-19,base+1,38,4,'#9c9d82');rect(c,cx-23,base+5,46,4,'#6e7d6e');
 windowPaint(c,27,wallTop+16);windowPaint(c,w-49,wallTop+16);
 // Warm lanterns flank each threshold.
 for(const x of [cx-25,cx+21]){rect(c,x,dy+6,4,14,P.ink);rect(c,x-2,dy+8,8,9,'#c0964e');rect(c,x,dy+9,4,6,'#ffe6a3');rect(c,x-3,dy+6,10,2,P.ink);}
 if(kind==='inn'||kind==='trader'){rect(c,w-27,13,14,30,P.ink);rect(c,w-25,15,10,24,'#788277');for(let y=17;y<38;y+=7)rect(c,w-25,y,10,2,'#a5a68c');rect(c,w-29,12,18,5,'#aaa98c');
 rect(c,cx-29,wallTop+5,58,12,P.ink);rect(c,cx-27,wallTop+7,54,8,'#ab8150');for(let xx=cx-21;xx<cx+22;xx+=6)rect(c,xx,wallTop+9,3,4,'#5a402b');
 }
 if(kind==='mill'){rect(c,23,base-24,30,20,'#302e24');for(let x=25;x<51;x+=8){ellipse(c,x,base-7,5,5,'#bd935c');ellipse(c,x,base-7,2,2,'#795534');}rect(c,21,base-25,34,3,P.wood);}
}
function heroSide(c:Brush,frame:number,facing:string,pose:string){
 const bob=frame===1?1:0,step=frame===1?-2:frame===2?2:0;
 c.save();if(facing==='left'){c.translate(32,0);c.scale(-1,1);}
 ellipse(c,16,37,10,2,'#273c36');rect(c,11,28,5,9+step/2,P.ink);rect(c,19,29,5,8-step/2,P.ink);
 rect(c,10,35+step/2,8,3,'#6d4d33');rect(c,19,35-step/2,8,3,'#6d4d33');rect(c,12,35+step/2,4,1,P.gold);rect(c,21,35-step/2,4,1,P.gold);
 rect(c,9,20+bob,15,12,P.ink);rect(c,11,21+bob,11,10,'#6f8784');rect(c,9,23+bob,4,7,'#5e4734');rect(c,14,22+bob,5,8,'#a0b1a5');rect(c,15,25+bob,5,2,'#526c68');rect(c,16,29+bob,4,3,'#c0cabb');rect(c,10,30+bob,14,2,'#493b2d');rect(c,22,29+bob,2,3,P.gold);
 poly(c,[[11,9+bob],[16,7+bob],[23,10+bob],[25,14+bob],[26,16+bob],[24,19+bob],[22,22+bob],[13,20+bob],[10,16+bob]],P.ink);
 rect(c,12,11+bob,11,7,'#75908a');rect(c,13,9+bob,7,3,'#bac6b4');rect(c,21,14+bob,4,5,'#d8ad81');rect(c,22,15+bob,3,2,P.ink);rect(c,22,19+bob,3,2,'#916b4a');rect(c,12,16+bob,5,6,'#526c68');rect(c,18,10+bob,3,9,'#afbeb0');
 poly(c,[[14,12+bob],[8,12+bob],[4,7+bob],[4,1+bob],[7,0+bob],[7,5+bob],[10,8+bob],[14,8+bob]],P.ink);
 poly(c,[[14,10+bob],[9,10+bob],[6,6+bob],[5,2+bob],[6,2+bob],[8,6+bob],[14,9+bob]],P.cream);
 poly(c,[[18,11+bob],[23,10+bob],[27,6+bob],[28,0+bob],[30,2+bob],[29,8+bob],[25,13+bob],[19,14+bob]],P.ink);
 poly(c,[[19,11+bob],[24,10+bob],[28,5+bob],[29,2+bob],[28,8+bob],[24,12+bob],[19,13+bob]],'#c8c5a2');
 if(pose==='throw'){rect(c,19,21,9,4,'#a4b7aa');rect(c,25,15,5,8,'#a4b7aa');rect(c,25,12,5,4,P.cream);}
 c.restore();
}
function humanoid(c:Brush,index:number,frame:number,dir='down',hero=false,pose='walk'){
 if(hero&&(dir==='left'||dir==='right')){heroSide(c,frame,dir,pose);return;}
 const bob=frame===1?1:0, step=frame===1?-2:frame===2?2:0;
 const palettes=[['#6c5041','#d49669','#704531'],['#795c67','#e1b38e','#c2a66d'],['#9f6d51','#e2b08b','#bb8453'],['#4f786e','#d4ad89','#ac7949'],['#6d6248','#cf9a72','#9f6d42'],['#658484','#dfb48b','#c6a05a'],['#845147','#deb08a','#c6a664'],['#43684c','#c9ad80','#654a2c'],['#81709b','#dfaf8d','#543c31'],['#927350','#d0a17c','#4c342b'],['#50636a','#d0a27c','#bba477'],['#795a46','#d0a17c','#5a4433'],['#6a6c4f','#d19b79','#6f5540'],['#636b82','#dab493','#b7baad'],['#507c8e','#d5a780','#c8a570'],['#9b5d4e','#cda17e','#704630'],['#70815b','#c7ac89','#b39c70'],['#5a7782','#d6b18e','#75533a']];
 const [shirt,skin,hair]=palettes[index%palettes.length];const small=index===2||index===5;const dy=small?4:0;
 ellipse(c,16,37,10,2,'#273c36');
 rect(c,10,29+dy,5,7-dy+step/2,P.ink);rect(c,18,29+dy,5,7-dy-step/2,P.ink);rect(c,9,35+step/2,7,3,'#5c4332');rect(c,18,35-step/2,7,3,'#5c4332');rect(c,10,35+step/2,3,1,'#ac8050');rect(c,19,35-step/2,3,1,'#ac8050');
 rect(c,8,19+bob+dy,17,13-dy,P.ink);rect(c,10,20+bob+dy,13,10-dy,hero?'#6f8784':shirt);
 rect(c,7,20+bob+dy,4,9-dy,hero?'#a0ada0':shirt);rect(c,23,20+bob+dy,4,9-dy,hero?'#637b75':shirt);
 rect(c,7,27+bob,4,4,hero?'#a4b7aa':skin);rect(c,23,27+bob,4,4,hero?'#a4b7aa':skin);
 rect(c,10,29+bob,14,3,'#463e2e');rect(c,16,29+bob,3,3,P.gold);
 rect(c,11,10+bob+dy,12,11,P.ink);rect(c,12,11+bob+dy,10,9,skin);rect(c,14,20+bob+dy,6,2,skin);
 if(hero){
  rect(c,10,8+bob,14,11,P.ink);rect(c,11,9+bob,12,8,'#718d88');rect(c,13,8+bob,8,2,'#bdc9b6');rect(c,15,8+bob,3,13,'#b5c4b6');rect(c,10,12+bob,3,9,'#536f6a');rect(c,22,12+bob,3,9,'#536f6a');rect(c,12,17+bob,3,2,P.ink);rect(c,19,17+bob,3,2,P.ink);rect(c,16,20+bob,3,2,'#6b4e36');
  // Both horns turn out, rise, and curl in. They dominate the sprite silhouette.
  poly(c,[[11,11+bob],[6,12+bob],[2,8+bob],[1,1+bob],[4,0+bob],[4,5+bob],[7,8+bob],[11,8+bob]],P.ink);
  poly(c,[[11,10+bob],[6,10+bob],[3,7+bob],[2,2+bob],[3,2+bob],[5,7+bob],[11,9+bob]],P.cream);
  poly(c,[[23,11+bob],[27,12+bob],[31,8+bob],[31,1+bob],[28,0+bob],[28,5+bob],[26,8+bob],[23,8+bob]],P.ink);
  poly(c,[[23,10+bob],[27,10+bob],[30,7+bob],[30,2+bob],[29,2+bob],[27,7+bob],[23,9+bob]],P.cream);
  rect(c,12,23+bob,3,5,'#b0beb0');rect(c,17,22+bob,5,2,'#b0beb0');rect(c,17,25+bob,5,2,'#4a625d');
  if(dir==='up'){rect(c,11,12+bob,13,10,'#536d69');rect(c,16,10+bob,3,10,'#a3b6aa');rect(c,12,23+bob,10,6,'#6a503c');}
  if(dir==='left'||dir==='right'){rect(c,dir==='left'?11:21,16+bob,2,2,P.ink);rect(c,dir==='left'?21:11,13+bob,3,8,'#526c68');}
 }else{
  rect(c,11,7+bob+dy,12,5,hair);rect(c,9,10+bob+dy,4,8,hair);rect(c,22,10+bob+dy,3,9,hair);rect(c,13,7+bob+dy,7,2,'#d3b37b');
  rect(c,13,15+bob+dy,2,2,P.ink);rect(c,19,15+bob+dy,2,2,P.ink);rect(c,16,19+bob+dy,3,1,'#86523e');
  if([1,3,8,10,13].includes(index)){rect(c,8,14+bob+dy,4,11,hair);rect(c,22,15+bob+dy,4,10,hair);rect(c,10,30,14,4,shirt);}
  if([0,4,9,11,12].includes(index)){rect(c,12,18+bob,10,5,hair);rect(c,15,18+bob,4,2,skin);}
  if(index===0){rect(c,12,23+bob,10,7,'#4e3b2d');rect(c,25,21+bob,3,12,'#9ba79a');rect(c,23,20+bob,7,4,'#cad1bc');}
  if(index===6){rect(c,24,19+bob,2,13,P.gold);ellipse(c,25,29+bob,4,5,'#bd9355');rect(c,24,26+bob,2,6,P.ink);}
  if(index===7){rect(c,8,14+bob,4,2,skin);rect(c,25,14+bob,4,2,skin);poly(c,[[27,15],[30,19],[30,30],[27,34],[28,29],[28,20]],P.gold);}
  if(index===14){rect(c,10,22+bob,13,3,'#acb6a3');rect(c,11,25+bob,11,3,'#435960');}
  if(index===15){rect(c,10,7+bob,14,6,'#b5ab90');rect(c,15,5+bob,4,7,'#8f493d');rect(c,11,22+bob,12,3,P.gold);}
 }
 if(pose==='throw'){rect(c,23,19,5,5,'#a4b7aa');rect(c,27,14,4,8,'#a4b7aa');rect(c,27,12,4,4,P.cream);}
 if(pose==='victory'){rect(c,5,14,5,11,'#a4b7aa');rect(c,24,14,5,11,'#a4b7aa');rect(c,4,11,5,5,P.cream);rect(c,25,11,5,5,P.cream);}
}

export function createArt(scene:Phaser.Scene):void {
 stamp(scene,'grass',32,32,c=>{rect(c,0,0,32,32,P.grass);dots(c,75,32,32,['#718b61','#5c7a58','#7b905e']);for(let i=0;i<5;i++){const x=Math.floor(random()*28),y=Math.floor(random()*28);rect(c,x,y,1,3,'#4e7254');rect(c,x+2,y+1,1,2,'#88a06b');}});
 stamp(scene,'path',32,32,c=>{rect(c,0,0,32,32,P.dirt);dots(c,110,32,32,['#aa9871','#96835f','#b9a37c']);for(let i=0;i<6;i++){const x=random()*29,y=random()*30;rect(c,x,y,3,2,'#c6b48a');rect(c,x,y+2,3,1,'#887c60');}});
 for(let f=0;f<2;f++)stamp(scene,'water'+f,32,32,c=>{rect(c,0,0,32,32,P.river);for(let y=1;y<32;y+=6){const x=(y*7+f*5)%25;rect(c,x,y,7,1,'#65a4a4');rect(c,(x+12)%26,y+2,6,1,'#2e6f81');rect(c,(x+5)%28,y+3,4,1,'#8dbeb5');}});
 stamp(scene,'stone',32,32,c=>{rect(c,0,0,32,32,'#687b6b');for(let y=0;y<32;y+=9)for(let x=-8;x<32;x+=16){const xx=x+(y%2)*8;rect(c,xx,y,14,7,'#8a9680');rect(c,xx+1,y+1,11,2,'#a5ab8c');rect(c,xx,y+6,14,1,'#4c675b');}});
 stamp(scene,'pine',64,96,c=>tree(c));
 stamp(scene,'rock',48,40,c=>{ellipse(c,24,34,22,5,'#345140');poly(c,[[3,28],[8,12],[20,4],[35,7],[45,24],[40,35],[10,36]],P.ink);poly(c,[[5,27],[11,13],[21,6],[34,9],[42,25],[38,32],[12,33]],'#6a7c70');poly(c,[[11,14],[21,6],[32,10],[25,16],[12,20]],'#a0a58a');poly(c,[[25,16],[34,9],[42,25],[33,29]],'#53695f');rect(c,10,29,8,3,'#72905d');rect(c,13,27,4,2,'#8ba26a');rect(c,29,13,5,1,'#bdbea0');});
 stamp(scene,'fence',32,24,c=>{for(const x of [1,25]){rect(c,x,0,6,24,P.ink);rect(c,x+1,1,3,21,P.lightwood);rect(c,x+2,2,1,15,P.gold);}for(const y of [5,15]){rect(c,0,y,32,5,P.wood);rect(c,0,y,32,2,P.lightwood);}});
 stamp(scene,'barrel',20,24,c=>{ellipse(c,10,22,9,2,'#243d31');ellipse(c,10,12,8,10,P.ink);rect(c,3,5,14,14,P.wood);for(let x=4;x<17;x+=4)rect(c,x,4,2,16,P.lightwood);ellipse(c,10,4,7,3,'#bf9256');ellipse(c,10,4,5,1,'#735035');rect(c,2,8,16,3,'#60736b');rect(c,3,17,14,3,'#60736b');rect(c,4,8,3,1,'#a8b2a0');});
 stamp(scene,'logs',48,24,c=>{for(const [x,y] of [[1,12],[16,12],[31,12],[8,3],[23,3]]){rect(c,x,y,14,10,'#503c2b');rect(c,x,y+1,14,2,'#a57845');ellipse(c,x+6,y+5,6,5,'#c6a063');ellipse(c,x+6,y+5,4,3,'#826138');ellipse(c,x+6,y+5,2,1,'#d1ad70');}});
 stamp(scene,'sign',24,32,c=>{rect(c,10,9,4,23,'#493b2c');rect(c,11,12,2,18,'#a87d48');poly(c,[[1,3],[19,3],[23,7],[19,11],[1,11]],P.ink);poly(c,[[2,4],[18,4],[21,7],[18,9],[2,9]],P.lightwood);rect(c,4,6,11,1,'#4d3c2b');rect(c,2,15,19,7,P.wood);rect(c,4,16,13,1,P.gold);});
 stamp(scene,'flower',16,16,c=>{rect(c,7,8,1,8,'#365b41');rect(c,4,11,4,2,'#91ab69');rect(c,8,13,4,2,'#4f7649');rect(c,5,3,5,7,'#a1aad0');rect(c,3,5,9,3,'#b6bbd8');rect(c,6,5,3,3,'#e6d98d');});
 stamp(scene,'forge',64,48,c=>{ellipse(c,31,44,30,4,'#334936');rect(c,2,24,36,21,'#45584f');for(let y=25;y<43;y+=6)for(let x=3;x<37;x+=10){rect(c,x,y,8,4,'#89927a');rect(c,x,y+4,8,1,'#283c35');}rect(c,8,20,25,13,'#2b3128');rect(c,12,26,17,8,'#a94f2e');rect(c,15,27,12,5,'#ed9848');rect(c,20,23,6,7,'#ffe0a0');rect(c,4,2,8,26,'#69776a');rect(c,2,2,12,5,'#a0a38a');rect(c,42,29,16,16,P.wood);poly(c,[[39,20],[63,20],[59,27],[54,27],[54,32],[45,32],[45,27],[40,25]],'#293f3b');rect(c,39,19,24,3,'#b1b9a5');rect(c,45,24,13,2,'#718b7c');rect(c,51,4,3,14,P.lightwood);rect(c,48,3,11,6,'#b5bfab');});
 for(let f=0;f<2;f++)stamp(scene,'fire'+f,16,24,c=>{poly(c,[[2,22],[1,15],[5,8],[6,13],[9,f?0:4],[12,9],[12,14],[14,10],[16,19],[13,23]],'#c56635');poly(c,[[4,22],[4,16],[8,10],[9,16],[12,12],[13,20],[11,23]],'#f3af55');poly(c,[[6,23],[6,18],[9,14],[11,21],[9,23]],'#ffe6a1');});
 stamp(scene,'wheel',64,64,c=>{ellipse(c,32,32,30,30,P.ink);ellipse(c,32,32,27,27,P.wood);ellipse(c,32,32,21,21,'#35564e');for(let i=0;i<8;i++){c.save();c.translate(32,32);c.rotate(i*Math.PI/4);rect(c,-3,-28,6,29,P.lightwood);rect(c,-2,-27,2,24,P.gold);rect(c,-8,-29,16,6,'#4b3b2d');rect(c,-7,-29,14,2,'#bd9257');c.restore();}ellipse(c,32,32,7,7,P.ink);ellipse(c,32,32,5,5,'#b2a271');rect(c,30,30,4,4,'#4c6157');});
 stamp(scene,'ball',16,16,c=>{ellipse(c,8,8,7,7,P.ink);ellipse(c,8,8,6,6,'#e3d4ac');poly(c,[[2,7],[3,4],[5,2],[10,2],[13,4],[14,7]],'#bd6655');rect(c,2,7,13,3,P.ink);rect(c,6,6,5,5,P.ink);rect(c,7,7,3,3,'#f6e5be');rect(c,4,3,3,1,'#efab81');});
 stamp(scene,'chicken',32,32,c=>{ellipse(c,16,29,11,2,'#28453a');rect(c,10,23,3,6,'#dca34f');rect(c,20,23,3,6,'#dca34f');rect(c,8,28,7,2,'#c68d3e');rect(c,19,28,7,2,'#c68d3e');poly(c,[[5,21],[1,15],[2,9],[8,14],[12,10],[23,10],[28,17],[25,25],[11,26]],P.ink);poly(c,[[6,20],[3,13],[8,16],[12,12],[22,12],[26,18],[24,23],[12,24]],'#e8dfb9');ellipse(c,16,19,7,4,'#babb9d');ellipse(c,14,17,6,4,'#f6eccb');rect(c,20,5,8,10,'#eee2bc');rect(c,22,3,3,5,'#c7604c');rect(c,25,2,3,5,'#dd7151');rect(c,24,8,2,2,P.ink);poly(c,[[28,10],[32,12],[28,14]],'#dca34f');rect(c,25,14,3,4,'#bb5543');});
 stamp(scene,'dog',40,32,c=>{ellipse(c,21,29,17,2,'#294536');rect(c,8,21,5,8,'#69462d');rect(c,25,21,5,8,'#69462d');poly(c,[[6,23],[3,13],[0,10],[1,7],[6,10],[11,13],[25,10],[34,13],[35,23]],'#342e24');ellipse(c,19,19,12,8,'#aa8250');rect(c,27,7,9,13,'#c29a63');rect(c,25,5,5,12,'#65472e');rect(c,35,7,4,7,'#765236');rect(c,31,11,2,2,P.ink);rect(c,34,15,6,5,'#d7b781');rect(c,37,15,3,2,P.ink);rect(c,32,21,3,3,'#cb7d64');rect(c,12,14,10,5,'#d2ad73');});
 stamp(scene,'bear',128,112,c=>{ellipse(c,66,103,54,7,'#293d32');
 // Large muscular silhouette with layered fur, round ears and expressive muzzle.
 ellipse(c,66,63,43,41,P.ink);ellipse(c,67,61,39,38,'#694831');ellipse(c,57,55,30,31,'#89613d');ellipse(c,83,66,22,31,'#573e2d');
 ellipse(c,27,71,17,28,P.ink);ellipse(c,29,69,14,25,'#8d633e');ellipse(c,105,71,15,28,P.ink);ellipse(c,102,68,13,25,'#765032');
 ellipse(c,45,94,22,12,P.ink);ellipse(c,45,92,19,10,'#775234');ellipse(c,88,94,22,12,P.ink);ellipse(c,88,92,19,10,'#65462f');
 for(const x of [31,40,49,75,84,93]){rect(c,x,98,5,6,'#d8c291');rect(c,x,98,2,3,'#f0dfb3');}
 ellipse(c,42,18,12,13,P.ink);ellipse(c,42,18,8,9,'#926b45');ellipse(c,42,19,4,5,'#4a372c');ellipse(c,88,18,12,13,P.ink);ellipse(c,88,18,8,9,'#926b45');ellipse(c,88,19,4,5,'#4a372c');
 ellipse(c,65,33,32,28,P.ink);ellipse(c,65,32,29,25,'#976c43');ellipse(c,58,25,20,16,'#af8252');ellipse(c,80,36,13,18,'#795235');
 poly(c,[[42,27],[55,28],[56,33],[44,32]],'#3e3026');poly(c,[[75,28],[88,25],[87,31],[75,33]],'#3e3026');rect(c,47,32,6,4,'#eed6a1');rect(c,78,32,6,4,'#eed6a1');rect(c,50,32,3,4,P.ink);rect(c,78,32,3,4,P.ink);
 ellipse(c,65,46,18,13,'#c29a65');ellipse(c,65,41,10,6,'#2b2d26');rect(c,60,38,8,2,'#6b6d50');rect(c,64,45,3,8,'#503a2b');rect(c,57,53,19,3,'#4b3528');rect(c,55,51,3,5,'#ead7a5');rect(c,74,51,3,5,'#ead7a5');
 for(let i=0;i<70;i++){const x=32+Math.floor(random()*65),y=56+Math.floor(random()*33);if((x-65)**2/1300+(y-64)**2/1200<1)rect(c,x,y,2+(i%3),2,i%3?'#9a7147':'#543d2a');}
 for(const x of [17,23,29,99,105,111])rect(c,x,89,3,6,'#dac594');rect(c,47,65,17,3,'#b38a54');rect(c,51,69,11,2,'#b38a54');
 });
 stamp(scene,'feather',12,16,c=>{poly(c,[[9,0],[12,4],[10,10],[4,14],[1,16],[4,9],[5,3]],'#e4e4c7');rect(c,6,4,1,8,'#aab8aa');rect(c,3,12,3,1,'#aab8aa');});
 for(const [key,w,h] of [['house',160,144],['trader',192,160],['inn',224,176],['mill',160,144]] as [string,number,number][])stamp(scene,key,w,h,c=>building(c,w,h,key));
 for(const d of ['down','up','left','right'])for(let f=0;f<3;f++)stamp(scene,`hero-${d}-${f}`,32,40,c=>humanoid(c,0,f,d,true));
 stamp(scene,'hero-throw',32,40,c=>humanoid(c,0,0,'right',true,'throw'));
 stamp(scene,'hero-victory',32,40,c=>humanoid(c,0,0,'down',true,'victory'));
 for(let n=0;n<18;n++)for(let f=0;f<2;f++)stamp(scene,`npc-${n}-${f}`,32,40,c=>humanoid(c,n,f));
 // Interior furnishings use the same timber, iron and ochre palette as the village.
 stamp(scene,'shelf',128,64,c=>{
  rect(c,3,2,122,60,P.ink);rect(c,8,5,112,53,'#443c2d');
  for(const y of [7,30,55]){rect(c,6,y,116,5,P.wood);rect(c,7,y,114,2,P.lightwood);rect(c,9,y+5,111,2,'#2b332b');}
  for(const x of [4,119]){rect(c,x,2,6,61,P.wood);rect(c,x+1,3,2,59,P.lightwood);rect(c,x,60,7,4,P.ink);}
  // Bottles have corks, glass highlights, and softly coloured contents.
  for(const [x,y,col] of [[15,14,'#638e81'],[28,14,'#809876'],[42,16,'#b79961'],[77,37,'#688c8b'],[91,36,'#987293']] as [number,number,string][]){
   rect(c,x+3,y,4,3,'#b49662');rect(c,x+2,y+3,6,4,col);rect(c,x,y+7,10,9,col);rect(c,x+1,y+8,2,6,'#c3c4a1');rect(c,x+4,y+12,5,2,'#d1c5a0');rect(c,x,y+16,10,1,P.ink);
  }
  for(let i=0;i<6;i++){const x=60+i*8,h=13+(i%3)*3;rect(c,x,30-h,6,h,['#ac7051','#6e9190','#b39963'][i%3]);rect(c,x+1,31-h,1,h-2,'#d9c58e');rect(c,x,27,6,1,P.ink);}
  for(const x of [15,37,104]){ellipse(c,x+7,47,9,8,'#9d895b');rect(c,x+3,37,8,4,'#c1ad74');rect(c,x+4,40,7,2,P.wood);rect(c,x+2,45,3,5,'#baa56e');}
  rect(c,54,44,15,10,'#795c44');rect(c,54,44,15,2,P.gold);rect(c,59,48,4,2,'#c3a674');
 });
 stamp(scene,'counter',128,48,c=>{
  ellipse(c,64,44,61,4,'#293c31');rect(c,5,13,118,31,P.ink);rect(c,8,15,112,25,P.wood);
  for(let x=10;x<120;x+=14){rect(c,x,16,2,23,'#4e3b2b');rect(c,x+3,17,2,21,'#9a7044');}rect(c,6,37,116,5,'#4f3b2b');rect(c,7,37,114,2,'#b18b55');
  rect(c,1,3,126,17,P.ink);rect(c,3,4,122,12,'#ab8350');for(let y=5;y<16;y+=4){rect(c,4,y,120,1,'#715133');for(let x=9;x<118;x+=23)rect(c,x,y+1,12,1,'#c29a60');}rect(c,3,16,122,3,'#64472d');
  rect(c,41,5,24,10,'#dacb9d');rect(c,43,7,18,1,'#8b805d');rect(c,43,10,15,1,'#8b805d');rect(c,43,12,19,1,'#8b805d');rect(c,61,4,3,3,'#e8dbad');
  for(const x of [14,97]){rect(c,x,4,8,9,'#bdae7c');rect(c,x+1,4,6,2,'#54432e');rect(c,x+7,6,4,5,'#bdae7c');rect(c,x+8,7,2,3,'#4f4531');rect(c,x+1,7,2,5,'#e4d19b');}
  for(const [x,y] of [[76,11],[81,8],[86,12],[74,6]]){ellipse(c,x,y,3,2,'#d8b366');rect(c,x-1,y-1,2,1,'#f2dc96');}
 });
 stamp(scene,'bed',96,128,c=>{
  ellipse(c,47,120,44,7,'#263b30');rect(c,8,4,80,115,P.ink);rect(c,13,10,70,106,'#684831');
  for(const x of [7,81]){rect(c,x,2,8,121,'#775236');rect(c,x+1,3,3,118,'#af8350');rect(c,x-1,0,10,8,'#c09a61');rect(c,x,5,8,2,'#513e2b');}
  rect(c,15,6,66,15,'#a77946');rect(c,18,9,60,8,'#493c2d');for(let x=20;x<77;x+=10){poly(c,[[x,13],[x+4,9],[x+8,13],[x+4,17]],'#b58b53');}
  rect(c,17,23,62,83,'#d4c69d');rect(c,21,25,54,20,'#ede0b9');rect(c,22,25,52,3,'#fff0c6');rect(c,21,43,54,3,'#a49b7c');rect(c,24,29,3,10,'#d5c9a3');
  rect(c,17,49,62,57,'#625e48');rect(c,18,50,60,6,'#a89b70');rect(c,17,57,62,45,'#817452');
  for(let i=0;i<145;i++){const x=18+Math.floor(random()*59),y=54+Math.floor(random()*49);rect(c,x,y,2+(i%3),1,i%3?'#9e9067':'#5f5c45');}
  for(let y=61;y<99;y+=10){rect(c,23,y,50,2,'#615f4b');rect(c,26,y+2,44,1,'#b4a279');}
  rect(c,16,105,64,11,'#a57845');rect(c,17,106,62,2,'#c59d62');rect(c,18,111,60,3,'#5b4430');
 });
 stamp(scene,'table',112,72,c=>{
  ellipse(c,56,63,52,7,'#293b2f');
  for(const [x,y] of [[4,26],[87,26],[44,53]]){rect(c,x+3,y+8,15,11,'#4b3929');rect(c,x,y,23,11,P.ink);rect(c,x+2,y+1,19,7,'#a57a48');rect(c,x+3,y+3,16,1,'#c49a5c');}
  rect(c,25,35,7,25,'#694b32');rect(c,80,35,7,25,'#694b32');rect(c,26,37,2,21,'#ac8150');rect(c,81,37,2,21,'#ac8150');
  rect(c,16,8,80,39,P.ink);rect(c,18,9,76,33,'#a77d4b');rect(c,18,42,76,4,'#6e4e30');
  for(let y=10;y<42;y+=8){rect(c,19,y,74,1,'#6b4b30');for(let x=22;x<89;x+=20){rect(c,x,y+2,12,1,'#c99f61');rect(c,x+4,y+5,11,1,'#92673e');}}
  for(const [x,y] of [[34,22],[73,29]]){ellipse(c,x,y,9,6,'#665a3d');ellipse(c,x,y-1,8,5,'#ded1a1');ellipse(c,x,y-1,5,3,'#aaa27b');ellipse(c,x+1,y-1,3,2,'#be8d51');}
  rect(c,54,15,8,9,'#c5b485');rect(c,55,15,6,2,'#483b29');rect(c,61,17,4,5,'#c5b485');rect(c,62,18,2,3,'#6b5131');rect(c,55,18,2,4,'#eee0ad');
  rect(c,46,33,16,3,'#5b4930');rect(c,47,32,8,2,'#d1d2b2');
 });
 stamp(scene,'rug',192,112,c=>{
  rect(c,6,4,180,104,'#302f29');rect(c,8,6,176,100,'#995e49');rect(c,13,11,166,90,'#c7a269');rect(c,18,16,156,80,'#576c63');
  for(let x=9;x<185;x+=5){rect(c,x,1,2,6,'#c3a270');rect(c,x,106,2,6,'#c3a270');}
  for(let x=21;x<171;x+=12){poly(c,[[x,22],[x+5,17],[x+10,22],[x+5,27]],'#b6a06c');poly(c,[[x,90],[x+5,85],[x+10,90],[x+5,95]],'#b6a06c');}
  for(let y=29;y<81;y+=12){poly(c,[[23,y],[28,y+5],[23,y+10],[18,y+5]],'#b6a06c');poly(c,[[168,y],[173,y+5],[168,y+10],[163,y+5]],'#b6a06c');}
  poly(c,[[96,24],[154,56],[96,88],[38,56]],'#d0b079');poly(c,[[96,30],[144,56],[96,82],[48,56]],'#965f48');poly(c,[[96,38],[130,56],[96,74],[62,56]],'#d0b079');poly(c,[[96,43],[120,56],[96,69],[72,56]],'#566e62');
  rect(c,92,46,8,20,'#cdb47e');rect(c,83,52,26,8,'#cdb47e');rect(c,94,49,4,14,'#9a684d');
  for(let y=8;y<105;y+=3){rect(c,10,y,172,1,'rgba(27,40,33,.13)');}
 });
 stamp(scene,'hearth',112,96,c=>{
  ellipse(c,56,90,54,5,'#2a3a30');rect(c,9,0,94,83,P.ink);rect(c,12,2,88,79,'#667264');
  for(let y=4;y<77;y+=12)for(let x=12;x<100;x+=22){const xx=x+(y%24?0:-10);rect(c,Math.max(12,xx),y,Math.min(20,100-Math.max(12,xx)),9,'#8c937a');rect(c,Math.max(13,xx+1),y+1,Math.min(17,99-Math.max(13,xx+1)),2,'#afb196');}
  rect(c,26,31,60,47,'#292e26');poly(c,[[26,40],[34,28],[77,28],[86,40]],'#292e26');
  rect(c,30,57,52,20,'#4b3929');rect(c,34,65,44,10,'#2d2b23');
  for(const [x,y] of [[33,69],[53,70]]){rect(c,x,y,25,5,'#67462c');rect(c,x+1,y,23,2,'#a76c36');ellipse(c,x+23,y+2,3,3,'#c29250');}
  rect(c,4,78,104,13,'#45584e');rect(c,7,79,98,5,'#9c9f85');for(let x=9;x<103;x+=19)rect(c,x,85,16,4,'#6c7d6d');
  rect(c,6,20,100,7,'#3d4b40');rect(c,7,20,98,3,'#b0af8e');
  rect(c,18,9,5,10,'#e2cf9a');rect(c,19,5,3,5,'#e8b260');rect(c,84,10,12,9,'#8b6942');rect(c,86,9,8,2,'#c5a069');
 });
 stamp(scene,'panorama',960,540,c=>{
 rect(c,0,0,960,540,'#87a9a7');rect(c,0,0,960,95,'#688e97');rect(c,0,95,960,83,'#83a5a7');rect(c,0,178,960,70,'#acc0ad');
 ellipse(c,703,109,40,40,'#e5d7a4');for(let y=110;y<150;y+=5)rect(c,660,y,88,2,'#c6c9ac');
 poly(c,[[0,264],[100,142],[161,203],[274,58],[370,185],[462,111],[600,267]],'#5d7c7d');poly(c,[[200,146],[274,58],[337,137],[305,118],[284,133],[267,104],[248,140]],'#d7decc');poly(c,[[395,224],[513,137],[588,209],[708,94],[862,242],[960,160],[960,330],[0,330]],'#78928a');poly(c,[[645,164],[708,94],[772,164],[729,139],[704,146],[692,125],[679,154]],'#ccd5c2');
 poly(c,[[0,281],[139,244],[279,277],[453,238],[587,279],[753,251],[960,278],[960,540],[0,540]],'#435f4b');
 for(let i=0;i<32;i++)tree(c,i*33-25,236+(i%4)*8,.7);
 poly(c,[[496,282],[568,282],[646,360],[653,409],[774,540],[365,540],[532,425],[554,365]],'#497f82');poly(c,[[522,282],[541,282],[600,363],[598,413],[659,540],[527,540],[578,409],[584,365]],'#75a09a');
 for(let i=0;i<65;i++){const y=299+Math.floor(random()*236),x=480+Math.floor(random()*150);rect(c,x,y,7+random()*25,1,'#acc5ae');}
 c.save();c.translate(84,302);building(c,224,176,'inn');c.restore();c.save();c.translate(684,296);building(c,192,160,'trader');c.restore();
 for(const [x,y,s] of [[-12,301,2.7],[174,417,1.7],[827,369,2.1],[903,302,2.7],[280,304,1.3],[748,412,1.7]])tree(c,x,y,s);
 rect(c,0,520,960,20,'#1f3830');for(let i=0;i<200;i++)rect(c,random()*960,512+random()*28,2,5,['#375843','#5a754a','#7e8f56'][i%3]);
 });
}
