const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const lessonPath=path.join(root,'japanese','data','lessons-a1.json');
const lessons=JSON.parse(fs.readFileSync(lessonPath,'utf8'));

function assert(ok,msg){if(!ok)throw new Error(msg)}
assert(Array.isArray(lessons),'lessons must be an array');
assert(lessons.length>=3,'v0.1 requires at least three lessons');

for(const lesson of lessons){
  assert(/^ja-a1-\d{3}$/.test(lesson.id),`bad id: ${lesson.id}`);
  assert(lesson.level==='A1',`${lesson.id}: expected A1`);
  assert(lesson.sentence&&lesson.reading&&lesson.translation_en,`${lesson.id}: missing sentence/read/translation`);
  assert(Array.isArray(lesson.words)&&lesson.words.length>0,`${lesson.id}: missing words`);
  assert(Array.isArray(lesson.insights)&&lesson.insights.length>0,`${lesson.id}: missing Japanese insights`);
  assert(Array.isArray(lesson.structure)&&lesson.structure.length>0,`${lesson.id}: missing structure`);
  assert(Array.isArray(lesson.forms)&&lesson.forms.length>0,`${lesson.id}: missing form data`);
  assert(Array.isArray(lesson.transforms)&&lesson.transforms.length>0,`${lesson.id}: missing transforms`);
  assert(lesson.rebuild&&lesson.rebuild.prompt&&lesson.rebuild.answer,`${lesson.id}: missing rebuild`);
  for(const word of lesson.words){
    assert(word.surface&&word.reading&&word.meaning_en&&word.pos&&word.role,`${lesson.id}: incomplete word record`);
  }
  for(const transform of lesson.transforms){
    assert(transform.label&&transform.from&&transform.to&&transform.change&&transform.why,`${lesson.id}: incomplete transform`);
  }
}

const app=fs.readFileSync(path.join(root,'japanese','app.js'),'utf8');
assert(app.includes("u.lang='ja-JP'"),'Japanese TTS language must be ja-JP');
assert(app.includes("./data/lessons-a1.json"),'app must load A1 lesson data');
assert(app.includes("const STORAGE_KEY='JSL_PROGRESS_V1'"),'Japanese progress must use an isolated storage namespace');
assert(app.includes("FLOW_STEPS=['listen','words','structure','transform','rebuild','relisten']"),'guided flow must contain six learning stages');
assert(app.includes("markStep('words')"),'word interaction must advance flow');
assert(app.includes("markStep('structure')"),'structure confirmation must advance flow');
assert(app.includes("markStep('transform')"),'transform interaction must advance flow');
assert(app.includes("markStep('rebuild')"),'rebuild interaction must advance flow');
assert(app.includes("markStep('relisten')"),'final listening must advance flow');
assert(app.includes("speak(x.to,.92)"),'revealed transform should be speakable');

const html=fs.readFileSync(path.join(root,'japanese','index.html'),'utf8');
for(const id of ['flowTrack','flowStatus','completionBadge','listenCard','wordsCard','sentence','reading','translation','tokens','insights','structureCard','structure','morphology','transformCard','transforms','rebuildCard','rebuildAnswer','finishCard','listenAgain','continueLesson']){
  assert(html.includes(`id="${id}"`),`missing UI target: ${id}`);
}
for(const step of ['listen','words','structure','transform','rebuild','relisten']){
  assert(html.includes(`data-flow="${step}"`),`missing flow navigation step: ${step}`);
}

console.log(`PASS Japanese Structure Lab guided flow: ${lessons.length} lessons, 6-stage loop`);
