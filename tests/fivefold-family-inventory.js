const fs=require('fs');
const vm=require('vm');
const path=require('path');
const root=path.resolve(__dirname,'..');
const sandbox={window:{}};vm.createContext(sandbox);
['fivefold-curriculum-v2.js','natural-chinese-overrides.js'].forEach(file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file}));
const api=sandbox.window.CSLFivefoldCurriculum;
if(!api)throw new Error('CSLFivefoldCurriculum missing');
function family(id){const m=String(id).match(/^csl-a[12]x-([a-z0-9-]+)-\d+$/);return m?m[1]:'other'}
function report(level){
 const items=api.all(level),map={};
 items.forEach(x=>(map[family(x.id)]||(map[family(x.id)]=[])).push(x));
 console.log('\n'+level+' FAMILY INVENTORY — '+items.length+' items');
 Object.keys(map).sort().forEach(k=>{
  const a=map[k],ix=[0,Math.floor(a.length/2),a.length-1];
  console.log('FAMILY '+k+' COUNT '+a.length);
  ix.forEach(i=>{const x=a[i];console.log('  '+x.id+' | '+x.zh+' | '+x.py+' | '+x.ja+' | context='+x.context)});
 });
}
report('A1');report('A2');
