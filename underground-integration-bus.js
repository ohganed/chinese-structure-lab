(function(){
'use strict';
/* Underground Integration Bus v1
   Connects existing underground engines without taking learner control.
   Event-driven recalculation, normalized snapshots, governor arbitration,
   budget consumption only after an allowed proposal, and decision tracing. */
var VERSION=1,EXT='undergroundIntegrationV1',timer=null,lastFingerprint='';
function safe(fn){try{return fn()}catch(e){return null}}
function now(){return new Date().toISOString()}
function storage(){return window.CSLStorage||null}
function read(name,method){return safe(function(){var x=window[name];return x&&x[method||'get']?x[method||'get']():null})}
function normalized(){
 var adaptive=read('CSLAdaptivePresentation'),confidence=read('CSLEvidenceConfidence'),agency=read('CSLLearnerAgency'),budget=read('CSLInterventionBudget','status'),load=read('CSLCognitiveLoadGuard'),rhythm=read('CSLLearningRhythm'),opp=read('CSLOpportunityMatching'),audit=read('CSLQualityAuditor');
 var a=adaptive&&adaptive.adaptive||{};
 return {at:now(),presentation:{mode:a.presentation||'conservative',audioOrder:a.audioOrder||'neutral',pinyin:a.pinyin||adaptive&&adaptive.defaults&&adaptive.defaults.pinyin||'available-nearby',meaning:a.meaning||adaptive&&adaptive.defaults&&adaptive.defaults.meaning||'available-nearby',explanationDensity:a.explanationDensity||'normal'},confidence:confidence||null,agency:agency||null,budget:budget||null,load:load||null,rhythm:rhythm||null,opportunity:opp||null,audit:audit||null};
}
function agencyBlocks(a){if(!a)return false;var g=a.guidance||a.preference||a.intent||'';return /decline|avoid|stop|less|do-not|no-adaptation/i.test(String(g))||a.allowAdaptation===false}
function consumeBudget(decision){if(!decision||decision.action!=='ALLOW_GENTLE_OPPORTUNITY')return false;var b=window.CSLInterventionBudget;if(!b)return false;return safe(function(){if(b.consume)return b.consume(1,'governor-approved-opportunity');if(b.spend)return b.spend(1,'governor-approved-opportunity');return false})||false}
function trace(payload){var d=window.CSLDecisionTrace;safe(function(){if(d&&d.record)d.record(payload)});var s=storage();safe(function(){if(!s||!s.load||!s.save)return;var p=s.load();p.extensions=p.extensions||{};var x=p.extensions[EXT]||{version:VERSION,decisions:[]};x.last=payload;x.decisions=(x.decisions||[]).concat([payload]).slice(-100);p.extensions[EXT]=x;s.save(p)})}
function run(reason){var snap=normalized(),decision=read('CSLUndergroundGovernor','decide')||{action:'DO_NOTHING',reasons:['governor-unavailable']};if(agencyBlocks(snap.agency)){decision={version:VERSION,decidedAt:now(),action:'DO_NOTHING',candidate:null,reasons:['learner-agency-veto'],policy:{learnerAgencyOutranksInference:true}}}
 var fingerprint=JSON.stringify([decision.action,decision.candidate&&decision.candidate.id,decision.reasons,snap.presentation.mode,snap.confidence&&snap.confidence.permission]);var consumed=false;if(fingerprint!==lastFingerprint){consumed=consumeBudget(decision);lastFingerprint=fingerprint}
 var result={version:VERSION,ranAt:now(),reason:reason||'manual',snapshot:snap,decision:decision,budgetConsumed:consumed};trace(result);safe(function(){if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('underground-integration',{action:decision.action,reason:result.reason})});return result}
function schedule(reason){clearTimeout(timer);timer=setTimeout(function(){run(reason)},120)}
['learning-event','encounter-recorded','sentence-viewed','audio-played','pinyin-toggled','meaning-revealed','unclear-changed','scene-changed','accessibility-changed','learner-choice','platform-ready'].forEach(function(n){window.addEventListener('csl:'+n,function(){schedule(n)})});
window.addEventListener('storage',function(){schedule('storage-change')});
window.CSLUndergroundIntegration={version:VERSION,run:run,snapshot:normalized,schedule:schedule};
setTimeout(function(){run('startup')},5000);
})();