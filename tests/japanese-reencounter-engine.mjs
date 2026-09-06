import assert from 'node:assert/strict';
import {scoreLesson,chooseNextLesson,buildReencounterReason} from '../japanese/reencounter-engine.js';

const lessons=[
  {id:'ja-a1-001',connections:{reuses:[],prepares:['topic-ha']}},
  {id:'ja-a1-002',connections:{reuses:['topic-ha'],prepares:['object-wo']}},
  {id:'ja-a1-003',connections:{reuses:['object-wo'],prepares:['verb-masu']}}
];

const empty={};
const first=chooseNextLesson({lessons,currentIndex:0,progress:empty});
assert.equal(first.lesson.id,'ja-a1-002','nearest incomplete structural re-encounter should be preferred');

const progress={
  'ja-a1-002':{steps:['listen','words','structure','transform','rebuild','relisten'],complete:true},
  'ja-a1-003':{steps:[],complete:false}
};
const second=chooseNextLesson({lessons,currentIndex:0,progress});
assert.equal(second.lesson.id,'ja-a1-003','an incomplete lesson should outrank an already completed lesson');

const incompleteScore=scoreLesson({lesson:lessons[2],index:2,currentIndex:0,progress});
const completedScore=scoreLesson({lesson:lessons[1],index:1,currentIndex:0,progress});
assert.ok(incompleteScore>completedScore,'incomplete lesson score should be higher in this scenario');
assert.match(buildReencounterReason({lesson:lessons[2],progress}),/まだ1周していない/);

console.log('PASS Japanese re-encounter engine behavior');
