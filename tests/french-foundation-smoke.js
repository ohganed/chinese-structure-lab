const fs=require('fs');
const assert=require('assert');

const indexPath='french/data/index.json';
const appPath='french/app.js';
const htmlPath='french/index.html';

const index=JSON.parse(fs.readFileSync(indexPath,'utf8'));
assert(index.schema_version,'dataset schema_version is required');
assert(Array.isArray(index.lessons)&&index.lessons.length>=4,'multi-lesson index requires at least four lessons');
for(const meta of index.lessons){
  assert(meta.id&&meta.path&&meta.title_ja,'lesson index items need id, title and path');
  assert(meta.path.startsWith('./data/'),'lesson paths must be GitHub Pages-safe relative paths');
  assert(fs.existsSync(`french/${meta.path.replace(/^\.\//,'')}`),`missing lesson file: ${meta.path}`);
}

for(const meta of index.lessons){
  const lesson=JSON.parse(fs.readFileSync(`french/${meta.path.replace(/^\.\//,'')}`,'utf8'));
  for(const key of ['id','level','theme','sentence','translation_ja','audio','sound_groups','sound_phenomena','words','expressions','transforms','meaning_chunks','sentence_structure']){
    assert(Object.prototype.hasOwnProperty.call(lesson,key),`${meta.id}: missing lesson key ${key}`);
  }
  assert(lesson.schema_version,`${meta.id}: schema_version is required`);
  assert(lesson.words.length>=4,`${meta.id}: meaningful word structure required`);
  const ids=new Set(lesson.words.map(w=>w.id));
  assert(ids.size===lesson.words.length,`${meta.id}: every word needs a unique id`);
  for(const expression of lesson.expressions){
    assert(expression.id&&expression.surface&&expression.meaning_ja,`${meta.id}: expression needs id/surface/meaning`);
    for(const wordId of expression.word_ids||[])assert(ids.has(wordId),`${meta.id}: expression references unknown word id ${wordId}`);
  }
  for(const transform of lesson.transforms){
    assert(transform.id&&transform.target&&Array.isArray(transform.changes),`${meta.id}: transform needs id/target/changes`);
  }
}

const app=fs.readFileSync(appPath,'utf8');
assert(app.includes("fetch('./data/index.json'"),'app must load the small lesson index first');
assert(app.includes('fetch(meta.path'),'app must lazy-load only the selected lesson');
assert(app.includes('URLSearchParams'),'lesson ID should be recoverable from the URL hash');
assert(app.includes('moveLesson'),'previous/next lesson navigation must exist');
assert(app.includes('lessonPicker'),'lesson picker must be wired');
assert(app.includes('state.selectedExpression'),'expression state must be centralized');
assert(app.includes('state.openTransform'),'transform expansion state must be centralized');
assert(app.includes('openExpression'),'expression detail must be wired');
assert(app.includes('toggleTransform'),'transform observation must be wired');
assert(app.includes("speechSynthesis.cancel()"),'speech should cancel before replacement');
assert(!app.includes('MutationObserver'),'foundation should not use MutationObserver');
assert(!app.includes('setInterval('),'foundation should not poll');

const html=fs.readFileSync(htmlPath,'utf8');
assert(html.includes('id="lessonPicker"'),'lesson selector must exist');
assert(html.includes('Expressions'),'expression mode must exist');
assert(html.includes('Transform'),'transform mode must exist');
assert(html.includes('Open the Words'),'word mode must exist');
assert(html.includes('Meaning Chunks'),'chunk mode must exist');
assert(html.includes('Sound Lab'),'sound lab must exist');

console.log('French Structure Lab expressions + transform smoke: OK');
