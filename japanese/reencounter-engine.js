export function scoreLesson({lesson,index,currentIndex,progress}){
  const p=progress[lesson.id]||{steps:[],complete:false};
  const stepCount=(p.steps||[]).length;
  const incompleteBonus=p.complete?0:30;
  const distancePenalty=Math.abs(index-currentIndex)*1.5;
  const reuseBonus=(lesson.connections?.reuses?.length||0)*6;
  const prepareBonus=(lesson.connections?.prepares?.length||0)*2;
  const exposurePenalty=stepCount*3;
  return incompleteBonus+reuseBonus+prepareBonus-exposurePenalty-distancePenalty;
}

export function chooseNextLesson({lessons,currentIndex,progress}){
  if(!Array.isArray(lessons)||!lessons.length)return null;
  const ranked=lessons
    .map((lesson,index)=>({lesson,index,score:scoreLesson({lesson,index,currentIndex,progress})}))
    .filter(x=>x.index!==currentIndex)
    .sort((a,b)=>b.score-a.score||a.index-b.index);
  return ranked[0]||null;
}

export function buildReencounterReason({lesson,progress}){
  const p=progress[lesson.id]||{steps:[],complete:false};
  if(!p.complete)return 'まだ1周していないレッスンを優先します。';
  if((lesson.connections?.reuses?.length||0)>0)return '以前の構造が別の場面で再登場するレッスンです。';
  return '学習間隔を空けて、もう一度触れる候補です。';
}
