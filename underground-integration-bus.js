(function(){
'use strict';
/* Underground Integration Bus v5
   SESSION-END ONLY.
   During learning, the app records raw learner events but performs no deep analysis.
   Deep analysis is invoked explicitly after a learning session ends.
   This preserves the underground intelligence while removing real-time CPU/storage churn. */
var VERSION=5,EXT='undergroundIntegrationV1',PROFILE_KEY='csl_profile_v1',lastFingerprint='';
function safe(fn){try{return fn()}catch(e){return null}}
function now(){return new Date().toISOString()}
function storage(){return window.CSLStorage||null}
function parse(v){try{return v?JSON.parse(v):null}catch(e){return null}}
function primary(p){if(!p||typeof p!=='object')return null;return{schemaVersion:p.schemaVersion||null,preferences:p.preferences||{},progress:p.progress||{},learning:p.learning||{},aliases:p.aliases||{}}}
function primaryChanged(e){if(!e||e.key!==PROFILE_KEY)return false;var before=primary(parse(e.oldValue)),after=primary(parse(e.newValue));if(!before&&!after)return false;return JSON.stringify(before)!==JSON.stringify(after)}
function read(name,method){return safe(function(){var x=window[name];return x&&x[method||'get']?x[method||'get']():null})}
function normalized(){
 var adaptive=read('CSLAdaptivePresentation'),confidence=read('CSLEvidenceConfidence'),agency=read('CSLLearnerAgency'),budget=read('CSLInterventionBudget','status'),load=read('CSLCognitiveLoadGuard'),rhythm=read('CSLLearningRhythm'),opp=read('CSLOpportunityMatching'),audit=read('CSLQualityAuditor'),support=read('CSLSupportRegulation'),deep=read('CSLDeepUnderground'),constitution=read('CSLUndergroundConstitution');
 var a=adaptive&&adaptive.adaptive||{},d=adaptive&&adaptive.defaults||{};
 return {at:now(),presentation:{mode:a.presentation||'conservative',audioOrder:a.audioOrder||'neutral',pinyin:a.pinyin||d.pinyin||'available-nearby',meaning:a.meaning||d.meaning||'available-nearby',explanationDensity:a.explanationDensity||'normal'},confidence:confidence||null,agency:agency||null,budget:budget||null,load:load||null,rhythm:rhythm||null,opportunity:opp||null,audit:audit||null,support:support||null,deep:deep||null,constitution:constitution||null};
}
function applyAgency(decision,agency,presentation){if(!agency||!agency.preferences)return{decision:decision,presentation:presentation};var p=agency.preferences,g=agency.guidance||{};var next=Object.assign({},presentation);if(p.pinyin&&p.pinyin.signal==='repeated')next.pinyin='available-nearby';if(p.meaning&&p.meaning.signal==='repeated')next.meaning='available-nearby';if(p.audio&&p.audio.signal==='repeated'&&next.audioOrder==='neutral')next.audioOrder='natural-first';if(p.structure&&p.structure.signal==='repeated')next.explanationDensity='normal';return{decision:decision,presentation:next,agencyApplied:{pinyin:g.pinyin||null,meaning:g.meaning||null,audio:g.audio||null,structure:g.structure||null}}}
function applyDeepSupport(presentation,support){var next=Object.assign({},presentation),applied=null;if(!support||!support.floors)return{presentation:next,applied:applied};var pinyin=support.floors[34],meaning=support.floors[35],audio=support.floors[33];if(pinyin&&pinyin.policy)next.pinyin=pinyin.policy;if(meaning&&meaning.policy)next.meaning=meaning.policy;if(audio&&audio.policy&&audio.policy!=='neutral')next.audioOrder=audio.policy;applied={pinyin:next.pinyin,meaning:next.meaning,audioOrder:next.audioOrder};return{presentation:next,applied:applied}}
function consumeBudget(decision){if(!decision||decision.action!=='ALLOW_GENTLE_OPPORTUNITY')return{consumed:false,reason:'not-an-intervention'};var b=window.CSLInterventionBudget;if(!b||!b.request)return{consumed:false,reason:'budget-api-unavailable'};var r=safe(function(){return b.request('governor-approved-opportunity',{candidateId:decision.candidate&&decision.candidate.id||null})});return{consumed:!!(r&&r.allowed),reason:r&&r.reason||'request-failed',result:r||null}}
function trace(decision,result){var d=window.CSLDecisionTrace;safe(function(){if(d&&d.record)d.record(decision)});var s=storage();safe(function(){if(!s||!s.load||!s.save)return;var p=s.load();p.extensions=p.extensions||{};var x=p.extensions[EXT]||{version:VERSION,decisions:[]};x.version=VERSION;x.last=result;x.decisions=(x.decisions||[]).concat([result]).slice(-100);p.extensions[EXT]=x;s.save(p)})}
function quiet(reason,extra){return{version:VERSION,decidedAt:now(),action:'DO_NOTHING',candidate:null,reasons:[reason].concat(extra||[]),policy:{duplicateInterventionsSuppressed:true,budgetMustAuthorizeIntervention:true}}}
function run(reason){var snap=normalized(),decision=read('CSLUndergroundGovernor','decide')||quiet('governor-unavailable');var agency=applyAgency(decision,snap.agency,snap.presentation),deepSupport=applyDeepSupport(agency.presentation,snap.support);snap.presentation=deepSupport.presentation;if(snap.constitution&&snap.constitution.action==='FREEZE_ADAPTATION')decision=quiet('constitution-freeze',snap.constitution.violations||[]);var fingerprint=JSON.stringify([decision.action,decision.candidate&&decision.candidate.id,decision.reasons,snap.presentation,snap.confidence&&snap.confidence.permission]);var budgetResult={consumed:false,reason:'not-required'};
 if(decision.action==='ALLOW_GENTLE_OPPORTUNITY'){
   if(fingerprint===lastFingerprint){budgetResult={consumed:false,reason:'duplicate-suppressed'};decision=quiet('duplicate-intervention-suppressed');}
   else {budgetResult=consumeBudget(decision);lastFingerprint=fingerprint;if(!budgetResult.consumed)decision=quiet('budget-denied',[budgetResult.reason]);}
 } else {lastFingerprint=fingerprint;}
 var result={version:VERSION,ranAt:now(),reason:reason||'session-end',snapshot:snap,decision:decision,budget:budgetResult,agencyApplied:agency.agencyApplied||null,deepSupportApplied:deepSupport.applied,policy:{sessionEndOnly:true,noRealtimeAnalysis:true}};trace(decision,result);safe(function(){if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('underground-integration',{action:decision.action,reason:result.reason})});return result}
function schedule(){return{scheduled:false,reason:'realtime-analysis-disabled'}}
window.CSLUndergroundIntegration={version:VERSION,run:run,snapshot:normalized,schedule:schedule,primaryStorageChange:primaryChanged,policy:{sessionEndOnly:true,noStartupRun:true,noRealtimeListeners:true}};
})();
