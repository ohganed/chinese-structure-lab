(function(){
'use strict';
/* Chinese Structure Lab — Word Touch Engine v5
   Word buttons are learner-driven three-step objects:
   Chinese only -> tap: immediate speech + pinyin -> tap: meaning -> tap: Chinese only.
   Audio always starts inside the actual user gesture. History may be buffered.
   No autoplay. No correctness. No score. */
var VERSION=5,cachedVoices=[],states=new WeakMap();
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
  var synth=window.speechSynthesis,u=new SpeechSynthesisUtterance(String(text||''));
  u.lang='zh-CN';u.rate=rate||.82;u.volume=1;
  var vs=cachedVoices.length?cachedVoices:(synth.getVoices()||[]);
  var zhVoice=vs.filter(function(v){return /^zh(-CN)?/i.test(v.lang)})[0]||vs.filter(function(v){return /^zh/i.test(v.lang)})[0]||null;
  if(zhVoice)u.voice=zhVoice;
  u.onend=done;u.onerror=done;
  try{synth.cancel()}catch(e){}
  try{synth.resume()}catch(e){}
  synth.speak(u);
  safety=setTimeout(done,Math.max(1400,Math.min(4200,String(text||'').length*420)));
 }catch(e){setTimeout(done,200)}
}
function paint(el,item,step){
 var zh=item.zh||item.word||'',py=item.py||item.pinyin||'',ja=item.ja||item.meaning||'';
 var main=el.querySelector('[data-csl-word-zh]'),helper=el.querySelector('[data-csl-word-helper]');
 if(main){main.textContent=zh;main.hidden=false}
 if(!helper)return;
 if(step===1){helper.textContent=py||'🔊';helper.hidden=false;el.classList.add('csl-word-pronunciation');el.classList.remove('csl-word-meaning');el.setAttribute('aria-label',zh+'、'+(py||'発音を確認中'))}
 else if(step===2){helper.textContent=ja;helper.hidden=!ja;el.classList.add('csl-word-meaning');el.classList.remove('csl-word-pronunciation');el.setAttribute('aria-label',zh+'、'+(ja||'意味'))}
 else{helper.textContent='';helper.hidden=true;el.classList.remove('csl-word-pronunciation','csl-word-meaning','csl-word-sounding');el.setAttribute('aria-label',zh+'。押すと発音が聞こえます')}
}
function touch(el,item,meta){
 if(!el||!item)return;
 var current=states.get(el)||0,next=(current+1)%3,zh=item.zh||item.word||'';
 states.set(el,next);
 if(next===1){
  el.classList.add('csl-word-sounding');
  paint(el,item,1);
  /* Audio first: playback remains inside this click/tap gesture. */
  speak(zh,.82,function(){el.classList.remove('csl-word-sounding')});
  emit('word_pronunciation_revealed',{wordId:item.id||null,word:zh,pinyin:item.py||item.pinyin||null,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
 }else if(next===2){
  paint(el,item,2);
  emit('word_meaning_revealed',{wordId:item.id||null,word:zh,meaning:item.ja||item.meaning||null,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true,temporary:false});
 }else{
  paint(el,item,0);
  emit('word_returned_to_chinese',{wordId:item.id||null,word:zh,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
 }
 emit('word_touch',{wordId:item.id||null,word:zh,step:next,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
}
function button(item,meta){
 var b=document.createElement('button');b.type='button';b.className='csl-word-touch';
 b.setAttribute('aria-label',(item.zh||item.word||'')+'。押すと発音が聞こえます');
 var z=document.createElement('span');z.setAttribute('data-csl-word-zh','');z.textContent=item.zh||item.word||'';
 var h=document.createElement('span');h.setAttribute('data-csl-word-helper','');h.hidden=true;h.style.display='block';h.style.fontSize='.68em';h.style.fontWeight='650';h.style.marginTop='3px';h.style.lineHeight='1.25';
 b.appendChild(z);b.appendChild(h);states.set(b,0);b.addEventListener('click',function(){touch(b,item,meta)},{passive:true});return b
}
function mount(container,items,meta){if(!container)return;container.innerHTML='';(items||[]).forEach(function(x){container.appendChild(button(x,meta))});return container}
window.CSLWordTouch={version:VERSION,mount:mount,touch:touch,speak:speak,refreshVoices:refreshVoices};
})();