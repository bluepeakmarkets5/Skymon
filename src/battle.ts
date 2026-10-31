export type MoveId='peck'|'feather'|'cluck'|'blessing'|'claw'|'maul'|'roar'|'hibernate';
export interface Move {name:string;power:number;accuracy:number;pp:number;kind:'damage'|'buff'|'debuff'|'heal';description:string;}
export const MOVES:Record<MoveId,Move>={
 peck:{name:'Peck',power:30,accuracy:1,pp:35,kind:'damage',description:'Reliable strike · 100% accuracy'},
 feather:{name:'Feather Storm',power:22,accuracy:.9,pp:7,kind:'damage',description:'2–3 hits · 90% accuracy'},
 cluck:{name:'Battle Cluck',power:0,accuracy:1,pp:5,kind:'buff',description:'Raise attack by one stage (max +3)'},
 blessing:{name:"Dragonborn’s Blessing",power:0,accuracy:1,pp:3,kind:'heal',description:'Restore 45% HP · 3 uses'},
 claw:{name:'Claw Swipe',power:30,accuracy:.95,pp:99,kind:'damage',description:'A heavy swipe'},
 maul:{name:'Maul',power:55,accuracy:.85,pp:99,kind:'damage',description:'Heavy strike; bear rests next turn'},
 roar:{name:'Intimidating Roar',power:0,accuracy:1,pp:3,kind:'debuff',description:'Lower attack by one stage'},
 hibernate:{name:'Hibernate',power:0,accuracy:1,pp:2,kind:'heal',description:'Restore 25% HP'}
};
export interface Fighter {name:string;hp:number;maxHp:number;attack:number;defense:number;speed:number;stage:number;level:number;pp:Partial<Record<MoveId,number>>;rest:boolean;}
export interface Event {kind:'attack'|'miss'|'heal'|'buff'|'rest'|'faint';actor:'chicken'|'bear';target:'chicken'|'bear';text:string;amount:number;move?:MoveId;hp:number;}
export class BattleEngine {
 chicken:Fighter;bear:Fighter;turn=0;result:'win'|'lose'|null=null;rng:()=>number;
 constructor(level=5,wins=0,rng:()=>number=Math.random){this.rng=rng;this.chicken={name:'CHICKEN',level,hp:92+(level-5)*9,maxHp:92+(level-5)*9,attack:24+(level-5)*3,defense:18+(level-5)*2,speed:24,stage:0,pp:{peck:35,feather:7,cluck:5,blessing:3},rest:false};const scale=Math.min(wins,5);this.bear={name:'BEAR',level:7+scale,hp:138+scale*12,maxHp:138+scale*12,attack:29+scale*2,defense:23+scale,speed:15,stage:0,pp:{claw:99,maul:99,roar:3,hibernate:2},rest:false};}
 enemyMove():MoveId {if(this.bear.hp<this.bear.maxHp*.34&&(this.bear.pp.hibernate||0)>0&&this.rng()<.6)return 'hibernate';if(this.chicken.stage>0&&(this.bear.pp.roar||0)>0&&this.rng()<.33)return 'roar';return this.rng()<.32?'maul':'claw';}
 damage(a:Fighter,b:Fighter,power:number){const mult=a.stage>=0?1+a.stage*.5:1/(1-a.stage*.5);return Math.max(1,Math.floor(((2*a.level/5+2)*power*a.attack*mult/b.defense/9+2)*(.9+this.rng()*.2)));}
 act(actor:'chicken'|'bear',move:MoveId):Event[]{const a=this[actor],target=actor==='chicken'?'bear':'chicken',b=this[target],m=MOVES[move];const out:Event[]=[];const push=(kind:Event['kind'],text:string,amount=0,to:'chicken'|'bear'=target)=>out.push({kind,actor,target:to,text,amount,move,hp:this[to].hp});
 if(a.rest){a.rest=false;push('rest',`${a.name} catches its breath after Maul.`,0,actor);return out;}if((a.pp[move]||0)<=0)return out;a.pp[move]!--;
 if(this.rng()>m.accuracy){push('miss',`${a.name} used ${m.name}… but missed!`);return out;}
 if(m.kind==='heal'){const amount=Math.min(a.maxHp-a.hp,Math.floor(a.maxHp*(actor==='chicken'?.45:.25)));a.hp+=amount;push('heal',`${a.name} used ${m.name}! Restored ${amount} HP.`,amount,actor);}
 else if(m.kind==='buff'){a.stage=Math.min(3,a.stage+1);push('buff',`${a.name} used ${m.name}! Attack is now ${a.stage>0?'+':''}${a.stage}.`,0,actor);}
 else if(m.kind==='debuff'){b.stage=Math.max(-3,b.stage-1);push('buff',`${a.name} used ${m.name}! CHICKEN’s attack fell to ${b.stage}.`);}
 else {const hits=move==='feather'?2+Math.floor(this.rng()*2):1;let total=0;for(let i=0;i<hits;i++)total+=this.damage(a,b,m.power);const amount=Math.min(b.hp,total);b.hp-=amount;push('attack',`${a.name} used ${m.name}! ${hits>1?hits+' hits! ':''}${amount} damage.`,amount);if(move==='maul')a.rest=true;}
 if(b.hp<=0){push('faint',`${b.name} fainted!`);this.result=actor==='chicken'?'win':'lose';}return out;}
 resolve(move:MoveId):Event[]{if(this.result||!['peck','feather','cluck','blessing'].includes(move)||(this.chicken.pp[move]||0)<=0)return [];this.turn++;const enemy=this.enemyMove();let events:Event[]=[];const order:('chicken'|'bear')[]=this.chicken.speed>=this.bear.speed?['chicken','bear']:['bear','chicken'];for(const who of order){events.push(...this.act(who,who==='chicken'?move:enemy));if(this.result)break;}return events;}
}
