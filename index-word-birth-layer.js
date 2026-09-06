(function(){
'use strict';
/* Chinese Structure Lab — Index Word Birth Layer v1
   Stabilizes the question-mark word cards on index.html.
   Flow: ? -> learner tap: immediate sound + persistent Chinese -> meaning -> pinyin/details -> ?.
   It deliberately does not use the legacy .word class, so legacy upgraders cannot reset its state. */
if(!/\/(index\.html)?$/.test(location.pathname))return;
var host=null,observer=null,renderQueued=false;
function lang(){try{return localStorage.getItem('csl_ui_language')==='ja'?'ja':'en'}catch(e){return'en'}}
function currentScene(){
 try{
  var title=(document.getElementById('sceneTitle')||{}).textContent||'';
  var arr=window.scenes||[];
  for(var i=0;i<arr.length;i++)if(title===arr[i].title||title===arr[i].titleJa)return arr[i];
  var progress=(document.getElementById('progress')||{}).textContent||'';
  var m=progress.match(/(\d+)\s*\/\s*(\d+)/);if(m&&arr[Number(m[1])-1])return arr[Number(m[1])-1];
  return arr[0]||null;
 }catch(e){return null}
}
function speakNow(text){
 try{
  if(window.CSLWordTouch&&CSLWordTouch.speak){CSLWordTouch.speak(text,.82);return}
  if(!('speechSynthesis' in window)||!window.SpeechSynthesisUtterance)return;
  var u=new SpeechSynthesisUtterance(String(text||''));u.lang='zh-CN';u.rate=.82;
  speechSynthesis.cancel();speechSynthesis.speak(u);
 }catch(e){}
}
function emit(type,data){
 try{if(window.CSLLightEventBuffer&&CSLLightEventBuffer.emit){CSLLightEventBuffer.emit(type,data);return}}catch(e){}
 try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent(type,data)}catch(e){}
}
function wordData(raw,i){return{id:'index-born-'+i+'-'+String(raw[0]||''),zh:raw[0]||'',py:raw[1]||'',en:raw[2]||'',ja:raw[3]||''}}
function paint(btn,item,step){
 var zh=btn.querySelector('.csl-born-zh'),sub=btn.querySelector('.csl-born-sub');
 btn.dataset.step=String(step);
 btn.classList.remove('is-sounding','is-meaning','is-detail');
 if(step===0){zh.textContent='?';sub.textContent='';sub.hidden=true;btn.setAttribute('aria-label',(lang()==='ja'?'押すと発音':'Tap to hear the word'));return}
 zh.textContent=item.zh;sub.hidden=false;
 if(step===1){sub.textContent='🔊';btn.classList.add('is-sounding');btn.setAttribute('aria-label',item.zh+', '+(lang()==='ja'?'発音を再生中':'playing pronunciation'));return}
 if(step===2){sub.textContent=(lang()==='ja'?item.ja:item.en)||(lang()==='ja'?'意味を確認':'English meaning unavailable');btn.classList.add('is-meaning');return}
 sub.textContent=(item.py?item.py+' · ':'')+((lang()==='ja'?item.ja:item.en)||'');btn.classList.add('is-detail');
}
function make(item){
 var b=document.createElement('button');b.type='button';b.className='csl-born-word';b.dataset.step='0';
 var z=document.createElement('span');z.className='csl-born-zh';
 var s=document.createElement('span');s.className='csl-born-sub';s.hidden=true;
 b.appendChild(z);b.appendChild(s);paint(b,item,0);
 b.addEventListener('click',function(){
  var step=Number(b.dataset.step||0),next=(step+1)%4;
  if(next===1){paint(b,item,1);speakNow(item.zh);emit('word_audio_played',{wordId:item.id,word:item.zh,course:'connected-world',learnerInitiated:true})}
  else if(next===2){paint(b,item,2);emit('word_meaning_revealed',{wordId:item.id,word:item.zh,meaning:lang()==='ja'?item.ja:item.en,uiLanguage:lang(),course:'connected-world',learnerInitiated:true})}
  else if(next===3){paint(b,item,3);emit('word_detail_revealed',{wordId:item.id,word:item.zh,pinyin:item.py,uiLanguage:lang(),course:'connected-world',learnerInitiated:true})}
  else{paint(b,item,0);emit('word_returned_to_question',{wordId:item.id,word:item.zh,course:'connected-world',learnerInitiated:true})}
  emit('word_touch',{wordId:item.id,word:item.zh,step:next,course:'connected-world',learnerInitiated:true});
 },{passive:true});return b
}
function injectStyle(){if(document.getElementById('csl-word-birth-style'))return;var s=document.createElement('style');s.id='csl-word-birth-style';s.textContent='.csl-born-word{border:0;background:#ece9e1;border-radius:24px;min-width:112px;min-height:92px;padding:13px 14px;font-size:25px;font-weight:780;color:#171717;display:flex;flex-direction:column;justify-content:center;align-items:center}.csl-born-sub{display:block;font-size:13px;font-weight:600;color:#666;margin-top:6px;line-height:1.35;max-width:150px}.csl-born-word.is-meaning,.csl-born-word.is-detail{background:#f0eee7}.senior .csl-born-word{font-size:31px;min-height:112px}.senior .csl-born-sub{font-size:18px}@media(max-width:430px){.csl-born-word{flex:1 1 calc(50% - 9px);min-width:0}}';document.head.appendChild(s)}
function render(){
 renderQueued=false;host=document.getElementById('words');if(!host)return;var sc=currentScene();if(!sc||!Array.isArray(sc.words))return;
 var signature=(sc.title||sc.titleJa||'')+'|'+sc.words.map(function(w){return w[0]}).join(',');if(host.dataset.birthSignature===signature&&host.querySelector('.csl-born-word'))return;
 host.dataset.birthSignature=signature;host.innerHTML='';sc.words.forEach(function(w,i){host.appendChild(make(wordData(w,i))});
}
function queue(){if(renderQueued)return;renderQueued=true;setTimeout(render,0)}
function start(){injectStyle();queue();var title=document.getElementById('sceneTitle'),words=document.getElementById('words');observer=new MutationObserver(queue);if(title)observer.observe(title,{childList:true,subtree:true,characterData:true});if(words)observer.observe(words,{childList:true,subtree:false});document.addEventListener('csl:language-changed',queue);window.addEventListener('storage',queue)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
