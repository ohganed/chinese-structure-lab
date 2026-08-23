const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('french/index.html','utf8');
const deep=fs.readFileSync('french/deep-view.js','utf8');
const index=JSON.parse(fs.readFileSync('french/data/index.json','utf8'));
const lexemes=JSON.parse(fs.readFileSync('french/data/lexemes/a1-core.json','utf8'));
const network=JSON.parse(fs.readFileSync('french/data/networks/a1-related.json','utf8'));

assert(html.includes('./deep-view.css'),'deep view stylesheet must be wired');
assert(html.includes('./deep-view.js'),'deep view module must be wired');
assert(deep.includes("event.target.closest('[data-word-index]')"),'deep view must attach from word interaction');
assert(deep.includes('data-open-lexeme-deep'),'word detail needs explicit deeper action');
assert(deep.includes('ensureDeepData'),'shared lexeme/network data should be lazy-loaded');
assert(deep.includes("fetch(refs.lexemes"),'lexeme registry should load only for deep view');
assert(deep.includes("fetch(refs.related_words"),'related network should load only for deep view');
assert(deep.includes('deepStack'),'Matryoshka navigation needs an explicit stack');
assert(deep.includes('data-related-lexeme'),'related lexemes must be navigable');
assert(deep.includes('data-deep-back'),'deep navigation must provide a safe return path');
assert(!deep.includes('MutationObserver'),'deep view must not use MutationObserver');
assert(!deep.includes('setInterval('),'deep view must not poll');
assert(index.reference_data?.lexemes,'index must expose shared lexeme registry');
assert(index.reference_data?.related_words,'index must expose related-word network');
const ids=new Set(lexemes.lexemes.map(x=>x.id));
for(const relation of network.relations){assert(ids.has(relation.from),`unknown relation source ${relation.from}`);assert(ids.has(relation.to),`unknown relation target ${relation.to}`);assert(relation.type&&relation.confidence==='verified','relations need typed verified metadata');}
console.log('French Structure Lab lazy Matryoshka deep view smoke: OK');
