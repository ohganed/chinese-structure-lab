const state={lessons:[],index:0};
const $=id=>document.getElementById(id);

async function load(){
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
  const l=state.lessons[state.index];
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
    b.innerHTML=`<b>${w.surface}</b><span>${w.reading} · ${w.meaning_en}</span><span class="detail">${w.pos} · ${w.role}${w.morphology?`<br>${w.morphology}`:''}</span>`;
    b.addEventListener('click',()=>b.classList.toggle('open'));
    $('tokens').appendChild(b);
  });

  $('structure').innerHTML='';
  l.structure.forEach(x=>{
    const row=document.createElement('div');
    row.className='structure-row';
    row.innerHTML=`<b>${x.label}</b><span>${x.text}</span>`;
    $('structure').appendChild(row);
  });

  $('rebuildPrompt').textContent=l.rebuild.prompt;
  $('rebuildAnswer').textContent=l.rebuild.answer;
  $('rebuildAnswer').hidden=true;
}

document.querySelectorAll('[data-rate]').forEach(b=>b.addEventListener('click',()=>{
  const l=state.lessons[state.index];speak(l.sentence,Number(b.dataset.rate));
}));
$('toggleReading').addEventListener('click',()=>{$('reading').hidden=!$('reading').hidden});
$('toggleMeaning').addEventListener('click',()=>{$('translation').hidden=!$('translation').hidden});
$('showRebuild').addEventListener('click',()=>{$('rebuildAnswer').hidden=!$('rebuildAnswer').hidden});
$('prevLesson').addEventListener('click',()=>{state.index=(state.index-1+state.lessons.length)%state.lessons.length;render()});
$('nextLesson').addEventListener('click',()=>{state.index=(state.index+1)%state.lessons.length;render()});
$('lessonPicker').addEventListener('change',e=>{state.index=Number(e.target.value);render()});

load().catch(err=>{$('sceneTitle').textContent='読み込みエラー';$('sceneText').textContent=err.message});
