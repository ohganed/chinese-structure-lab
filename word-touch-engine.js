(function(){
'use strict';
/* Chinese Structure Lab — Word Touch Engine v8
   Learner-driven four-step word objects:
   Chinese only -> tap: immediate speech -> tap: meaning -> tap: details -> tap: Chinese only.
   Audio always starts inside the actual user gesture. History may be buffered.
   EN mode never silently falls back to Japanese learning glosses.
   No autoplay. No correctness. No score. */
var VERSION=8,cachedVoices=[],states=new WeakMap();
function uiLang(){try{return localStorage.getItem('csl_ui_language')==='ja'?'ja':'en'}catch(e){return'en'}}
function t(en,ja){return uiLang()==='ja'?ja:en}
function meaningOf(item){
 if(uiLang()==='ja')return item.ja||item.meaningJa||item.meaning||'';
 return item.en||item.meaningEn||item.meaning||'';
}
function detailOf(item){
 if(uiLang()==='ja')return item.detailJa||item.usageJa||item.noteJa||item.detail||item.usage||item.note||'';
 return item.detailEn||item.usageEn||item.noteEn||item.detail||item.usage||item.note||'';
}
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
function bankExamples(item){
 var zh=item.zh||item.word||'',out=[];
 try{
  var bank=window.CSLSentenceBank,all=bank&&bank.all?bank.all():[];
  for(var i=0;i<all.length&&out.length<2;i++){
   var s=all[i],words=s&&Array.isArray(s.words)?s.words:[];
   var hit=words.some(function(w){return String(w||'').split(' ')[0]===zh||String(w||'').indexOf(zh+' ')===0});
   if(hit&&s.zh)out.push({zh:s.zh,en:s.en||'',ja:s.ja||''});
  }
 }catch(e){}
 return out;
}
function detailText(item){
 var lines=[],py=item.py||item.pinyin||'';
 if(py)lines.push(t('Pinyin ','拼音 ')+py);
 var detail=detailOf(item);
 if(detail)lines.push(String(detail));
 var examples=item.examples||item.example||[];
 if(typeof examples==='string')examples=[examples];
 if(!Array.isArray(examples)||!examples.length)examples=bankExamples(item);
 if(Array.isArray(examples))examples.slice(0,2).forEach(function(x){
  if(!x)return;
  if(typeof x==='string')lines.push(t('Example ','例 ')+x);
  else if(x.zh){var gloss=uiLang()==='ja'?(x.ja||''):(x.en||'');lines.push(t('Example ','例 ')+x.zh+(gloss?' · '+gloss:''));}
 });
 if(!lines.length)lines.push(t('You will meet this word again in other sentences.','この語は、文の中で何度も再会します。'));
 return lines.join('\n');
}
function paint(el,item,step){
 var zh=item.zh||item.word||'',meaning=meaningOf(item);
 var main=el.querySelector('[data-csl-word-zh]'),helper=el.querySelector('[data-csl-word-helper]');
 if(main){main.textContent=zh;main.hidden=false}
 if(!helper)return;
 el.classList.remove('csl-word-pronunciation','csl-word-meaning','csl-word-detail','csl-word-sounding');
 if(step===1){
  helper.textContent='🔊';helper.hidden=false;el.classList.add('csl-word-pronunciation','csl-word-sounding');
  el.setAttribute('aria-label',zh+', '+t('playing pronunciation','発音を再生中'));
 }else if(step===2){
  helper.textContent=meaning||t('English meaning unavailable','意味を確認');helper.hidden=false;el.classList.add('csl-word-meaning');
  el.setAttribute('aria-label',zh+', '+(meaning||t('meaning unavailable','意味')));
 }else if(step===3){
  helper.textContent=detailText(item);helper.hidden=false;el.classList.add('csl-word-detail');
  el.setAttribute('aria-label',zh+', '+t('details','詳細情報'));
 }else{
  helper.textContent='';helper.hidden=true;el.setAttribute('aria-label',zh+'. '+t('Tap to hear it.','押すと発音が聞こえます'));
 }
}
function touch(el,item,meta){
 if(!el||!item)return;
 var current=states.get(el)||0,next=(current+1)%4,zh=item.zh||item.word||'',meaning=meaningOf(item);
 states.set(el,next);
 if(next===1){
  paint(el,item,1);
  speak(zh,.82,function(){el.classList.remove('csl-word-sounding')});
  emit('word_audio_played',{wordId:item.id||null,word:zh,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
 }else if(next===2){
  paint(el,item,2);
  emit('word_meaning_revealed',{wordId:item.id||null,word:zh,meaning:meaning||null,uiLanguage:uiLang(),sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true,temporary:false});
 }else if(next===3){
  paint(el,item,3);
  emit('word_detail_revealed',{wordId:item.id||null,word:zh,pinyin:item.py||item.pinyin||null,detail:detailOf(item)||null,uiLanguage:uiLang(),sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
 }else{
  paint(el,item,0);
  emit('word_returned_to_chinese',{wordId:item.id||null,word:zh,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
 }
 emit('word_touch',{wordId:item.id||null,word:zh,step:next,sentenceId:meta&&meta.sentenceId||null,course:meta&&meta.course||null,learnerInitiated:true});
}
function button(item,meta){
 var b=document.createElement('button');b.type='button';b.className='csl-word-touch';
 b.setAttribute('aria-label',(item.zh||item.word||'')+'. '+t('Tap to hear it.','押すと発音が聞こえます'));
 var z=document.createElement('span');z.setAttribute('data-csl-word-zh','');z.textContent=item.zh||item.word||'';
 var h=document.createElement('span');h.setAttribute('data-csl-word-helper','');h.hidden=true;h.style.display='block';h.style.fontSize='.68em';h.style.fontWeight='650';h.style.marginTop='3px';h.style.lineHeight='1.35';h.style.whiteSpace='pre-line';
 b.appendChild(z);b.appendChild(h);states.set(b,0);b.addEventListener('click',function(){touch(b,item,meta)},{passive:true});return b
}
function refreshNearbyHints(container){
 try{
  var scope=container&&container.closest?container.closest('.card')||document:null;
  var hint=scope&&scope.querySelector?scope.querySelector('.quietHint'):null;
  if(hint&&(/1回目/.test(hint.textContent||'')||/1st tap/i.test(hint.textContent||'')))hint.textContent=t('Chinese → 1st tap: 🔊 sound → 2nd: meaning → 3rd: details → 4th: Chinese','中国語 → 1回目：🔊 音声 → 2回目：意味 → 3回目：詳細 → 4回目：中国語');
  var note=document.querySelector('.softnote');
  if(note&&(/音と発音/.test(note.textContent||'')||/sound/i.test(note.textContent||'')))note.textContent=t('Start with Chinese only. Tap once for sound, again for meaning, again for details, and once more to return to Chinese only.','最初は中国語だけ。1回押すと音声、もう1回押すと意味、さらに押すと詳細情報、もう1回押すと中国語だけに戻ります。');
 }catch(e){}
}
function mount(container,items,meta){if(!container)return;container.innerHTML='';(items||[]).forEach(function(x){container.appendChild(button(x,meta))});refreshNearbyHints(container);return container}
window.CSLWordTouch={version:VERSION,mount:mount,touch:touch,speak:speak,refreshVoices:refreshVoices,detailText:detailText,uiLang:uiLang,meaningOf:meaningOf};
})();