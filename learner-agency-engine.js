(function(){
'use strict';
/* Learner Agency Engine v1
   Repeated learner-initiated choices outrank adaptive guesses.
   Observes preference signals; never treats them as ability or permanent identity. */
var VERSION=1,EXT='learnerAgencyV1';
function S(){return window.CSLStorage||null}function now(){return new Date().toISOString()}function safe(f){try{return f()}catch(e){return null}}
function classify(e){var t=((e&&e.type)||'').toLowerCase(),d=e&&e.data||{};return{
 audio:/audio|listen|natural|slow|pronun/.test(t),
 meaning:/meaning|translation|gloss/.test(t),
 pinyin:/pinyin/.test(t),
 structure:/structure|grammar|chunk|word|detail|explain/.test(t),
 dismiss:/close|hide|dismiss|collapse/.test(t),
 explicit:!!(d.userInitiated||d.learnerInitiated||d.explicitChoice)
}}
function build(){var p=safe(function(){return S()&&S().load()});var es=p&&p.learning&&p.learning.events||[],c={audio:0,meaning:0,pinyin:0,structure:0,dismiss:0},explicit=0;es.forEach(function(e){var x=classify(e);Object.keys(c).forEach(function(k){if(x[k])c[k]++});if(x.explicit)explicit++});var total=Math.max(1,es.length),prefs={};Object.keys(c).forEach(function(k){var n=c[k],strength=Math.min(1,n/8);prefs[k]={observations:n,strength:strength,signal:n>=5?'repeated':n>=2?'emerging':'insufficient'}});return{version:VERSION,builtAt:now(),observations:es.length,explicitChoices:explicit,preferences:prefs,policy:{learnerChoiceOutranksInference:true,preferencesAreRevisable:true,neverAbility:true,neverPermanentIdentity:true,learnerInitiatedDoesNotSpendInterventionBudget:true},guidance:{audio:prefs.audio.signal==='repeated'?'keep audio easy to reach':'no strong preference',meaning:prefs.meaning.signal==='repeated'?'keep meaning easy to reach':'no strong preference',pinyin:prefs.pinyin.signal==='repeated'?'keep pinyin easy to reach':'no strong preference',structure:prefs.structure.signal==='repeated'?'keep deeper explanation easy to reach':'no strong preference'}}}
function save(g){var s=S();if(!s||!s.load||!s.save)return g;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=g;s.save(p);return g}function get(){return save(build())}function prefers(k){var g=get(),x=g.preferences[k];return !!(x&&x.signal==='repeated')}
window.CSLLearnerAgency={version:VERSION,get:get,refresh:get,prefers:prefers};setTimeout(function(){try{var g=get();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('learner-agency-ready',{version:VERSION,observations:g.observations})}catch(e){}},3850);
})();