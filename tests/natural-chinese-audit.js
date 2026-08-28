const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const root=path.resolve(__dirname,'..');
const sandbox={window:{}};vm.createContext(sandbox);
['fivefold-curriculum-v2.js','natural-chinese-overrides.js'].forEach(file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file}));
const api=sandbox.window.CSLFivefoldCurriculum;assert(api,'curriculum API missing');
const a1=api.all('A1'),a2=api.all('A2'),all=a1.concat(a2);
assert.strictEqual(a1.length,1248,'Natural Chinese corrections must not change A1 count');
assert.strictEqual(a2.length,240,'Natural Chinese corrections must not change A2 count');
assert.strictEqual(new Set(all.map(x=>x.id)).size,all.length,'Natural Chinese corrections must preserve unique stable IDs');
assert.strictEqual(new Set(a1.map(x=>x.zh)).size,a1.length,'A1 corrections must not create duplicate Chinese sentences');
assert.strictEqual(new Set(a2.map(x=>x.zh)).size,a2.length,'A2 corrections must not create duplicate Chinese sentences');
const bad=[
 /(?:下午|晚上)(?:起床|吃早饭|洗脸)/,
 /^这.+有便宜一点儿的吗？$/,
 /^我可以买这.+吗？$/,
 /^麻烦问一下，/,
 /没问题吗？$/,
 /我的手机被我忘在酒店了/,
 /有两个人的座位吗/,
 /^我看看。$/,
 /^请给我水。$/
];
all.forEach(x=>{
 ['zh','py','ja','context'].forEach(k=>assert(x[k]&&String(x[k]).trim(),x.id+' missing '+k));
 assert(!/[{][xpj][}]/.test(x.zh+x.py+x.ja),x.id+' contains unresolved template placeholder');
 bad.forEach(re=>assert(!re.test(x.zh),x.id+' failed naturalness rule '+re+': '+x.zh));
 assert(Array.isArray(x.words)&&x.words.length>=2,x.id+' needs useful word/chunk breakdown');
 if(/^csl-a2x-ba-/.test(x.id))assert(/了。$/.test(x.zh),x.id+' should present the completed 把 event naturally: '+x.zh);
});
function families(xs){const m={};xs.forEach(x=>{const mm=x.id.match(/^csl-a[12]x-([a-z0-9-]+)-\d+$/);const f=mm?mm[1]:'other';(m[f]||(m[f]=[])).push(x)});return m}
function report(level,xs){const fm=families(xs);console.log('\n'+level+' Natural Chinese family audit');Object.keys(fm).sort().forEach(f=>{const a=fm[f];const samples=[a[0],a[Math.floor(a.length/2)],a[a.length-1]].filter(Boolean).map(x=>x.zh);console.log(' - '+f+': '+a.length+' | '+samples.join(' / '))})}
report('A1',a1);report('A2',a2);
console.log('\nNatural Chinese Audit gate: passed — '+all.length+' expanded sentences checked.');
