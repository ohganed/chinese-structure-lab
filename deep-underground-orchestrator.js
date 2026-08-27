(function(){
'use strict';
/* Floors 48–49: SESSION-END ONLY deep analysis.
   During learning, this module is dormant. It derives and persists a deep snapshot
   only when explicitly invoked after the learner ends a session. */
var VERSION=2,EXT='deepUndergroundV1';
function S(){return window.CSLStorage||null}function now(){return new Date().toISOString()}function safe(f){try{return f()}catch(e){return null}}
function read(name){return safe(function(){return window[name]&&window[name].get?window[name].get():null})}
function build(){var temporal=read('CSLTemporalPattern'),support=read('CSLSupportRegulation'),curriculum=read('CSLCurriculumBalance'),continuity=read('CSLContinuityResilience'),registry=safe(function(){return window.CSLUndergroundFloors&&CSLUndergroundFloors.health()}),issues=[];if(!temporal)issues.push('temporal-unavailable');if(!support)issues.push('support-unavailable');if(!curriculum)issues.push('curriculum-unavailable');if(!continuity)issues.push('continuity-unavailable');if(!registry)issues.push('floor-registry-unavailable');else if(!registry.complete)issues.push('floor-registry-incomplete');if(continuity&&continuity.floors[45].healthy!==true)issues.push('schema-integrity');if(continuity&&continuity.floors[46].healthy!==true)issues.push('history-continuity');if(continuity&&continuity.floors[47].healthy!==true)issues.push('privacy-resilience');var floor48={name:'Deep Snapshot',temporal:temporal,support:support,curriculum:curriculum,continuity:continuity};var floor49={name:'Invariant Auditor',status:issues.length?'freeze':'healthy',issues:issues,registry:registry,checks:{noGrade:true,noForcedReview:true,noHistoryDeletion:true,noTypedText:true,recoveryControlsRemain:true,doNothingAllowed:true}};return{version:VERSION,builtAt:now(),floors:{48:floor48,49:floor49},policy:{readAndDeriveOnly:true,noDirectUIControl:true,noHistoryMutation:true,noBudgetSpend:true,failClosed:true,sessionEndOnly:true,noRealtimeAnalysis:true}}}
function save(x){var s=S();if(!s||!s.load||!s.save)return x;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=x;s.save(p);return x}
function analyze(){var x=save(build());try{if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('deep-underground-ready',{version:VERSION,status:x.floors[49].status,reason:'session-end'})}catch(e){}return x}
function peek(){return build()}
function floor(n){var x=peek();return x&&x.floors[n]||null}
function schedule(){return{scheduled:false,reason:'realtime-analysis-disabled'}}
window.CSLDeepUnderground={version:VERSION,get:peek,peek:peek,analyze:analyze,refresh:analyze,floor:floor,schedule:schedule,policy:{sessionEndOnly:true,noStartupRun:true,noRealtimeListeners:true}};
})();
