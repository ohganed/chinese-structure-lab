const INDEX_PATH='./data/index.json';
const EXPLORATION_KEY='fsl.exploration.v1';
const cache={index:null,lexemes:null,network:null,occurrences:null,lessons:new Map()};
let selectedWordIndex=null;
let deepStack=[];

document.addEventListener('click',(event)=>{
  const wordButton=event.target.closest('[data-word-index]');
  if(wordButton){selectedWordIndex=Number(wordButton.dataset.wordIndex);queueMicrotask(()=>attachDeepButton());return;}
  const deepButton=event.target.closest('[data-open-lexeme-deep]');
  if(deepButton){openCurrentWordDeepView();return;}
  const related=event.target.closest('[data-related-lexeme]');
  if(related){deepStack.push(related.dataset.relatedLexeme);renderLexemeDeep(related.dataset.relatedLexeme);return;}
  const back=event.target.closest('[data-deep-back]');
  if(back){if(deepStack.length>1)deepStack.pop();renderLexemeDeep(deepStack[deepStack.length-1]);return;}
  const occurrence=event.target.closest('[data-occurrence-lesson]');
  if(occurrence){openOccurrenceLesson(occurrence.dataset.occurrenceLesson,occurrence.dataset.occurrenceLexeme,occurrence.dataset.occurrenceWord);return;}
  const returnButton=event.target.closest('[data-return-origin]');
  if(returnButton){returnToOrigin();}
});
window.addEventListener('hashchange',()=>restoreExplorationFocus());
queueMicrotask(()=>restoreExplorationFocus());

function attachDeepButton(){
  const body=document.querySelector('#detailBody');
  const kind=document.querySelector('#detailKind');
  if(!body||kind?.textContent!=='WORD DETAIL'||selectedWordIndex===null)return;
  if(body.querySelector('[data-open-lexeme-deep]'))return;
  const wrap=document.createElement('div');wrap.className='deep-entry';
  wrap.innerHTML='<button type="button" class="deep-entry-button" data-open-lexeme-deep aria-expanded="false">さらに深く見る <span aria-hidden="true">↓</span></button><p>共有lexeme・関連語・別教材の出現例は、このボタンを押したときだけ読み込みます。</p>';
  body.appendChild(wrap);
}

async function openCurrentWordDeepView(){
  const button=document.querySelector('[data-open-lexeme-deep]');if(button){button.disabled=true;button.textContent='読み込み中…';}
  try{
    const lesson=await currentLesson();const word=lesson?.words?.[selectedWordIndex];
    if(!word?.lexeme_id)throw new Error('この語には共有lexeme参照がまだありません。');
    await ensureDeepData();deepStack=[word.lexeme_id];renderLexemeDeep(word.lexeme_id);
  }catch(error){renderDeepError(error.message||'Deep Viewを開けませんでした。');}
}

async function currentLesson(){
  const index=await ensureIndex();const params=new URLSearchParams(location.hash.replace(/^#/,''));const id=params.get('lesson')||index.lessons?.[0]?.id;const meta=index.lessons?.find(x=>x.id===id)||index.lessons?.[0];if(!meta)return null;
  if(cache.lessons.has(meta.id))return cache.lessons.get(meta.id);
  const res=await fetch(meta.path,{cache:'no-store'});if(!res.ok)throw new Error('現在の教材を読み込めませんでした。');const lesson=await res.json();cache.lessons.set(meta.id,lesson);return lesson;
}

async function lessonById(id){const index=await ensureIndex();const meta=index.lessons?.find(x=>x.id===id);if(!meta)return null;if(cache.lessons.has(id))return cache.lessons.get(id);const res=await fetch(meta.path,{cache:'no-store'});if(!res.ok)return null;const lesson=await res.json();cache.lessons.set(id,lesson);return lesson;}
async function ensureIndex(){if(cache.index)return cache.index;const res=await fetch(INDEX_PATH,{cache:'no-store'});if(!res.ok)throw new Error('教材索引を読み込めませんでした。');cache.index=await res.json();return cache.index;}
async function ensureDeepData(){
  const index=await ensureIndex();const refs=index.reference_data||{};
  if(!cache.lexemes){const res=await fetch(refs.lexemes||'./data/lexemes/a1-core.json',{cache:'no-store'});if(!res.ok)throw new Error('共有lexemeを読み込めませんでした。');cache.lexemes=await res.json();}
  if(!cache.network){const res=await fetch(refs.related_network||'./data/networks/a1-related.json',{cache:'no-store'});if(!res.ok)throw new Error('関連語ネットワークを読み込めませんでした。');cache.network=await res.json();}
  if(!cache.occurrences){const res=await fetch(refs.occurrences||'./data/occurrences/a1-index.json',{cache:'no-store'});if(!res.ok)throw new Error('出現索引を読み込めませんでした。');cache.occurrences=await res.json();}
}

function renderLexemeDeep(lexemeId){
  const body=document.querySelector('#detailBody');const title=document.querySelector('#detailSurface');const kind=document.querySelector('#detailKind');if(!body)return;
  const lexeme=(cache.lexemes?.lexemes||[]).find(x=>x.id===lexemeId);if(!lexeme){renderDeepError('共有lexemeが見つかりません。');return;}
  const relations=relationsFor(lexemeId);const occurrences=occurrencesFor(lexemeId);kind.textContent='LEXEME DEEP VIEW';title.textContent=lexeme.lemma;
  body.innerHTML=`<section class="deep-view"><div class="deep-nav">${deepStack.length>1?'<button type="button" data-deep-back>← ひとつ戻る</button>':''}<span>共有lexeme</span></div><div class="deep-core"><div><b>辞書形</b><span>${esc(lexeme.lemma)}</span></div><div><b>品詞</b><span>${esc(lexeme.pos||'—')}</span></div><div><b>基本意味</b><span>${esc(lexeme.meaning_ja||'—')}</span></div><div><b>確信度</b><span>${esc(lexeme.confidence||'—')}</span></div></div>${renderOccurrences(lexemeId,occurrences)}<section class="deep-network"><div class="sound-section-label">RELATED NETWORK</div>${relations.length?relations.map(r=>relatedCard(lexemeId,r)).join(''):'<p class="hint">現在、このlexemeには検証済みの関連語がまだ登録されていません。</p>'}</section><p class="deep-footnote">関連は同義を意味しません。関係の種類を明示して表示しています。</p></section>`;
}

function occurrencesFor(id){return cache.occurrences?.occurrences?.[id]||[];}
function renderOccurrences(lexemeId,items){
  const currentId=currentLessonId();const elsewhere=items.filter(item=>item.lesson_id!==currentId);const visible=elsewhere.length?elsewhere:items;
  return `<section class="deep-occurrences"><div class="sound-section-label">IN REAL LESSONS</div>${visible.length?visible.map(item=>occurrenceCard(lexemeId,item,item.lesson_id===currentId)).join(''):'<p class="hint">このlexemeの教材内出現例はまだ登録されていません。</p>'}${!elsewhere.length&&items.length?'<p class="deep-footnote">現在はこの教材だけに登場します。別教材が増えると、ここから自然に再遭遇できます。</p>':''}</section>`;
}
function occurrenceCard(lexemeId,item,isCurrent){const meta=(cache.index?.lessons||[]).find(x=>x.id===item.lesson_id);return `<button type="button" class="occurrence-card" data-occurrence-lesson="${esc(item.lesson_id)}" data-occurrence-lexeme="${esc(lexemeId)}" data-occurrence-word="${esc(item.word_id)}" ${isCurrent?'disabled':''}><small>${isCurrent?'現在の教材':'別教材で再遭遇'}${meta?.title_ja?` · ${esc(meta.title_ja)}`:''}</small><b>${esc(item.sentence||'')}</b><span>${esc(item.surface||'')}</span></button>`;}
function currentLessonId(){const params=new URLSearchParams(location.hash.replace(/^#/,''));return params.get('lesson')||cache.index?.lessons?.[0]?.id||'';}

function openOccurrenceLesson(id,lexemeId,wordId){
  const originLessonId=currentLessonId();if(!id||id===originLessonId)return;
  const context={schema_version:'1.0',phase:'visiting',originLessonId,originLexemeId:deepStack[0]||lexemeId,originWordIndex:selectedWordIndex,targetLessonId:id,targetLexemeId:lexemeId,targetWordId:wordId};
  saveExploration(context);location.hash=`lesson=${encodeURIComponent(id)}`;
}
function returnToOrigin(){
  const context=loadExploration();if(!context?.originLessonId)return;
  context.phase='returning';context.targetLessonId=context.originLessonId;context.targetLexemeId=context.originLexemeId;context.targetWordId='';saveExploration(context);location.hash=`lesson=${encodeURIComponent(context.originLessonId)}`;
}
function saveExploration(value){try{sessionStorage.setItem(EXPLORATION_KEY,JSON.stringify(value));}catch{}}
function loadExploration(){try{const raw=sessionStorage.getItem(EXPLORATION_KEY);return raw?JSON.parse(raw):null;}catch{return null;}}
function clearExploration(){try{sessionStorage.removeItem(EXPLORATION_KEY);}catch{}}

async function restoreExplorationFocus(){
  const context=loadExploration();if(!context||context.targetLessonId!==currentLessonId())return;
  const lesson=await lessonById(context.targetLessonId);if(!lesson)return;
  const wordIndex=context.phase==='returning'&&Number.isInteger(context.originWordIndex)?context.originWordIndex:findTargetWordIndex(lesson,context.targetWordId,context.targetLexemeId);
  const ready=await waitForLessonUI(context.targetLessonId);if(!ready)return;
  const wordsTab=document.querySelector('[data-mode="words"]');if(wordsTab&&!wordsTab.classList.contains('active'))wordsTab.click();
  await nextFrame();
  const target=document.querySelector(`[data-word-index="${wordIndex}"]`);if(target){target.classList.add('reencounter-focus');target.focus({preventScroll:true});target.scrollIntoView({block:'center',behavior:reduceMotion()?'auto':'smooth'});}
  if(context.phase==='returning'){clearExploration();return;}
  showReturnBanner(context);
}
function findTargetWordIndex(lesson,wordId,lexemeId){const byWord=(lesson.words||[]).findIndex(w=>w.id===wordId);if(byWord>=0)return byWord;return Math.max(0,(lesson.words||[]).findIndex(w=>w.lexeme_id===lexemeId));}
async function waitForLessonUI(targetId){for(let i=0;i<12;i+=1){const picker=document.querySelector('#lessonPicker');if(picker?.value===targetId)return true;await delay(100);}return false;}
function showReturnBanner(context){
  const workspace=document.querySelector('#workspace');if(!workspace)return;workspace.querySelector('.exploration-return')?.remove();
  const banner=document.createElement('div');banner.className='exploration-return';banner.innerHTML=`<span>別の文脈で再遭遇しています。</span><button type="button" data-return-origin>← 元の文へ戻る</button>`;workspace.prepend(banner);
}
function delay(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
function nextFrame(){return new Promise(resolve=>requestAnimationFrame(()=>resolve()));}
function reduceMotion(){return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;}

function relationsFor(id){return (cache.network?.relations||[]).filter(r=>r.from===id||r.to===id);}
function relatedCard(originId,relation){const otherId=relation.from===originId?relation.to:relation.from;const other=(cache.lexemes?.lexemes||[]).find(x=>x.id===otherId);if(!other)return'';return `<button type="button" class="related-card" data-related-lexeme="${esc(otherId)}"><small>${esc(relationLabel(relation.type))}</small><b>${esc(other.lemma)}</b><span>${esc(other.meaning_ja||'')}</span>${relation.expression?`<em>${esc(relation.expression)}</em>`:''}<p>${esc(relation.note_ja||'')}</p></button>`;}
function relationLabel(type){return({'semantic-neighbor':'意味的に近い','semantic-field':'同じ意味領域','common-pattern':'よく使う構文','lesson-context':'教材内の共起','word-family':'語族','derivation':'派生関係','antonym':'反意関係'}[type]||type);}
function renderDeepError(message){const body=document.querySelector('#detailBody');if(body)body.innerHTML=`<div class="error">${esc(message)} 通常の単語詳細は引き続き利用できます。</div>`;}
function esc(value=''){return String(value).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}

window.FSL_DEEP_DEBUG={relationsFor,occurrencesFor,relationLabel,findTargetWordIndex};
