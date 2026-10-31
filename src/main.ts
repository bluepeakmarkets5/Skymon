import Phaser from 'phaser';
import './style.css';
import { BootScene,TitleScene,WorldScene } from './world';
import { BattleScene } from './battle-scene';
import {ExpeditionScene} from './expedition';
import {EncounterScene} from './encounter-scene';
import {companions,travel,saveTransfer} from './collection-ui';
import { audio } from './audio';
import { state,save } from './state';
import { ui,worldUI } from './ui';
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:960,height:540,pixelArt:true,roundPixels:true,backgroundColor:'#152e31',scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[BootScene,TitleScene,WorldScene,BattleScene,ExpeditionScene,EncounterScene],audio:{noAudio:true},render:{antialias:false},fps:{target:60}});
ui.onCompanions=()=>companions();ui.onTravel=()=>travel();ui.onTransfer=()=>saveTransfer();
ui.travelTo=(place)=>{for(const key of ['World','Expedition']){const s=game.scene.getScene(key) as WorldScene|ExpeditionScene;if(s?.scene.isActive()){if(s instanceof WorldScene)s.persistPosition();else s.persist();game.scene.stop(key);}}
 state.journey.place=place;state.journey.x=768;state.journey.y=1045;state.journey.outside=place;state.journey.returnX=768;state.journey.returnY=1045;
 if(place==='Riverwood'){state.area='Riverwood';state.x=896;state.y=1200;}save();game.scene.start(place==='Riverwood'?'World':'Expedition');};
// Read-only diagnostics aid testing without modifying the player's journey.
Object.defineProperty(window,'riverwood',{get:()=>({mode:ui.mode,state:JSON.parse(JSON.stringify(state)),audio:audio.diagnostics,scene:game.scene.getScenes(true).map(s=>s.scene.key),player:(()=>{const s=game.scene.getScene('World') as WorldScene;return s?.player?{x:s.player.x,y:s.player.y,area:s.area,near:s.near?.name}:null;})()})});
window.addEventListener('pagehide',()=>{if(ui.mode!=='title')save();});
if('serviceWorker'in navigator&&import.meta.env.PROD&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

if(import.meta.env.DEV && new URLSearchParams(location.search).has('qa'))void import('./qa').then(m=>m.setupQA(game));
document.addEventListener('pointerdown',()=>void audio.unlock(),{once:true});
