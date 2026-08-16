(function(){
'use strict';
/* Retrieval Need Engine v1
   Estimates when a natural re-encounter may be useful.
   It does not schedule drills, grade memory, or overwrite raw history. */
var VERSION=1,EXT='retrievalNeedV1';
function S(){return window.CSLStorage||null}function Q(){return window.CSLEncounterQuality||null}
function now(){return new Date().toISOString()}function clamp(x){return Math.max(0,Math.min(1,x))}
function daysSince(iso){if(!iso)return null;var t=Date.parse(iso);return isNaN(t)?null:Math.max(0,(Date.now()-t)/86400000)}
function build(){var s=S(),q=Q();if(!s||!s.load)return null;var p=s.load(),sent=(p.learning&&p.learning.sentences)||{},quality=q&&q.get?q.get():null,out={};Object.keys(sent).forEach(function(id){var x=sent[id]||{},qr=quality&&quality.encounters&&(quality.encounters[id]||quality.encounters['text:'+(x.legacyText||x.text||'')]),d=daysSince(x.lastSeenAt||(qr&&qr.lastAt)),enc=Number(x.encounters)||0,rich=qr?Number(qr.quality)||0:Math.min(.35,enc*.07),fuzzy=!!x.fuzzy;
 var time=d==null?0:1-Math.exp(-d/5.5),stability=clamp(rich*.62+Math.min(.28,enc*.045)+(qr&&qr.signals&&qr.signals.reencounter?Math.min(.18,qr.signals.reencounter*.06):0)),need=clamp(time*(1-stability*.72)+(fuzzy?.16:0));
 var band=need<.25?'rest':need<.48?'available':need<.7?'good-window':'high-value';out[id]={id:id,text:x.legacyText||x.text||'',daysSinceLast:d,encounters:enc,encounterRichness:rich,estimatedStability:stability,retrievalNeed:need,band:band,reason:fuzzy?'learner-marked uncertainty plus spacing':'spacing adjusted by encounter richness'} });
 var ranked=Object.keys(out).map(function(k){return out[k]}).sort(function(a,b){return b.retrievalNeed-a.retrievalNeed});return{version:VERSION,builtAt:now(),items:out,ranked:ranked.slice(0,50),policy:{naturalReencounter:true,noForcedDrill:true,noMasteryClaim:true,noPunishmentForAbsence:true,replaceableInference:true}}}
function save(g){var s=S();if(!s||!s.load||!s.save)return g;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=g;s.save(p);return g}function refresh(){return save(build())}function get(){return refresh()}function top(n){var g=refresh();return g?g.ranked.slice(0,n||5):[]}
window.CSLRetrievalNeed={version:VERSION,get:get,refresh:refresh,top:top};setTimeout(function(){try{var g=refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('retrieval-need-ready',{version:VERSION,items:g.ranked.length})}catch(e){}},2550);
})();