/* Cognition Engine Core v1.0 — language-neutral educational primitives.
   Currently installed ONLY in Chinese Structure Lab. No external requests.
   Theory mapping is a design hypothesis; it is not a model of neurons.
*/
(function(global){
  'use strict';
  var VERSION = '1.0.0';
  var PROGRESS_KEY = 'csl_cognition_core_v1';
  var INTERVAL_DAYS = [1, 3, 7, 14, 30];
  function normalize(text, language){
    var s = String(text == null ? '' : text).normalize('NFKC').toLocaleLowerCase();
    if (language === 'zh' || language === 'ja') {
      return s.replace(/[\s\p{P}\p{S}]/gu, '');
    }
    return s.replace(/[\p{P}\p{S}]/gu, '').replace(/\s+/g,' ').trim();
  }
  function evaluate(response, acceptable, language){
    var answers = Array.isArray(acceptable) ? acceptable : [acceptable];
    var value = normalize(response, language);
    return {match: value.length>0 && answers.some(function(a){return normalize(a,language)===value}),
      empty: !value, normalized: value};
  }
  function validateLesson(lesson){
    var problems=[];
    if (!lesson || typeof lesson!=='object')return {ok:false,problems:['Not an object']};
    if (!/^[a-z0-9][a-z0-9._-]{4,79}$/.test(String(lesson.id||''))) problems.push('Invalid stable id');
    if (!/^[a-z]{2}$/.test(String(lesson.language||''))) problems.push('Invalid language code');
    ['scene','goal','question','target','contrast','structure','transfer'].forEach(function(k){
      if (!lesson[k] || typeof lesson[k]!=='object') problems.push('Missing '+k);
    });
    if (!lesson.target || !lesson.target.text) problems.push('Missing target text');
    if (!lesson.contrast || !lesson.contrast.text) problems.push('Missing contrast text');
    if (lesson.target && lesson.contrast && normalize(lesson.target.text,lesson.language)===normalize(lesson.contrast.text,lesson.language)) problems.push('Identical contrast');
    if (!lesson.transfer || !lesson.transfer.target || !lesson.transfer.target.text) problems.push('Missing transfer target');
    if (!lesson.structure || !Array.isArray(lesson.structure.chunks) || !lesson.structure.chunks.length) problems.push('Missing structure chunks');
    if (!lesson.scene || !lesson.scene.ja || !lesson.goal || !lesson.goal.ja || !lesson.question || !lesson.question.ja) problems.push('Missing Japanese semantic prompt');
    return {ok:problems.length===0,problems:problems};
  }
  function due(record, time){
    var moment = time==null?Date.now():+new Date(time);
    var stamp = record && Date.parse(record.dueAt);
    return !record || !Number.isFinite(stamp) || stamp<=moment;
  }
  function nextReview(previous, quality, time){
    if (['good','hint','again'].indexOf(quality)<0) throw new Error('Invalid review quality');
    var t = time==null ? Date.now() : +new Date(time);
    if (!Number.isFinite(t))throw new Error('Invalid timestamp');
    var old=previous && typeof previous==='object'?previous:{};
    if (quality!=='again' && !due(old,t)){
      return {scheduled:false,reason:'not-due',record:Object.assign({},old)};
    }
    var stage=Math.max(0,Math.min(5,Number(old.stage)||0)),delay;
    if (quality==='good'){
      stage=Math.min(stage+1,5);
      delay=INTERVAL_DAYS[stage-1]*86400000;
    } else if (quality==='hint'){
      stage=Math.max(0,stage-1);
      delay=86400000;
    } else {
      stage=0;delay=600000;
    }
    return {scheduled:true,record:{
      stage:stage,attempts:Math.max(0,Number(old.attempts)||0)+1,
      lastOutcome:quality,lastReviewedAt:new Date(t).toISOString(),
      dueAt:new Date(t+delay).toISOString()
    }};
  }
  function readProgress(storage){
    try{
      if (!storage || typeof storage.load!=='function')return {};
      var p=storage.load(),raw=p && p.progress && p.progress[PROGRESS_KEY];
      return raw && typeof raw==='object' && !Array.isArray(raw)?raw:{};
    }catch(e){return {}}
  }
  function recordReview(storage, lessonId, quality, data, time){
    if (!storage || typeof storage.setProgress!=='function')throw new Error('Storage unavailable');
    var all=readProgress(storage),result=nextReview(all[lessonId],quality,time);
    if (!result.scheduled)return result;
    var next=Object.assign({},all);next[lessonId]=result.record;
    storage.setProgress(PROGRESS_KEY,next);
    if (typeof storage.addEvent==='function'){
      try{storage.addEvent('cognition_review_v1',{
        lessonId:lessonId,quality:quality,dueAt:result.record.dueAt,
        stage:result.record.stage,mode:'self-report',signals:data||{}
      })}catch(e){/* progress saved even if optional event log failed */ }
    }
    return result;
  }
  function recordAttempt(storage, lessonId, step, data){
    if (!storage || typeof storage.addEvent!=='function')return false;
    try{storage.addEvent('cognition_attempt_v1',{lessonId:lessonId,step:step,signals:data||{}});return true}
    catch(e){return false}
  }
  global.CognitionCore=Object.freeze({
    version:VERSION,progressKey:PROGRESS_KEY,
    normalize:normalize,evaluate:evaluate,validateLesson:validateLesson,
    due:due,nextReview:nextReview,readProgress:readProgress,recordReview:recordReview,recordAttempt:recordAttempt
  });
})(window);
