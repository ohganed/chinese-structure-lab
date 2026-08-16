(function(){
'use strict';
/* Chinese Structure Lab · Reencounter Planner v1
   Plans what may naturally reappear next. It does not alter lesson content yet. */
var VERSION=1,EXT='reencounterPlanV1';
function S(){return window.CSLStorage||null}function LM(){return window.CSLLearnerModel||null}function MM(){return window.CSLLearningMemory||null}
function now(){return new Date().toISOString()}function obj(x){return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function load(){try{return S()&&S().load?S().load():null}catch(e){return null}}
function daysSince(iso){if(!iso)return 30;var n=(Date.now()-new Date(iso).getTime())/86400000;return isFinite(n)?Math.max(0,n):30}
function scoreSentence(s){var e=obj(s.extras),age=daysSince(s.lastSeenAt||e.lastReencounterAt),enc=Number(s.encounters)||0;var score=0;if(s.fuzzy)score+=5;score+=Math.min(3,age/4);if(enc===1)score+=1.5;if(Number(e.reencounterCount)>0)score-=Math.min(1.5,Number(e.reencounterCount)*.3);return score}
function build(){var p=load();if(!p)return null;var sent=obj(obj(p.learning).sentences),learner=LM()&&LM().get?LM().get():null,memory=MM()&&MM().get?MM().get():null,candidates=[];
 Object.keys(sent).forEach(function(id){var s=sent[id]||{},text=s.legacyText||s.text||'';if(!text)return;var score=scoreSentence(s);if(score>1)candidates.push({kind:'sentence',id:id,text:text,score:score,reason:s.fuzzy?'previously-unclear':'due-for-natural-return',lastSeenAt:s.lastSeenAt||null});});
 var words=memory&&memory.words||{};Object.keys(words).forEach(function(w){var x=words[w]||{};candidates.push({kind:'word',id:w,text:w,score:2+Math.min(2,daysSince(x.lastSeenAt)/7),reason:'reuse-across-contexts',lastSeenAt:x.lastSeenAt||null});});
 var cons=memory&&memory.constructions||{};Object.keys(cons).forEach(function(k){var x=cons[k]||{};candidates.push({kind:'construction',id:k,text:x.label||k,score:1.8+Math.min(2,daysSince(x.lastSeenAt)/8),reason:'structural-reencounter',lastSeenAt:x.lastSeenAt||null});});
 candidates.sort(function(a,b){return b.score-a.score});var chosen=[],kindCount={};for(var i=0;i<candidates.length&&chosen.length<8;i++){var c=candidates[i],n=kindCount[c.kind]||0;if(n>=4)continue;kindCount[c.kind]=n+1;chosen.push(c)}
 return{version:VERSION,builtAt:now(),mode:'quiet-natural-reencounter',learnerEvidence:learner&&learner.evidenceLevel||'unknown',rules:{neverInterrupt:true,neverQuiz:true,doNotForceInsertion:true,maxHintsPerSession:2,preferDifferentContext:true},candidates:chosen};}
function save(plan){var s=S();if(!s||!s.load||!s.save)return plan;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=plan;s.save(p);return plan}
function refresh(){return save(build())}function get(){var p=load();if(!p)return null;var old=p.extensions&&p.extensions[EXT];return old&&old.version===VERSION?old:refresh()}
function suggestions(limit){var p=refresh();return p?p.candidates.slice(0,limit||3):[]}
window.CSLReencounterPlanner={version:VERSION,get:get,refresh:refresh,suggestions:suggestions};setTimeout(function(){try{refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('reencounter-plan-ready',{version:VERSION})}catch(e){}},1250);
})();