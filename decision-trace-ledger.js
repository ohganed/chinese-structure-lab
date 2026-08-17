(function(){
'use strict';
/* Decision Trace Ledger v1
   Append-only, bounded audit trail for underground decisions.
   Stores reasons and system state, not learner grades. */
var VERSION=1,EXT='decisionTraceLedgerV1',MAX=200;
function S(){return window.CSLStorage||null}function G(){return window.CSLUndergroundGovernor||null}function now(){return new Date().toISOString()}function safe(f){try{return f()}catch(e){return null}}
function load(){var s=S(),p=s&&s.load?s.load():null;return p&&p.extensions&&p.extensions[EXT]||{version:VERSION,entries:[]}}
function save(l){var s=S();if(!s||!s.load||!s.save)return l;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=l;s.save(p);return l}
function compact(g){return{id:'trace-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),at:now(),action:g.action,reasons:(g.reasons||[]).slice(),candidate:g.candidate?{id:g.candidate.id||null,text:g.candidate.text||'',context:g.candidate.context||null,score:g.candidate.opportunityScore||null}:null,context:g.context||{},policyVersion:{governor:g.version||null,ledger:VERSION}}}
function record(decision){var g=decision||safe(function(){return G()&&G().decide()});if(!g)return null;var l=load();l.version=VERSION;l.entries=Array.isArray(l.entries)?l.entries:[];var e=compact(g),last=l.entries[l.entries.length-1];if(last&&last.action===e.action&&JSON.stringify(last.reasons)===JSON.stringify(e.reasons)&&Date.parse(e.at)-Date.parse(last.at)<30000)return last;l.entries.push(e);if(l.entries.length>MAX)l.entries=l.entries.slice(-MAX);l.updatedAt=now();save(l);return e}
function recent(n){var l=load();return(l.entries||[]).slice(-(n||20))}
function summary(){var xs=recent(100),c={DO_NOTHING:0,ALLOW_GENTLE_OPPORTUNITY:0,other:0},reasons={};xs.forEach(function(x){if(c[x.action]!==undefined)c[x.action]++;else c.other++;(x.reasons||[]).forEach(function(r){reasons[r]=(reasons[r]||0)+1})});return{version:VERSION,entries:xs.length,actions:c,reasons:reasons,policy:{appendOnly:true,bounded:true,noLearnerGrade:true,noRawContentDump:true,auditPurpose:true}}}
window.CSLDecisionTrace={version:VERSION,record:record,recent:recent,summary:summary};setTimeout(function(){try{var e=record();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('decision-trace-ready',{version:VERSION,action:e&&e.action||null})}catch(e){}},4750);
})();