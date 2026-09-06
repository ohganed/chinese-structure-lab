(function(){
  'use strict';
  function zhVoice(){var voices=speechSynthesis.getVoices().filter(function(v){return /^zh/i.test(v.lang)});return voices.filter(function(v){return v.localService})[0]||voices[0]||null;}
  function speak(text,rate){if(!text)return;var u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=rate||0.9;u.voice=zhVoice();speechSynthesis.cancel();speechSynthesis.speak(u);}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]});}
  function makeWordButton(word,index){var b=document.createElement('button');b.className='discovery-word';b.type='button';b.dataset.stage='0';b.setAttribute('aria-label','Discover word '+(index+1));b.innerHTML='<span class="dw-main">?</span><span class="dw-sub"></span>';
    b.addEventListener('click',function(){var stage=Number(b.dataset.stage||0),main=b.querySelector('.dw-main'),sub=b.querySelector('.dw-sub');
      if(stage===0){speak(word.zh,0.82);main.textContent='🔊';sub.textContent='';}
      else if(stage===1){main.textContent=word.pinyin;sub.textContent='';}
      else if(stage===2){main.textContent=word.en||'—';sub.textContent='';}
      else if(stage===3){main.textContent=word.ja||'—';sub.textContent='';}
      else{b.classList.toggle('deep');main.textContent=word.zh;sub.textContent=[word.pinyin,word.en,word.ja,word.note].filter(Boolean).join(' · ');speak(word.zh,0.82);}
      b.dataset.stage=String(Math.min(stage+1,4));});return b;}
  function sentenceButton(data){var b=document.createElement('button');b.className='discovery-sentence';b.type='button';b.dataset.stage='0';b.innerHTML='<span class="ds-main">▶ Sentence</span><span class="ds-sub"></span>';
    b.addEventListener('click',function(){var stage=Number(b.dataset.stage||0),main=b.querySelector('.ds-main'),sub=b.querySelector('.ds-sub');
      if(stage===0){speak(data.zh,0.92);main.textContent='🔊 Natural sentence';sub.textContent='';}
      else if(stage===1){main.textContent=data.pinyin;sub.textContent='';}
      else if(stage===2){main.textContent=data.en||'—';sub.textContent='';}
      else if(stage===3){main.textContent=data.ja||'—';sub.textContent='';}
      else{b.classList.toggle('deep');main.textContent=data.zh;sub.textContent=[data.pinyin,data.en,data.ja,data.note].filter(Boolean).join(' · ');speak(data.zh,0.92);}
      b.dataset.stage=String(Math.min(stage+1,4));});return b;}
  function renderCard(data){var card=document.createElement('article');card.className='discovery-card';var scene=document.createElement('div');scene.className='mental-scene';scene.textContent=data.scene||'？';scene.title='Mental Scene Trigger';card.appendChild(scene);var prompt=document.createElement('div');prompt.className='discovery-prompt';prompt.textContent='What might be happening? Tap and discover.';card.appendChild(prompt);var words=document.createElement('div');words.className='discovery-words';(data.words||[]).forEach(function(w,i){words.appendChild(makeWordButton(w,i));});card.appendChild(words);card.appendChild(sentenceButton(data));var details=document.createElement('details');details.className='discovery-details';details.innerHTML='<summary>Open deeper structure</summary><div class="dd-body">'+esc(data.note||'')+'</div>';card.appendChild(details);return card;}
  function mount(root,data){if(typeof root==='string')root=document.querySelector(root);if(!root)return;root.innerHTML='';(data||[]).forEach(function(item){root.appendChild(renderCard(item));});speechSynthesis.getVoices();}
  window.A1A2Discovery={mount:mount,speak:speak};
})();