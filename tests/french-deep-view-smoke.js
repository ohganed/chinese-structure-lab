const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('french/index.html','utf8');
const deep=fs.readFileSync('french/deep-view.js','utf8');
const css=fs.readFileSync('french/deep-view.css','utf8');
const index=JSON.parse(fs.readFileSync('french/data/index.json','utf8'));
const lexemes=JSON.parse(fs.readFileSync('french/data/lexemes/a1-core.json','utf8'));
const network=JSON.parse(fs.readFileSync('french/data/networks/a1-related.json','utf8'));
const occurrences=JSON.parse(fs.readFileSync('french/data/occurrences/a1-index.json','utf8'));

assert(html.includes('./deep-view.css'),'deep view stylesheet must be wired');
assert(html.includes('./deep-view.js'),'deep view module must be wired');
assert(deep.includes("event.target.closest('[data-word-index]')"),'deep view must attach from word interaction');
assert(deep.includes('data-open-lexeme-deep'),'word detail needs explicit deeper action');
assert(deep.includes('ensureDeepData'),'shared data should be lazy-loaded');
assert(deep.includes("fetch(refs.lexemes"),'lexeme registry should load only for deep view');
assert(deep.includes("fetch(refs.related_network"),'related network should load only for deep view');
assert(deep.includes("fetch(refs.occurrences"),'occurrence index should load only for deep view');
assert(deep.includes('deepStack'),'Matryoshka navigation needs an explicit stack');
assert(deep.includes('data-related-lexeme'),'related lexemes must be navigable');
assert(deep.includes('data-deep-back'),'deep navigation must provide a safe return path');
assert(deep.includes('data-occurrence-lesson'),'occurrence cards must navigate to real lessons');
assert(deep.includes('data-occurrence-lexeme')&&deep.includes('data-occurrence-word'),'occurrence navigation must preserve the exact re-encounter target');
assert(deep.includes('EXPLORATION_KEY'),'cross-lesson exploration needs isolated session state');
assert(deep.includes('sessionStorage'),'exploration state should be temporary and tab-local');
assert(deep.includes('originLessonId')&&deep.includes('originWordIndex'),'exploration must preserve a one-action route to the origin');
assert(deep.includes('targetLexemeId')&&deep.includes('targetWordId'),'exploration must preserve target focus metadata');
assert(deep.includes('data-return-origin'),'re-encounter view needs an explicit return action');
assert(deep.includes('restoreExplorationFocus'),'target lesson must restore contextual focus');
assert(deep.includes('findTargetWordIndex'),'focus must resolve the actual word occurrence safely');
assert(deep.includes('prefers-reduced-motion'),'focus scrolling must respect reduced motion');
assert(css.includes('.reencounter-focus'),'focused re-encounter needs a visible non-color-only cue');
assert(css.includes('.exploration-return'),'origin return control needs responsive styling');
assert(!deep.includes('MutationObserver'),'deep view must not use MutationObserver');
assert(!deep.includes('setInterval('),'deep view must not poll indefinitely');
assert(index.reference_data?.lexemes,'index must expose shared lexeme registry');
assert(index.reference_data?.related_network,'index must expose related-word network');
assert(index.reference_data?.occurrences,'index must expose occurrence index');

const ids=new Set(lexemes.lexemes.map(x=>x.id));
const lessonIds=new Set(index.lessons.map(x=>x.id));
for(const relation of network.relations){assert(ids.has(relation.from),`unknown relation source ${relation.from}`);assert(ids.has(relation.to),`unknown relation target ${relation.to}`);assert(relation.type&&relation.confidence==='verified','relations need typed verified metadata');}
for(const [lexemeId,items] of Object.entries(occurrences.occurrences||{})){assert(ids.has(lexemeId),`occurrence index references unknown lexeme ${lexemeId}`);assert(Array.isArray(items)&&items.length,'occurrence entries must be non-empty arrays');for(const item of items){assert(lessonIds.has(item.lesson_id),`occurrence references unknown lesson ${item.lesson_id}`);assert(item.word_id&&item.surface&&item.sentence,'occurrence needs lesson/word/surface/sentence context');}}
assert((occurrences.occurrences['lex-je']||[]).some(x=>x.lesson_id==='fr-a1-002'),'at least one lexeme should demonstrate cross-lesson re-encounter');

console.log('French Structure Lab Deep View + contextual re-encounter smoke: OK');
