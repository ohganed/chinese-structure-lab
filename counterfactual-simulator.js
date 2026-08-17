(function(){
'use strict';
/* Counterfactual Simulator v1
   Pure in-memory comparison of alternative underground decisions.
   It never spends budget, changes UI, mutates learner history, or writes a trace. */
var VERSION=1;
function safe(fn){try{return fn()}catch(e){return null}}
function now(){return new Date().toISOString()}
function clone(x){try{return JSON.parse(JSON.stringify(x))}catch(e){return x}}
function snapshot(){
 var x=safe(function(){return window.CSLUndergroundIntegration&&CSLUndergroundIntegration.snapshot?CSLUndergroundIntegration.snapshot():null});
 return x?clone(x):null;
}
function evaluate(s){
 if(!s)return{action:'DO_NOTHING',reasons:['no-snapshot'],candidate:null};
 var reasons=[],candidate=null,action='DO_NOTHING';
 var confidence=s.confidence||{},budget=s.budget||{},load=s.load||{},rhythm=s.rhythm||{},opp=s.opportunity||{},audit=s.audit||{};
 if(!confidence||confidence.permission==='observe-only')reasons.push('insufficient-evidence');
 if(audit&&audit.status==='degraded')reasons.push('audit-degraded');
 if(load&&load.band==='high')reasons.push('interface-load-high');
 if(budget&&budget.budget&&budget.budget.remaining<=0)reasons.push('intervention-budget-exhausted');
 if(rhythm&&rhythm.mode==='active-production')reasons.push('protect-active-production');
 if(!reasons.length&&opp&&opp.recommendations&&opp.recommendations.length){candidate=clone(opp.recommendations[0]);action='ALLOW_GENTLE_OPPORTUNITY';reasons.push('natural-opportunity','evidence-permits','budget-available')}
 else if(!reasons.length)reasons.push('no-valuable-opportunity');
 return{action:action,reasons:reasons,candidate:candidate};
}
function scenario(base,name,mutator,note){var s=clone(base);if(mutator)mutator(s);var d=evaluate(s);return{name:name,note:note||'',decision:d,changedFromBaseline:false}}
function simulate(){
 var base=snapshot();if(!base)return{version:VERSION,ranAt:now(),status:'unavailable',policy:{simulationOnly:true,noBudgetSpend:true,noUIChange:true,noHistoryMutation:true,noTraceWrite:true}};
 var baseline=evaluate(base),sc=[];
 sc.push(scenario(base,'current-state',null,'Pure model of the current underground snapshot.'));
 sc.push(scenario(base,'without-load-brake',function(s){s.load=s.load||{};s.load.band='low'},'What if interface load were low?'));
 sc.push(scenario(base,'with-stronger-evidence',function(s){s.confidence=s.confidence||{};s.confidence.permission='bounded-adaptation'},'What if evidence were sufficient for bounded adaptation?'));
 sc.push(scenario(base,'with-fresh-budget',function(s){s.budget=s.budget||{};s.budget.budget=s.budget.budget||{};s.budget.budget.remaining=Math.max(1,Number(s.budget.budget.remaining)||0)},'What if one intervention slot were available?'));
 sc.push(scenario(base,'protect-production-off',function(s){s.rhythm=s.rhythm||{};if(s.rhythm.mode==='active-production')s.rhythm.mode='balanced'},'What if the learner were not currently in active production?'));
 sc.forEach(function(x){x.changedFromBaseline=JSON.stringify(x.decision)!==JSON.stringify(baseline)});
 return{version:VERSION,ranAt:now(),status:'ok',baseline:baseline,scenarios:sc,policy:{simulationOnly:true,noBudgetSpend:true,noUIChange:true,noHistoryMutation:true,noTraceWrite:true,noLearnerExperiment:true,syntheticConditionsClearlyLabeled:true}};
}
window.CSLCounterfactualSimulator={version:VERSION,simulate:simulate,evaluate:evaluate,snapshot:snapshot};
setTimeout(function(){try{var r=simulate();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('counterfactual-simulator-ready',{version:VERSION,status:r.status,scenarios:r.scenarios?r.scenarios.length:0})}catch(e){}},6100);
})();