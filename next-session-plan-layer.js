(function(){
'use strict';
/* Chinese Structure Lab — Next Session Plan Layer v1
   READ-ONLY during learning. It consumes the plan computed at the previous
   explicit session boundary. It never runs learner analysis and never writes
   the profile. On the main Continue surface it may resume at a scene containing
   a precomputed sentence/word candidate. */
var VERSION=1,ROOT_KEY='csl_profile_v1',applied=false;
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
 return{version:VERSION,builtAt:plan&&plan.builtAt||null,candidates:c.slice(0,8),source:ext.reencounterPlanV1?'derived-plan':(c.length?'completed-session':'none'),policy:{readOnly:true,noAnalysis:true,noProfileWrite:true,precomputedPlanOnly:true}}
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
function apply(){
 if(applied)return snapshot();
 var plan=snapshot(),i=sceneIndexFor(plan);if(i<0)return plan;
 applied=true;
 try{
  /* idx/render are the existing main Continue surface globals. No analysis here. */
  if(typeof window.idx==='number')window.idx=i;else if(typeof idx==='number')idx=i;
  if(typeof window.render==='function')window.render();else if(typeof render==='function')render();
  window.__cslNextSessionReason=plan.candidates[0]||null;
 }catch(e){}
 return plan
}
function boot(){setTimeout(apply,60)}
window.CSLNextSessionPlan={version:VERSION,snapshot:snapshot,apply:apply,policy:{readOnly:true,noRealtimeAnalysis:true,precomputedPlanOnly:true}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
