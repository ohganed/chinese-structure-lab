(function(){
'use strict';
/* Chinese Structure Lab — Word Touch Engine v4
   Core invariant: learner touch must cause speech immediately in the same user gesture.
   Event/history work may be buffered, but audio is never deferred.
   No autoplay. No correctness. No score. */
var VERSION=4,timers=new WeakMap(),cachedVoices=[];
function refreshVoices(){try{cachedVoices=speechSynthesis.getVoices()||[]}catch(e){cachedVoices=[]}}
try{refreshVoices();if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=refreshVoices}catch(e){}
function emit(type,data){
 try{if(window.CSLLightEventBuffer&&CSLLightEventBuffer.emit){CSLLightEventBuffer.emit(type,data||{});return}}catch(e){}
 try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent(type,data||{})}catch(e){}
 try{if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit(type,data||{})}catch(e){}
}
function speak(text,rate,onEnd){
 var finished=false,safety=null;
 function done(){if(finished)return;finished=true;if(safety)clearTimeout(safety);if(onEnd)onEnd()}
 try{
  if(!('speechSynthesis' in window)||!window.SpeechSynthesisUtterance){setTimeout(done,200);return}
  var synth=window.speechSynthesis;
  var u=new SpeechSynthesisUtterance(String(text||''));
  u.lang='zh-CN';u.rate=rate||.82;u.volume=1;
  var vs=cachedVoices.length?cachedVoices:(synth.getVoices()||[]);
  var zh=vs.filter(function(v){return /^zh(-CN)?/i.test(v.lang)})[0]||vs.filter(function(v){return /^zh/i.test(v.lang)})[0]||null;
  if(zh)u.voice=zh;
  u.onend=done;u.onerror=done;
  /* Chrome/Safari: keep playback inside the actual click/tap gesture. */
  try{synth.cancel()}catch(e){}
  try{synth.resume()}catch(e){}
  synth.speak(u);
  safety=setTimeout(done,Math.max(1400,Math.min(4200,String(text||'').length*420)));
 }catch(e){setTimeout(done,200)}
}
function touch(el,item,meta){
 if(!el||!item)return;
 var zh=item.zh||item.word||'',ja=item.ja||item.meaning||'';
 el.classList.add('csl-word-sounding');el.setAttribute('aria-label',zh+'。音声再生中');
 /* Audio first: no storage or analysis work may run before playback starts. */
 function reveal(){
  el.classList.remove('csl-word-sounding');el.classList.add('csl-word-meaning');
  var z=el.querySelector('[data-csl-word-zh]'),m=el.querySelector('[data-csl-word-ja]');if(z)z.hidden=true;if(m)m.hidden=false;
  var old=timers.get(el);if(old)clearTimeout(old);
  var t=setTimeout(function(){if(z)z.hidden=false;if(m)m.hidden=true;el.classList.remove('csl-word-meaning');el.setAttribute('aria-label',zh+'。押すと音が聞こえます')},1500);timers.set(el,t);
  emit('word_meaning_revealed',{wordId:item.id||null,word:zh,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true,temporary:true})
 }
 speak(zh,.82,reveal);
 emit('word_touch',{wordId:item.id||null,word:zh,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
}
function button(item,meta){var b=document.createElement('button');b.type='button';b.className='csl-word-touch';b.setAttribute('aria-label',(item.zh||item.word||'')+'。押すと音が聞こえます');var z=document.createElement('span');z.setAttribute('data-csl-word-zh','');z.textContent=item.zh||item.word||'';var m=document.createElement('span');m.setAttribute('data-csl-word-ja','');m.hidden=true;m.textContent=item.ja||item.meaning||'';b.appendChild(z);b.appendChild(m);b.addEventListener('click',function(){touch(b,item,meta)},{passive:true});return b}
function mount(container,items,meta){if(!container)return;container.innerHTML='';(items||[]).forEach(function(x){container.appendChild(button(x,meta))});return container}
window.CSLWordTouch={version:VERSION,mount:mount,touch:touch,speak:speak,refreshVoices:refreshVoices};
})();