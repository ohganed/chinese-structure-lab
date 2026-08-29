(function(){
'use strict';
/* Chinese Structure Lab — Next Session Plan Layer v2
   READ-ONLY during learning. It consumes only a plan already computed at a
   session boundary. If a stale unfinished session is being recovered on this
   visit, wait for that recovery to finish and then apply the freshly computed
   plan. No learner analysis or profile writes occur here. */
var VERSION=2,ROOT_KEY='csl_profile_v1',applied=false;
function parse(v,f){try{return v?JSON.parse(v):f}catch(e){return f}}
function norm(t){return String(t||'').replace(/\s+/g,'').replace(/[。！？!?，,；;：:“”‘’"'（）()、]/g,'')}
function readProfile(){return parse(localStorage.getItem(ROOT_KEY),null)}
function latestSessionPlan(p){
 var ss=p&&p.learning&&Array.isArray(p.learning.sessions)?p.learning.sessions:[];
 for(var i=ss.length-1;i>=0;i--){var x=ss[i]&&ss[i].nextSessionPlan;if(x&&Array.isArray(x.candidates)&&x.candidates.length)return x}
 return null
}
function snapshot(){
 var p=readProfile(),ext=p&&p.extensions||{},plan=ext.reencounterPlanV1||latestSessionPlan(p),c=plan&&Array.isArray(plan.candidates)?plan.candidates:[];
 return{version:VERSION,builtAt:plan&&plan.builtAt||null,candidates:c.slice(0,8),source:ext.reencounterPlanV1?'derived-plan':(c.length?'completed-session':'none'),policy:{readOnly:true,noAnalysis:true,noProfileWrite:true,precomputedPlanOnly:true,waitsForStaleRecovery:true}}
}
function sceneIndexFor(plan){
 if(!Array.isArray(window.scenes)||!plan||!Array.isArray(plan.candidates))return -1;
 for(var c=0;c<plan.candidates.length;c++){
  var x=plan.candidates[c]||{},needle=norm(x.text||x.id||'');if(!needle)continue;
  for(var i=0;i<window.scenes.length;i++){
   var z=norm(window.scenes[i]&&window.scenes[i].z||'');if(!z)continue;
   if(x.kind==='sentence'&&z===needle)return i;
   if(x.kind==='word'&&z.indexOf(needle)>=0)return i;
  }
 }
 return -1
}
function apply(force){
 if(window.__cslStaleSessionRecoveryPending&&!force)return snapshot();
 if(applied&&!force)return snapshot();
 var plan=snapshot(),i=sceneIndexFor(plan);if(i<0)return plan;
 applied=true;
 try{
  if(typeof window.idx==='number')window.idx=i;else if(typeof idx==='number')idx=i;
  if(typeof window.render==='function')window.render();else if(typeof render==='function')render();
  window.__cslNextSessionReason=plan.candidates[0]||null;
 }catch(e){}
 return plan
}
function boot(){setTimeout(function(){apply(false)},80)}
window.addEventListener('csl:stale-session-recovery-start',function(){window.__cslStaleSessionRecoveryPending=true});
window.addEventListener('csl:stale-session-recovery-complete',function(){window.__cslStaleSessionRecoveryPending=false;applied=false;setTimeout(function(){apply(true)},0)});
window.addEventListener('csl:stale-session-recovery-error',function(){window.__cslStaleSessionRecoveryPending=false;setTimeout(function(){apply(false)},0)});
window.CSLNextSessionPlan={version:VERSION,snapshot:snapshot,apply:apply,policy:{readOnly:true,noRealtimeAnalysis:true,precomputedPlanOnly:true,waitsForStaleRecovery:true}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
