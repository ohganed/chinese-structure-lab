'use strict';
const fs=require('fs');
function read(p){return fs.readFileSync(p,'utf8')}
const tired=read('tired.html');
const word=read('word-touch-engine.js');
const buffer=read('light-event-buffer.js');
const workflow=read('.github/workflows/apply-situation-layer.yml');
function need(ok,msg){if(!ok){console.error('FAIL:',msg);process.exitCode=1}}
need(tired.includes('light-event-buffer.js'),'Light Day must use the light event buffer');
need(tired.includes('word-touch-engine.js'),'Light Day must load Word Touch Engine');
need(!tired.includes('<script src="./storage-core.js"></script>'),'Light Day must not eagerly load canonical storage');
need(!tired.includes('learning-memory-engine.js'),'Light Day must not eagerly load underground engines');
need(!tired.includes('underground-integration-bus.js'),'Light Day must stay outside the full underground runtime');
need(workflow.includes("fast_path_pages={'tired.html'}"),'Workflow must preserve the Light Day fast-path exemption');
need(word.includes('Chinese only -> tap: immediate speech + pinyin -> tap: meaning -> tap: Chinese only'),'Word Touch three-step contract must remain explicit');
need(word.includes('synth.speak(u);'),'Speech must be invoked directly by the touch path');
need(buffer.includes("KEY='csl_light_event_queue_v1'"),'Buffered events must have a durable queue');
need(buffer.includes('if(!window.CSLStorage||!CSLStorage.load||!CSLStorage.save)return false'),'Buffer must preserve events when canonical storage is unavailable');
// Regression guard: do not reintroduce timed canonical-storage startup during learning.
need(!/setTimeout\(function\(\)\{if\(!document\.hidden\)ensureStorageAndFlush\(\)\},\s*15000\)/.test(tired),'Do not start canonical storage automatically 15 seconds into a Light Day session');
if(!process.exitCode)console.log('Light Day fast-path smoke checks passed.');
