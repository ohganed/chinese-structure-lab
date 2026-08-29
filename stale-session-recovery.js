(function(){
'use strict';
/* Chinese Structure Lab — Stale Session Recovery v1
   A learner may leave without pressing "学習を終了". Raw events remain durable.
   On the next app visit, if the latest unfinalized event is at least 12 hours old,
   finalize that previous session once, run the normal Session End Analyzer, and
   leave a fresh Next Session Plan for the current visit.
   Nothing runs merely because 12 hours pass; recovery happens only on a later visit. */
var VERSION=1,STALE_MS=12*60*60*1000,LOCK_KEY='csl_stale_session_recovery_lock_v1';
function parse(v,f){try{return v?JSON.parse(v):f}catch(e){return f}}
function raw(){try{return window.CSLLightEventBuffer&&CSLLightEventBuffer.peek?CSLLightEventBuffer.peek():parse(localStorage.getItem('csl_light_event_queue_v1'),[])}catch(e){return[]}}
function timeOf(e){var t=Date.parse(e&&e.at||'');return isFinite(t)?t:0}
function snapshot(){var q=raw().filter(function(e){return e&&timeOf(e)>0});if(!q.length)return null;q.sort(function(a,b){return timeOf(a)-timeOf(b)});var first=q[0],last=q[q.length-1],lastMs=timeOf(last);return{events:q,eventCount:q.length,firstAt:first.at,lastAt:last.at,lastMs:lastMs,ageMs:Date.now()-lastMs}}
function stale(s){return!!(s&&s.eventCount>0&&s.ageMs>=STALE_MS)}
function lockActive(){var x=parse(localStorage.getItem(LOCK_KEY),null),at=Date.parse(x&&x.at||'');return!!(x&&isFinite(at)&&Date.now()-at<10*60*1000)}
function setLock(s){try{localStorage.setItem(LOCK_KEY,JSON.stringify({at:new Date().toISOString(),lastAt:s.lastAt,eventCount:s.eventCount}))}catch(e){}}
function clearLock(){try{localStorage.removeItem(LOCK_KEY)}catch(e){}}
function emit(name,detail){try{window.dispatchEvent(new CustomEvent(name,{detail:detail||{}}))}catch(e){}}
function waitRuntime(limit){return new Promise(function(resolve,reject){var n=0;function tick(){if(window.CSLLightEventBuffer&&window.CSLSessionEndAnalyzer&&CSLSessionEndAnalyzer.analyze){resolve();return}if(++n>(limit||80)){reject(new Error('session recovery runtime unavailable'));return}setTimeout(tick,50)}tick()})}
function run(){var s=snapshot();if(!stale(s)||lockActive())return Promise.resolve({version:VERSION,recovered:false,reason:!s?'no-pending-events':(!stale(s)?'not-stale-yet':'locked')});
 window.__cslStaleSessionRecoveryPending=true;setLock(s);emit('csl:stale-session-recovery-start',{eventCount:s.eventCount,firstAt:s.firstAt,lastAt:s.lastAt,thresholdHours:12});
 return waitRuntime().then(function(){return CSLSessionEndAnalyzer.analyze({implicit:true,reason:'inactivity-12h',thresholdHours:12,eventCount:s.eventCount,firstEventAt:s.firstAt,lastEventAt:s.lastAt,recoveredOnVisitAt:new Date().toISOString()})}).then(function(result){
  clearLock();window.__cslStaleSessionRecoveryPending=false;
  var out={version:VERSION,recovered:true,eventCount:s.eventCount,firstAt:s.firstAt,lastAt:s.lastAt,result:result||null};
  emit('csl:stale-session-recovery-complete',out);return out
 }).catch(function(err){clearLock();window.__cslStaleSessionRecoveryPending=false;var out={version:VERSION,recovered:false,error:String(err&&err.message||err),eventCount:s.eventCount,lastAt:s.lastAt};emit('csl:stale-session-recovery-error',out);return out})
}
window.CSLStaleSessionRecovery={version:VERSION,thresholdMs:STALE_MS,snapshot:snapshot,isStale:function(){return stale(snapshot())},run:run,policy:{visitTriggered:true,thresholdHours:12,noBackgroundTimer:true,preservesRawHistory:true,usesSessionEndAnalyzer:true}};
/* Evaluate once on page startup, before the learner's first new interaction whenever possible. */
setTimeout(run,0);
})();
