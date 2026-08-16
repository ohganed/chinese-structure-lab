(function(){
'use strict';
/* Chinese Structure Lab · Learning Memory Engine v1
   Derived memory only: raw append-only events remain the source of truth.
   No existing learning history is deleted or rewritten. */
var ENGINE_VERSION=1;
var EXT_KEY='learningMemoryV1';
function storage(){return window.CSLStorage||null}
function now(){return new Date().toISOString()}
function arr(x){return Array.isArray(x)?x:[]}
function obj(x){return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function inc(map,key,n){if(!key)return;map[key]=(Number(map[key])||0)+(n==null?1:n)}
function touch(map,key,at,extra){if(!key)return;var x=map[key]||{count:0,firstSeenAt:null,lastSeenAt:null};x.count++;x.firstSeenAt=x.firstSeenAt||at;x.lastSeenAt=at||x.lastSeenAt;if(extra)Object.keys(extra).forEach(function(k){x[k]=extra[k]});map[key]=x}
function rebuild(profile){
  profile=profile||{};var learning=obj(profile.learning),events=arr(learning.events),sentences=obj(learning.sentences);
  var m={engineVersion:ENGINE_VERSION,builtAt:now(),sourceEventCount:events.length,sourceSentenceCount:Object.keys(sentences).length,summary:{encounters:0,fuzzySentences:0,audioNatural:0,audioSlow:0,reencounters:0,semanticShifts:0},sentences:{},words:{},constructions:{},senses:{},contexts:{},signals:{}};
  Object.keys(sentences).forEach(function(id){var s=obj(sentences[id]),count=Number(s.encounters)||0;m.summary.encounters+=count;if(s.fuzzy)m.summary.fuzzySentences++;m.sentences[id]={text:s.legacyText||s.text||'',encounters:count,fuzzy:!!s.fuzzy,firstSeenAt:s.firstSeenAt||null,lastSeenAt:s.lastSeenAt||null,reencounterCount:Number(obj(s.extras).reencounterCount)||0};});
  events.forEach(function(e){if(!e||!e.type)return;var d=obj(e.data),at=e.at||null;inc(m.signals,e.type);if(d.page)touch(m.contexts,d.page,at);
    if(e.type==='natural_reencounter'){m.summary.reencounters++;}
    if(e.type==='lexical_reencounter'){m.summary.reencounters++;touch(m.words,d.feature,at,{lastText:d.currentText||''});}
    if(e.type==='construction_reencounter'){m.summary.reencounters++;touch(m.constructions,d.feature,at,{label:d.label||d.feature,lastText:d.currentText||''});}
    if(e.type==='semantic_reencounter'){m.summary.reencounters++;touch(m.words,d.feature,at,{lastText:d.currentText||''});var k=(d.feature||'?')+':'+(d.currentSense||'general');touch(m.senses,k,at,{word:d.feature||'',sense:d.currentSense||'general',label:d.currentSenseLabel||''});if(d.shifted)m.summary.semanticShifts++;}
    if(e.type==='audio_play'||e.type==='audio'){var rate=Number(d.rate);if(rate>0&&rate<=0.55)m.summary.audioSlow++;else m.summary.audioNatural++;}
  });
  return m;
}
function saveDerived(memory){var s=storage();if(!s||!s.load||!s.save)return memory;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT_KEY]=memory;s.save(p);return memory}
function refresh(){var s=storage();if(!s||!s.load)return null;return saveDerived(rebuild(s.load()))}
function get(){var s=storage();if(!s||!s.load)return null;var p=s.load(),old=p.extensions&&p.extensions[EXT_KEY],eventCount=arr(obj(p.learning).events).length,sentenceCount=Object.keys(obj(obj(p.learning).sentences)).length;if(!old||old.engineVersion!==ENGINE_VERSION||old.sourceEventCount!==eventCount||old.sourceSentenceCount!==sentenceCount)return refresh();return old}
function record(type,data){var s=storage();if(s&&s.addEvent)s.addEvent(type,data||{});return refresh()}
function learnerSnapshot(){var m=get();if(!m)return null;return{version:ENGINE_VERSION,builtAt:m.builtAt,summary:m.summary,strongSignals:Object.keys(m.words).sort(function(a,b){return m.words[b].count-m.words[a].count}).slice(0,12).map(function(k){return{word:k,count:m.words[k].count}}),constructions:Object.keys(m.constructions).sort(function(a,b){return m.constructions[b].count-m.constructions[a].count}).slice(0,12).map(function(k){return{id:k,count:m.constructions[k].count,label:m.constructions[k].label}})}}
window.CSLLearningMemory={version:ENGINE_VERSION,get:get,refresh:refresh,rebuild:rebuild,record:record,snapshot:learnerSnapshot};
setTimeout(function(){try{refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('learning-memory-ready',{version:ENGINE_VERSION})}catch(e){}},650);
})();