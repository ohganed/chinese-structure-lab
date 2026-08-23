const fs=require('fs');
const assert=require('assert');

const indexPath='french/data/index.json';
const appPath='french/app.js';
const htmlPath='french/index.html';
const myTextPath='french/my-text.js';
const lexiconPath='french/data/lexicon/a1-core.json';
const lexemePath='french/data/lexemes/a1-core.json';
const expressionPath='french/data/expressions/a1-core.json';
const networkPath='french/data/networks/a1-related.json';

const index=JSON.parse(fs.readFileSync(indexPath,'utf8'));
assert(index.schema_version,'dataset schema_version is required');
assert(index.reference_data?.lexemes&&index.reference_data?.expressions&&index.reference_data?.related_network,'shared reference data must be indexed');
assert(Array.isArray(index.lessons)&&index.lessons.length>=4,'multi-lesson index requires at least four lessons');
for(const meta of index.lessons){assert(meta.id&&meta.path&&meta.title_ja,'lesson index items need id, title and path');assert(meta.path.startsWith('./data/'),'lesson paths must be GitHub Pages-safe relative paths');assert(fs.existsSync(`french/${meta.path.replace(/^\.\//,'')}`),`missing lesson file: ${meta.path}`);}

const lexemes=JSON.parse(fs.readFileSync(lexemePath,'utf8'));
assert(lexemes.schema_version==='1.1','shared lexeme registry needs current schema version');
assert(Array.isArray(lexemes.lexemes)&&lexemes.lexemes.length>=20,'shared lexeme registry needs useful coverage');
const lexemeIds=new Set(lexemes.lexemes.map(x=>x.id));
assert(lexemeIds.size===lexemes.lexemes.length,'shared lexeme IDs must be unique');

for(const meta of index.lessons){
  const lesson=JSON.parse(fs.readFileSync(`french/${meta.path.replace(/^\.\//,'')}`,'utf8'));
  for(const key of ['id','level','theme','sentence','translation_ja','audio','sound_groups','sound_phenomena','words','expressions','transforms','meaning_chunks','sentence_structure'])assert(Object.prototype.hasOwnProperty.call(lesson,key),`${meta.id}: missing lesson key ${key}`);
  assert(lesson.schema_version,`${meta.id}: schema_version is required`);
  assert(lesson.words.length>=4,`${meta.id}: meaningful word structure required`);
  const ids=new Set(lesson.words.map(w=>w.id));assert(ids.size===lesson.words.length,`${meta.id}: every word needs a unique id`);
  for(const word of lesson.words){assert(word.lexeme_id,`${meta.id}: every word occurrence must reference a shared lexeme`);assert(lexemeIds.has(word.lexeme_id),`${meta.id}: unknown lexeme_id ${word.lexeme_id}`);}
  for(const expression of lesson.expressions){assert(expression.id&&expression.surface&&expression.meaning_ja,`${meta.id}: expression needs id/surface/meaning`);for(const wordId of expression.word_ids||[])assert(ids.has(wordId),`${meta.id}: expression references unknown word id ${wordId}`);}
  for(const transform of lesson.transforms)assert(transform.id&&transform.target&&Array.isArray(transform.changes),`${meta.id}: transform needs id/target/changes`);
}

const lexicon=JSON.parse(fs.readFileSync(lexiconPath,'utf8'));
assert(lexicon.schema_version==='1.1','surface-form lexicon should use migrated schema');
assert(lexicon.lexeme_registry==='../lexemes/a1-core.json','surface-form lexicon must point to shared lexeme registry');
assert(Array.isArray(lexicon.entries)&&lexicon.entries.length>=20,'core lexicon needs useful verified coverage');
for(const entry of lexicon.entries){assert(entry.form&&entry.meaning_ja&&entry.confidence==='verified','lexicon entries must be verified and explicit');if(entry.lexeme_id)assert(lexemeIds.has(entry.lexeme_id),`unknown shared lexeme ${entry.lexeme_id}`);}

const expressions=JSON.parse(fs.readFileSync(expressionPath,'utf8'));
assert(expressions.schema_version==='1.0','shared expressions need schema version');
assert(Array.isArray(expressions.expressions)&&expressions.expressions.length>=5,'shared expression registry needs useful coverage');
for(const expression of expressions.expressions){assert(expression.id&&expression.surface&&Array.isArray(expression.tokens)&&expression.tokens.length>1,'shared expressions need explicit token sequences');assert(expression.confidence==='verified','shared expressions must be verified before matching');}
assert(expressions.expressions.some(x=>x.surface==='avoir une minute'&&Array.isArray(x.match_forms)),'inflected expression matching needs explicit match_forms');

const network=JSON.parse(fs.readFileSync(networkPath,'utf8'));
assert(network.schema_version==='1.0','related-word network needs schema version');
assert(network.source==='verified-curated','related-word network must identify curated source');
assert(Array.isArray(network.relations)&&network.relations.length>=5,'related-word network needs useful seed relations');
for(const relation of network.relations){assert(lexemeIds.has(relation.from),`network from lexeme missing: ${relation.from}`);assert(lexemeIds.has(relation.to),`network to lexeme missing: ${relation.to}`);assert(relation.type&&relation.note_ja&&relation.confidence==='verified','network relations need explicit typed verified notes');}

const app=fs.readFileSync(appPath,'utf8');
assert(app.includes("fetch('./data/index.json'"),'app must load the small lesson index first');
assert(app.includes('fetch(meta.path'),'app must lazy-load only the selected lesson');
assert(app.includes('URLSearchParams'),'lesson ID should be recoverable from the URL hash');
assert(app.includes('state.selectedExpression'),'expression state must be centralized');
assert(app.includes('state.openTransform'),'transform expansion state must be centralized');
assert(app.includes("const STORAGE_KEY='fsl.learning.v1'"),'learning history needs a versioned local key');
assert(app.includes('state.history.events.length>300'),'history must be bounded');
assert(app.includes('renderLearningMap'),'Learning Map renderer must exist');
assert(!app.includes('MutationObserver'),'foundation should not use MutationObserver');
assert(!app.includes('setInterval('),'foundation should not poll');

const myText=fs.readFileSync(myTextPath,'utf8');
assert(myText.includes("const MY_TEXT_KEY='fsl.mytext.v1'"),'My Text needs separate versioned local storage');
assert(myText.includes("const LEXICON_PATH='./data/lexicon/a1-core.json'"),'My Text should load the local surface-form lexicon');
assert(myText.includes("const LEXEME_PATH='./data/lexemes/a1-core.json'"),'My Text should load shared lexemes lazily');
assert(myText.includes("const EXPRESSION_PATH='./data/expressions/a1-core.json'"),'My Text should load verified expressions lazily');
assert(myText.includes('tokenizeFrench'),'My Text needs lightweight local tokenization');
assert(myText.includes('ensureReferenceData'),'My Text must load only explicit local reference data');
assert(myText.includes('findExpressionMatches'),'My Text needs deterministic multi-word expression matching');
assert(myText.includes("confidence:'unverified'"),'user text must remain unverified');
assert(myText.includes('annotations:{}'),'new My Text items need local annotation storage');
assert(myText.includes('saveTokenNote'),'token annotations must be saveable locally');
assert(myText.includes('未知の表現を推測して作りません'),'unknown expressions must not be guessed');
assert(myText.includes('現在の内蔵教材から安全に照合できる情報はありません'),'unknown words must not be guessed');
assert(myText.includes('store.items.length>100'),'My Text storage must be bounded');
assert(!myText.includes('https://'),'My Text observation must not depend on external APIs');
assert(!myText.includes('setInterval('),'My Text must not poll');

const html=fs.readFileSync(htmlPath,'utf8');
for(const label of ['Open the Words','Expressions','Meaning Chunks','Sound Lab','Transform','Learning Map','My Text'])assert(html.includes(label),`${label} must exist`);
assert(html.includes('id="myTextObserve"'),'My Text observation area must exist');

console.log('French Structure Lab occurrence→lexeme + related network smoke: OK');
