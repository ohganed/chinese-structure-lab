import {chooseNextLesson,buildReencounterReason} from './reencounter-engine.js';

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
