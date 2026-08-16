(function(){
'use strict';
/* Encounter Quality Engine v1
   Estimates richness of learning encounters without grading the learner.
   Raw events remain authoritative; scores are replaceable derived estimates. */
var VERSION=1,EXT='encounterQualityV1';
function S(){return window.CSLStorage||null}function now(){return new Date().toISOString()}
function load(){try{return S()&&S().load?S().load():null}catch(e){return null}}
function clamp(x){return Math.max(0,Math.min(1,x))}function obj(x){return x&&typeof x==='object'?x:{}}
function eventText(e){var d=obj(e&&e.data);return d.text||d.sentence||d.zh||d.sentenceText||''}
function eventId(e){var d=obj(e&&e.data);return d.sentenceId||d.id||null}
function classify(e){var t=(e&&e.type||'').toLowerCase();return{
 audio:/audio|listen|speak|pronun|natural|slow/.test(t),
 reveal:/meaning|word|chunk|structure|open|reveal|detail/.test(t),
 uncertainty:/fuzzy|unclear|confus/.test(t),
 reencounter:/reencounter|repeat|return/.test(t),
 context:/situation|scene|context|world/.test(t),
 production:/speak|record|type|write|respond|answer/.test(t)
}}
function build(){var p=load();if(!p)return null;var es=obj(p.learning).events||[],sent=obj(obj(p.learning).sentences),by={};function rec(id,text){var k=id||('text:'+text);if(!by[k])by[k]={id:id||null,text:text||'',events:0,signals:{audio:0,reveal:0,uncertainty:0,reencounter:0,context:0,production:0},firstAt:null,lastAt:null};return by[k]}
 es.forEach(function(e){var id=eventId(e),text=eventText(e),r=rec(id,text),c=classify(e);r.events++;Object.keys(c).forEach(function(k){if(c[k])r.signals[k]++});r.firstAt=!r.firstAt||e.at<r.firstAt?e.at:r.firstAt;r.lastAt=!r.lastAt||e.at>r.lastAt?e.at:r.lastAt});
 Object.keys(sent).forEach(function(id){var s=sent[id]||{},r=rec(id,s.legacyText||s.text||'');r.encounters=Number(s.encounters)||0;r.fuzzy=!!s.fuzzy;r.firstAt=r.firstAt||s.firstSeenAt||null;r.lastAt=r.lastAt||s.lastSeenAt||null});
 Object.keys(by).forEach(function(k){var r=by[k],q=0;q+=Math.min(.22,(r.encounters||r.events||0)*.07);if(r.signals.context)q+=.14;if(r.signals.audio)q+=.16;if(r.signals.reveal)q+=.12;if(r.signals.reencounter)q+=.18;if(r.signals.production)q+=.18;if(r.signals.uncertainty||r.fuzzy)q+=.04;var modalities=(r.signals.audio>0)+(r.signals.reveal>0)+(r.signals.context>0)+(r.signals.production>0);if(modalities>=3)q+=.08;r.quality=clamp(q);r.band=r.quality<.22?'glimpse':r.quality<.45?'contact':r.quality<.68?'connected':'rich';r.note='Encounter richness, not learner ability.'});
 var vals=Object.keys(by).map(function(k){return by[k].quality}),avg=vals.length?vals.reduce(function(a,b){return a+b},0)/vals.length:0;return{version:VERSION,builtAt:now(),summary:{items:vals.length,averageRichness:avg},encounters:by,policy:{neverGrade:true,qualityIsNotMastery:true,rawEventsRemainSource:true,replaceableInference:true}}}
function save(x){var s=S();if(!s||!s.load||!s.save)return x;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=x;s.save(p);return x}function refresh(){return save(build())}function get(){return refresh()}
function forSentence(id,text){var g=refresh();if(!g)return null;return g.encounters[id]||g.encounters['text:'+text]||null}
window.CSLEncounterQuality={version:VERSION,get:get,refresh:refresh,forSentence:forSentence};setTimeout(function(){try{var g=refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('encounter-quality-ready',{version:VERSION,items:g.summary.items})}catch(e){}},2350);
})();