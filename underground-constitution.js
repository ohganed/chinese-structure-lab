(function(){
'use strict';
/* Floor 50: non-negotiable constitutional boundary and fail-safe. */
var VERSION=1,EXT='undergroundConstitutionV1';
function S(){return window.CSLStorage||null}function now(){return new Date().toISOString()}function safe(f){try{return f()}catch(e){return null}}
function evaluate(snapshot){snapshot=snapshot||safe(function(){return window.CSLDeepUnderground&&CSLDeepUnderground.get()});var audit=snapshot&&snapshot.floors&&snapshot.floors[49],violations=[];if(!snapshot)violations.push('deep-snapshot-unavailable');if(audit&&audit.status!=='healthy')violations=violations.concat(audit.issues||['invariant-audit-failed']);var action=violations.length?'FREEZE_ADAPTATION':'PROCEED_QUIETLY';return{version:VERSION,floor:50,name:'Underground Constitution',evaluatedAt:now(),action:action,violations:violations,constitution:{learnerAgencyIsSupreme:true,noGrades:true,noCorrectnessJudgment:true,noForcedReview:true,noStreak:true,noAbsencePenalty:true,noHistoryDeletion:true,noTypedTextCollection:true,noIdentityCollection:true,noHiddenRecoveryControls:true,noDirectUIControl:true,doNothingIsValid:true,allAdaptationReversible:true,accessibilityOverridesAdaptation:true},effect:action==='FREEZE_ADAPTATION'?'Keep ordinary learner controls; suppress adaptive interventions.':'Permit only bounded, reversible, budgeted support.'}}
function save(x){var s=S();if(!s||!s.load||!s.save)return x;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=x;s.save(p);return x}function get(){return save(evaluate())}
window.CSLUndergroundConstitution={version:VERSION,get:get,evaluate:evaluate};setTimeout(function(){try{var x=get();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('underground-constitution-ready',{version:VERSION,action:x.action})}catch(e){}},5350);
})();
