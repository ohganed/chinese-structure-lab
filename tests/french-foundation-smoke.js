const fs=require('fs');
const assert=require('assert');

const lessonPath='french/data/lessons-a1.json';
const appPath='french/app.js';
const htmlPath='french/index.html';

const lessons=JSON.parse(fs.readFileSync(lessonPath,'utf8'));
assert(Array.isArray(lessons)&&lessons.length>0,'at least one lesson is required');
const lesson=lessons[0];
for(const key of ['id','level','theme','sentence','translation_ja','audio','sound_groups','sound_phenomena','sound_reference_examples','words','meaning_chunks','sentence_structure']){
  assert(Object.prototype.hasOwnProperty.call(lesson,key),`missing lesson key: ${key}`);
}
assert(lesson.words.length>=5,'foundation lesson should expose meaningful word structure');
assert(lesson.sound_groups.length>=1,'sound groups are required');
assert(lesson.sound_phenomena.length>=3,'Sound Lab needs sentence-bound observations');
assert(lesson.sound_phenomena.some(x=>x.type==='liaison-blocked'),'non-liaison positions must be modelled, not guessed');
for(const phenomenon of lesson.sound_phenomena){
  assert(phenomenon.type&&phenomenon.span&&phenomenon.detail_ja,'sound phenomenon must have type, span and explanation');
}
assert(lesson.sound_reference_examples.some(x=>x.type==='liaison-required'),'liaison reference example is required');
assert(lesson.sound_reference_examples.some(x=>x.type==='enchaînement'),'enchaînement reference example is required');
assert(lesson.sound_reference_examples.some(x=>x.type==='elision'),'elision reference example is required');
assert(lesson.sound_reference_examples.some(x=>x.type==='schwa'),'schwa reference example is required');

const app=fs.readFileSync(appPath,'utf8');
assert(app.includes('state.drawerOpen'),'drawer state must be centralized');
assert(app.includes('state.openSound'),'Sound Lab expansion state must be centralized');
assert(app.includes('toggleSound'),'Sound Lab details must be idempotently toggled');
assert(app.includes("speechSynthesis.cancel()"),'speech should cancel before replacement');
assert(app.includes("aria-expanded"),'expansion state must be accessible');
assert(!app.includes('MutationObserver'),'foundation should not use MutationObserver');
assert(!app.includes('setInterval('),'foundation should not poll');

const html=fs.readFileSync(htmlPath,'utf8');
assert(html.includes('Open the Words'),'word mode must exist');
assert(html.includes('Meaning Chunks'),'chunk mode must exist');
assert(html.includes('Sound Lab'),'sound lab must exist');

console.log('French Structure Lab foundation + Sound Lab smoke: OK');
