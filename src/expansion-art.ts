import Phaser from 'phaser';

/** Original, locally painted pixel art for the holds and companion collection. */
type C = CanvasRenderingContext2D;
const P={ink:'#182827',dark:'#233c37',wood:'#775238',woodHi:'#ac8050',gold:'#d8b66c',cream:'#efdfb1',stone:'#758477',stoneHi:'#aab09a',teal:'#386e70',roof:'#42685f',rust:'#ae6b43',leaf:'#b89b50'};
let seed=198517;
const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
function r(c:C,x:number,y:number,w:number,h:number,color:string){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function p(c:C,pts:number[][],color:string){c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=color;c.fill();}
function e(c:C,x:number,y:number,rx:number,ry:number,color:string){for(let yy=-Math.ceil(ry);yy<=ry;yy++){const xx=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry))));r(c,x-xx,y+yy,xx*2+1,1,color);}}
function tex(scene:Phaser.Scene,key:string,w:number,h:number,draw:(c:C)=>void){if(scene.textures.exists(key))return;const cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d')!;c.imageSmoothingEnabled=false;draw(c);scene.textures.addCanvas(key,cv);}
function fur(c:C,x:number,y:number,w:number,h:number,n:number,colors:string[]){for(let i=0;i<n;i++)r(c,x+Math.floor(rnd()*w),y+Math.floor(rnd()*h),2+i%3,1,colors[i%colors.length]);}
function eyes(c:C,x:number,y:number){r(c,x,y,5,4,P.ink);r(c,x+2,y,2,2,P.cream);}
function shadow(c:C){e(c,49,74,40,4,'#294538');}
function paw(c:C,x:number,y:number,color:string){r(c,x,y,8,14,P.ink);r(c,x+1,y,6,11,color);r(c,x-2,y+11,12,4,P.ink);r(c,x-1,y+11,10,2,color);}
function fox(c:C,snow:boolean){
 const coat=snow?'#c3d3cb':'#b36d3e',hi=snow?'#e5e8cf':'#d59855',shade=snow?'#91aca9':'#865238',white=snow?'#f3edd6':'#e5d8af';shadow(c);
 // A raised, exceptionally bushy tail curls behind the haunches.
 p(c,[[32,58],[17,56],[7,47],[2,33],[6,19],[13,13],[12,30],[20,37],[34,41],[41,50]],P.ink);
 p(c,[[31,54],[18,52],[11,45],[6,33],[8,23],[12,19],[11,31],[19,40],[33,44],[37,50]],coat);
 p(c,[[7,34],[6,28],[8,22],[12,18],[11,29],[16,37]],white);r(c,17,43,8,3,hi);
 paw(c,35,58,shade);paw(c,64,59,shade);e(c,48,48,25,17,P.ink);e(c,49,47,23,15,coat);e(c,48,43,18,9,hi);
 p(c,[[63,35],[62,16],[70,22],[75,28],[82,15],[87,21],[88,37],[94,43],[91,53],[78,58],[63,53],[58,44]],P.ink);
 p(c,[[65,34],[65,21],[71,27],[76,32],[83,20],[85,24],[85,38],[91,44],[88,51],[78,55],[65,50],[61,43]],coat);
 p(c,[[66,25],[67,30],[71,32]],'#d6a68b');p(c,[[80,30],[83,24],[84,34]],'#d6a68b');
 p(c,[[64,40],[72,44],[77,48],[82,43],[89,42],[91,46],[87,52],[77,55],[66,50]],white);
 eyes(c,69,36);eyes(c,82,35);r(c,86,45,7,4,P.ink);r(c,88,45,2,1,'#84988a');r(c,78,51,8,1,'#826a51');
 if(snow){p(c,[[34,53],[28,50],[30,58],[35,57],[33,62],[39,59],[42,63],[46,59]],white);p(c,[[61,45],[56,51],[60,52],[58,57],[65,54],[67,58],[72,54]],white);fur(c,34,40,23,12,20,['#dfe4cf','#acc2bb']);}
 else {fur(c,34,41,23,11,17,['#bd7d46','#dca15b']);r(c,36,70,9,2,'#332e25');r(c,65,70,8,2,'#332e25');}
}
function wolf(c:C){shadow(c);p(c,[[32,50],[18,44],[6,48],[2,55],[13,54],[24,61],[37,61]],P.ink);p(c,[[31,52],[18,47],[7,50],[13,51],[25,57],[35,58]],'#748984');paw(c,30,59,'#7d9289');paw(c,64,58,'#91a397');e(c,49,47,27,18,P.ink);e(c,48,46,25,16,'#7c938c');p(c,[[27,39],[33,31],[43,30],[54,34],[65,32],[73,41],[67,52],[49,49]],'#a2b3a3');
 p(c,[[61,36],[62,9],[71,17],[74,25],[83,10],[89,16],[87,36],[95,44],[92,53],[79,60],[65,54],[55,45]],P.ink);
 p(c,[[63,35],[65,15],[70,22],[74,30],[83,16],[86,19],[84,38],[92,45],[89,51],[79,56],[66,51],[59,45]],'#92a79d');p(c,[[65,18],[68,23],[68,30]],'#536c67');p(c,[[79,30],[83,20],[84,34]],'#536c67');
 p(c,[[60,41],[66,43],[69,48],[78,51],[85,45],[92,44],[91,50],[80,57],[68,53],[61,48]],'#d0d5b8');r(c,68,35,6,4,P.ink);r(c,70,35,3,2,'#d4ba69');r(c,82,35,5,4,P.ink);r(c,83,35,2,2,'#d4ba69');r(c,88,44,7,4,P.ink);r(c,76,52,11,2,'#49574b');
 p(c,[[59,44],[51,53],[57,53],[53,60],[63,57],[62,64],[70,57],[67,48]],'#b9c8b4');fur(c,30,36,29,17,26,['#b7c6b3','#5f7872','#8ea398']);}
function mudcrab(c:C){shadow(c);
 // Eight angular legs fan out from a broad mottled carapace.
 for(const [x,y,dx] of [[28,48,-1],[27,55,-1],[31,63,-1],[36,68,-1],[67,49,1],[68,56,1],[65,64,1],[59,68,1]]){p(c,[[x,y],[x+dx*18,y-3],[x+dx*25,y+5],[x+dx*20,y+10],[x+dx*20,y+5],[x+dx*14,y+2],[x,y+5]],P.ink);r(c,x+dx*16,y,10,3,'#a08757');}
 e(c,48,50,29,24,P.ink);e(c,48,48,27,21,'#8d8055');e(c,46,43,22,15,'#b09a61');p(c,[[27,47],[32,33],[44,28],[58,31],[69,43],[59,37],[46,34],[35,39]],'#c7b079');
 for(let i=0;i<55;i++){const x=26+Math.floor(rnd()*44),y=35+Math.floor(rnd()*28);if((x-48)**2/570+(y-49)**2/300<1)r(c,x,y,3,2,['#6d6947','#c6ab6e','#9c8958'][i%3]);}
 for(const [x,flip] of [[18,-1],[77,1]]){p(c,[[x,49],[x+flip*8,40],[x+flip*13,24],[x+flip*9,13],[x+flip*2,22],[x,30],[x-flip*5,22],[x-flip*7,13],[x-flip*12,26],[x-flip*8,38],[x-flip*2,48]],P.ink);p(c,[[x,44],[x+flip*5,37],[x+flip*10,25],[x+flip*8,19],[x+flip*4,29],[x,34],[x-flip*7,27],[x-flip*7,20],[x-flip*9,27],[x-flip*6,35]],'#b78856');r(c,x-3,35,6,3,'#d5a566');}
 r(c,37,28,4,13,'#5e6249');r(c,56,28,4,13,'#5e6249');e(c,39,27,4,5,P.ink);e(c,58,27,4,5,P.ink);r(c,39,24,2,3,P.gold);r(c,58,24,2,3,P.gold);r(c,39,58,20,3,'#494b36');r(c,44,62,10,2,'#d0b17a');}
function skeever(c:C){shadow(c);p(c,[[35,59],[21,65],[9,63],[3,57],[1,46],[4,38],[7,39],[5,47],[7,55],[13,59],[23,60],[35,54]],P.ink);p(c,[[34,60],[20,63],[10,61],[5,56],[3,46],[5,40],[5,50],[9,57],[22,60],[34,55]],'#b88c7c');
 paw(c,38,61,'#b69b7d');paw(c,69,59,'#b69b7d');e(c,50,48,25,20,P.ink);e(c,49,46,23,18,'#746b57');e(c,45,40,17,11,'#9e9275');fur(c,33,35,26,24,40,['#b4a383','#5e5b4b','#887b64']);
 p(c,[[57,35],[64,23],[79,28],[83,38],[95,49],[90,56],[74,59],[60,53]],P.ink);p(c,[[59,35],[65,26],[76,30],[81,41],[91,49],[88,53],[73,56],[62,50]],'#9c8f72');e(c,63,25,9,11,P.ink);e(c,63,25,7,8,'#b6a17f');e(c,64,25,4,6,'#b77e72');e(c,80,28,7,9,P.ink);e(c,80,28,5,6,'#b6a17f');e(c,80,28,3,4,'#b77e72');eyes(c,77,39);e(c,92,49,4,3,'#b77e72');r(c,84,53,3,5,P.cream);r(c,87,53,3,5,P.cream);r(c,79,48,10,1,'#d0bda0');r(c,81,51,11,1,'#d0bda0');}
function goat(c:C){shadow(c);paw(c,29,58,'#a4a791');paw(c,60,58,'#a4a791');e(c,45,46,26,19,P.ink);e(c,45,44,24,17,'#b9b99b');e(c,39,40,19,12,'#dbd6af');p(c,[[23,42],[13,36],[14,30],[20,34],[27,35]],P.cream);fur(c,25,35,33,22,35,['#eeE2b7','#9dA18a','#c7c4a0']);
 p(c,[[61,38],[60,24],[65,17],[76,16],[85,23],[83,42],[90,48],[86,55],[74,60],[63,52]],P.ink);p(c,[[64,37],[63,25],[67,20],[75,19],[82,25],[80,43],[87,49],[83,53],[74,56],[66,50]],'#d0cbaa');
 p(c,[[65,25],[56,21],[51,23],[54,29],[65,31]],'#b0af93');p(c,[[81,25],[90,21],[95,24],[92,29],[81,31]],'#b0af93');
 p(c,[[65,21],[59,12],[59,3],[64,0],[66,3],[64,9],[69,18]],P.ink);p(c,[[65,18],[61,10],[61,4],[63,2],[63,9],[68,18]],P.cream);p(c,[[76,19],[75,10],[78,2],[84,0],[88,3],[83,6],[81,11],[81,22]],P.ink);p(c,[[78,18],[77,10],[80,4],[84,2],[85,3],[81,7],[79,18]],P.cream);
 r(c,67,32,6,3,P.ink);r(c,68,32,3,1,'#dab36c');r(c,78,32,5,3,P.ink);r(c,79,32,2,1,'#dab36c');e(c,79,49,7,4,'#8b8e78');r(c,80,48,2,2,P.ink);p(c,[[71,55],[74,68],[77,64],[80,66],[82,56]],'#d9d5b1');}
function sabrecat(c:C){shadow(c);p(c,[[30,56],[19,48],[12,33],[12,22],[8,19],[4,22],[7,28],[8,37],[15,53],[27,64]],P.ink);p(c,[[29,59],[17,51],[10,35],[10,25],[7,23],[9,33],[12,44],[20,55]],'#be8e4e');paw(c,31,58,'#af7b43');paw(c,65,59,'#af7b43');e(c,48,48,28,20,P.ink);e(c,47,47,25,18,'#bd8b4c');e(c,44,40,21,11,'#d9ac65');
 e(c,62,23,8,9,P.ink);e(c,62,23,5,6,'#ac7441');e(c,83,23,8,9,P.ink);e(c,83,23,5,6,'#ac7441');e(c,73,37,23,22,P.ink);e(c,73,36,20,19,'#c79a57');e(c,70,31,15,12,'#deb66c');p(c,[[55,35],[61,39],[64,45],[70,48],[75,43],[82,42],[88,47],[85,56],[70,59],[58,51]],'#e0cca0');e(c,76,45,7,4,P.ink);
 p(c,[[60,45],[66,46],[65,65],[61,69],[61,57]],P.ink);p(c,[[61,47],[65,48],[64,63],[62,66]],'#f1e1b5');p(c,[[81,45],[87,45],[86,61],[82,67],[82,55]],P.ink);p(c,[[83,47],[86,47],[85,60],[83,64]],'#f1e1b5');
 r(c,61,33,7,4,P.ink);r(c,63,33,3,2,'#8aab70');r(c,80,33,7,4,P.ink);r(c,81,33,3,2,'#8aab70');
 for(const [x,y] of [[30,34],[43,31],[50,35],[25,45],[40,45],[52,50],[35,56]]){r(c,x,y,3,8,'#6b5133');r(c,x+2,y+2,2,4,'#6b5133');}r(c,68,20,3,7,'#98713d');r(c,74,20,3,7,'#98713d');}
function window(c:C,x:number,y:number,w=20,h=25){r(c,x-3,y-3,w+6,h+6,P.ink);r(c,x-1,y-1,w+2,h+2,P.woodHi);r(c,x,y,w,h,'#d4af67');r(c,x+2,y+2,w-4,h-4,'#edcf89');r(c,x+w/2-1,y,3,h,P.wood);r(c,x,y+h/2,w,3,P.wood);r(c,x-4,y+h+2,w+8,3,P.wood);}
function masonry(c:C,x:number,y:number,w:number,h:number){r(c,x,y,w,h,'#4b5c50');for(let yy=y;yy<y+h;yy+=8)for(let xx=x-(yy%16?8:0);xx<x+w;xx+=17){const a=Math.max(x,xx),b=Math.min(x+w,xx+15);r(c,a,yy,b-a,6,P.stone);r(c,a+1,yy+1,Math.max(0,b-a-2),2,P.stoneHi);}}
function roof(c:C,x:number,y:number,w:number,h:number,color:string){p(c,[[x+w/2,y],[x+w,y+h],[x+w-3,y+h+7],[x+3,y+h+7],[x,y+h]],P.ink);p(c,[[x+w/2,y+6],[x+w-9,y+h],[x+9,y+h]],color);for(let yy=10;yy<h;yy+=7){const half=(yy-6)/(h-6)*(w/2-9);for(let xx=Math.ceil(x+w/2-half)+3;xx<x+w/2+half-5;xx+=11){r(c,xx,y+yy,9,2,'#879184');r(c,xx,y+yy+3,9,2,'#2b4b46');}}
 for(let i=0;i<h;i+=3){const xx=x+w/2-i*(w/2-4)/h;r(c,xx,y+i,4,4,P.woodHi);r(c,x+w-(xx-x)-4,y+i,4,4,P.wood);}r(c,x+4,y+h+1,w-8,4,P.wood);r(c,x+5,y+h+1,w-10,1,P.gold);
 p(c,[[x+w/2-3,y+8],[x+w/2-11,y+2],[x+w/2-12,y-4],[x+w/2-8,y-3],[x+w/2-6,y+2],[x+w/2,y+4],[x+w/2+6,y+2],[x+w/2+8,y-3],[x+w/2+12,y-4],[x+w/2+11,y+2],[x+w/2+3,y+8]],P.gold);}
function doorway(c:C,x:number,y:number,w=24,h=35){r(c,x-w/2-4,y-4,w+8,h+5,P.ink);r(c,x-w/2,y,w,h,'#4b3b2d');for(let xx=x-w/2+2;xx<x+w/2;xx+=6)r(c,xx,y+2,3,h-3,P.woodHi);for(const yy of [y+9,y+h-10])r(c,x-w/2,yy,w,3,'#293c33');r(c,x+5,y+18,3,3,P.gold);r(c,x-19,y+h+1,38,4,P.stoneHi);r(c,x-23,y+h+5,46,4,P.stone);}
function wall(c:C,x:number,y:number,w:number,h:number){r(c,x,y,w,h,P.ink);r(c,x+3,y+3,w-6,h-6,P.wood);for(let yy=y+5;yy<y+h-4;yy+=7){r(c,x+4,yy,w-8,2,P.woodHi);r(c,x+4,yy+4,w-8,1,'#463b2c');}for(const xx of [x+3,x+w-9]){r(c,xx,y,6,h,P.ink);r(c,xx+1,y+1,2,h-2,P.woodHi);}}
function hanging(c:C,x:number,y:number,color:string){r(c,x-2,y-3,30,4,P.woodHi);p(c,[[x,y],[x+24,y],[x+24,y+36],[x+12,y+43],[x,y+36]],P.ink);p(c,[[x+2,y+2],[x+22,y+2],[x+22,y+34],[x+12,y+40],[x+2,y+34]],color);r(c,x+4,y+4,2,29,P.gold);r(c,x+18,y+4,2,29,P.gold);e(c,x+12,y+22,5,5,P.gold);for(const [dx,dy] of [[6,14],[10,12],[15,12],[19,15]])e(c,x+dx,y+dy,2,3,P.gold);}
function house(c:C,w:number,h:number,riften:boolean,gym=false){const base=h-12,wy=riften?68:65,roofH=riften?78:66;e(c,w/2,h-5,w/2-6,5,'#2b4235');masonry(c,15,base-20,w-30,20);wall(c,17,wy,w-34,base-wy-10);
 if(riften){for(const xx of [25,w/2-3,w-30]){r(c,xx,wy,7,base-wy-9,P.ink);r(c,xx+1,wy,2,base-wy-9,P.woodHi);}r(c,17,wy+36,w-34,7,P.ink);r(c,18,wy+37,w-36,2,P.woodHi);}
 roof(c,2,5,w-4,roofH,riften?'#355c5b':'#6b795e');window(c,30,wy+20,20,22);window(c,w-51,wy+20,20,22);doorway(c,w/2,base-35);
 if(gym){hanging(c,w/2-59,wy+6,riften?'#386b70':'#9a5942');hanging(c,w/2+35,wy+6,riften?'#386b70':'#9a5942');r(c,w/2-20,wy-6,40,11,P.ink);r(c,w/2-18,wy-4,36,7,P.gold);r(c,w/2-10,wy-2,20,3,'#6d6547');}
 for(const x of [w/2-25,w/2+21]){r(c,x,base-28,4,16,P.ink);r(c,x-2,base-25,8,10,'#a8864d');r(c,x,base-24,4,7,'#ffe1a0');}
}
function leafCluster(c:C,x:number,y:number,rx:number,ry:number,color:string){e(c,x,y,rx,ry,P.ink);e(c,x,y-2,rx-2,ry-2,color);for(let i=0;i<20;i++){const xx=x-rx+3+Math.floor(rnd()*(rx*2-6)),yy=y-ry+3+Math.floor(rnd()*(ry*2-6));if((xx-x)**2/(rx*rx)+(yy-y)**2/(ry*ry)<.8)r(c,xx,yy,3,2,i%2?'#d6b65e':'#aa843e');}}

export function createExpansionArt(scene:Phaser.Scene):void{
 for(const key of ['fox','snowfox'])tex(scene,key,96,80,c=>fox(c,key==='snowfox'));
 tex(scene,'wolf',96,80,wolf);tex(scene,'mudcrab',96,80,mudcrab);tex(scene,'skeever',96,80,skeever);tex(scene,'goat',96,80,goat);tex(scene,'sabrecat',96,80,sabrecat);
 tex(scene,'whiterun-house',160,144,c=>house(c,160,144,false));tex(scene,'riften-house',160,160,c=>house(c,160,160,true));tex(scene,'gym-whiterun',224,176,c=>house(c,224,176,false,true));tex(scene,'gym-riften',224,176,c=>house(c,224,176,true,true));
 tex(scene,'whiterun-hall',256,192,c=>{
  e(c,128,184,121,6,'#2b4235');masonry(c,14,142,228,29);wall(c,22,87,212,68);roof(c,3,51,250,54,'#65755d');
  wall(c,68,52,120,96);roof(c,49,28,158,59,'#596f5b');wall(c,94,29,68,91);roof(c,82,5,92,54,'#527160');
  for(const [x,y,w,h] of [[35,110,20,24],[200,110,20,24],[80,88,17,24],[160,88,17,24],[116,59,24,31]])window(c,x,y,w,h);
  for(const x of [24,62,187,225]){r(c,x,110,7,49,P.ink);r(c,x+1,112,3,46,P.woodHi);r(c,x-2,149,11,7,P.gold);}
  doorway(c,128,125,32,39);hanging(c,73,113,'#967540');hanging(c,160,113,'#967540');
  for(let i=0;i<4;i++){r(c,94-i*8,169+i*5,68+i*16,5,P.stone);r(c,95-i*8,169+i*5,66+i*16,2,P.stoneHi);}
  r(c,27,167,52,8,'#657663');r(c,178,167,51,8,'#657663');
 });
 tex(scene,'market-stall',96,80,c=>{
  e(c,48,75,44,4,'#2b4235');for(const x of [7,83]){r(c,x,10,6,65,P.ink);r(c,x+1,12,2,61,P.woodHi);}r(c,4,51,88,22,P.ink);r(c,6,53,84,18,P.wood);for(let x=8;x<88;x+=11){r(c,x,54,2,16,'#4d3c2c');r(c,x+3,55,2,14,P.woodHi);}r(c,3,47,90,7,P.woodHi);r(c,4,47,88,2,P.gold);
  p(c,[[14,4],[82,4],[95,31],[1,31]],P.ink);p(c,[[15,6],[81,6],[91,28],[5,28]],'#d1b67e');for(let i=0;i<5;i++){const x=16+i*14;p(c,[[x,6],[x+7,6],[x+11,28],[x-3,28]],'#7d945f');}for(let x=4;x<93;x+=11){r(c,x,28,10,7,(x%2)?'#cdb27b':'#7d945f');r(c,x+1,35,8,2,P.ink);}
  for(const [x,y,col] of [[14,41,'#b86746'],[22,39,'#cb7a4a'],[30,42,'#ab5940'],[45,41,'#93a16b'],[52,39,'#b1b77b'],[60,42,'#80955c'] ] as [number,number,string][]){e(c,x,y,5,5,col);r(c,x,y-5,1,2,P.ink);r(c,x-2,y-3,2,1,'#e2bc75');}r(c,71,40,13,6,'#c6a168');r(c,73,38,9,3,'#d9bd82');r(c,74,42,2,2,'#9a784b');
 });
 tex(scene,'birch',64,96,c=>{e(c,32,90,24,5,'#344e37');p(c,[[26,91],[28,45],[20,32],[25,29],[34,46],[42,29],[46,32],[36,53],[36,90]],P.ink);p(c,[[29,89],[30,45],[23,32],[24,32],[33,49],[43,32],[44,33],[34,54],[34,89]],'#d9d4b4');for(const y of [55,65,76,84])r(c,29,y,5,2,'#667465');leafCluster(c,19,32,17,23,'#b9a253');leafCluster(c,43,30,18,24,'#c1a452');leafCluster(c,31,19,18,17,'#d3b764');leafCluster(c,29,46,21,16,'#b99745');r(c,12,79,4,2,'#b99c4f');r(c,44,87,4,2,'#b99c4f');});
 tex(scene,'gildergreen',112,144,c=>{e(c,56,135,48,7,'#2c4635');p(c,[[32,137],[44,121],[47,89],[33,70],[16,63],[15,56],[37,62],[49,78],[49,55],[39,37],[45,35],[57,58],[60,77],[77,61],[96,49],[100,54],[80,69],[63,94],[65,121],[81,136],[66,133],[57,126],[44,136]],P.ink);p(c,[[39,134],[48,119],[51,88],[36,67],[19,61],[38,64],[53,83],[53,55],[43,39],[45,39],[57,60],[59,86],[79,65],[96,53],[79,70],[60,94],[61,121],[73,133],[57,124],[46,133]],'#99825a');r(c,53,88,3,34,'#c1a878');r(c,59,100,2,23,'#605e43');
  leafCluster(c,24,48,23,25,'#a39c58');leafCluster(c,85,42,25,24,'#b4a059');leafCluster(c,58,22,28,21,'#bda664');leafCluster(c,41,42,27,25,'#c4ab69');leafCluster(c,69,51,25,24,'#a69955');for(const [x,y] of [[28,37],[57,18],[76,39],[44,55],[87,51]]){r(c,x,y,3,7,'#e8d7a6');r(c,x-2,y+2,7,3,'#e8d7a6');r(c,x,y+2,3,3,'#d4b767');}
 });
 tex(scene,'statue',64,96,c=>{e(c,32,91,29,4,'#2d4235');masonry(c,5,78,54,12);r(c,10,74,44,6,P.stoneHi);r(c,19,60,26,15,'#71877a');p(c,[[20,61],[24,39],[20,32],[15,26],[19,20],[28,27],[33,24],[42,31],[45,42],[40,43],[38,36],[37,60]],P.ink);p(c,[[23,59],[27,39],[23,31],[18,25],[20,24],[29,31],[34,28],[39,33],[41,40],[39,39],[35,34],[34,59]],'#9baf9e');e(c,32,18,8,11,P.ink);e(c,32,18,6,9,'#abbba5');r(c,29,14,6,3,'#dae0c1');r(c,28,20,4,2,'#667e72');p(c,[[26,38],[36,35],[39,60],[43,65],[20,65]],'#8b9e8c');r(c,28,41,3,20,'#b3c1a7');r(c,46,8,4,55,P.ink);r(c,47,9,2,51,'#b1bea4');p(c,[[44,9],[48,0],[52,9]],P.gold);r(c,43,12,10,3,P.gold);r(c,24,80,16,6,'#496457');r(c,27,82,10,1,P.gold);});
 tex(scene,'boat',96,48,c=>{e(c,48,38,45,7,'#356c72');p(c,[[2,19],[14,12],[77,13],[94,20],[84,34],[70,41],[27,41],[11,33]],P.ink);p(c,[[6,20],[16,16],[76,16],[89,21],[80,31],[68,37],[28,37],[14,30]],'#a67b49');p(c,[[14,21],[22,18],[73,19],[81,23],[72,31],[27,32],[19,28]],'#483e2d');for(const x of [25,45,65]){r(c,x,17,5,17,'#b88c55');r(c,x+1,18,2,14,'#d4ac6e');}r(c,6,25,83,2,'#7c5735');p(c,[[30,3],[33,3],[64,42],[68,42],[70,47],[65,48],[60,43]],P.woodHi);r(c,10,20,4,4,P.gold);});
 tex(scene,'stone-tile',32,32,c=>{r(c,0,0,32,32,'#556a5c');for(let y=0;y<32;y+=8)for(let x=-8;x<32;x+=16){const xx=x+(y%16?8:0);r(c,xx+1,y+1,14,6,'#909c83');r(c,xx+2,y+1,12,2,'#b1b69a');r(c,xx+2,y+5,12,1,'#6b8170');}for(let i=0;i<12;i++)r(c,rnd()*32,rnd()*32,2,1,'#7b8c74');});
 tex(scene,'autumn-grass',32,32,c=>{r(c,0,0,32,32,'#849061');for(let i=0;i<90;i++)r(c,rnd()*32,rnd()*32,1+i%2,1,['#929961','#6b8155','#a3a36b'][i%3]);for(let i=0;i<4;i++){const x=rnd()*28,y=rnd()*28;r(c,x,y,3,2,'#c5a054');r(c,x+1,y+2,1,1,'#ad7f3e');}});
 tex(scene,'canal-water',32,32,c=>{r(c,0,0,32,32,'#386c71');for(let y=2;y<32;y+=6){const x=y*7%24;r(c,x,y,8,1,'#709e94');r(c,(x+12)%24,y+2,7,1,'#2d5d64');r(c,(x+6)%27,y+3,4,1,'#a3bb9e');}});
 tex(scene,'banner',32,64,c=>{r(c,1,1,30,4,P.woodHi);r(c,14,4,4,60,P.wood);hanging(c,4,6,'#8a5c46');r(c,7,52,18,3,P.gold);});
 tex(scene,'training-target',32,48,c=>{r(c,14,18,4,29,P.wood);r(c,3,44,26,4,P.ink);e(c,16,19,15,17,P.ink);e(c,16,18,13,15,'#c6b17c');e(c,16,18,10,12,'#9b6047');e(c,16,18,7,9,'#d9c28a');e(c,16,18,3,4,'#8e5141');r(c,15,16,2,4,P.gold);p(c,[[4,7],[6,5],[20,23],[18,25]],P.woodHi);r(c,3,5,5,3,'#c9cdb1');});
 tex(scene,'alchemy',48,48,c=>{e(c,24,44,22,3,'#293d31');r(c,5,28,38,16,P.wood);r(c,7,29,3,13,P.woodHi);r(c,38,29,3,13,P.woodHi);r(c,2,25,44,7,P.ink);r(c,4,25,40,4,P.woodHi);for(const [x,y,color] of [[8,9,'#88b094'],[27,5,'#8ea4ba'],[34,14,'#c39c6b']] as [number,number,string][]){r(c,x+3,y,4,4,P.gold);r(c,x+3,y+4,4,5,color);e(c,x+5,y+13,6,8,P.ink);e(c,x+5,y+13,4,6,color);r(c,x+3,y+10,2,5,'#d9dec0');}e(c,21,25,8,3,'#c2c8aa');r(c,15,19,2,6,'#708675');r(c,15,18,11,2,'#c5c9a8');});
 tex(scene,'lute',32,40,c=>{e(c,16,35,13,3,'#2a4033');p(c,[[16,20],[19,2],[24,1],[24,7],[21,21]],P.ink);r(c,20,4,2,19,P.woodHi);e(c,14,27,12,11,P.ink);e(c,14,26,10,9,'#bd8d50');e(c,13,24,7,6,'#ddba76');e(c,15,23,3,3,'#3e3729');r(c,9,31,11,2,'#59402b');r(c,18,9,1,22,'#e4d39a');r(c,20,9,1,22,'#e4d39a');r(c,21,2,6,3,P.gold);r(c,19,7,7,2,P.gold);});
 tex(scene,'trophies',64,48,c=>{e(c,32,44,30,3,'#2a4033');r(c,2,34,60,9,P.wood);r(c,3,34,58,2,P.woodHi);for(const [x,y,size] of [[12,16,8],[32,7,12],[53,17,7]]){r(c,x-4,y+19,8,4,'#665237');r(c,x-1,y+10,3,10,P.gold);p(c,[[x-size,y],[x+size,y],[x+size-3,y+10],[x,y+14],[x-size+3,y+10]],'#a88546');p(c,[[x-size+2,y+1],[x+size-2,y+1],[x+size-4,y+8],[x,y+11],[x-size+4,y+8]],'#dbb864');r(c,x-size+3,y+2,3,5,'#f1d698');r(c,x-size-3,y+2,3,7,P.gold);r(c,x+size,y+2,3,7,P.gold);r(c,x-5,y+23,11,2,'#d5c092');}});
 tex(scene,'desk',96,64,c=>{e(c,48,59,45,4,'#2b4033');r(c,8,29,80,29,P.ink);r(c,10,31,23,25,P.wood);r(c,64,31,22,25,P.wood);for(const x of [11,65])for(const y of [34,44]){r(c,x,y,20,8,'#a27645');r(c,x+8,y+3,4,2,P.gold);}r(c,3,15,90,18,P.ink);r(c,5,16,86,13,'#b18853');for(let y=17;y<29;y+=4){r(c,6,y,84,1,'#795435');r(c,14,y+2,25,1,'#cca36a');r(c,55,y+2,25,1,'#cca36a');}r(c,35,17,24,11,'#dccc9e');r(c,37,19,18,1,'#8c805e');r(c,37,22,16,1,'#8c805e');r(c,37,25,17,1,'#8c805e');r(c,68,15,8,11,'#405c54');r(c,70,12,4,5,'#a6b094');p(c,[[73,16],[77,4],[80,1],[83,5],[78,13]],'#e4dec0');r(c,17,8,4,16,'#d9c490');r(c,14,23,10,3,P.gold);r(c,18,4,2,5,'#f4d286');r(c,18,3,2,2,'#e99c4e');});
}
