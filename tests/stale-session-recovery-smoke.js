const fs=require('fs'),vm=require('vm');
const code=fs.readFileSync('stale-session-recovery.js','utf8');
function run(ageHours){
 const store={};const events=[{id:'x1',at:new Date(Date.now()-ageHours*3600000).toISOString(),type:'word_touch',data:{word:'要'}}];
 store.csl_light_event_queue_v1=JSON.stringify(events);
 let analyzed=0,complete=0;
 const listeners={};
 const ctx={console,setTimeout:(fn)=>{fn();return 1},clearTimeout:()=>{},Date,Promise,CustomEvent:function(name,o){this.type=name;this.detail=o&&o.detail},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}},window:null};
 ctx.window=ctx;ctx.addEventListener=(n,f)=>{(listeners[n]||(listeners[n]=[])).push(f)};ctx.dispatchEvent=e=>{if(e.type==='csl:stale-session-recovery-complete')complete++;(listeners[e.type]||[]).forEach(f=>f(e));return true};
 ctx.CSLStorage={load:()=>({learning:{events:[],sessions:[]},extensions:{}}),save:p=>p};
 ctx.CSLLightEventBuffer={peek:()=>events.slice(),flush:()=>true};
 ctx.CSLSessionEndAnalyzer={analyze:(meta)=>{analyzed++;if(meta.reason!=='inactivity-12h')throw new Error('wrong reason');return Promise.resolve({ok:true,meta})}};
 vm.createContext(ctx);vm.runInContext(code,ctx);
 return new Promise(r=>setImmediate(()=>r({analyzed,complete,policy:ctx.CSLStaleSessionRecovery.policy,threshold:ctx.CSLStaleSessionRecovery.thresholdMs})));
}
(async()=>{
 const stale=await run(13),fresh=await run(11);
 if(stale.analyzed!==1)throw new Error('13-hour stale session must be analyzed exactly once');
 if(stale.complete!==1)throw new Error('stale recovery must emit completion');
 if(fresh.analyzed!==0)throw new Error('11-hour session must not auto-finalize');
 if(stale.threshold!==12*60*60*1000)throw new Error('threshold must be exactly 12 hours');
 if(!stale.policy.visitTriggered||!stale.policy.noBackgroundTimer||!stale.policy.preservesRawHistory||!stale.policy.lazyLoadsMinimalRuntime)throw new Error('recovery policy mismatch');
 console.log('Stale session recovery smoke passed: 13h recovers once, 11h stays open, threshold=12h.');
})().catch(e=>{console.error(e);process.exit(1)});
