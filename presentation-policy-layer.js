(function(){
'use strict';
/* Presentation Policy Layer v1
   Safely translates Adaptive Presentation proposals into UI hints.
   It never removes access to meaning/pinyin, never overrides senior mode,
   and does not reorder lesson content in v1. */
var VERSION=1;
function A(){return window.CSLAdaptivePresentation||null}
function large(){try{return localStorage.getItem('csl_large_text')==='1'||document.body.classList.contains('senior')}catch(e){return false}}
function apply(){var a=A(),plan=a&&a.get?a.get():null;if(!plan)return null;var root=document.documentElement;root.dataset.cslPresentation=plan.mode||'standard';root.dataset.cslSupport=plan.support||'balanced';root.classList.toggle('csl-presentation-audio-first',!large()&&plan.audioFirst===true);root.classList.toggle('csl-presentation-context-first',!large()&&plan.contextFirst===true);root.classList.toggle('csl-presentation-light-support',!large()&&plan.support==='light');root.classList.toggle('csl-presentation-full-support',large()||plan.support==='full');return{version:VERSION,appliedAt:new Date().toISOString(),mode:root.dataset.cslPresentation,support:root.dataset.cslSupport,seniorOverride:large(),policy:{hintsOnly:true,noReorder:true,meaningAlwaysReachable:true,pinyinAlwaysReachable:true}}}
function boot(){var result=apply();try{if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('presentation-policy-ready',result||{version:VERSION})}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2900)});else setTimeout(boot,2900);
window.addEventListener('storage',function(e){if(e.key==='csl_large_text')setTimeout(apply,0)});
window.CSLPresentationPolicy={version:VERSION,apply:apply};
})();