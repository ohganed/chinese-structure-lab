(function(){
'use strict';
/* Intervention Budget Engine v1
   Protects learner attention by limiting adaptive interventions per session.
   Underground intelligence must earn the right to interrupt—and often stay silent. */
var VERSION=1,EXT='interventionBudgetV1',KEY='csl_intervention_budget_session_v1';
function S(){return window.CSLStorage||null}function E(){return window.CSLEvidenceConfidence||null}function now(){return new Date().toISOString()}
function state(){try{return JSON.parse(sessionStorage.getItem(KEY)||'null')||{startedAt:now(),used:0,events:[]}}catch(e){return{startedAt:now(),used:0,events:[]}}}
function saveLocal(x){try{sessionStorage.setItem(KEY,JSON.stringify(x))}catch(e){}return x}
function limit(){var e=E()&&E().get?E().get():null;if(!e||e.permission==='observe-only')return 0;if(e.permission==='gentle-hints')return 2;return 3}
function status(){var st=state(),max=limit(),remaining=Math.max(0,max-st.used);return{version:VERSION,at:now(),sessionStartedAt:st.startedAt,budget:{max:max,used:st.used,remaining:remaining},permission:remaining>0?'available':'silent',policy:{attentionIsFinite:true,noInterventionWithoutBudget:true,maxThreePerSession:true,silenceIsAValidAction:true,learnerInitiatedActionsDoNotConsumeBudget:true}}}
function request(kind,meta){var st=state(),max=limit();if(st.used>=max)return{allowed:false,reason:max===0?'confidence-too-low':'budget-exhausted',status:status()};st.used++;st.events.push({at:now(),kind:kind||'adaptive-hint',meta:meta||{}});saveLocal(st);return{allowed:true,reason:'budget-available',status:status()}}
function reset(){try{sessionStorage.removeItem(KEY)}catch(e){}return status()}
function persist(){var x=status(),s=S();if(s&&s.load&&s.save){var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=x;s.save(p)}return x}
window.CSLInterventionBudget={version:VERSION,status:persist,request:request,reset:reset};setTimeout(function(){try{var x=persist();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('intervention-budget-ready',{version:VERSION,remaining:x.budget.remaining})}catch(e){}},3650);
})();