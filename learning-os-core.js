(function(){
'use strict';
/* Chinese Learning OS Core v1
   A stable contract for a very large number of quiet background engines.
   Engines observe facts, derive estimates, propose plans, and may be replaced
   without rewriting the learner's raw history. */
var VERSION=1,registry={},state={startedAt:new Date().toISOString(),runs:0,errors:[]};
var phases=['observe','remember','infer','plan','adapt','verify'];
function validPhase(x){return phases.indexOf(x)>=0}
function clone(x){try{return JSON.parse(JSON.stringify(x))}catch(e){return null}}
function register(def){if(!def||!def.id)throw new Error('engine id required');if(registry[def.id])return registry[def.id];var e={id:String(def.id),version:Number(def.version)||1,phase:validPhase(def.phase)?def.phase:'infer',priority:Number(def.priority)||100,enabled:def.enabled!==false,dependsOn:Array.isArray(def.dependsOn)?def.dependsOn.slice():[],run:typeof def.run==='function'?def.run:function(){return null},confidencePolicy:def.confidencePolicy||'explicit',description:def.description||''};registry[e.id]=e;return e}
function available(id){return !!registry[id]}
function context(extra){return{at:new Date().toISOString(),storage:window.CSLStorage||null,memory:window.CSLLearningMemory||null,learner:window.CSLLearnerModel||null,planner:window.CSLReencounterPlanner||null,platform:window.CSLPlatform||null,extra:extra||{}}}
function ordered(){return Object.keys(registry).map(function(k){return registry[k]}).filter(function(e){return e.enabled}).sort(function(a,b){var pa=phases.indexOf(a.phase),pb=phases.indexOf(b.phase);return pa-pb||a.priority-b.priority})}
function run(extra){var ctx=context(extra),out={at:ctx.at,coreVersion:VERSION,results:{},skipped:[]};ordered().forEach(function(e){var missing=e.dependsOn.filter(function(d){return !available(d)});if(missing.length){out.skipped.push({id:e.id,reason:'missing-dependency',dependencies:missing});return}try{var r=e.run(ctx,out);out.results[e.id]={version:e.version,phase:e.phase,output:r==null?null:r}}catch(err){var rec={at:ctx.at,id:e.id,message:String(err&&err.message||err)};state.errors.push(rec);if(state.errors.length>50)state.errors.shift();out.results[e.id]={version:e.version,phase:e.phase,error:rec.message}}});state.runs++;return out}
function describe(){return{version:VERSION,phases:phases.slice(),engineCount:Object.keys(registry).length,engines:ordered().map(function(e){return{id:e.id,version:e.version,phase:e.phase,priority:e.priority,dependsOn:e.dependsOn.slice(),description:e.description}}),state:{startedAt:state.startedAt,runs:state.runs,errorCount:state.errors.length}}}
function health(){var d=describe();return{ok:state.errors.length===0,coreVersion:VERSION,engineCount:d.engineCount,runs:state.runs,recentErrors:clone(state.errors.slice(-5))}}
window.CSLLearningOS={version:VERSION,phases:phases.slice(),register:register,run:run,describe:describe,health:health};
/* Adapters: existing engines become citizens of the OS without changing them. */
register({id:'memory.snapshot',version:1,phase:'remember',priority:10,description:'Read derived learning memory.',run:function(c){return c.memory&&c.memory.snapshot?c.memory.snapshot():null}});
register({id:'learner.snapshot',version:1,phase:'infer',priority:10,dependsOn:['memory.snapshot'],description:'Read quiet learner-model estimates.',run:function(c){return c.learner&&c.learner.get?c.learner.get():null}});
register({id:'reencounter.plan',version:1,phase:'plan',priority:10,dependsOn:['learner.snapshot'],description:'Propose natural reencounters without forcing them.',run:function(c){return c.planner&&c.planner.suggestions?c.planner.suggestions(3):[]}});
setTimeout(function(){try{var r=run({reason:'boot'});if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('learning-os-ready',{version:VERSION,engines:Object.keys(registry).length,results:Object.keys(r.results).length})}catch(e){}},1600);
})();