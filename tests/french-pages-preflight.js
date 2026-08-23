const fs=require('fs');
const path=require('path');
const assert=require('assert');

const root='french';
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const deep=fs.readFileSync(path.join(root,'deep-view.js'),'utf8');
const myText=fs.readFileSync(path.join(root,'my-text.js'),'utf8');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const deepCss=fs.readFileSync(path.join(root,'deep-view.css'),'utf8');
const index=JSON.parse(fs.readFileSync(path.join(root,'data/index.json'),'utf8'));

assert(fs.existsSync('.nojekyll'),'repository should include .nojekyll for predictable GitHub Pages delivery');
assert(/<meta name="viewport"/.test(html),'mobile viewport meta is required');
assert(/<meta name="color-scheme"/.test(html),'light/dark browser integration is required');
assert(html.includes('./styles.css')&&html.includes('./deep-view.css'),'styles must use relative paths');
assert(html.includes('./app.js')&&html.includes('./deep-view.js')&&html.includes('./my-text.js'),'modules must use relative paths');
assert(!/(?:src|href)=["']\//.test(html),'root-absolute HTML asset paths would break repository-subpath Pages');

for(const [name,source] of Object.entries({app,deep,myText,css,deepCss})){
  assert(!/fetch\(["']\//.test(source),`${name}: root-absolute fetch would break repository-subpath Pages`);
  assert(!/url\(\s*["']?\//.test(source),`${name}: root-absolute CSS url would break repository-subpath Pages`);
}

assert(app.includes("fetch('./data/index.json'"),'app should boot from a relative lightweight index');
assert(app.includes('fetch(meta.path'),'lessons should remain lazy-loaded');
assert(app.includes("if(!('speechSynthesis'in window))return"),'audio-unavailable guard should let learning continue without speech');
assert(index.lessons.length>0,'Pages build must have at least one indexed lesson');
for(const lesson of index.lessons){assert(lesson.path.startsWith('./'),'lesson paths must be relative');assert(fs.existsSync(path.join(root,lesson.path.replace(/^\.\//,''))),`missing lesson ${lesson.path}`);}
for(const ref of Object.values(index.reference_data||{})){assert(typeof ref==='string'&&ref.startsWith('./'),'reference_data paths must be relative');assert(fs.existsSync(path.join(root,ref.replace(/^\.\//,''))),`missing reference data ${ref}`);}

assert(css.includes('@media')||deepCss.includes('@media'),'responsive CSS rules are required');
assert(css.includes('prefers-reduced-motion')||deepCss.includes('prefers-reduced-motion')||deep.includes('prefers-reduced-motion'),'reduced motion support is required');
assert(css.includes('overflow')||deepCss.includes('overflow'),'scrollable constrained panels need explicit overflow handling');

console.log('French Structure Lab GitHub Pages preflight: OK');
