const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const htmlFiles=fs.readdirSync(root).filter(f=>f.endsWith('.html')).sort();
const jsFiles=fs.readdirSync(root).filter(f=>f.endsWith('.js')).sort();
const findings=[];
function add(sev,file,type,detail){findings.push({sev,file,type,detail})}
function hasJP(s){return /[ぁ-んァ-ヶ]/.test(s)}
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
    if(hasJP(stripped)) add('MEDIUM',file,'hardcoded-japanese-visible-ui',stripped.match(/.{0,40}[ぁ-んァ-ヶ].{0,80}/)?.[0]||stripped.slice(0,160));
  }
}
try{
  const sandbox={window:{}}; vm.createContext(sandbox);
  ['fivefold-curriculum-v2.js','natural-chinese-overrides.js','fivefold-english-layer.js','fivefold-english-fixes.js'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),sandbox,{filename:f}));
  const api=sandbox.window.CSLFivefoldCurriculum;
  if(api){
    for(const level of ['A1','A2']){
      const xs=api.all(level);
      const missing=xs.filter(x=>!x.en||!String(x.en).trim());
      if(missing.length) add('CRITICAL','fivefold-english-layer.js','missing-English-curriculum-field',`${level}: ${missing.length}/${xs.length} expanded items have no en field; sample ${missing[0].id} ${missing[0].zh}`);
      const pending=xs.filter(x=>/unavailable|pending|TODO/i.test(String(x.en||'')));
      if(pending.length) add('CRITICAL','fivefold-english-layer.js','placeholder-English-curriculum-field',`${level}: ${pending.length} expanded items contain placeholder English`);
      const japanese=xs.filter(x=>hasJP(String(x.en||'')));
      if(japanese.length) add('HIGH','fivefold-english-layer.js','Japanese-in-English-field',`${level}: ${japanese.length} English translations contain Japanese kana; sample ${japanese[0].id}`);
      const missingContext=xs.filter(x=>!x.contextEn||!String(x.contextEn).trim());
      if(missingContext.length) add('HIGH','fivefold-english-layer.js','missing-English-context-field',`${level}: ${missingContext.length}/${xs.length} expanded items have no contextEn field`);
      const wordMissing=[];xs.forEach(x=>(x.words||[]).forEach(w=>{if(!w||typeof w!=='object'||!w.en||!String(w.en).trim())wordMissing.push({x,w})}));
      if(wordMissing.length) add('HIGH','fivefold-english-layer.js','missing-English-word-gloss',`${level}: ${wordMissing.length} word/chunk objects lack English; sample ${wordMissing[0].x.id} ${(wordMissing[0].w&&wordMissing[0].w.zh)||wordMissing[0].w}`);
    }
    const checks={
      'csl-a1x-requests-002':/I'd like|Could I have/i,
      'csl-a1x-shopping-096':/I'll take this charger\./,
      'csl-a2x-experience-001':/I've been to Beijing\./,
      'csl-a2x-ba-001':/I closed the door\./,
      'csl-a2x-if-then-001':/If I have time, I will go exercise\./,
      'csl-a2x-plans-001':/planning to go to Beijing tomorrow/i,
      'csl-a2x-plans-002':/planning to see a friend tomorrow/i,
      'csl-a2x-plans-045':/planning to study Chinese next month/i
    };
    Object.entries(checks).forEach(([id,re])=>{var x=api.get?api.get(id):api.all().find(y=>y.id===id);if(!x||!re.test(x.en||''))add('HIGH','fivefold-english-layer.js','natural-English-regression',id+' => '+(x&&x.en))});
  }
}catch(e){add('HIGH','fivefold-english-layer.js','expanded-data-audit-error',String(e.message||e))}
for(const file of jsFiles){
  if(file==='fivefold-curriculum-v2.js')continue;
  const text=fs.readFileSync(path.join(root,file),'utf8');
  if(/\bja\s*:/.test(text)&&!/\ben\s*:/.test(text)&&/(\bzh\s*:|sentence|curriculum|bank)/i.test(text)) add('MEDIUM',file,'ja-field-without-en-schema','Contains Japanese curriculum/gloss fields but no English field in this file.');
}
const order={CRITICAL:0,HIGH:1,MEDIUM:2,LOW:3}; findings.sort((a,b)=>order[a.sev]-order[b.sev]||a.file.localeCompare(b.file));
console.log('\n=== ENGLISH MODE AUDIT ===');
console.log('HTML files scanned:',htmlFiles.length,'JS files scanned:',jsFiles.length);
const counts={}; findings.forEach(x=>counts[x.sev]=(counts[x.sev]||0)+1); console.log('Findings:',counts);
for(const f of findings) console.log(`[${f.sev}] ${f.file} :: ${f.type} :: ${f.detail}`);
console.log('=== END ENGLISH MODE AUDIT ===\n');
const blockers=findings.filter(x=>x.sev==='CRITICAL'||x.sev==='HIGH');
if(blockers.length){console.error(`English Mode Gate failed with ${blockers.length} blocking finding(s).`);process.exit(1)}
console.log('English Mode Gate passed.');
