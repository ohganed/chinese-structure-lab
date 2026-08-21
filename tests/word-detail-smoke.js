const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const source=fs.readFileSync(path.resolve(__dirname,'../curriculum-pedagogy-layer.js'),'utf8');
let ready=null,click=null,timers=[];
const document={
  readyState:'loading',
  documentElement:{dataset:{}},
  addEventListener:(type,fn,capture)=>{if(type==='DOMContentLoaded')ready=fn;if(type==='click'){click=fn;assert.strictEqual(capture,true,'word details must use one capture listener so inline audio remains intact')}},
  getElementById:()=>null,
  createElement:()=>({}),
  querySelectorAll:()=>[],
  head:{appendChild:()=>{}}
};
const sandbox={window:{},document,location:{pathname:'/food.html'},setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout:()=>{},SpeechSynthesisUtterance:function(){}};
sandbox.window=sandbox;
vm.runInNewContext(source,sandbox,{filename:'curriculum-pedagogy-layer.js'});
assert(ready,'layer must wait for DOM readiness');
ready();
assert(click,'one delegated word-detail listener must be installed');
assert.strictEqual(document.documentElement.dataset.cslWordDetails,'1','listener installation must be idempotently marked');
assert.strictEqual(timers.length,3,'only the existing bounded pedagogy refreshes may be scheduled');
assert.strictEqual(sandbox.CSLCurriculumPedagogy.version,2);
assert(sandbox.CSLCurriculumPedagogy.wordNotes>=25,'common grammar words need curated explanations');
assert(!source.includes('new MutationObserver'),'word details must not add another page observer');
console.log('word detail smoke: passed');
