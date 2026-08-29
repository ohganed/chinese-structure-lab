'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),sandbox={window:{}};vm.createContext(sandbox);
['sentence-bank.js','sentence-bank-expansion-01.js','sentence-bank-expansion-02.js','sentence-bank-expansion-03.js','sentence-bank-english-data.js','sentence-bank-english-layer.js'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox,{filename:f}));
const api=sandbox.window.CSLSentenceBank;assert(api,'CSLSentenceBank missing');
const all=api.all();
assert.strictEqual(all.length,300,'Shared Sentence Bank must remain exactly 300 items');
assert.strictEqual(new Set(all.map(x=>x.id)).size,300,'Sentence IDs must remain unique');
function noKana(s){return !/[ぁ-んァ-ヶ]/.test(String(s||''))}
all.forEach(x=>{
 assert(x.id&&x.zh&&x.py&&x.ja,`${x.id||'unknown'} missing canonical field`);
 assert(x.en&&String(x.en).trim(),`${x.id} missing English translation`);
 assert(x.contextEn&&String(x.contextEn).trim(),`${x.id} missing English context`);
 assert(noKana(x.en),`${x.id} English translation contains Japanese kana: ${x.en}`);
 assert(noKana(x.contextEn),`${x.id} English context contains Japanese kana: ${x.contextEn}`);
 assert(Array.isArray(x.words)&&x.words.length,`${x.id} missing words/chunks`);
 x.words.forEach((w,i)=>{
  assert(w&&typeof w==='object',`${x.id} word ${i} must be structured`);
  assert(w.zh&&w.py,`${x.id} word ${i} missing Chinese/pinyin`);
  assert(w.en&&String(w.en).trim(),`${x.id} word ${w.zh||i} missing English gloss`);
  assert(noKana(w.en),`${x.id} word ${w.zh||i} English gloss contains Japanese kana: ${w.en}`);
 });
});
const expected={
 'csl-a1-food-001':"I'd like a cup of tea.",
 'csl-a1-shop-002':"I'm just looking.",
 'csl-a1-study-104':'How do you write this character?',
 'csl-a2-service-208':'I lost my wallet.',
 'csl-a2-weather-208':'Autumn is the most comfortable season.'
};
Object.entries(expected).forEach(([id,en])=>{const x=api.get(id);assert(x,`missing regression sentence ${id}`);assert.strictEqual(x.en,en,`${id} natural English regression`)});
const data=sandbox.window.CSLSentenceBankEnglishData;assert(data&&data.version,'English data layer missing');
assert.strictEqual(Object.keys(data.sentences||{}).length,300,'English data must explicitly cover all 300 stable sentence IDs');
console.log('Shared Sentence Bank English Gate: passed — 300 sentences and all structured word/chunk glosses verified.');
