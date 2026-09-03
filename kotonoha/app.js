(function(){
'use strict';

const STORAGE_KEY = 'kotonoha-state-v0.1';
const QUESTIONS = window.KOTONOHA_QUESTIONS || [];

function defaultState(){
  return {
    version: 1,
    learner: { readingLevel: 1.0, confidence: 0.15, vocabularyFrontier: 0.45 },
    attempts: [],
    vocab: {},
    decisionTrace: [],
    currentQuestionId: null,
    settings: { reading: true, listening: false, writing: false, speaking: false }
  };
}

function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch(e){
    return defaultState();
  }
}

let state = loadState();
let selectedChoice = null;
let answered = false;

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function now(){ return new Date().toISOString(); }
function attemptsFor(id){ return state.attempts.filter(a=>a.questionId===id); }
function vocabState(term){
  if(!state.vocab[term]) state.vocab[term] = { exposures:0, lookups:0, directSuccess:0, incidentalSuccess:0, lastSeen:null, contexts:[], modalities:[] };
  return state.vocab[term];
}

function dueScore(term){
  const v = state.vocab[term];
  if(!v || !v.lastSeen) return 0;
  const ageHours = (Date.now() - Date.parse(v.lastSeen)) / 3600000;
  const familiarity = v.exposures + v.directSuccess*1.5 + v.incidentalSuccess - v.lookups*0.8;
  return clamp(ageHours/24 - familiarity*0.18, 0, 2.5);
}

function newWordLoad(q){
  if(!q.vocab || !q.vocab.length) return 0;
  const unseen = q.vocab.filter(v=>!state.vocab[v.term] || state.vocab[v.term].exposures===0).length;
  return unseen / q.vocab.length;
}

function candidateScore(q){
  const history = attemptsFor(q.id);
  const target = state.learner.readingLevel;
  const levelFit = 1.5 - Math.abs(q.difficulty - target);
  const noveltyPenalty = history.length * 0.35;
  const due = (q.vocab || []).reduce((s,v)=>s + dueScore(v.term),0) * 0.45;
  const load = newWordLoad(q);
  const frontier = state.learner.vocabularyFrontier;
  const frontierPenalty = load > frontier ? (load-frontier)*2.2 : 0;
  const stretchBonus = q.difficulty > target && q.difficulty <= target+0.25 ? 0.18 : 0;
  return levelFit + due + stretchBonus - noveltyPenalty - frontierPenalty;
}

function selectNextQuestion(){
  const scored = QUESTIONS.map(q=>({q,score:candidateScore(q)})).sort((a,b)=>{
    if(b.score!==a.score) return b.score-a.score;
    return a.q.id.localeCompare(b.q.id);
  });
  const chosen = scored[0] ? scored[0].q : QUESTIONS[0];
  if(chosen){
    state.currentQuestionId = chosen.id;
    state.decisionTrace.push({at:now(), selected:chosen.id, topCandidates:scored.slice(0,3).map(x=>({id:x.q.id,score:Number(x.score.toFixed(3))})), readingLevel:state.learner.readingLevel, vocabularyFrontier:state.learner.vocabularyFrontier});
    state.decisionTrace = state.decisionTrace.slice(-100);
    saveState();
  }
  return chosen;
}

function currentQuestion(){
  return QUESTIONS.find(q=>q.id===state.currentQuestionId) || selectNextQuestion();
}

function recordExposure(q){
  (q.vocab||[]).forEach(item=>{
    const v = vocabState(item.term);
    v.exposures += 1;
    v.lastSeen = now();
    if(!v.contexts.includes(q.genre)) v.contexts.push(q.genre);
    if(!v.modalities.includes(q.skill)) v.modalities.push(q.skill);
  });
  saveState();
}

function adjustLearner(correct, q){
  const target = q.difficulty;
  const delta = correct ? 0.04 : -0.025;
  state.learner.readingLevel = clamp(state.learner.readingLevel + delta + (correct && target>state.learner.readingLevel ? 0.01 : 0), 1, 7);
  state.learner.confidence = clamp(state.learner.confidence + 0.025, 0, 1);

  const recent = state.attempts.slice(-8);
  const lookupRate = recent.length ? recent.reduce((n,a)=>n+(a.lookupCount||0),0)/recent.length : 0;
  const accuracy = recent.length ? recent.filter(a=>a.correct).length/recent.length : 0.5;
  let frontier = state.learner.vocabularyFrontier;
  if(lookupRate > 1.0 || accuracy < 0.55) frontier -= 0.05;
  else if(accuracy > 0.8 && lookupRate < 0.5) frontier += 0.04;
  state.learner.vocabularyFrontier = clamp(frontier, 0.15, 0.9);
}

function render(){
  const q = currentQuestion();
  if(!q) return;
  selectedChoice = null;
  answered = false;
  recordExposure(q);

  document.getElementById('questionGenre').textContent = genreLabel(q.genre);
  document.getElementById('questionText').textContent = q.text;
  document.getElementById('questionPrompt').textContent = q.prompt;
  document.getElementById('feedback').innerHTML = '';
  document.getElementById('feedback').className = 'feedback hidden';
  document.getElementById('nextButton').classList.add('hidden');
  document.getElementById('checkButton').classList.remove('hidden');
  document.getElementById('checkButton').disabled = true;

  const choices = document.getElementById('choices');
  choices.innerHTML = '';
  q.choices.forEach((choice,index)=>{
    const button = document.createElement('button');
    button.className = 'choice';
    button.textContent = choice;
    button.addEventListener('click',()=>{
      if(answered) return;
      selectedChoice = index;
      Array.from(choices.children).forEach(x=>x.classList.remove('selected'));
      button.classList.add('selected');
      document.getElementById('checkButton').disabled = false;
    });
    choices.appendChild(button);
  });

  const vocab = document.getElementById('vocabHelp');
  vocab.innerHTML = '';
  (q.vocab||[]).forEach(item=>{
    const wrap = document.createElement('div');
    wrap.className = 'vocab-row';
    const btn = document.createElement('button');
    btn.className = 'meaning-button';
    btn.textContent = `「${item.term}」の意味を見る`;
    const detail = document.createElement('div');
    detail.className = 'meaning-detail hidden';
    detail.textContent = `${item.reading} — ${item.meaning}`;
    btn.addEventListener('click',()=>{
      detail.classList.remove('hidden');
      btn.disabled = true;
      const v = vocabState(item.term);
      v.lookups += 1;
      v.lastSeen = now();
      saveState();
    });
    wrap.append(btn,detail);
    vocab.appendChild(wrap);
  });

  updateHeader();
}

function genreLabel(g){
  return ({notice:'案内',message:'メッセージ',work:'仕事',daily:'日常',public:'公共',service:'サービス'})[g] || '日本語';
}

function checkAnswer(){
  const q = currentQuestion();
  if(!q || selectedChoice===null || answered) return;
  answered = true;
  const correct = selectedChoice===q.answer;
  const lookupCount = (q.vocab||[]).reduce((n,item)=>n+(state.vocab[item.term]?.lookups||0),0);

  state.attempts.push({questionId:q.id, at:now(), correct, selectedChoice, lookupCount});
  (q.vocab||[]).forEach(item=>{
    const v = vocabState(item.term);
    if(correct){
      if(item.role==='direct') v.directSuccess += 1;
      else v.incidentalSuccess += 1;
    }
  });
  adjustLearner(correct,q);
  saveState();

  const buttons = Array.from(document.querySelectorAll('.choice'));
  buttons.forEach((b,i)=>{
    b.disabled = true;
    if(i===q.answer) b.classList.add('correct');
    if(i===selectedChoice && !correct) b.classList.add('incorrect');
  });

  const feedback = document.getElementById('feedback');
  feedback.className = 'feedback';
  feedback.innerHTML = `<strong>${correct ? 'そうです。' : 'ここを確認してみましょう。'}</strong><p>${q.explanation}</p>`;
  document.getElementById('checkButton').classList.add('hidden');
  document.getElementById('nextButton').classList.remove('hidden');
  updateHeader();
}

function goNext(){
  state.currentQuestionId = null;
  saveState();
  selectNextQuestion();
  render();
}

function updateHeader(){
  document.getElementById('encounterCount').textContent = state.attempts.length;
  document.getElementById('gardenCount').textContent = Object.keys(state.vocab).filter(k=>state.vocab[k].exposures>0).length;
}

function resetDemo(){
  if(!confirm('この端末のKotonoha学習履歴をリセットしますか？')) return;
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  selectNextQuestion();
  render();
}

window.KotonohaDebug = {
  getState: ()=>JSON.parse(JSON.stringify(state)),
  scoreCandidates: ()=>QUESTIONS.map(q=>({id:q.id,score:candidateScore(q)})).sort((a,b)=>b.score-a.score),
  reset: resetDemo
};

document.addEventListener('DOMContentLoaded',()=>{
  if(!state.currentQuestionId) selectNextQuestion();
  document.getElementById('checkButton').addEventListener('click',checkAnswer);
  document.getElementById('nextButton').addEventListener('click',goNext);
  document.getElementById('resetButton').addEventListener('click',resetDemo);
  render();
});
})();