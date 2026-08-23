(function(){
'use strict';
/* Chinese Structure Lab — Word Touch Engine v3
   Chinese stays primary. The learner touches a word; that intentional action
   causes sound, then a brief meaning reveal, then the surface returns to Chinese.
   No autoplay. No correctness. No score.
   Light Day can route events through CSLLightEventBuffer so taps never trigger
   a full learning-profile rewrite. */
var VERSION=3, timers=new WeakMap();
function emit(type,data){
 try{if(window.CSLLightEventBuffer&&CSLLightEventBuffer.emit){CSLLightEventBuffer.emit(type,data||{});return}}catch(e){}
 try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent(type,data||{})}catch(e){}
 try{if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit(type,data||{})}catch(e){}
}
function speak(text,rate,onEnd){
 var finished=false;
 function done(){if(finished)return;finished=true;if(onEnd)onEnd()}
 try{
  if(!('speechSynthesis' in window)||!window.SpeechSynthesisUtterance){setTimeout(done,250);return}
  var u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=rate||.82;
  var vs=speechSynthesis.getVoices().filter(function(v){return /^zh/i.test(v.lang)});u.voice=vs[0]||null;
  u.onend=done;u.onerror=done;
  speechSynthesis.cancel();
  /* Let the button paint its pressed state before speech work begins. */
  setTimeout(function(){try{speechSynthesis.speak(u)}catch(e){done()}},0);
  /* Browser safety net: meaning must never remain stuck if onend is lost. */
  setTimeout(done,Math.max(1200,Math.min(3600,String(text||'').length*360)));
 }catch(e){setTimeout(done,200)}
}
function touch(el,item,meta){
 if(!el||!item)return;
 var zh=item.zh||item.word||'',ja=item.ja||item.meaning||'';
 el.classList.add('csl-word-sounding');el.setAttribute('aria-label',zh+'。音声再生中');
 emit('word_touch',{wordId:item.id||null,word:zh,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
 function reveal(){
  el.classList.remove('csl-word-sounding');el.classList.add('csl-word-meaning');
  var z=el.querySelector('[data-csl-word-zh]'),m=el.querySelector('[data-csl-word-ja]');if(z)z.hidden=true;if(m)m.hidden=false;
  var old=timers.get(el);if(old)clearTimeout(old);
  var t=setTimeout(function(){if(z)z.hidden=false;if(m)m.hidden=true;el.classList.remove('csl-word-meaning');el.setAttribute('aria-label',zh+'。押すと音が聞こえます')},1500);timers.set(el,t);
  emit('word_meaning_revealed',{wordId:item.id||null,word:zh,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true,temporary:true})
 }
 speak(zh,.82,reveal)
}
function button(item,meta){var b=document.createElement('button');b.type='button';b.className='csl-word-touch';b.setAttribute('aria-label',(item.zh||item.word||'')+'。押すと音が聞こえます');var z=document.createElement('span');z.setAttribute('data-csl-word-zh','');z.textContent=item.zh||item.word||'';var m=document.createElement('span');m.setAttribute('data-csl-word-ja','');m.hidden=true;m.textContent=item.ja||item.meaning||'';b.appendChild(z);b.appendChild(m);b.addEventListener('click',function(){touch(b,item,meta)});return b}
function mount(container,items,meta){if(!container)return;container.innerHTML='';(items||[]).forEach(function(x){container.appendChild(button(x,meta))});return container}
window.CSLWordTouch={version:VERSION,mount:mount,touch:touch,speak:speak};
})();