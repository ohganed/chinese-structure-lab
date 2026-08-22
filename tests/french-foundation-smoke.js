const fs=require('fs');
const assert=require('assert');

const lessonPath='french/data/lessons-a1.json';
const appPath='french/app.js';
const htmlPath='french/index.html';

const lessons=JSON.parse(fs.readFileSync(lessonPath,'utf8'));
assert(Array.isArray(lessons)&&lessons.length>0,'at least one lesson is required');
const lesson=lessons[0];
for(const key of ['id','level','theme','sentence','translation_ja','audio','sound_groups','words','meaning_chunks','sentence_structure']){
  assert(Object.prototype.hasOwnProperty.call(lesson,key),`missing lesson key: ${key}`);
}
assert(lesson.words.length>=5,'foundation lesson should expose meaningful word structure');
assert(lesson.sound_groups.length>=1,'sound groups are required');

const app=fs.readFileSync(appPath,'utf8');
assert(app.includes('state.drawerOpen'),'drawer state must be centralized');
assert(app.includes("speechSynthesis.cancel()"),'speech should cancel before replacement');
assert(app.includes("aria-expanded"),'word expansion state must be accessible');
assert(!app.includes('MutationObserver'),'foundation should not use MutationObserver');
assert(!app.includes('setInterval('),'foundation should not poll');

const html=fs.readFileSync(htmlPath,'utf8');
assert(html.includes('Open the Words'),'word mode must exist');
assert(html.includes('Meaning Chunks'),'chunk mode must exist');
assert(html.includes('Sound Lab'),'sound lab must exist');

console.log('French Structure Lab foundation smoke: OK');
