const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const htmlFiles=fs.readdirSync(root).filter(f=>f.endsWith('.html')).sort();
const jsFiles=fs.readdirSync(root).filter(f=>f.endsWith('.js')).sort();
const findings=[];
function add(sev,file,type,detail){findings.push({sev,file,type,detail})}
function hasJP(s){return /[ぁ-んァ-ヶ一-龠々ー]/.test(s)}
for(const file of htmlFiles){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  const tags=text.match(/<[^>]+>/g)||[];
  for(const tag of tags){
    if(/data-ja\s*=/.test(tag)&&!/data-en\s*=/.test(tag)) add('HIGH',file,'data-ja-without-data-en',tag.slice(0,180));
    const em=tag.match(/data-en\s*=\s*(["'])(.*?)\1/); if(em&&!em[2].trim()) add('HIGH',file,'empty-data-en',tag.slice(0,180));
  }
  const supportsEN=/csl_ui_language|data-en=|mode===['"]en['"]|mode=['"]en['"]/.test(text);
  if(supportsEN){
    const body=(text.match(/<body[\s\S]*?<\/body>/i)||[''])[0]
      .replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'');
    const stripped=body.replace(/<[^>]*data-en=[^>]*>[\s\S]*?<\/[^>]+>/gi,' ')
      .replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
    if(hasJP(stripped)) add('MEDIUM',file,'hardcoded-japanese-visible-ui',stripped.match(/.{0,40}[ぁ-んァ-ヶ一-龠々ー].{0,80}/)?.[0]||stripped.slice(0,160));
  }
}
// Expanded A1/A2 data is executable and can be audited precisely.
try{
  const sandbox={window:{}}; vm.createContext(sandbox);
  ['fivefold-curriculum-v2.js','natural-chinese-overrides.js'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox,{filename:f}));
  const api=sandbox.window.CSLFivefoldCurriculum;
  if(api){
    for(const level of ['A1','A2']){
      const xs=api.all(level);
      const missing=xs.filter(x=>!x.en||!String(x.en).trim());
      if(missing.length) add('CRITICAL','fivefold-curriculum-v2.js','missing-English-curriculum-field',`${level}: ${missing.length}/${xs.length} expanded items have no en field; sample ${missing[0].id} ${missing[0].zh}`);
      const missingContext=xs.filter(x=>!x.contextEn||!String(x.contextEn).trim());
      if(missingContext.length) add('HIGH','fivefold-curriculum-v2.js','missing-English-context-field',`${level}: ${missingContext.length}/${xs.length} expanded items have no contextEn field`);
    }
  }
}catch(e){add('HIGH','fivefold-curriculum-v2.js','expanded-data-audit-error',String(e.message||e))}
// Detect obvious Japanese-only curriculum object schemas in root JS.
for(const file of jsFiles){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  if(/\bja\s*:/.test(text)&&!/\ben\s*:/.test(text)&&/(\bzh\s*:|sentence|curriculum|bank)/i.test(text)){
    add('MEDIUM',file,'ja-field-without-en-schema','Contains Japanese curriculum/gloss fields but no English field in this file.');
  }
}
const order={CRITICAL:0,HIGH:1,MEDIUM:2,LOW:3}; findings.sort((a,b)=>order[a.sev]-order[b.sev]||a.file.localeCompare(b.file));
console.log('\n=== ENGLISH MODE AUDIT ===');
console.log('HTML files scanned:',htmlFiles.length,'JS files scanned:',jsFiles.length);
const counts={}; findings.forEach(x=>counts[x.sev]=(counts[x.sev]||0)+1); console.log('Findings:',counts);
for(const f of findings) console.log(`[${f.sev}] ${f.file} :: ${f.type} :: ${f.detail}`);
console.log('=== END ENGLISH MODE AUDIT ===\n');
// Audit mode: fail only on structural critical/high defects. This makes English completeness a release gate.
const blockers=findings.filter(x=>x.sev==='CRITICAL'||x.sev==='HIGH');
if(blockers.length){console.error(`English Mode Gate failed with ${blockers.length} blocking finding(s).`);process.exit(1)}
console.log('English Mode Gate passed.');
