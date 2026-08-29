const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..'),sandbox={window:{}};vm.createContext(sandbox);
['fivefold-curriculum-v2.js','natural-chinese-overrides.js','fivefold-english-layer.js','fivefold-english-fixes.js'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox,{filename:f}));
const api=sandbox.window.CSLFivefoldCurriculum;
for(const level of ['A1','A2']){
 const xs=api.all(level),missSent=xs.filter(x=>!x.en),missWords=new Map();
 xs.forEach(x=>(x.words||[]).forEach(w=>{if(!w.en)missWords.set(w.zh,{py:w.py,ja:w.ja})}));
 console.log('\n'+level+' MISSING SENTENCES '+missSent.length);missSent.forEach(x=>console.log('SENT '+x.id+' | '+x.zh+' | '+x.ja));
 console.log(level+' UNIQUE MISSING WORDS '+missWords.size);[...missWords].forEach(([z,v])=>console.log('MISS '+z+' | '+v.py+' | '+v.ja));
}
