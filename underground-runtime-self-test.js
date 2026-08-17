(function(){
'use strict';
/* Underground Runtime Self-Test v1
   Non-destructive health check for the learning underground.
   It verifies presence and safe read paths; it does not spend budget or alter UI. */
var VERSION=1,EXT='undergroundRuntimeSelfTestV1';
function now(){return new Date().toISOString()}function safe(fn){try{return{ok:true,value:fn()}}catch(e){return{ok:false,error:String(e&&e.message||e)}}}
function exists(name,method){var x=window[name];return!!(x&&(!method||typeof x[method]==='function'))}
function check(name,pass,detail){return{name:name,pass:!!pass,detail:detail||null}}
function run(){var checks=[];
 checks.push(check('storage',exists('CSLStorage','load'),'CSLStorage.load'));
 checks.push(check('learning-memory',!!window.CSLLearningMemory,'CSLLearningMemory'));
 checks.push(check('adaptive-presentation',exists('CSLAdaptivePresentation','get'),'CSLAdaptivePresentation.get'));
 checks.push(check('evidence-confidence',exists('CSLEvidenceConfidence','get'),'CSLEvidenceConfidence.get'));
 checks.push(check('intervention-budget',exists('CSLInterventionBudget','status')&&exists('CSLInterventionBudget','request'),'status + request'));
 checks.push(check('learner-agency',exists('CSLLearnerAgency','get'),'CSLLearnerAgency.get'));
 checks.push(check('learning-rhythm',exists('CSLLearningRhythm','get'),'CSLLearningRhythm.get'));
 checks.push(check('cognitive-load',exists('CSLCognitiveLoadGuard','get'),'CSLCognitiveLoadGuard.get'));
 checks.push(check('governor',exists('CSLUndergroundGovernor','decide'),'CSLUndergroundGovernor.decide'));
 checks.push(check('decision-trace',exists('CSLDecisionTrace','record')&&exists('CSLDecisionTrace','recent'),'record + recent'));
 checks.push(check('integration-bus',exists('CSLUndergroundIntegration','snapshot')&&exists('CSLUndergroundIntegration','run'),'snapshot + run'));
 var snap=safe(function(){return window.CSLUndergroundIntegration.snapshot()});checks.push(check('integration-snapshot',snap.ok&&!!snap.value,snap.ok?'readable':snap.error));
 var budget=safe(function(){return window.CSLInterventionBudget.status()});checks.push(check('budget-read-nondestructive',budget.ok&&budget.value&&budget.value.budget&&typeof budget.value.budget.remaining==='number',budget.ok?'remaining readable':budget.error));
 var agency=safe(function(){return window.CSLLearnerAgency.get()});checks.push(check('agency-read',agency.ok&&agency.value&&agency.value.policy&&agency.value.policy.learnerChoiceOutranksInference===true,agency.ok?'policy present':agency.error));
 var failed=checks.filter(function(c){return!c.pass}),status=failed.length?'degraded':'healthy';var report={version:VERSION,ranAt:now(),status:status,total:checks.length,passed:checks.length-failed.length,failed:failed.length,checks:checks,policy:{nonDestructive:true,noBudgetSpend:true,noUIChange:true,noLearnerGrade:true}};
 var s=window.CSLStorage;safe(function(){if(!s||!s.load||!s.save)return;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=report;s.save(p)});
 try{if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('underground-self-test',{version:VERSION,status:status,passed:report.passed,total:report.total})}catch(e){}
 return report}
window.CSLUndergroundSelfTest={version:VERSION,run:run};setTimeout(run,5750);
})();