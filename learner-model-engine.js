(function(){
'use strict';
/* Chinese Structure Lab · Learner Model Engine v1
   Quiet inference, never grading. Evidence is preserved separately from estimates. */
var VERSION=1,EXT='learnerModelV1';
function S(){return window.CSLStorage||null}function M(){return window.CSLLearningMemory||null}
function clamp(x){return Math.max(0,Math.min(1,x))}function now(){return new Date().toISOString()}
function profile(){try{return S()&&S().load?S().load():null}catch(e){return null}}
function events(p){return p&&p.learning&&Array.isArray(p.learning.events)?p.learning.events:[]}
function count(es,type){var n=0;es.forEach(function(e){if(e&&e.type===type)n++});return n}
function build(){var p=profile();if(!p)return null;var mem=M()&&M().get?M().get():null,es=events(p),sent=p.learning&&p.learning.sentences||{};var fuzzy=0,seen=0,repeat=0;Object.keys(sent).forEach(function(k){var x=sent[k]||{},c=Number(x.encounters)||0;if(c)seen++;if(c>1)repeat+=c-1;if(x.fuzzy)fuzzy++});
 var natural=(mem&&mem.summary.audioNatural)||count(es,'audio_play'),slow=(mem&&mem.summary.audioSlow)||0,reenc=(mem&&mem.summary.reencounters)||count(es,'natural_reencounter'),semantic=(mem&&mem.summary.semanticShifts)||count(es,'semantic_reencounter');
 var evidence=Math.min(1,(seen+es.length*.35)/35);var model={version:VERSION,builtAt:now(),evidenceLevel:evidence<.2?'very-low':evidence<.45?'low':evidence<.7?'medium':'growing',dimensions:{},observations:{seenSentences:seen,repeatEncounters:repeat,fuzzySentences:fuzzy,naturalAudio:natural,slowAudio:slow,reencounters:reenc,semanticShifts:semantic,eventCount:es.length},policy:{neverGrade:true,doNotExposeWeaknessByDefault:true,preferNaturalReencounter:true}};
 function dim(name,score,confidence,why){model.dimensions[name]={score:clamp(score),confidence:clamp(confidence*evidence),evidence:why}}
 dim('contextConnection',.35+Math.min(.5,reenc*.08),.75,['reencounters:'+reenc]);
 dim('meaningFlexibility',.3+Math.min(.55,semantic*.12),.65,['semanticShifts:'+semantic]);
 dim('formFamiliarity',seen?clamp(.3+repeat/(seen*3+1)):.2,.6,['seen:'+seen,'repeat:'+repeat]);
 dim('selfAwareness',seen?clamp(.35+Math.min(.45,fuzzy/(seen+1))):.25,.55,['fuzzySignals:'+fuzzy]);
 var audioTotal=natural+slow;dim('audioEngagement',audioTotal?clamp(.35+Math.log(audioTotal+1)/5):.2,.65,['audio:'+audioTotal,'slow:'+slow]);
 model.preferences={audioPace:audioTotal?(slow/audioTotal>.45?'slow-supportive':slow/audioTotal>.15?'mixed':'natural-first'):'unknown',learningSurface:reenc>=3?'context-rich':'insufficient-evidence'};
 return model}
function save(m){var s=S();if(!s||!s.load||!s.save)return m;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=m;s.save(p);return m}
function refresh(){return save(build())}function get(){var p=profile();if(!p)return null;var old=p.extensions&&p.extensions[EXT],ec=events(p).length;if(!old||old.version!==VERSION||!old.observations||old.observations.eventCount!==ec)return refresh();return old}
function recommendation(){var m=get();if(!m)return null;var d=m.dimensions||{},pref=m.preferences||{};return{mode:'quiet-support',audioPace:pref.audioPace,preferContext:(d.contextConnection&&d.contextConnection.score>=.5),preferReencounter:true,confidence:m.evidenceLevel,reason:'Derived from behavior; never a grade.'}}
window.CSLLearnerModel={version:VERSION,get:get,refresh:refresh,recommendation:recommendation};setTimeout(function(){try{refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('learner-model-ready',{version:VERSION})}catch(e){}},950);
})();