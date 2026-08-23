const fs=require('fs');
const assert=require('assert');

const indexPath='french/data/index.json';
const appPath='french/app.js';
const htmlPath='french/index.html';
const myTextPath='french/my-text.js';

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
  for(const key of ['id','level','theme','sentence','translation_ja','audio','sound_groups','sound_phenomena','words','expressions','transforms','meaning_chunks','sentence_structure'])assert(Object.prototype.hasOwnProperty.call(lesson,key),`${meta.id}: missing lesson key ${key}`);
  assert(lesson.schema_version,`${meta.id}: schema_version is required`);
  assert(lesson.words.length>=4,`${meta.id}: meaningful word structure required`);
  const ids=new Set(lesson.words.map(w=>w.id));assert(ids.size===lesson.words.length,`${meta.id}: every word needs a unique id`);
  for(const expression of lesson.expressions){assert(expression.id&&expression.surface&&expression.meaning_ja,`${meta.id}: expression needs id/surface/meaning`);for(const wordId of expression.word_ids||[])assert(ids.has(wordId),`${meta.id}: expression references unknown word id ${wordId}`);}
  for(const transform of lesson.transforms)assert(transform.id&&transform.target&&Array.isArray(transform.changes),`${meta.id}: transform needs id/target/changes`);
}

const app=fs.readFileSync(appPath,'utf8');
assert(app.includes("fetch('./data/index.json'"),'app must load the small lesson index first');
assert(app.includes('fetch(meta.path'),'app must lazy-load only the selected lesson');
assert(app.includes('URLSearchParams'),'lesson ID should be recoverable from the URL hash');
assert(app.includes('state.selectedExpression'),'expression state must be centralized');
assert(app.includes('state.openTransform'),'transform expansion state must be centralized');
assert(app.includes("const STORAGE_KEY='fsl.learning.v1'"),'learning history needs a versioned local key');
assert(app.includes('state.history.events.length>300'),'history must be bounded');
assert(app.includes('renderLearningMap'),'Learning Map renderer must exist');
assert(app.includes("speechSynthesis.cancel()"),'speech should cancel before replacement');
assert(!app.includes('MutationObserver'),'foundation should not use MutationObserver');
assert(!app.includes('setInterval('),'foundation should not poll');

const html=fs.readFileSync(htmlPath,'utf8');
for(const label of ['Open the Words','Expressions','Meaning Chunks','Sound Lab','Transform','Learning Map','My Text'])assert(html.includes(label),`${label} must exist`);
assert(html.includes('id="myTextInput"'),'My Text input must exist');
assert(html.includes('id="importMyText"'),'My Text JSON import must exist');
assert(html.includes('id="exportMyText"'),'My Text JSON export must exist');
assert(html.includes('src="./my-text.js"'),'My Text module must load by relative path');

const myText=fs.readFileSync(myTextPath,'utf8');
assert(myText.includes("const MY_TEXT_KEY='fsl.mytext.v1'"),'My Text needs a separate versioned local key');
assert(myText.includes("source:'user'"),'My Text must stay distinct from built-in lessons');
assert(myText.includes("confidence:'unverified'"),'user/imported text must not be marked verified');
assert(myText.includes('store.items.length>100'),'My Text storage must be bounded');
assert(myText.includes('JSON.parse(await file.text())'),'JSON import must parse locally');
assert(myText.includes("kind:'french-structure-lab-my-text'"),'JSON export needs an identifiable kind');
assert(myText.includes('URL.createObjectURL'),'JSON export should be client-side only');
assert(!myText.includes('fetch('),'My Text must not depend on an external API');
assert(!myText.includes('setInterval('),'My Text must not poll');

console.log('French Structure Lab My Text + JSON transfer smoke: OK');
