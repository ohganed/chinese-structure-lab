const state={lesson:null,lessonIndex:[],mode:'listen',selectedWord:null,selectedExpression:null,drawerOpen:false,openSound:null,openTransform:null};
const $=(s)=>document.querySelector(s);const $$=(s)=>[...document.querySelectorAll(s)];
const els={sentence:$('#sentence'),translation:$('#translation'),workspace:$('#workspace'),drawer:$('#wordDrawer'),detailKind:$('#detailKind'),detailSurface:$('#detailSurface'),detailBody:$('#detailBody'),scrim:$('#scrim'),picker:$('#lessonPicker'),prev:$('#prevLesson'),next:$('#nextLesson')};

init();

async function init(){bindStaticEvents();try{const indexRes=await fetch('./data/index.json',{cache:'no-store'});if(!indexRes.ok)throw new Error(`教材索引を読み込めませんでした (${indexRes.status})`);const index=await indexRes.json();state.lessonIndex=Array.isArray(index.lessons)?index.lessons:[];if(!state.lessonIndex.length)throw new Error('教材索引が空です。');renderLessonPicker();await loadLesson(resolveLessonId());}catch(error){showLoadError(error);}}

function bindStaticEvents(){
  $('.mode-tabs').addEventListener('click',(event)=>{const button=event.target.closest('[data-mode]');if(button)setMode(button.dataset.mode);});
  $('.audio-row').addEventListener('click',(event)=>{const button=event.target.closest('[data-speech-rate]');if(button&&state.lesson)speak(state.lesson.sentence,Number(button.dataset.speechRate));});
  els.workspace.addEventListener('click',(event)=>{
    const wordButton=event.target.closest('[data-word-index]');if(wordButton&&state.lesson){openWord(Number(wordButton.dataset.wordIndex));return;}
    const expressionButton=event.target.closest('[data-expression-index]');if(expressionButton&&state.lesson){openExpression(Number(expressionButton.dataset.expressionIndex));return;}
    const soundButton=event.target.closest('[data-sound-index]');if(soundButton&&state.lesson){toggleSound(Number(soundButton.dataset.soundIndex));return;}
    const transformButton=event.target.closest('[data-transform-index]');if(transformButton&&state.lesson){toggleTransform(Number(transformButton.dataset.transformIndex));return;}
    const refButton=event.target.closest('[data-ref-index]');if(refButton&&state.lesson){const item=state.lesson.sound_reference_examples?.[Number(refButton.dataset.refIndex)];if(item)speak(item.text.replace(' → ',' '),.88);}
  });
  els.picker.addEventListener('change',()=>goToLesson(els.picker.value));els.prev.addEventListener('click',()=>moveLesson(-1));els.next.addEventListener('click',()=>moveLesson(1));
  $('#closeDrawer').addEventListener('click',closeDetail);els.scrim.addEventListener('click',closeDetail);document.addEventListener('keydown',(event)=>{if(event.key==='Escape')closeDetail();});
  $('#themeButton').addEventListener('click',()=>document.documentElement.classList.toggle('force-light'));
  window.addEventListener('hashchange',()=>loadLesson(resolveLessonId()).catch(showLoadError));
}

function renderLessonPicker(){els.picker.innerHTML=state.lessonIndex.map((m,i)=>`<option value="${escapeHtml(m.id)}">${i+1}. ${escapeHtml(m.title_ja||m.id)}</option>`).join('');}
function resolveLessonId(){const params=new URLSearchParams(location.hash.replace(/^#/,''));return params.get('lesson')||state.lessonIndex[0]?.id||'';}
function currentLessonPosition(){return Math.max(0,state.lessonIndex.findIndex(x=>x.id===state.lesson?.id));}
function moveLesson(delta){if(!state.lessonIndex.length)return;const pos=currentLessonPosition();const next=Math.min(state.lessonIndex.length-1,Math.max(0,pos+delta));if(next!==pos)goToLesson(state.lessonIndex[next].id);}
function goToLesson(id){if(id)location.hash=`lesson=${encodeURIComponent(id)}`;}

async function loadLesson(id){const meta=state.lessonIndex.find(item=>item.id===id)||state.lessonIndex[0];if(!meta)throw new Error('教材が見つかりません。');const res=await fetch(meta.path,{cache:'no-store'});if(!res.ok)throw new Error(`教材を読み込めませんでした (${res.status})`);state.lesson=await res.json();state.selectedWord=null;state.selectedExpression=null;state.drawerOpen=false;state.openSound=null;state.openTransform=null;closeDetail();renderLesson();renderMode();updateLessonNavigation();if(location.hash!==`#lesson=${encodeURIComponent(meta.id)}`)history.replaceState(null,'',`#lesson=${encodeURIComponent(meta.id)}`);}
function updateLessonNavigation(){const pos=currentLessonPosition();els.picker.value=state.lesson.id;els.prev.disabled=pos<=0;els.next.disabled=pos>=state.lessonIndex.length-1;}
function showLoadError(error){els.sentence.textContent='French Structure Lab';els.workspace.innerHTML=`<div class="error">${escapeHtml(error.message)} 音声や教材がなくても画面自体は安全に動作します。</div>`;}
function renderLesson(){els.sentence.textContent=state.lesson.sentence;els.translation.textContent=state.lesson.translation_ja;}

function setMode(mode){state.mode=mode;state.openSound=null;state.openTransform=null;$$('.mode-tabs [data-mode]').forEach(button=>{const active=button.dataset.mode===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});if(!['words','expressions'].includes(mode))closeDetail();renderMode();}
function renderMode(){if(!state.lesson)return;const lesson=state.lesson;els.translation.hidden=true;switch(state.mode){
  case'listen':els.workspace.innerHTML='<p class="hint">まず音の流れを聞きます。意味が必要になったら、下のボタンで静かに開けます。</p><button class="word-chip" id="showMeaning" type="button">意味を見る</button>';$('#showMeaning').addEventListener('click',()=>{els.translation.hidden=false;});break;
  case'words':els.workspace.innerHTML=`<div class="word-list">${(lesson.words||[]).map((w,i)=>`<button class="word-chip" type="button" data-word-index="${i}" aria-expanded="${state.selectedWord===i&&state.drawerOpen}">${escapeHtml(w.surface)}</button>`).join('')}</div><p class="hint">単語を押すと発音し、詳細を開きます。</p>`;break;
  case'expressions':renderExpressions();break;
  case'chunks':els.translation.hidden=false;els.workspace.innerHTML=`<div class="chunk-list">${(lesson.meaning_chunks||[]).map(c=>`<div class="chunk"><b>${escapeHtml(c.text)}</b><span>${escapeHtml(c.meaning_ja)}</span></div>`).join('')}</div>`;break;
  case'structure':els.translation.hidden=false;els.workspace.innerHTML=`<div class="structure-list">${Object.entries(lesson.sentence_structure||{}).map(([k,v])=>`<div class="structure-piece"><b>${escapeHtml(v)}</b><span>${escapeHtml(structureLabel(k))}</span></div>`).join('')}</div>`;break;
  case'sound':renderSoundLab();break;
  case'transform':renderTransform();break;
  default:els.workspace.innerHTML='';}}

function renderExpressions(){const expressions=state.lesson.expressions||[];els.workspace.innerHTML=expressions.length?`<div class="expression-list">${expressions.map((x,i)=>`<button class="expression-card" type="button" data-expression-index="${i}" aria-expanded="${state.selectedExpression===i&&state.drawerOpen}"><small>${escapeHtml(expressionTypeLabel(x.type))}</small><b>${escapeHtml(x.surface)}</b><span>${escapeHtml(x.meaning_ja)}</span></button>`).join('')}</div><p class="hint">単語を越えて、一まとまりで働く表現を観察します。</p>`:'<p class="hint">この文には登録された複数語表現がまだありません。</p>';}
function openExpression(index){const x=state.lesson.expressions?.[index];if(!x)return;state.selectedExpression=index;state.selectedWord=null;state.drawerOpen=true;speak(x.surface,.9);els.detailKind.textContent='EXPRESSION DETAIL';els.detailSurface.textContent=x.surface;const rows=[['意味',x.meaning_ja],['種類',expressionTypeLabel(x.type)],['文中の働き',x.function_ja||x.function],['使用域',registerLabel(x.register)],['観察ポイント',x.detail_ja],['別の自然な例',x.example]].filter(([,v])=>v);els.detailBody.innerHTML=rows.map(([label,value])=>`<div class="detail-row"><b>${escapeHtml(label)}</b><div>${escapeHtml(value)}</div></div>`).join('');openDrawer();}

function renderTransform(){const transforms=state.lesson.transforms||[];els.translation.hidden=false;els.workspace.innerHTML=transforms.length?`<p class="hint">正解を当てるのではなく、文を少し変えたときに何が連動して変わるかを観察します。</p>${transforms.map((t,i)=>{const open=state.openTransform===i;return `<div class="transform-card"><button class="transform-toggle" type="button" data-transform-index="${i}" aria-expanded="${open}"><span><small>${escapeHtml(t.label_ja||'変化を見る')}</small><b>${escapeHtml(t.target)}</b></span><span aria-hidden="true">${open?'−':'＋'}</span></button>${open?`<div class="transform-detail"><div class="transform-flow"><div><small>FROM</small><p>${escapeHtml(t.source||state.lesson.sentence)}</p></div><div aria-hidden="true">↓</div><div><small>TO</small><p>${escapeHtml(t.target)}</p></div></div><div class="change-list">${(t.changes||[]).map(c=>`<div class="change-row"><b>${escapeHtml(c.from)} → ${escapeHtml(c.to)}</b><span>${escapeHtml(c.explanation_ja||changeReasonLabel(c.reason))}</span></div>`).join('')}</div></div>`:''}</div>`;}).join('')}`:'<p class="hint">この文のTransformデータはまだありません。</p>';}
function toggleTransform(index){state.openTransform=state.openTransform===index?null:index;renderTransform();}

function renderSoundLab(){const lesson=state.lesson;const groups=(lesson.sound_groups||[]).map(g=>`<div class="sound-group"><div class="fr">${escapeHtml(g.text)}</div><div class="ipa">/${escapeHtml(g.ipa)}/</div>${g.role_ja?`<div class="sound-note">${escapeHtml(g.role_ja)}</div>`:''}</div>`).join('');const phenomena=(lesson.sound_phenomena||[]).map((p,i)=>{const open=state.openSound===i;return `<div class="sound-card"><button type="button" class="sound-toggle" data-sound-index="${i}" aria-expanded="${open}"><span><small>${escapeHtml(p.label_ja)}</small><b>${escapeHtml(p.span)}</b><em>${escapeHtml(p.surface_hint)}</em></span><span aria-hidden="true">${open?'−':'＋'}</span></button>${open?`<div class="sound-detail"><p>${escapeHtml(p.detail_ja)}</p><div class="sound-meta">${escapeHtml(registerLabel(p.register))}${p.confidence?` · ${escapeHtml(confidenceLabel(p.confidence))}`:''}</div></div>`:''}</div>`;}).join('');const refs=(lesson.sound_reference_examples||[]).map((r,i)=>`<button class="reference-sound" type="button" data-ref-index="${i}"><span>${escapeHtml(soundTypeLabel(r.type))}</span><b>${escapeHtml(r.text)}</b><small>/${escapeHtml(r.ipa)}/</small><em>${escapeHtml(r.note_ja)}</em></button>`).join('');els.workspace.innerHTML=`<section><div class="sound-section-label">SOUND FLOW</div>${groups||'<p class="hint">音声グループ情報はまだありません。</p>'}</section><section class="sound-observations"><div class="sound-section-label">この文で起きていること</div>${phenomena||'<p class="hint">この文には登録された音声現象がありません。</p>'}</section>${refs?`<details class="sound-reference"><summary>ほかの代表例を見る</summary><div class="reference-grid">${refs}</div></details>`:''}`;}
function toggleSound(index){state.openSound=state.openSound===index?null:index;renderSoundLab();}

function openWord(index){const word=state.lesson.words?.[index];if(!word)return;state.selectedWord=index;state.selectedExpression=null;state.drawerOpen=true;speak(word.surface,.9);els.detailKind.textContent='WORD DETAIL';els.detailSurface.textContent=word.surface;const rows=[['IPA',word.ipa?`/${word.ipa}/`:null],['文脈上の意味',word.meaning_ja],['辞書形',word.lemma],['品詞',word.pos],['文中の働き',word.role],['形・活用',word.morphology],['短い解説',word.detail_ja]].filter(([,v])=>v);els.detailBody.innerHTML=rows.map(([label,value])=>`<div class="detail-row"><b>${escapeHtml(label)}</b><div>${escapeHtml(value)}</div></div>`).join('');openDrawer();}
function openDrawer(){els.drawer.classList.add('open');els.drawer.setAttribute('aria-hidden','false');els.scrim.hidden=false;updateDetailAria();}
function closeDetail(){if(!state.drawerOpen)return;state.drawerOpen=false;els.drawer.classList.remove('open');els.drawer.setAttribute('aria-hidden','true');els.scrim.hidden=true;updateDetailAria();}
function updateDetailAria(){$$('[data-word-index]').forEach(button=>button.setAttribute('aria-expanded',String(state.drawerOpen&&Number(button.dataset.wordIndex)===state.selectedWord)));$$('[data-expression-index]').forEach(button=>button.setAttribute('aria-expanded',String(state.drawerOpen&&Number(button.dataset.expressionIndex)===state.selectedExpression)));}
function speak(text,rate=1){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=Math.max(.65,Math.min(1.05,rate));speechSynthesis.speak(utterance);}
function structureLabel(key){return({subject:'話し手・主語',verb:'文の中心・動詞',destination:'目的地',means:'手段',object:'対象',contrast:'対比',time:'時刻',intention:'話者の意図'})[key]||key;}
function soundTypeLabel(type){return({'liaison-required':'リエゾン','enchaînement':'アンシェヌマン','elision':'エリジオン','schwa':'脱落性の e'})[type]||type;}
function expressionTypeLabel(type){return({'fixed-expression':'まとまり表現','common-expression':'よく使う表現','comparison-pattern':'比較表現','time-expression':'時刻表現'})[type]||type||'表現';}
function registerLabel(value){return({'all':'どの場面でも','standard-and-conversation':'標準・会話共通','neutral':'標準・中立'})[value]||value||'';}
function confidenceLabel(value){return({'verified':'検証済み','pedagogical':'学習用の区切り','variable':'話者・速度で変化','regional':'地域差あり','uncertain':'未確定'})[value]||value;}
function changeReasonLabel(value){return({'subject-change':'主語が変わる','verb-agreement':'主語に合わせて動詞が変わる','negation':'否定の形になる','question':'疑問の形になる','preference-comparison':'好みの比較を一つの形にまとめる','determiner-change':'限定詞が変わる'})[value]||value||'';}
function escapeHtml(value=''){return String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
window.FSL_DEBUG={state,setMode,openWord,openExpression,closeDetail,toggleSound,toggleTransform,loadLesson,resolveLessonId,moveLesson};
