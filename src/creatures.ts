export type SpeciesId='chicken'|'fox'|'wolf'|'mudcrab'|'skeever'|'goat'|'bear'|'sabrecat'|'snowfox';
export type Affinity='Wild'|'River'|'Frost'|'Guile';
export interface Companion {id:SpeciesId;nickname:string;level:number;xp:number;bond:number;}
export interface Ability {name:string;power:number;accuracy:number;pp:number;affinity:Affinity;kind:'attack'|'heal'|'boost'|'guard'|'weaken'|'poison'|'slow';text:string;}
export const ABILITIES:Record<string,Ability>={
 peck:{name:'Peck',power:29,accuracy:1,pp:30,affinity:'Wild',kind:'attack',text:'A sure, single peck.'},
 feather:{name:'Feather Storm',power:52,accuracy:.9,pp:8,affinity:'Wild',kind:'attack',text:'A whirlwind of feathers. High power.'},
 cluck:{name:'Battle Cluck',power:0,accuracy:1,pp:5,affinity:'Wild',kind:'boost',text:'Attack rises by one stage.'},
 blessing:{name:'Dragonborn’s Blessing',power:42,accuracy:1,pp:3,affinity:'Wild',kind:'heal',text:'Restore 42% of maximum HP.'},
 bite:{name:'Cunning Bite',power:33,accuracy:1,pp:22,affinity:'Guile',kind:'attack',text:'A precise bite from an unexpected angle.'},
 feint:{name:'Foxfire Feint',power:47,accuracy:.9,pp:9,affinity:'Guile',kind:'attack',text:'A flashing, elusive strike.'},
 focus:{name:'Hunter’s Focus',power:0,accuracy:1,pp:5,affinity:'Guile',kind:'boost',text:'Sharpen your attack for the hunt.'},
 nest:{name:'Warm Nest',power:38,accuracy:1,pp:3,affinity:'Wild',kind:'heal',text:'Curl up and restore 38% HP.'},
 fang:{name:'Pack Fang',power:35,accuracy:1,pp:24,affinity:'Wild',kind:'attack',text:'The dependable bite of a loyal hunter.'},
 howl:{name:'Moonlit Howl',power:0,accuracy:1,pp:5,affinity:'Wild',kind:'boost',text:'Raise attack. Let the mountains hear you.'},
 pounce:{name:'Pounce',power:54,accuracy:.85,pp:8,affinity:'Wild',kind:'attack',text:'A powerful leap. Can miss.'},
 recover:{name:'Second Wind',power:35,accuracy:1,pp:3,affinity:'Wild',kind:'heal',text:'Catch your breath; restore 35% HP.'},
 pinch:{name:'River Pincer',power:32,accuracy:1,pp:25,affinity:'River',kind:'attack',text:'A reliable water-charged pinch.'},
 bubble:{name:'Whitewater Burst',power:50,accuracy:.9,pp:8,affinity:'River',kind:'attack',text:'A rushing wave from the White River.'},
 shell:{name:'Iron Shell',power:0,accuracy:1,pp:5,affinity:'River',kind:'guard',text:'Raise defence by one stage.'},
 mend:{name:'Freshwater Rest',power:42,accuracy:1,pp:3,affinity:'River',kind:'heal',text:'Restore 42% HP and wash away poison.'},
 nibble:{name:'Sneaking Nibble',power:28,accuracy:1,pp:30,affinity:'Guile',kind:'attack',text:'Small teeth. Surprising determination.'},
 venom:{name:'Sewer Venom',power:18,accuracy:.9,pp:6,affinity:'Guile',kind:'poison',text:'A bite that poisons for three turns.'},
 dart:{name:'Scurry Strike',power:42,accuracy:1,pp:12,affinity:'Wild',kind:'attack',text:'A quick dart between your opponent’s feet.'},
 scavenge:{name:'Pocket Crumbs',power:38,accuracy:1,pp:3,affinity:'Guile',kind:'heal',text:'An emergency snack restores 38% HP.'},
 ram:{name:'Mountain Ram',power:46,accuracy:.95,pp:14,affinity:'Wild',kind:'attack',text:'A horn-first charge. Very goat.'},
 hoof:{name:'Surefoot Kick',power:31,accuracy:1,pp:25,affinity:'Wild',kind:'attack',text:'The sure footing of a mountain climber.'},
 steady:{name:'Steadfast',power:0,accuracy:1,pp:5,affinity:'Wild',kind:'guard',text:'Plant your hooves and raise defence.'},
 snack:{name:'Stolen Cabbage',power:42,accuracy:1,pp:3,affinity:'Wild',kind:'heal',text:'A delicious 42% HP. Nobody saw a thing.'},
 claw:{name:'Claw Swipe',power:35,accuracy:.95,pp:25,affinity:'Wild',kind:'attack',text:'A heavy paw across the battlefield.'},
 maul:{name:'Maul',power:72,accuracy:.85,pp:6,affinity:'Wild',kind:'attack',text:'Huge damage. Must rest next turn.'},
 roar:{name:'Intimidating Roar',power:0,accuracy:1,pp:4,affinity:'Wild',kind:'weaken',text:'Lower the opponent’s attack.'},
 hibernate:{name:'Hibernate',power:40,accuracy:1,pp:2,affinity:'Wild',kind:'heal',text:'A brief nap restores 40% HP.'},
 icefang:{name:'Glacial Fang',power:38,accuracy:1,pp:20,affinity:'Frost',kind:'attack',text:'A bite cold enough to silence a bard.'},
 frostbite:{name:'Winter’s Breath',power:26,accuracy:.95,pp:8,affinity:'Frost',kind:'slow',text:'Cold breath slows the opponent for 3 turns.'},
 aurora:{name:'Aurora Veil',power:40,accuracy:1,pp:3,affinity:'Frost',kind:'heal',text:'Restore 40% HP beneath northern lights.'},
 iceguard:{name:'Snowdrift Guard',power:0,accuracy:1,pp:5,affinity:'Frost',kind:'guard',text:'A frosty coat raises defence.'}
};
export interface Species {id:SpeciesId;name:string;affinity:Affinity;hp:number;attack:number;defense:number;speed:number;moves:string[];trait:string;description:string;habitat:string;texture:string;call:string;color:string;}
export const SPECIES:Record<SpeciesId,Species>={
 chicken:{id:'chicken',name:'Chicken',affinity:'Wild',hp:92,attack:26,defense:20,speed:25,moves:['peck','feather','cluck','blessing'],trait:'Brave Heart · extra damage below 35% HP',description:'Convinced that it is the largest creature in Skyrim. Nobody has successfully argued otherwise.',habitat:'Your first companion, rescued at Helgen.',texture:'chicken',call:'cluck',color:'#dfc67e'},
 fox:{id:'fox',name:'Red Fox',affinity:'Guile',hp:85,attack:28,defense:18,speed:35,moves:['bite','feint','focus','nest'],trait:'Quick Wit · first attack receives a small bonus',description:'Collects shiny things, then forgets where it hid them. Trust arrives one patient conversation at a time.',habitat:'Whiterun Tundra · west of the old road',texture:'fox',call:'fox',color:'#ce9564'},
 wolf:{id:'wolf',name:'Grey Wolf',affinity:'Wild',hp:103,attack:31,defense:21,speed:29,moves:['fang','howl','pounce','recover'],trait:'Pack Bond · gains attack with a full party',description:'It always checks that everyone is following. A fiercely loyal friend beneath a solemn stare.',habitat:'Whiterun Tundra · northern pines',texture:'wolf',call:'wolf',color:'#9faeaf'},
 mudcrab:{id:'mudcrab',name:'Mudcrab',affinity:'River',hp:110,attack:24,defense:31,speed:12,moves:['pinch','bubble','shell','mend'],trait:'Hard Shell · takes less damage from the first hit',description:'Carries its house everywhere and still complains about the rent. Secretly fond of flute music.',habitat:'Riftwood Trail · beside the stream',texture:'mudcrab',call:'mudcrab',color:'#83b6b5'},
 skeever:{id:'skeever',name:'Skeever',affinity:'Guile',hp:82,attack:25,defense:18,speed:33,moves:['nibble','venom','dart','scavenge'],trait:'Scavenger · healing moves recover an extra 8% HP',description:'A tiny scoundrel with magnificent whiskers. Its treasured collection consists mostly of cheese rinds.',habitat:'Riftwood Trail · the abandoned campsite',texture:'skeever',call:'skeever',color:'#b5a087'},
 goat:{id:'goat',name:'Mountain Goat',affinity:'Wild',hp:108,attack:27,defense:27,speed:18,moves:['ram','hoof','steady','snack'],trait:'Surefoot · resists slowing effects',description:'Sees a mountain and asks: is that edible? Sees a gym leader and asks the same thing.',habitat:'Whiterun Tundra · near the standing stones',texture:'goat',call:'goat',color:'#c3b98e'},
 bear:{id:'bear',name:'Brown Bear',affinity:'Wild',hp:140,attack:35,defense:26,speed:10,moves:['claw','maul','roar','hibernate'],trait:'Thick Fur · physical damage is reduced',description:'Large enough to frighten a giant. Gentle enough to wait for a butterfly to finish drinking.',habitat:'Riftwood Trail · the eastern clearing',texture:'bear',call:'roar',color:'#b89163'},
 sabrecat:{id:'sabrecat',name:'Sabre Cat',affinity:'Frost',hp:100,attack:35,defense:21,speed:31,moves:['icefang','pounce','focus','frostbite'],trait:'Ambush · stronger attacks against slowed targets',description:'A dramatic hunter with absurdly large teeth. Insists on sitting in boxes three sizes too small.',habitat:'Whiterun Tundra · northeast ridge',texture:'sabrecat',call:'sabrecat',color:'#abc3c9'},
 snowfox:{id:'snowfox',name:'Snow Fox',affinity:'Frost',hp:90,attack:27,defense:24,speed:32,moves:['frostbite','feint','aurora','iceguard'],trait:'Northern Light · healing also clears poison and slow',description:'Soft as falling snow, sharp as winter stars. Leaves little pawprints around your campfire.',habitat:'Riftwood Trail · the cool northern spring',texture:'snowfox',call:'snowfox',color:'#d2e1dc'}
};
export const SPECIES_IDS=Object.keys(SPECIES) as SpeciesId[];
export function newCompanion(id:SpeciesId,level=5):Companion{return {id,nickname:SPECIES[id].name,level,xp:0,bond:0};}
const beats:Record<Affinity,Affinity>={Wild:'Guile',Guile:'Frost',Frost:'River',River:'Wild'};
export function effectiveness(attack:Affinity,defense:Affinity){return beats[attack]===defense?1.4:beats[defense]===attack?.75:1;}
export function nextLevelXp(level:number){return level*18;}
export function gainExperience(c:Companion,amount:number){c.xp+=amount;let levels=0;while(c.xp>=nextLevelXp(c.level)&&c.level<30){c.xp-=nextLevelXp(c.level);c.level++;levels++;}return levels;}
export interface Gym {id:'whiterun'|'riften';name:string;leader:string;badge:string;intro:string;after:string;team:{id:SpeciesId;level:number}[];reward:number;}
export const GYMS:Record<string,Gym>={
 whiterun:{id:'whiterun',name:'Whiterun · Hall of Companions',leader:'Aela the Huntress',badge:'Skyforge Badge',intro:'Strength means knowing your companions. Three against three. Show me the courage behind those feathers.',after:'A good hunter knows when to strike. A great trainer knows when to trust. You have earned this.',team:[{id:'wolf',level:6},{id:'goat',level:7},{id:'bear',level:8}],reward:150},
 riften:{id:'riften',name:'Riften · Canal Gym',leader:'Mjoll the Lioness',badge:'Riftwater Badge',intro:'Riften has enough people who take. Let us see what you give your companions: patience, courage, and a fair fight.',after:'Honour survives even here. Take the Riftwater Badge. Riften has found another friend worth trusting.',team:[{id:'mudcrab',level:9},{id:'skeever',level:9},{id:'sabrecat',level:10}],reward:220}
};
