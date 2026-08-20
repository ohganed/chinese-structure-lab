(function(){
'use strict';
/* Underground Runtime Self-Test v4
   Non-destructive health check for the learning underground.
   It verifies presence and safe read paths; it does not spend budget or alter UI. */
var VERSION=4,EXT='undergroundRuntimeSelfTestV1';
function now(){return new Date().toISOString()}function safe(fn){try{return{ok:true,value:fn()}}catch(e){return{ok:false,error:String(e&&e.message||e)}}}
function exists(name,method){var x=window[name];return!!(x&&(!method||typeof x[method]==='function'))}
function check(name,pass,detail){return{name:name,pass:!!pass,detail:detail||null}}
function run(){var checks=[];
 checks.push(check('storage',exists('CSLStorage','load'),'CSLStorage.load'));
 checks.push(check('learning-memory',!!window.CSLLearningMemory,'CSLLearningMemory'));
 checks.push(check('interaction-ledger',exists('CSLInteractionLedger','snapshot'),'CSLInteractionLedger.snapshot'));
 checks.push(check('temporal-pattern',exists('CSLTemporalPattern','get'),'CSLTemporalPattern.get'));
 checks.push(check('support-regulation',exists('CSLSupportRegulation','get'),'CSLSupportRegulation.get'));
 checks.push(check('curriculum-balance',exists('CSLCurriculumBalance','get'),'CSLCurriculumBalance.get'));
 checks.push(check('continuity-resilience',exists('CSLContinuityResilience','get'),'CSLContinuityResilience.get'));
 checks.push(check('floor-registry',exists('CSLUndergroundFloors','health'),'CSLUndergroundFloors.health'));
 checks.push(check('deep-underground',exists('CSLDeepUnderground','get'),'CSLDeepUnderground.get'));
 checks.push(check('constitution',exists('CSLUndergroundConstitution','get'),'CSLUndergroundConstitution.get'));
 checks.push(check('adaptive-presentation',exists('CSLAdaptivePresentation','get'),'CSLAdaptivePresentation.get'));
 checks.push(check('evidence-confidence',exists('CSLEvidenceConfidence','get'),'CSLEvidenceConfidence.get'));
 checks.push(check('intervention-budget',exists('CSLInterventionBudget','status')&&exists('CSLInterventionBudget','request'),'status + request'));
 checks.push(check('learner-agency',exists('CSLLearnerAgency','get'),'CSLLearnerAgency.get'));
 checks.push(check('learning-rhythm',exists('CSLLearningRhythm','get'),'CSLLearningRhythm.get'));
 checks.push(check('cognitive-load',exists('CSLCognitiveLoadGuard','get'),'CSLCognitiveLoadGuard.get'));
 checks.push(check('governor',exists('CSLUndergroundGovernor','decide'),'CSLUndergroundGovernor.decide'));
 checks.push(check('decision-trace',exists('CSLDecisionTrace','record')&&exists('CSLDecisionTrace','recent'),'record + recent'));
 checks.push(check('integration-bus',exists('CSLUndergroundIntegration','snapshot')&&exists('CSLUndergroundIntegration','run'),'snapshot + run'));
 checks.push(check('counterfactual-simulator',exists('CSLCounterfactualSimulator','simulate')&&exists('CSLCounterfactualSimulator','evaluate'),'simulate + evaluate'));
 var snap=safe(function(){return window.CSLUndergroundIntegration.snapshot()});checks.push(check('integration-snapshot',snap.ok&&!!snap.value,snap.ok?'readable':snap.error));
 var budget=safe(function(){return window.CSLInterventionBudget.status()});checks.push(check('budget-read-nondestructive',budget.ok&&budget.value&&budget.value.budget&&typeof budget.value.budget.remaining==='number',budget.ok?'remaining readable':budget.error));
 var agency=safe(function(){return window.CSLLearnerAgency.get()});checks.push(check('agency-read',agency.ok&&agency.value&&agency.value.policy&&agency.value.policy.learnerChoiceOutranksInference===true,agency.ok?'policy present':agency.error));
 var ledger=safe(function(){return window.CSLInteractionLedger.snapshot()});checks.push(check('interaction-privacy',ledger.ok&&ledger.value&&ledger.value.policy&&ledger.value.policy.noCorrectness===true&&ledger.value.policy.noTypedText===true&&ledger.value.policy.noGrades===true,ledger.ok?'privacy safeguards present':ledger.error));
 var floors=safe(function(){return window.CSLUndergroundFloors.health()});checks.push(check('fifty-floor-registry',floors.ok&&floors.value&&floors.value.total===50&&floors.value.complete===true,floors.ok?('available '+floors.value.available+' / 50'):floors.error));
 var deep=safe(function(){return window.CSLDeepUnderground.get()});checks.push(check('deep-invariants',deep.ok&&deep.value&&deep.value.floors&&deep.value.floors[49]&&deep.value.floors[49].status==='healthy',deep.ok?(deep.value.floors[49].issues||[]).join(','):deep.error));
 var constitution=safe(function(){return window.CSLUndergroundConstitution.get()});checks.push(check('constitutional-boundary',constitution.ok&&constitution.value&&constitution.value.constitution&&constitution.value.constitution.noGrades===true&&constitution.value.constitution.noForcedReview===true&&constitution.value.constitution.noHistoryDeletion===true,constitution.ok?constitution.value.action:constitution.error));
 var cf=safe(function(){return window.CSLCounterfactualSimulator.simulate()});checks.push(check('counterfactual-read',cf.ok&&cf.value&&cf.value.policy&&cf.value.policy.simulationOnly===true&&cf.value.policy.noBudgetSpend===true,cf.ok?'simulation safeguards present':cf.error));
 var failed=checks.filter(function(c){return!c.pass}),status=failed.length?'degraded':'healthy';var report={version:VERSION,ranAt:now(),status:status,total:checks.length,passed:checks.length-failed.length,failed:failed.length,checks:checks,policy:{nonDestructive:true,noBudgetSpend:true,noUIChange:true,noLearnerGrade:true}};
 var s=window.CSLStorage;safe(function(){if(!s||!s.load||!s.save)return;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=report;s.save(p)});
 try{if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('underground-self-test',{version:VERSION,status:status,passed:report.passed,total:report.total})}catch(e){}
 return report}
window.CSLUndergroundSelfTest={version:VERSION,run:run};setTimeout(run,6500);
})();
