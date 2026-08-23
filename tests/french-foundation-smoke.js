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
  for(const key of ['id','level','theme','sentence','translation_ja','audio','sound_groups','sound_phenomena','words','meaning_chunks','sentence_structure']){
    assert(Object.prototype.hasOwnProperty.call(lesson,key),`${meta.id}: missing lesson key ${key}`);
  }
  assert(lesson.schema_version,`${meta.id}: schema_version is required`);
  assert(lesson.words.length>=4,`${meta.id}: meaningful word structure required`);
}

const app=fs.readFileSync(appPath,'utf8');
assert(app.includes("fetch('./data/index.json'"),'app must load the small lesson index first');
assert(app.includes('fetch(meta.path'),'app must lazy-load only the selected lesson');
assert(app.includes('URLSearchParams'),'lesson ID should be recoverable from the URL hash');
assert(app.includes('moveLesson'),'previous/next lesson navigation must exist');
assert(app.includes('lessonPicker'),'lesson picker must be wired');
assert(app.includes('state.drawerOpen'),'drawer state must be centralized');
assert(app.includes('state.openSound'),'Sound Lab expansion state must be centralized');
assert(app.includes("speechSynthesis.cancel()"),'speech should cancel before replacement');
assert(!app.includes('MutationObserver'),'foundation should not use MutationObserver');
assert(!app.includes('setInterval('),'foundation should not poll');

const html=fs.readFileSync(htmlPath,'utf8');
assert(html.includes('id="lessonPicker"'),'lesson selector must exist');
assert(html.includes('id="prevLesson"'),'previous lesson control must exist');
assert(html.includes('id="nextLesson"'),'next lesson control must exist');
assert(html.includes('Open the Words'),'word mode must exist');
assert(html.includes('Meaning Chunks'),'chunk mode must exist');
assert(html.includes('Sound Lab'),'sound lab must exist');

console.log('French Structure Lab multi-lesson GitHub Pages smoke: OK');
