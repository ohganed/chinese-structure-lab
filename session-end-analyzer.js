(function(){
'use strict';
/* Chinese Structure Lab — Session End Analyzer v3
   Learning time: collect raw events only. No underground analysis.
   Session boundary: flush the raw event buffer first, then lazy-load underground
   modules, analyze the completed session exactly once, save the completed session,
   and leave the derived next-session state ready for the next visit. */
var VERSION=3,loading=null;
var HEAVY=[
 'learning-memory-engine.js','learner-model-engine.js','reencounter-planner.js',
 'situation-graph-engine.js','persistent-world-engine.js','language-graph-engine.js',
 'meaning-sense-graph-engine.js','encounter-quality-engine.js','retrieval-need-engine.js',
 'opportunity-matching-engine.js','adaptive-presentation-engine.js','presentation-policy-layer.js',
 'learning-os-core.js','contradiction-quality-auditor.js','evidence-confidence-engine.js',
 'intervention-budget-engine.js','learner-agency-engine.js','learning-rhythm-engine.js',
 'cognitive-load-guard.js','temporal-pattern-engine.js','support-regulation-engine.js',
 'curriculum-balance-engine.js','continuity-resilience-engine.js','underground-floor-registry.js',
 'deep-underground-orchestrator.js','underground-constitution.js','underground-governor.js',
 'decision-trace-ledger.js','underground-integration-bus.js','counterfactual-simulator.js'
];
function loadOne(src){return new Promise(function(resolve,reject){
 if(document.querySelector('script[data-csl-session-end="'+src+'"]')||document.querySelector('script[src$="/'+src+'"]')){resolve();return}
 var s=document.createElement('script');s.src='./'+src;s.async=false;s.dataset.cslSessionEnd=src;s.onload=resolve;s.onerror=function(){reject(new Error('Failed to load '+src))};document.head.appendChild(s)
})}
function loadAll(){if(loading)return loading;loading=HEAVY.reduce(function(p,src){return p.then(function(){return loadOne(src)})},Promise.resolve());return loading}
function now(){return new Date().toISOString()}
function safe(fn){try{return fn()}catch(e){return null}}
function flushRaw(){return safe(function(){return window.CSLLightEventBuffer&&CSLLightEventBuffer.flush?CSLLightEventBuffer.flush():true})!==false}
function nextPlan(){return safe(function(){return window.CSLReencounterPlanner&&CSLReencounterPlanner.get?CSLReencounterPlanner.get():null})}
function saveSession(meta,result,plan){safe(function(){if(window.CSLStorage&&CSLStorage.addSession)CSLStorage.addSession({type:'learning-session',completedAt:result.analyzedAt,meta:meta||{},analysis:{durationMs:result.durationMs,deepStatus:result.deep&&result.deep.status||null,integrationAction:result.integration&&result.integration.action||null},nextSessionPlan:plan?{builtAt:plan.builtAt||null,candidates:(plan.candidates||[]).slice(0,8)}:null})})}
function analyze(meta){meta=meta||{};var started=Date.now(),rawFlushed=flushRaw();
 return loadAll().then(function(){
   /* Refresh derived memory/model after the just-finished raw events are durable. */
   safe(function(){if(window.CSLLearningMemory&&CSLLearningMemory.refresh)CSLLearningMemory.refresh()});
   safe(function(){if(window.CSLLearnerModel&&CSLLearnerModel.refresh)CSLLearnerModel.refresh()});
   var deep=safe(function(){return window.CSLDeepUnderground&&CSLDeepUnderground.analyze?CSLDeepUnderground.analyze():null});
   var integration=safe(function(){return window.CSLUndergroundIntegration&&CSLUndergroundIntegration.run?CSLUndergroundIntegration.run('session-end'):null});
   var plan=safe(function(){return window.CSLReencounterPlanner&&CSLReencounterPlanner.refresh?CSLReencounterPlanner.refresh():nextPlan()});
   var result={version:VERSION,analyzedAt:now(),durationMs:Date.now()-started,meta:meta,rawEventsFlushed:rawFlushed,deep:deep?{status:deep.floors&&deep.floors[49]&&deep.floors[49].status||null}:null,integration:integration?{action:integration.decision&&integration.decision.action||null}:null,nextSessionPlan:plan?{builtAt:plan.builtAt||null,candidateCount:(plan.candidates||[]).length}:null,policy:{sessionEndOnly:true,noRealtimeAnalysis:true,lazyLoaded:true,flushBeforeAnalysis:true}};
   safe(function(){if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent('session_analysis_complete',result)});
   saveSession(meta,result,plan);
   try{window.dispatchEvent(new CustomEvent('csl:session-analysis-complete',{detail:result}))}catch(e){}
   return result
 }).catch(function(err){var result={version:VERSION,analyzedAt:now(),durationMs:Date.now()-started,meta:meta,rawEventsFlushed:rawFlushed,error:String(err&&err.message||err),policy:{sessionEndOnly:true,noRealtimeAnalysis:true,lazyLoaded:true,flushBeforeAnalysis:true,failOpen:true}};try{window.dispatchEvent(new CustomEvent('csl:session-analysis-error',{detail:result}))}catch(e){}return result})
}
window.CSLSessionEndAnalyzer={version:VERSION,analyze:analyze,loadAll:loadAll,policy:{sessionEndOnly:true,noRealtimeAnalysis:true,lazyLoadUnderground:true,flushBeforeAnalysis:true,persistCompletedSession:true}};
})();