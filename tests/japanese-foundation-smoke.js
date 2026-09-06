const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const lessonPath=path.join(root,'japanese','data','lessons-a1.json');
const lessons=JSON.parse(fs.readFileSync(lessonPath,'utf8'));

function assert(ok,msg){if(!ok)throw new Error(msg)}
assert(Array.isArray(lessons),'lessons must be an array');
assert(lessons.length>=10,'A1 foundation requires at least ten connected lessons');

const ids=new Set();
let reuseLinks=0;
for(const lesson of lessons){
  assert(/^ja-a1-\d{3}$/.test(lesson.id),`bad id: ${lesson.id}`);
  assert(!ids.has(lesson.id),`duplicate id: ${lesson.id}`);ids.add(lesson.id);
  assert(lesson.level==='A1',`${lesson.id}: expected A1`);
  assert(lesson.sentence&&lesson.reading&&lesson.translation_en,`${lesson.id}: missing sentence/read/translation`);
  assert(Array.isArray(lesson.words)&&lesson.words.length>0,`${lesson.id}: missing words`);
  assert(Array.isArray(lesson.insights)&&lesson.insights.length>0,`${lesson.id}: missing Japanese insights`);
  assert(Array.isArray(lesson.structure)&&lesson.structure.length>0,`${lesson.id}: missing structure`);
  assert(Array.isArray(lesson.forms)&&lesson.forms.length>0,`${lesson.id}: missing form data`);
  assert(Array.isArray(lesson.transforms)&&lesson.transforms.length>0,`${lesson.id}: missing transforms`);
  assert(lesson.connections&&Array.isArray(lesson.connections.reuses)&&Array.isArray(lesson.connections.prepares),`${lesson.id}: missing structure-network links`);
  assert(lesson.connections.prepares.length>0,`${lesson.id}: must prepare at least one reusable structure`);
  reuseLinks+=lesson.connections.reuses.length;
  assert(lesson.rebuild&&lesson.rebuild.prompt&&lesson.rebuild.answer,`${lesson.id}: missing rebuild`);
  for(const word of lesson.words){
    assert(word.surface&&word.reading&&word.meaning_en&&word.pos&&word.role,`${lesson.id}: incomplete word record`);
  }
  for(const transform of lesson.transforms){
    assert(transform.label&&transform.from&&transform.to&&transform.change&&transform.why,`${lesson.id}: incomplete transform`);
  }
}
assert(reuseLinks>=8,'A1 should contain meaningful re-encounters, not isolated lesson sentences');

const requiredStructures=['topic-ha','object-wo','question-ka','verb-masu'];
const prepared=new Set(lessons.flatMap(l=>l.connections.prepares));
const reused=new Set(lessons.flatMap(l=>l.connections.reuses));
for(const key of requiredStructures){
  assert(prepared.has(key),`missing prepared core structure: ${key}`);
  assert(reused.has(key),`core structure never reappears: ${key}`);
}

for(let i=0;i<lessons.length;i++){
  const lesson=lessons[i];
  for(const key of lesson.connections.reuses){
    const prior=lessons.slice(0,i).some(x=>x.connections.prepares.includes(key));
    assert(prior,`${lesson.id}: reuse '${key}' has no earlier prepared lesson`);
  }
}

const app=fs.readFileSync(path.join(root,'japanese','app.js'),'utf8');
assert(app.includes("u.lang='ja-JP'"),'Japanese TTS language must be ja-JP');
assert(app.includes("./data/lessons-a1.json"),'app must load A1 lesson data');
assert(app.includes("const STORAGE_KEY='JSL_PROGRESS_V1'"),'Japanese progress must use an isolated storage namespace');
assert(app.includes("FLOW_STEPS=['listen','words','structure','transform','rebuild','relisten']"),'guided flow must contain six learning stages');
assert(app.includes('function renderLearningMap()'),'app must render lesson connection map');
assert(app.includes('function findPriorLessons'),'learning map must resolve prior structure encounters');
assert(app.includes('function findNextLessons'),'learning map must resolve future structure encounters');
assert(app.includes('STRUCTURE_LABELS'),'learning map must present human-readable structure labels');
assert(app.includes("markStep('words')"),'word interaction must advance flow');
assert(app.includes("markStep('structure')"),'structure confirmation must advance flow');
assert(app.includes("markStep('transform')"),'transform interaction must advance flow');
assert(app.includes("markStep('rebuild')"),'rebuild interaction must advance flow');
assert(app.includes("markStep('relisten')"),'final listening must advance flow');
assert(app.includes("speak(x.to,.92)"),'revealed transform should be speakable');

const engine=fs.readFileSync(path.join(root,'japanese','reencounter-engine.js'),'utf8');
assert(engine.includes('export function scoreLesson'),'re-encounter engine must expose scoring');
assert(engine.includes('export function chooseNextLesson'),'re-encounter engine must choose a next lesson');
assert(engine.includes('incompleteBonus'),'re-encounter scoring must prioritize incomplete learning');
assert(engine.includes('reuseBonus'),'re-encounter scoring must value structural reuse');

const recommendationUI=fs.readFileSync(path.join(root,'japanese','reencounter-ui.js'),'utf8');
assert(recommendationUI.includes("const STORAGE_KEY='JSL_PROGRESS_V1'"),'recommendation UI must read the isolated Japanese progress namespace');
assert(recommendationUI.includes('chooseNextLesson'),'recommendation UI must use the re-encounter engine');
assert(recommendationUI.includes("fetch('./data/lessons-a1.json')"),'recommendation UI must use the same lesson data');

const html=fs.readFileSync(path.join(root,'japanese','index.html'),'utf8');
for(const id of ['flowTrack','flowStatus','completionBadge','learningMapCard','mapBefore','mapCurrent','mapNext','toggleFullMap','fullMap','listenCard','wordsCard','sentence','reading','translation','tokens','insights','structureCard','structure','morphology','transformCard','transforms','rebuildCard','rebuildAnswer','finishCard','listenAgain','continueLesson']){
  assert(html.includes(`id="${id}"`),`missing UI target: ${id}`);
}
for(const step of ['listen','words','structure','transform','rebuild','relisten']){
  assert(html.includes(`data-flow="${step}"`),`missing flow navigation step: ${step}`);
}
assert(html.includes('./reencounter-ui.js'),'page must load re-encounter recommendation UI');

console.log(`PASS Japanese Structure Lab: ${lessons.length} connected A1 lessons, ${reuseLinks} re-use links, Learning Map, Re-encounter Engine, 6-stage loop`);
