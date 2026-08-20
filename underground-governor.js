(function(){
'use strict';
/* Underground Governor v2
   Final arbitration layer for adaptive proposals.
   DO NOTHING is a first-class decision. It never mutates learner history or UI directly. */
var VERSION=2,EXT='undergroundGovernorV1';
function S(){return window.CSLStorage||null}function safe(f){try{return f()}catch(e){return null}}function now(){return new Date().toISOString()}
function decide(){var confidence=safe(function(){return window.CSLEvidenceConfidence&&CSLEvidenceConfidence.get()}),budget=safe(function(){return window.CSLInterventionBudget&&CSLInterventionBudget.status()}),agency=safe(function(){return window.CSLLearnerAgency&&CSLLearnerAgency.get()}),rhythm=safe(function(){return window.CSLLearningRhythm&&CSLLearningRhythm.get()}),load=safe(function(){return window.CSLCognitiveLoadGuard&&CSLCognitiveLoadGuard.get()}),opp=safe(function(){return window.CSLOpportunityMatching&&CSLOpportunityMatching.get()}),audit=safe(function(){return window.CSLQualityAuditor&&CSLQualityAuditor.get()}),constitution=safe(function(){return window.CSLUndergroundConstitution&&CSLUndergroundConstitution.get()});var reasons=[],action='DO_NOTHING',candidate=null;
 if(constitution&&constitution.action==='FREEZE_ADAPTATION')reasons.push('constitution-freeze');
 if(!confidence||confidence.permission==='observe-only')reasons.push('insufficient-evidence');
 if(audit&&audit.status==='degraded')reasons.push('audit-degraded');
 if(load&&load.band==='high')reasons.push('interface-load-high');
 if(budget&&budget.budget&&budget.budget.remaining<=0)reasons.push('intervention-budget-exhausted');
 if(rhythm&&rhythm.mode==='active-production')reasons.push('protect-active-production');
 if(!reasons.length&&opp&&opp.recommendations&&opp.recommendations.length){candidate=opp.recommendations[0];action='ALLOW_GENTLE_OPPORTUNITY';reasons.push('natural-opportunity','evidence-permits','budget-available');}
 else if(!reasons.length)reasons.push('no-valuable-opportunity');
 var result={version:VERSION,decidedAt:now(),action:action,candidate:candidate,reasons:reasons,context:{confidence:confidence&&confidence.confidence||null,permission:confidence&&confidence.permission||'unknown',budgetRemaining:budget&&budget.budget?budget.budget.remaining:null,rhythm:rhythm&&rhythm.mode||'unknown',load:load&&load.band||'unknown',audit:audit&&audit.status||'unknown',constitution:constitution&&constitution.action||'unavailable'},agencySummary:agency&&agency.guidance||null,policy:{doNothingIsFirstClass:true,learnerAgencyOutranksInference:true,accessibilityOutranksAdaptation:true,constitutionCanFreezeAdaptation:true,noDirectUIControl:true,noHistoryMutation:true,reversibleActionsOnly:true}};var s=S();if(s&&s.load&&s.save){var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=result;s.save(p)}return result}
window.CSLUndergroundGovernor={version:VERSION,decide:decide,get:decide};setTimeout(function(){try{var g=decide();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('underground-governor-ready',{version:VERSION,action:g.action,reasons:g.reasons})}catch(e){}},4500);
})();
