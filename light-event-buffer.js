(function(){
'use strict';
/* Chinese Structure Lab — Light Event Buffer v2
   Learning time = append durable raw events only.
   NO timer flush, NO pagehide flush, NO analysis.
   The queue is merged into CSLStorage only when Session End Analyzer explicitly
   calls flush() after the learner presses "学習を終了".
*/
var VERSION=2,KEY='csl_light_event_queue_v1',MAX=5000;
function parse(v,f){try{return v?JSON.parse(v):f}catch(e){return f}}
function queue(){var q=parse(localStorage.getItem(KEY),[]);return Array.isArray(q)?q:[]}
function persist(q){try{localStorage.setItem(KEY,JSON.stringify((q||[]).slice(-MAX)))}catch(e){}}
function now(){return new Date().toISOString()}
function device(){try{return window.CSLStorage&&CSLStorage.deviceId?CSLStorage.deviceId():'light'}catch(e){return'light'}}
function emit(type,data){
 var q=queue(),d=device();
 q.push({id:'lev:'+d+':'+Date.now()+':'+Math.random().toString(36).slice(2,7),deviceId:d,type:type,at:now(),data:data||{}});
 persist(q);
 return true;
}
function flush(){
 var q=queue();if(!q.length)return true;
 try{
  if(!window.CSLStorage||!CSLStorage.load||!CSLStorage.save)return false;
  var p=CSLStorage.load();
  if(!p.learning)p.learning={sentences:{},sessions:[],events:[]};
  if(!Array.isArray(p.learning.events))p.learning.events=[];
  var have={};p.learning.events.forEach(function(e){if(e&&e.id)have[e.id]=1});
  q.forEach(function(e){if(e&&e.id&&!have[e.id]){p.learning.events.push(e);have[e.id]=1}});
  if(p.learning.events.length>10000)p.learning.events=p.learning.events.slice(-10000);
  CSLStorage.save(p);localStorage.removeItem(KEY);return true;
 }catch(e){persist(q);return false}
}
function size(){return queue().length}
function peek(){return queue().slice()}
window.CSLLightEventBuffer={version:VERSION,emit:emit,flush:flush,size:size,peek:peek,policy:{appendOnlyDuringLearning:true,flushAtSessionEndOnly:true,noTimerFlush:true,noPagehideFlush:true,noAnalysis:true}};
})();