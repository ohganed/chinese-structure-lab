const state={lesson:null,lessonIndex:[],mode:'listen',selectedWord:null,drawerOpen:false,openSound:null};
const $=(s)=>document.querySelector(s);const $$=(s)=>[...document.querySelectorAll(s)];
const els={sentence:$('#sentence'),translation:$('#translation'),workspace:$('#workspace'),drawer:$('#wordDrawer'),detailSurface:$('#detailSurface'),detailBody:$('#detailBody'),scrim:$('#scrim')};

init();

async function init(){
  bindStaticEvents();
  try{
    const indexRes=await fetch('./data/index.json',{cache:'no-store'});
    if(!indexRes.ok)throw new Error(`教材索引を読み込めませんでした (${indexRes.status})`);
    const index=await indexRes.json();
    state.lessonIndex=Array.isArray(index.lessons)?index.lessons:[];
    if(!state.lessonIndex.length)throw new Error('教材索引が空です。');
    await loadLesson(resolveLessonId());
  }catch(error){showLoadError(error);}
}

function bindStaticEvents(){
  $('.mode-tabs').addEventListener('click',(event)=>{
    const button=event.target.closest('[data-mode]');if(!button)return;
    setMode(button.dataset.mode);
  });
  $('.audio-row').addEventListener('click',(event)=>{
    const button=event.target.closest('[data-speech-rate]');if(!button||!state.lesson)return;
    speak(state.lesson.sentence,Number(button.dataset.speechRate));
  });
  els.workspace.addEventListener('click',(event)=>{
    const wordButton=event.target.closest('[data-word-index]');
    if(wordButton&&state.lesson){openWord(Number(wordButton.dataset.wordIndex));return;}
    const soundButton=event.target.closest('[data-sound-index]');
    if(soundButton&&state.lesson){toggleSound(Number(soundButton.dataset.soundIndex));return;}
    const refButton=event.target.closest('[data-ref-index]');
    if(refButton&&state.lesson){const item=state.lesson.sound_reference_examples?.[Number(refButton.dataset.refIndex)];if(item)speak(item.text.replace(' → ',' '),.88);}
  });
  $('#closeDrawer').addEventListener('click',closeWord);
  els.scrim.addEventListener('click',closeWord);
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape')closeWord();});
  $('#themeButton').addEventListener('click',()=>document.documentElement.classList.toggle('force-light'));
  window.addEventListener('hashchange',()=>loadLesson(resolveLessonId()).catch(showLoadError));
}

function resolveLessonId(){
  const params=new URLSearchParams(location.hash.replace(/^#/,''));
  return params.get('lesson')||state.lessonIndex[0]?.id||'';
}

async function loadLesson(id){
  const meta=state.lessonIndex.find(item=>item.id===id)||state.lessonIndex[0];
  if(!meta)throw new Error('教材が見つかりません。');
  const res=await fetch(meta.path,{cache:'no-store'});
  if(!res.ok)throw new Error(`教材を読み込めませんでした (${res.status})`);
  const lesson=await res.json();
  state.lesson=lesson;state.selectedWord=null;state.drawerOpen=false;state.openSound=null;
  closeWord();renderLesson();renderMode();
  if(location.hash!==`#lesson=${encodeURIComponent(meta.id)}`)history.replaceState(null,'',`#lesson=${encodeURIComponent(meta.id)}`);
}

function showLoadError(error){
  els.sentence.textContent='French Structure Lab';
  els.workspace.innerHTML=`<div class="error">${escapeHtml(error.message)} 音声や教材がなくても画面自体は安全に動作します。</div>`;
}

function renderLesson(){els.sentence.textContent=state.lesson.sentence;els.translation.textContent=state.lesson.translation_ja;}

function setMode(mode){
  state.mode=mode;state.openSound=null;
  $$('.mode-tabs [data-mode]').forEach((button)=>{const active=button.dataset.mode===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  if(mode!=='words')closeWord();
  renderMode();
}

function renderMode(){
  if(!state.lesson)return;
  const lesson=state.lesson;els.translation.hidden=true;
  switch(state.mode){
    case'listen':
      els.workspace.innerHTML='<p class="hint">まず音の流れを聞きます。意味が必要になったら、下のボタンで静かに開けます。</p><button class="word-chip" id="showMeaning" type="button">意味を見る</button>';
      $('#showMeaning').addEventListener('click',()=>{els.translation.hidden=false;});break;
    case'words':
      els.workspace.innerHTML=`<div class="word-list">${(lesson.words||[]).map((w,i)=>`<button class="word-chip" type="button" data-word-index="${i}" aria-expanded="${state.selectedWord===i&&state.drawerOpen}">${escapeHtml(w.surface)}</button>`).join('')}</div><p class="hint">単語を押すと発音し、詳細を開きます。別の語を押すと内容だけ安全に切り替わります。</p>`;break;
    case'chunks':
      els.translation.hidden=false;
      els.workspace.innerHTML=`<div class="chunk-list">${(lesson.meaning_chunks||[]).map(c=>`<div class="chunk"><b>${escapeHtml(c.text)}</b><span>${escapeHtml(c.meaning_ja)}</span></div>`).join('')}</div>`;break;
    case'structure':
      els.translation.hidden=false;
      els.workspace.innerHTML=`<div class="structure-list">${Object.entries(lesson.sentence_structure||{}).map(([k,v])=>`<div class="structure-piece"><b>${escapeHtml(v)}</b><span>${escapeHtml(structureLabel(k))}</span></div>`).join('')}</div>`;break;
    case'sound':renderSoundLab();break;
    default:els.workspace.innerHTML='';
  }
}

function renderSoundLab(){
  const lesson=state.lesson;
  const groups=(lesson.sound_groups||[]).map(g=>`<div class="sound-group"><div class="fr">${escapeHtml(g.text)}</div><div class="ipa">/${escapeHtml(g.ipa)}/</div>${g.role_ja?`<div class="sound-note">${escapeHtml(g.role_ja)}</div>`:''}</div>`).join('');
  const phenomena=(lesson.sound_phenomena||[]).map((p,i)=>{const open=state.openSound===i;return `<div class="sound-card"><button type="button" class="sound-toggle" data-sound-index="${i}" aria-expanded="${open}"><span><small>${escapeHtml(p.label_ja)}</small><b>${escapeHtml(p.span)}</b><em>${escapeHtml(p.surface_hint)}</em></span><span aria-hidden="true">${open?'−':'＋'}</span></button>${open?`<div class="sound-detail"><p>${escapeHtml(p.detail_ja)}</p><div class="sound-meta">${escapeHtml(registerLabel(p.register))}${p.confidence?` · ${escapeHtml(confidenceLabel(p.confidence))}`:''}</div></div>`:''}</div>`;}).join('');
  const refs=(lesson.sound_reference_examples||[]).map((r,i)=>`<button class="reference-sound" type="button" data-ref-index="${i}"><span>${escapeHtml(soundTypeLabel(r.type))}</span><b>${escapeHtml(r.text)}</b><small>/${escapeHtml(r.ipa)}/</small><em>${escapeHtml(r.note_ja)}</em></button>`).join('');
  els.workspace.innerHTML=`<section><div class="sound-section-label">SOUND FLOW</div>${groups||'<p class="hint">音声グループ情報はまだありません。</p>'}</section><section class="sound-observations"><div class="sound-section-label">この文で起きていること</div>${phenomena||'<p class="hint">この文には登録された音声現象がありません。</p>'}</section>${refs?`<details class="sound-reference"><summary>ほかの代表例を見る</summary><div class="reference-grid">${refs}</div></details>`:''}`;
}

function toggleSound(index){state.openSound=state.openSound===index?null:index;renderSoundLab();}

function openWord(index){
  const word=state.lesson.words?.[index];if(!word)return;
  state.selectedWord=index;state.drawerOpen=true;speak(word.surface,.9);els.detailSurface.textContent=word.surface;
  const rows=[['IPA',word.ipa?`/${word.ipa}/`:null],['文脈上の意味',word.meaning_ja],['辞書形',word.lemma],['品詞',word.pos],['文中の働き',word.role],['形・活用',word.morphology],['短い解説',word.detail_ja]].filter(([,v])=>v);
  els.detailBody.innerHTML=rows.map(([label,value])=>`<div class="detail-row"><b>${escapeHtml(label)}</b><div>${escapeHtml(value)}</div></div>`).join('');
  els.drawer.classList.add('open');els.drawer.setAttribute('aria-hidden','false');els.scrim.hidden=false;updateWordAria();
}

function closeWord(){if(!state.drawerOpen)return;state.drawerOpen=false;els.drawer.classList.remove('open');els.drawer.setAttribute('aria-hidden','true');els.scrim.hidden=true;updateWordAria();}
function updateWordAria(){$$('[data-word-index]').forEach(button=>button.setAttribute('aria-expanded',String(state.drawerOpen&&Number(button.dataset.wordIndex)===state.selectedWord)));}

function speak(text,rate=1){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=Math.max(.65,Math.min(1.05,rate));speechSynthesis.speak(utterance);}
function structureLabel(key){return({subject:'話し手・主語',verb:'文の中心・動詞',destination:'目的地',means:'手段'})[key]||key;}
function soundTypeLabel(type){return({'liaison-required':'リエゾン','enchaînement':'アンシェヌマン','elision':'エリジオン','schwa':'脱落性の e'})[type]||type;}
function registerLabel(value){return({'all':'どの場面でも','standard-and-conversation':'標準・会話共通'})[value]||value||'';}
function confidenceLabel(value){return({'verified':'検証済み','pedagogical':'学習用の区切り','variable':'話者・速度で変化','regional':'地域差あり','uncertain':'未確定'})[value]||value;}
function escapeHtml(value=''){return String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

window.FSL_DEBUG={state,setMode,openWord,closeWord,toggleSound,loadLesson,resolveLessonId};
