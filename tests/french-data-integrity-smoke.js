const fs=require('fs');
const assert=require('assert');
const path=require('path');

const root='french';
const index=JSON.parse(fs.readFileSync(path.join(root,'data/index.json'),'utf8'));
const lexemes=JSON.parse(fs.readFileSync(path.join(root,'data/lexemes/a1-core.json'),'utf8'));
const occurrences=JSON.parse(fs.readFileSync(path.join(root,'data/occurrences/a1-index.json'),'utf8'));

const lessonIds=new Set(index.lessons.map(x=>x.id));
assert(lessonIds.size===index.lessons.length,'lesson IDs must be unique');
const lexemeIds=new Set(lexemes.lexemes.map(x=>x.id));
assert(lexemeIds.size===lexemes.lexemes.length,'lexeme IDs must be unique');

for(const [key,value] of Object.entries(index.reference_data||{})){
  assert(typeof value==='string'&&value.startsWith('./data/'),`reference_data.${key} must use a GitHub Pages-safe relative path`);
  assert(!value.startsWith('/'),`reference_data.${key} must not use a root absolute path`);
  assert(fs.existsSync(path.join(root,value.replace(/^\.\//,''))),`reference_data.${key} target is missing: ${value}`);
}

const lessons=new Map();
for(const meta of index.lessons){
  assert(meta.path.startsWith('./data/'),'lesson path must be relative');
  assert(!meta.path.startsWith('/'),'lesson path must not be root absolute');
  const file=path.join(root,meta.path.replace(/^\.\//,''));
  assert(fs.existsSync(file),`missing lesson file ${file}`);
  const lesson=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.strictEqual(lesson.id,meta.id,`${meta.id}: lesson file ID must match index ID`);
  lessons.set(meta.id,lesson);
}

for(const [lexemeId,items] of Object.entries(occurrences.occurrences||{})){
  assert(lexemeIds.has(lexemeId),`occurrence index contains unknown lexeme ${lexemeId}`);
  assert(Array.isArray(items)&&items.length>0,`${lexemeId}: occurrence list must be non-empty`);
  const seen=new Set();
  for(const item of items){
    assert(lessonIds.has(item.lesson_id),`${lexemeId}: unknown lesson ${item.lesson_id}`);
    const lesson=lessons.get(item.lesson_id);
    const word=(lesson.words||[]).find(w=>w.id===item.word_id);
    assert(word,`${lexemeId}: missing word ${item.word_id} in ${item.lesson_id}`);
    assert.strictEqual(word.lexeme_id,lexemeId,`${item.lesson_id}/${item.word_id}: occurrence lexeme does not match lesson word`);
    assert.strictEqual(word.surface,item.surface,`${item.lesson_id}/${item.word_id}: occurrence surface is stale`);
    assert.strictEqual(lesson.sentence,item.sentence,`${item.lesson_id}/${item.word_id}: occurrence sentence is stale`);
    const identity=`${item.lesson_id}:${item.word_id}`;
    assert(!seen.has(identity),`${lexemeId}: duplicate occurrence ${identity}`);
    seen.add(identity);
  }
}

for(const lesson of lessons.values()){
  const wordIds=new Set();
  const expressionIds=new Set();
  const transformIds=new Set();
  for(const word of lesson.words||[]){assert(word.id&&!wordIds.has(word.id),`${lesson.id}: duplicate/missing word id ${word.id}`);wordIds.add(word.id);assert(lexemeIds.has(word.lexeme_id),`${lesson.id}/${word.id}: unknown lexeme ${word.lexeme_id}`);}
  for(const expression of lesson.expressions||[]){assert(expression.id&&!expressionIds.has(expression.id),`${lesson.id}: duplicate/missing expression id ${expression.id}`);expressionIds.add(expression.id);for(const wordId of expression.word_ids||[])assert(wordIds.has(wordId),`${lesson.id}/${expression.id}: unknown word_id ${wordId}`);}
  for(const transform of lesson.transforms||[]){assert(transform.id&&!transformIds.has(transform.id),`${lesson.id}: duplicate/missing transform id ${transform.id}`);transformIds.add(transform.id);assert(Array.isArray(transform.changes),`${lesson.id}/${transform.id}: changes must be an array`);}
}

const publicFiles=['index.html','app.js','my-text.js','deep-view.js','styles.css','deep-view.css'];
for(const relative of publicFiles){
  const text=fs.readFileSync(path.join(root,relative),'utf8');
  assert(!/(?:src|href|fetch)\s*\(?\s*['\"]\/(?!\/)/.test(text),`${relative}: root-absolute app path detected; GitHub Pages subpath may break`);
}

console.log('French Structure Lab data integrity + GitHub Pages path smoke: OK');
