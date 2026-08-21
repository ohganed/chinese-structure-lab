const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const root=path.resolve(__dirname,'..');
const sandbox={window:{}};
vm.createContext(sandbox);
['sentence-bank.js','sentence-bank-expansion-01.js','sentence-bank-expansion-02.js','sentence-bank-expansion-03.js'].forEach(file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file}));
const bank=sandbox.window.CSLSentenceBank;
const items=bank.all();
assert.strictEqual(items.length,300,'shared curriculum must contain exactly 5x the original 60 items');
assert.strictEqual(new Set(items.map(x=>x.id)).size,300,'sentence IDs must be unique');
items.forEach(x=>{
  ['id','title','context','zh','py','ja','level'].forEach(key=>assert(x[key],x.id+' is missing '+key));
  assert(Array.isArray(x.tags)&&x.tags.length,x.id+' must have mode tags');
});
assert.strictEqual(bank.forCourse('tired').length,300,'light-day mode must reach all 300 items');
assert(bank.forCourse('listening').length>=120,'listening pool must have at least 5x a 24-line course');
assert(bank.forCourse('three-minute').length>=120,'three-minute pool must have at least 5x a 24-line course');
['tired.html','three-minute.html'].forEach(file=>{
  const html=fs.readFileSync(path.join(root,file),'utf8');
  ['sentence-bank.js','sentence-bank-expansion-01.js','sentence-bank-expansion-02.js','sentence-bank-expansion-03.js'].forEach(asset=>assert(html.includes(asset),file+' must load '+asset));
});
const three=fs.readFileSync(path.join(root,'three-minute.html'),'utf8');
assert(three.includes("['daily','food','travel','shopping','social','work','health','service','hotel','plans']"),'3-minute mode must register 20 additional routes');
console.log('curriculum expansion smoke: passed');
