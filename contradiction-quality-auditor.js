(function(){
'use strict';
/* Contradiction & Quality Auditor v1
   Watches underground engines for conflicting recommendations and degraded state.
   Audit only: it never changes learner history or lesson UI. */
var VERSION=1,EXT='contradictionQualityAuditV1';
function S(){return window.CSLStorage||null}function safe(fn){try{return fn()}catch(e){return null}}
function now(){return new Date().toISOString()}function issue(type,severity,message,data){return{type:type,severity:severity,message:message,data:data||{},at:now()}}
function audit(){var issues=[],r=safe(function(){return window.CSLRetrievalNeed&&CSLRetrievalNeed.get()}),o=safe(function(){return window.CSLOpportunityMatching&&CSLOpportunityMatching.get()}),a=safe(function(){return window.CSLAdaptivePresentation&&CSLAdaptivePresentation.get()}),p=safe(function(){return window.CSLPresentationPolicy&&CSLPresentationPolicy.apply()}),os=safe(function(){return window.CSLLearningOS&&CSLLearningOS.health()});
 if(!r)issues.push(issue('missing-engine','warning','Retrieval Need is unavailable.'));
 if(!o)issues.push(issue('missing-engine','warning','Opportunity Matching is unavailable.'));
 if(!a)issues.push(issue('missing-engine','warning','Adaptive Presentation is unavailable.'));
 if(os&&os.recentErrors&&os.recentErrors.length)issues.push(issue('engine-errors','warning','Learning OS has recent engine errors.',{errors:os.recentErrors}));
 if(r&&o){var high={};(r.ranked||[]).forEach(function(x){if(x.retrievalNeed>=.7)high[x.id]=x});(o.matches||[]).forEach(function(x){if(high[x.id]&&x.action==='do-not-surface')issues.push(issue('need-vs-context','info','High retrieval need is being correctly held back because the current context is weak.',{id:x.id,text:x.text,need:x.retrievalNeed,fit:x.contextFit}))})}
 if(a&&p&&p.seniorOverride&&a.support==='light')issues.push(issue('accessibility-override','info','Senior accessibility correctly overrides a light-support presentation proposal.'));
 var severe=issues.filter(function(x){return x.severity==='error'}).length,warnings=issues.filter(function(x){return x.severity==='warning'}).length;var result={version:VERSION,auditedAt:now(),status:severe?'degraded':warnings?'watch':'healthy',counts:{errors:severe,warnings:warnings,info:issues.length-severe-warnings},issues:issues,policy:{auditOnly:true,noHistoryMutation:true,noUIControl:true,conflictIsData:true}};
 var s=S();if(s&&s.load&&s.save){var d=s.load();d.extensions=d.extensions||{};d.extensions[EXT]=result;s.save(d)}return result}
window.CSLQualityAuditor={version:VERSION,audit:audit,get:audit};setTimeout(function(){try{var x=audit();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('quality-audit-ready',{version:VERSION,status:x.status,issues:x.issues.length})}catch(e){}},3200);
})();