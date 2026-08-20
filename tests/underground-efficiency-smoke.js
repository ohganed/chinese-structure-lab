const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const path=require('path');
const root=path.resolve(__dirname,'..');

function testInteractiveCuesSettles(){
  let mutations=0,observerCallback=null,style=null;
  const classes=new Set();
  const classList={
    contains:name=>classes.has(name),
    toggle:(name,on)=>{const had=classes.has(name);if(on)classes.add(name);else classes.delete(name);if(had!==classes.has(name))mutations++;}
  };
  const el={disabled:false,classList,textContent:'Listen',matches:()=>true,hasAttribute:()=>false,getAttribute:()=>'',setAttribute:()=>{},getClientRects:()=>[{}]};
  const document={readyState:'complete',getElementById:id=>id==='csl-interactive-cue-style'?style:null,createElement:()=>({id:'',textContent:''}),head:{appendChild:s=>{style=s}},body:{},querySelectorAll:()=>[el]};
  const sandbox={document,window:{},MutationObserver:function(cb){observerCallback=cb;this.observe=()=>{}},getComputedStyle:()=>({display:'block',visibility:'visible'}),setTimeout:fn=>{fn();return 1},clearTimeout:()=>{}};
  sandbox.window=sandbox;
  vm.runInNewContext(fs.readFileSync(path.join(root,'interactive-cues.js'),'utf8'),sandbox,{filename:'interactive-cues.js'});
  const afterBoot=mutations;
  assert(afterBoot>0,'initial cue classes should be applied');
  observerCallback([]);
  assert.strictEqual(mutations,afterBoot,'observer refresh must not rewrite unchanged cue classes');
}

function testCrossTabStorageFilter(){
  const listeners={},scheduled=[];
  const sandbox={console,Date,Math,JSON,Object,Array,RegExp,String,Number,Boolean,isFinite,location:{pathname:'/index.html'},navigator:{},CustomEvent:function(){},clearTimeout:()=>{},setTimeout:(fn,ms)=>{scheduled.push({fn,ms});return scheduled.length}};
  sandbox.window=sandbox;
  sandbox.addEventListener=(name,fn)=>{listeners[name]=fn};
  sandbox.dispatchEvent=()=>{};
  vm.runInNewContext(fs.readFileSync(path.join(root,'underground-integration-bus.js'),'utf8'),sandbox,{filename:'underground-integration-bus.js'});
  scheduled.length=0;
  const base={schemaVersion:2,preferences:{language:'en'},progress:{sceneIndex:1},learning:{events:[]},aliases:{sentenceTextToId:{}},extensions:{audit:{version:1}}};
  const derived=JSON.parse(JSON.stringify(base));derived.extensions.audit.version=2;
  listeners.storage({key:'csl_profile_v1',oldValue:JSON.stringify(base),newValue:JSON.stringify(derived)});
  assert.strictEqual(scheduled.length,0,'derived-only storage writes must not wake another tab');
  const primaryUpdate=JSON.parse(JSON.stringify(derived));primaryUpdate.learning.events.push({id:'ev:1',type:'word_touch'});
  listeners.storage({key:'csl_profile_v1',oldValue:JSON.stringify(derived),newValue:JSON.stringify(primaryUpdate)});
  assert.strictEqual(scheduled.length,1,'primary learning changes must wake another tab once');
  listeners.storage({key:'unrelated-key',oldValue:'1',newValue:'2'});
  assert.strictEqual(scheduled.length,1,'unrelated storage keys must be ignored');
}

testInteractiveCuesSettles();
testCrossTabStorageFilter();
console.log('underground efficiency smoke: passed');
