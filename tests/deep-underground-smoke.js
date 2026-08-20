'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
let profile={schemaVersion:2,createdAt:'2026-08-01T00:00:00Z',updatedAt:'2026-08-20T00:00:00Z',preferences:{},progress:{sceneIndex:2},learning:{sentences:{s1:{id:'s1',legacyText:'你好。',encounters:2,fuzzy:false,extras:{}},s2:{id:'s2',legacyText:'我要一杯茶。',encounters:1,fuzzy:false,extras:{}}},sessions:[],events:[
 {id:'e1',type:'word_touch',at:'2026-08-20T00:00:00.000Z',data:{word:'你好',sentenceId:'s1',sentence:'你好。',page:'index.html'}},
 {id:'e2',type:'word_touch',at:'2026-08-20T00:00:00.400Z',data:{word:'你好',sentenceId:'s1',sentence:'你好。',page:'index.html'}},
 {id:'e3',type:'audio_played',at:'2026-08-20T00:00:01.000Z',data:{sentenceId:'s1',sentence:'你好。',page:'index.html',rateBand:'slow'}},
 {id:'e4',type:'pinyin_toggled',at:'2026-08-20T00:00:02.000Z',data:{sentenceId:'s1',sentence:'你好。',page:'index.html'}},
 {id:'e5',type:'meaning_revealed',at:'2026-08-20T00:00:03.000Z',data:{sentenceId:'s1',sentence:'你好。',page:'index.html'}},
 {id:'e6',type:'structure_opened',at:'2026-08-20T00:00:04.000Z',data:{sentenceId:'s1',sentence:'你好。',page:'index.html'}},
 {id:'e7',type:'scene_changed',at:'2026-08-20T00:00:05.000Z',data:{page:'index.html'}},
 {id:'e8',type:'natural_reencounter',at:'2026-08-20T00:00:06.000Z',data:{sentenceId:'s2',sentence:'我要一杯茶。',page:'food.html'}}
]},aliases:{sentenceTextToId:{}},sync:{deviceId:'test-device',devices:{}},extensions:{}};
const sandbox={console,Date,Math,JSON,Object,Array,RegExp,String,Number,Boolean,isFinite,setTimeout:()=>0,clearTimeout:()=>{},CustomEvent:function(name,o){this.type=name;this.detail=o&&o.detail},navigator:{},location:{pathname:'/index.html'}};
sandbox.window=sandbox;sandbox.addEventListener=()=>{};sandbox.dispatchEvent=()=>{};
sandbox.CSLStorage={load:()=>profile,save:x=>(profile=x),exportData:()=>JSON.stringify(profile),mergeProfile:()=>profile};
sandbox.CSLPlatform={emit:()=>{},capabilities:()=>({persistentKV:true})};
const simple=['CSLAudio','CSLLearnerModel','CSLReencounterPlanner','CSLSituationGraph','CSLPersistentWorld','CSLLanguageGraph','CSLMeaningSenseGraph','CSLEncounterQuality','CSLRetrievalNeed','CSLOpportunityMatching','CSLAdaptivePresentation','CSLPresentationPolicy','CSLEvidenceConfidence','CSLInterventionBudget','CSLLearnerAgency','CSLLearningRhythm','CSLCognitiveLoadGuard','CSLCounterfactualSimulator','CSLInteractionLedger'];
simple.forEach(k=>sandbox[k]={get:()=>({}),status:()=>({budget:{remaining:2}}),snapshot:()=>({})});
sandbox.CSLLearningMemory={get:()=>({words:{'你好':{count:2}},constructions:{'keyi-ma':{count:1}}})};
vm.createContext(sandbox);
function load(path){vm.runInContext(fs.readFileSync(path,'utf8'),sandbox,{filename:path})}
['temporal-pattern-engine.js','support-regulation-engine.js','curriculum-balance-engine.js','continuity-resilience-engine.js','underground-floor-registry.js','deep-underground-orchestrator.js','underground-constitution.js'].forEach(load);
const temporal=sandbox.CSLTemporalPattern.get();
assert.strictEqual(temporal.floors[25].duplicatesSuppressed,1,'floor 25 should suppress duplicate derived evidence');
assert.strictEqual(sandbox.CSLUndergroundFloors.list().length,50,'registry should contain exactly 50 floors');
assert.strictEqual(sandbox.CSLUndergroundFloors.health().total,50);
assert.strictEqual(sandbox.CSLUndergroundFloors.health().complete,true,'all 50 floor owners should be available');
const deep=sandbox.CSLDeepUnderground.get();
assert.strictEqual(deep.floors[49].status,'healthy');
assert.strictEqual(sandbox.CSLUndergroundConstitution.get().action,'PROCEED_QUIETLY');
profile.learning.events.push({id:'e9',type:'answer',at:'2026-08-20T00:00:07.000Z',data:{score:100}});
const frozen=sandbox.CSLUndergroundConstitution.get();
assert.strictEqual(frozen.action,'FREEZE_ADAPTATION','privacy invariant should freeze adaptation');
sandbox.CSLEvidenceConfidence={get:()=>({permission:'bounded-adaptation',confidence:{overall:.8}})};
sandbox.CSLInterventionBudget={status:()=>({budget:{remaining:2}})};
sandbox.CSLLearnerAgency={get:()=>({guidance:{}})};
sandbox.CSLLearningRhythm={get:()=>({mode:'receptive'})};
sandbox.CSLCognitiveLoadGuard={get:()=>({band:'low'})};
sandbox.CSLOpportunityMatching={get:()=>({recommendations:[{id:'x'}]})};
sandbox.CSLQualityAuditor={get:()=>({status:'healthy'})};
load('underground-governor.js');
const governed=sandbox.CSLUndergroundGovernor.decide();
assert.strictEqual(governed.action,'DO_NOTHING');
assert.ok(governed.reasons.includes('constitution-freeze'));
load('underground-integration-bus.js');
const integrated=sandbox.CSLUndergroundIntegration.run('smoke');
assert.strictEqual(integrated.decision.action,'DO_NOTHING');
assert.ok(integrated.snapshot.deep&&integrated.snapshot.constitution,'integration bus should carry floors 48-50');
assert.ok(integrated.deepSupportApplied,'integration bus should normalize floors 30-35 into presentation advice');
console.log('deep underground floors 24-50 smoke: passed');
