import {chooseNextLesson,buildReencounterReason} from './reencounter-engine.js';

const STORAGE_KEY='JSL_PROGRESS_V1';
let lessons=[];

function readProgress(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{}}catch{return {}}
}

export function ensureReencounterCard(){
  if(document.getElementById('reencounterCard'))return;
  const anchor=document.getElementById('learningMapCard');
  if(!anchor)return;
  const card=document.createElement('section');
  card.id='reencounterCard';
  card.className='card reencounter-card';
  card.innerHTML=`<div class="eyebrow">NEXT BEST ENCOUNTER</div><h2>次に触れるなら</h2><div id="reencounterTitle" class="reencounter-title"></div><p id="reencounterReason"></p><button id="goRecommendedLesson" type="button">このレッスンへ →</button>`;
  anchor.insertAdjacentElement('afterend',card);
}

export function renderReencounter({lessons,currentIndex,progress,onSelect}){
  ensureReencounterCard();
  const pick=chooseNextLesson({lessons,currentIndex,progress});
  const card=document.getElementById('reencounterCard');
  if(!card)return;
  if(!pick){card.hidden=true;return}
  card.hidden=false;
  document.getElementById('reencounterTitle').textContent=`${pick.lesson.title} · ${pick.lesson.sentence}`;
  document.getElementById('reencounterReason').textContent=buildReencounterReason({lesson:pick.lesson,progress});
  const button=document.getElementById('goRecommendedLesson');
  button.onclick=()=>onSelect(pick.index);
}

function currentIndex(){
  const picker=document.getElementById('lessonPicker');
  return picker?Number(picker.value||0):0;
}
function selectLesson(index){
  const picker=document.getElementById('lessonPicker');
  if(!picker)return;
  picker.value=String(index);
  picker.dispatchEvent(new Event('change',{bubbles:true}));
  window.scrollTo({top:0,behavior:'smooth'});
}
function refresh(){
  if(!lessons.length)return;
  renderReencounter({lessons,currentIndex:currentIndex(),progress:readProgress(),onSelect:selectLesson});
}

async function init(){
  const res=await fetch('./data/lessons-a1.json');
  if(!res.ok)return;
  lessons=await res.json();
  ensureReencounterCard();
  refresh();
  document.getElementById('lessonPicker')?.addEventListener('change',refresh);
  document.addEventListener('click',()=>queueMicrotask(refresh),true);
}

init().catch(()=>{});
