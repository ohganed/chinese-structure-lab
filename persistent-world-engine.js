(function(){
'use strict';
/* Chinese Structure Lab · Persistent World Engine v1
   Keeps people, places and events across levels without rewriting lesson history. */
var VERSION=1,EXT='persistentWorldV1';
function S(){return window.CSLStorage||null}function now(){return new Date().toISOString()}
function obj(x){return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function arr(x){return Array.isArray(x)?x:[]}
var CHARACTERS={
  wangming:{id:'wangming',names:['王明','Wang Ming'],role:'friend',firstLevel:'A1'},
  server:{id:'server',names:['服务员','Cafe server'],role:'service',firstLevel:'A1'},
  doctor:{id:'doctor',names:['医生','doctor'],role:'health',firstLevel:'A1'},
  receptionist:{id:'receptionist',names:['前台','receptionist'],role:'hotel',firstLevel:'A1'}
};
var PLACES={
  familiarCafe:{id:'familiarCafe',labels:['咖啡店','cafe'],kind:'cafe'},
  station:{id:'station',labels:['车站','地铁站','station'],kind:'transport'},
  hotel:{id:'hotel',labels:['酒店','hotel'],kind:'hotel'},
  clinic:{id:'clinic',labels:['医院','诊所','clinic','hospital'],kind:'health'}
};
function level(){var p=location.pathname.split('/').pop()||'';if(/^a1|index/.test(p))return'A1';if(/^a2/.test(p))return'A2';if(/^b1/.test(p))return'B1';if(/^b2/.test(p))return'B2';if(/^c1/.test(p))return'C1';if(/^c2/.test(p))return'C2';return'OTHER'}
function text(){return(document.body&&document.body.innerText||'').replace(/\s+/g,' ').slice(0,30000)}
function mentions(t,names){return names.some(function(n){return t.indexOf(n)>=0})}
function infer(){var t=text(),lvl=level(),chars=[],places=[],events=[];Object.keys(CHARACTERS).forEach(function(k){var c=CHARACTERS[k];if(mentions(t,c.names))chars.push(c.id)});Object.keys(PLACES).forEach(function(k){var p=PLACES[k];if(mentions(t,p.labels))places.push(p.id)});
 if(/王明/.test(t)&&/咖啡/.test(t))events.push({id:'wangming-cafe',type:'relationship',character:'wangming',place:'familiarCafe'});
 if(/王明/.test(t)&&/北京/.test(t))events.push({id:'wangming-beijing-plan',type:'plan',character:'wangming'});
 if(/票|买票/.test(t)&&/王明/.test(t))events.push({id:'wangming-ticket-thread',type:'recurring-object',character:'wangming'});
 return{page:location.pathname.split('/').pop()||'index.html',level:lvl,characters:chars,places:places,events:events,at:now()}}
function mergeWorld(old,seen){old=obj(old);var w={version:VERSION,updatedAt:now(),characters:obj(old.characters),places:obj(old.places),events:obj(old.events),pageVisits:Number(old.pageVisits)||0};w.pageVisits++;
 seen.characters.forEach(function(id){var c=w.characters[id]||{encounters:0,levels:[],firstSeenAt:seen.at,lastSeenAt:null};c.encounters++;if(c.levels.indexOf(seen.level)<0)c.levels.push(seen.level);c.lastSeenAt=seen.at;c.meta=CHARACTERS[id];w.characters[id]=c});
 seen.places.forEach(function(id){var p=w.places[id]||{encounters:0,levels:[],firstSeenAt:seen.at,lastSeenAt:null};p.encounters++;if(p.levels.indexOf(seen.level)<0)p.levels.push(seen.level);p.lastSeenAt=seen.at;p.meta=PLACES[id];w.places[id]=p});
 seen.events.forEach(function(e){var x=w.events[e.id]||{encounters:0,levels:[],firstSeenAt:seen.at,lastSeenAt:null,meta:e};x.encounters++;if(x.levels.indexOf(seen.level)<0)x.levels.push(seen.level);x.lastSeenAt=seen.at;w.events[e.id]=x});return w}
function refresh(){var s=S();if(!s||!s.load||!s.save)return null;var p=s.load();p.extensions=p.extensions||{};var w=mergeWorld(p.extensions[EXT],infer());p.extensions[EXT]=w;s.save(p);return w}
function get(){var s=S();if(!s||!s.load)return null;var p=s.load();return p.extensions&&p.extensions[EXT]||refresh()}
function threads(){var w=get();if(!w)return[];var out=[];Object.keys(w.characters||{}).forEach(function(id){var c=w.characters[id];if(c.encounters>1)out.push({kind:'character',id:id,encounters:c.encounters,levels:c.levels})});Object.keys(w.events||{}).forEach(function(id){var e=w.events[id];if(e.encounters>1)out.push({kind:'event',id:id,encounters:e.encounters,levels:e.levels})});return out.sort(function(a,b){return b.encounters-a.encounters})}
window.CSLPersistentWorld={version:VERSION,get:get,refresh:refresh,threads:threads};
setTimeout(function(){try{var w=refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('persistent-world-ready',{version:VERSION,characters:Object.keys(w&&w.characters||{}).length,events:Object.keys(w&&w.events||{}).length})}catch(e){}},1750);
})();