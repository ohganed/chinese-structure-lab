const STORAGE_KEY='JSL_PROGRESS_V1';
const FLOW_STEPS=['listen','words','structure','transform','rebuild','relisten'];
const state={lessons:[],index:0,progress:{}};
const $=id=>document.getElementById(id);

function loadProgress(){
  try{state.progress=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{}}catch{state.progress={}}
}
function saveProgress(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.progress))}
function currentLesson(){return state.lessons[state.index]}
function lessonProgress(){
  const lesson=currentLesson();
  if(!lesson)return {steps:[],complete:false};
  return state.progress[lesson.id]||{steps:[],complete:false};
}
function markStep(step){
  const lesson=currentLesson();
  if(!lesson)return;
  const p=lessonProgress();
  const steps=new Set(p.steps||[]);
  steps.add(step);
  const complete=FLOW_STEPS.every(x=>steps.has(x));
  state.progress[lesson.id]={steps:[...steps],complete};
  saveProgress();
  renderFlow();
}
function renderFlow(){
  const p=lessonProgress();
  const steps=new Set(p.steps||[]);
  document.querySelectorAll('[data-flow]').forEach(b=>b.classList.toggle('done',steps.has(b.dataset.flow)));
  $('flowStatus').textContent=`${steps.size} / ${FLOW_STEPS.length}`;
  $('completionBadge').hidden=!p.complete;
  $('lessonCompleteText').hidden=!p.complete;
  $('continueLesson').hidden=!p.complete;
}

async function load(){
  loadProgress();
  const res=await fetch('./data/lessons-a1.json');
  if(!res.ok) throw new Error('教材データを読み込めませんでした');
  state.lessons=await res.json();
  buildPicker();
  render();
}

function buildPicker(){
  $('lessonPicker').innerHTML='';
  state.lessons.forEach((lesson,i)=>{
    const opt=document.createElement('option');
    opt.value=String(i);
    opt.textContent=`${lesson.level} · ${lesson.title}`;
    $('lessonPicker').appendChild(opt);
  });
}

function speak(text,rate){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='ja-JP';u.rate=rate;u.pitch=1;
  speechSynthesis.speak(u);
}

function render(){
  const l=currentLesson();
  if(!l)return;
  $('lessonPicker').value=String(state.index);
  $('sceneTitle').textContent=l.title;
  $('sceneText').textContent=l.situation;
  $('sentence').textContent=l.sentence;
  $('reading').textContent=l.reading;
  $('reading').hidden=true;
  $('translation').textContent=l.translation_en;
  $('translation').hidden=true;

  $('tokens').innerHTML='';
  l.words.forEach(w=>{
    const b=document.createElement('button');
    b.type='button';b.className='token';
    const spoken=w.spoken?` · 発音 ${w.spoken}`:'';
    b.innerHTML=`<b>${w.surface}</b><span>${w.reading}${spoken} · ${w.meaning_en}</span><span class="detail">${w.pos} · ${w.role}${w.morphology?`<br>${w.morphology}`:''}</span>`;
    b.addEventListener('click',()=>{b.classList.toggle('open');markStep('words')});
    $('tokens').appendChild(b);
  });

  $('insights').innerHTML='';
  (l.insights||[]).forEach(x=>{
    const box=document.createElement('article');
    box.className='insight';
    box.innerHTML=`<div class="insight-label">${x.label}</div><b>${x.focus}</b><p>${x.detail}</p>`;
    $('insights').appendChild(box);
  });

  $('structure').innerHTML='';
  l.structure.forEach(x=>{
    const row=document.createElement('div');
    row.className='structure-row';
    row.innerHTML=`<b>${x.label}</b><span>${x.text}</span>`;
    $('structure').appendChild(row);
  });

  $('morphology').innerHTML='';
  (l.forms||[]).forEach(x=>{
    const box=document.createElement('article');
    box.className='form-card';
    box.innerHTML=`<div class="form-path"><b>${x.surface}</b><span>→</span><b>${x.base}</b></div><div class="form-kind">${x.kind}</div><p>${x.detail}</p>`;
    $('morphology').appendChild(box);
  });

  $('transforms').innerHTML='';
  (l.transforms||[]).forEach(x=>{
    const box=document.createElement('article');
    box.className='transform';
    box.innerHTML=`<div class="transform-label">${x.label}</div><div class="transform-from">${x.from}</div><div class="transform-arrow">↓ ${x.change}</div><button type="button" class="transform-reveal">変えた文を見る</button><div class="transform-to" hidden>${x.to}</div><p hidden>${x.why}</p>`;
    const btn=box.querySelector('.transform-reveal');
    const answer=box.querySelector('.transform-to');
    const why=box.querySelector('p');
    btn.addEventListener('click',()=>{
      const opening=answer.hidden;
      answer.hidden=!opening;why.hidden=!opening;
      btn.textContent=opening?'隠す':'変えた文を見る';
      if(opening){markStep('transform');speak(x.to,.92)}
    });
    $('transforms').appendChild(box);
  });

  $('rebuildPrompt').textContent=l.rebuild.prompt;
  $('rebuildAnswer').textContent=l.rebuild.answer;
  $('rebuildAnswer').hidden=true;
  renderFlow();
}

function changeLesson(delta){
  state.index=(state.index+delta+state.lessons.length)%state.lessons.length;
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-rate]').forEach(b=>b.addEventListener('click',()=>{
  const l=currentLesson();speak(l.sentence,Number(b.dataset.rate));markStep('listen');
}));
document.querySelectorAll('[data-flow]').forEach(b=>b.addEventListener('click',()=>{
  const target=$(b.dataset.target);
  if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
}));
$('toggleReading').addEventListener('click',()=>{$('reading').hidden=!$('reading').hidden});
$('toggleMeaning').addEventListener('click',()=>{$('translation').hidden=!$('translation').hidden});
$('observeStructure').addEventListener('click',()=>{markStep('structure');$('observeStructure').textContent='✓ 構造を確認しました'});
$('showRebuild').addEventListener('click',()=>{
  const opening=$('rebuildAnswer').hidden;
  $('rebuildAnswer').hidden=!opening;
  if(opening)markStep('rebuild');
});
$('listenAgain').addEventListener('click',()=>{const l=currentLesson();speak(l.sentence,.92);markStep('relisten')});
$('continueLesson').addEventListener('click',()=>changeLesson(1));
$('prevLesson').addEventListener('click',()=>changeLesson(-1));
$('nextLesson').addEventListener('click',()=>changeLesson(1));
$('lessonPicker').addEventListener('change',e=>{state.index=Number(e.target.value);render()});

load().catch(err=>{$('sceneTitle').textContent='読み込みエラー';$('sceneText').textContent=err.message});
