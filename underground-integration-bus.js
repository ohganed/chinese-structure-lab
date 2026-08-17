(function(){
'use strict';
/* Underground Integration Bus v3
   Connects existing underground engines without taking learner control.
   Event-driven recalculation, normalized snapshots, governor arbitration,
   budget consumption only after an allowed proposal, and decision tracing. */
var VERSION=3,EXT='undergroundIntegrationV1',timer=null,lastFingerprint='';
function safe(fn){try{return fn()}catch(e){return null}}
function now(){return new Date().toISOString()}
function storage(){return window.CSLStorage||null}
function read(name,method){return safe(function(){var x=window[name];return x&&x[method||'get']?x[method||'get']():null})}
function normalized(){
 var adaptive=read('CSLAdaptivePresentation'),confidence=read('CSLEvidenceConfidence'),agency=read('CSLLearnerAgency'),budget=read('CSLInterventionBudget','status'),load=read('CSLCognitiveLoadGuard'),rhythm=read('CSLLearningRhythm'),opp=read('CSLOpportunityMatching'),audit=read('CSLQualityAuditor');
 var a=adaptive&&adaptive.adaptive||{},d=adaptive&&adaptive.defaults||{};
 return {at:now(),presentation:{mode:a.presentation||'conservative',audioOrder:a.audioOrder||'neutral',pinyin:a.pinyin||d.pinyin||'available-nearby',meaning:a.meaning||d.meaning||'available-nearby',explanationDensity:a.explanationDensity||'normal'},confidence:confidence||null,agency:agency||null,budget:budget||null,load:load||null,rhythm:rhythm||null,opportunity:opp||null,audit:audit||null};
}
function applyAgency(decision,agency,presentation){if(!agency||!agency.preferences)return{decision:decision,presentation:presentation};var p=agency.preferences,g=agency.guidance||{};var next=Object.assign({},presentation);if(p.pinyin&&p.pinyin.signal==='repeated')next.pinyin='available-nearby';if(p.meaning&&p.meaning.signal==='repeated')next.meaning='available-nearby';if(p.audio&&p.audio.signal==='repeated'&&next.audioOrder==='neutral')next.audioOrder='natural-first';if(p.structure&&p.structure.signal==='repeated')next.explanationDensity='normal';return{decision:decision,presentation:next,agencyApplied:{pinyin:g.pinyin||null,meaning:g.meaning||null,audio:g.audio||null,structure:g.structure||null}}}
function consumeBudget(decision){if(!decision||decision.action!=='ALLOW_GENTLE_OPPORTUNITY')return{consumed:false,reason:'not-an-intervention'};var b=window.CSLInterventionBudget;if(!b||!b.request)return{consumed:false,reason:'budget-api-unavailable'};var r=safe(function(){return b.request('governor-approved-opportunity',{candidateId:decision.candidate&&decision.candidate.id||null})});return{consumed:!!(r&&r.allowed),reason:r&&r.reason||'request-failed',result:r||null}}
function trace(decision,result){var d=window.CSLDecisionTrace;safe(function(){if(d&&d.record)d.record(decision)});var s=storage();safe(function(){if(!s||!s.load||!s.save)return;var p=s.load();p.extensions=p.extensions||{};var x=p.extensions[EXT]||{version:VERSION,decisions:[]};x.version=VERSION;x.last=result;x.decisions=(x.decisions||[]).concat([result]).slice(-100);p.extensions[EXT]=x;s.save(p)})}
function quiet(reason,extra){return{version:VERSION,decidedAt:now(),action:'DO_NOTHING',candidate:null,reasons:[reason].concat(extra||[]),policy:{duplicateInterventionsSuppressed:true,budgetMustAuthorizeIntervention:true}}}
function run(reason){var snap=normalized(),decision=read('CSLUndergroundGovernor','decide')||quiet('governor-unavailable');var agency=applyAgency(decision,snap.agency,snap.presentation);snap.presentation=agency.presentation;var fingerprint=JSON.stringify([decision.action,decision.candidate&&decision.candidate.id,decision.reasons,snap.presentation,snap.confidence&&snap.confidence.permission]);var budgetResult={consumed:false,reason:'not-required'};
 if(decision.action==='ALLOW_GENTLE_OPPORTUNITY'){
   if(fingerprint===lastFingerprint){budgetResult={consumed:false,reason:'duplicate-suppressed'};decision=quiet('duplicate-intervention-suppressed');}
   else {budgetResult=consumeBudget(decision);lastFingerprint=fingerprint;if(!budgetResult.consumed)decision=quiet('budget-denied',[budgetResult.reason]);}
 } else {lastFingerprint=fingerprint;}
 var result={version:VERSION,ranAt:now(),reason:reason||'manual',snapshot:snap,decision:decision,budget:budgetResult,agencyApplied:agency.agencyApplied||null};trace(decision,result);safe(function(){if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('underground-integration',{action:decision.action,reason:result.reason})});return result}
function schedule(reason){clearTimeout(timer);timer=setTimeout(function(){run(reason)},160)}
['learning-event','encounter-recorded','sentence-viewed','audio-played','pinyin-toggled','meaning-revealed','unclear-changed','scene-changed','accessibility-changed','learner-choice','platform-ready'].forEach(function(n){window.addEventListener('csl:'+n,function(){schedule(n)})});
window.addEventListener('storage',function(){schedule('storage-change')});
window.CSLUndergroundIntegration={version:VERSION,run:run,snapshot:normalized,schedule:schedule};
setTimeout(function(){run('startup')},5000);
})();