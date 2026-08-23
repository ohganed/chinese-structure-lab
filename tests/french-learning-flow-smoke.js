const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('french/index.html','utf8');
const flow=fs.readFileSync('french/learning-flow.js','utf8');

for(const mode of ['listen','words','chunks','structure','sound']){
  assert(html.includes(`data-flow-mode="${mode}"`),`flow guide missing ${mode}`);
  assert(html.includes(`data-mode="${mode}"`),`target mode missing ${mode}`);
}
assert(html.includes('./learning-flow.js'),'learning flow module must be loaded with a relative path');
assert(flow.includes("target.click()"),'flow guide should delegate to the existing mode controls rather than duplicate mode logic');
assert(flow.includes("aria-current"),'current observation step should be exposed accessibly');
assert(!flow.includes('MutationObserver'),'learning flow must not add background DOM observation');
assert(!flow.includes('setInterval('),'learning flow must not poll');

console.log('French Structure Lab learning flow smoke: OK');
