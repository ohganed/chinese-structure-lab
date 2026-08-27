'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const root=path.resolve(__dirname,'..');
const sandbox={window:{}};
vm.createContext(sandbox);
['sentence-bank.js','sentence-bank-expansion-01.js','sentence-bank-expansion-02.js','sentence-bank-expansion-03.js'].forEach(file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file}));
const items=sandbox.window.CSLSentenceBank.all();
const corpus=items.map(x=>x.zh).join('\n');

// Known unnatural / misleading forms found in prior pedagogical audits.
// This is a regression gate, not a claim that these are the only possible issues.
const forbidden=[
  '我的手机被我忘在酒店了。',
  '有两个人的座位吗？',
  '请给我水。',
  '所以我回家的时候已经很晚了。',
  '有些人喜欢先听很多。',
  '幸好我重要的资料都有备份。',
  '公众对风险的感受',
  '相反，它往往是更负责任判断的起点。',
  '成熟的语言能力，包含知道什么时候不把话说满。',
  '好的论证不是把反对意见藏起来，而是把它处理掉。',
  '所谓“常识”，常常只是某个时代习惯了的看法。'
];
for(const bad of forbidden){
  assert(!corpus.includes(bad),'Known unnatural Chinese has re-entered the shared bank: '+bad);
}

// Quality floor for shared learning assets.
for(const x of items){
  assert(/[\u3400-\u9fff]/.test(x.zh),x.id+' must contain Chinese characters');
  assert(typeof x.py==='string'&&x.py.trim().length>0,x.id+' must have pinyin');
  assert(typeof x.ja==='string'&&x.ja.trim().length>0,x.id+' must have Japanese meaning');
  assert(Array.isArray(x.words)&&x.words.length>0,x.id+' must identify at least one reusable word/chunk');
  for(const w of x.words){
    assert(w.includes(' · '),x.id+' word/chunk metadata must keep the `Chinese pinyin · meaning` contract: '+w);
  }
}
console.log('Natural Chinese regression gate: passed for '+items.length+' shared sentences.');
