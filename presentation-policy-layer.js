(function(){
'use strict';
/* Presentation Policy Layer v2
   Safely translates Adaptive Presentation proposals into reversible UI hints.
   Understands the current nested Adaptive Presentation schema. */
var VERSION=2;
function A(){return window.CSLAdaptivePresentation||null}
function large(){try{return localStorage.getItem('csl_large_text')==='1'||document.body.classList.contains('senior')}catch(e){return false}}
function normalize(plan){var a=plan&&plan.adaptive||{},d=plan&&plan.defaults||{};return{mode:a.presentation||'conservative',audioOrder:a.audioOrder||'neutral',pinyin:a.pinyin||d.pinyin||'available-nearby',meaning:a.meaning||d.meaning||'available-nearby',density:a.explanationDensity||'normal',contextFirst:(a.presentation==='context-first')||(d.situationFirst===true)}}
function apply(){var api=A(),plan=api&&api.get?api.get():null;if(!plan)return null;var n=normalize(plan),senior=large(),root=document.documentElement;root.dataset.cslPresentation=n.mode;root.dataset.cslSupport=n.density;root.dataset.cslPinyinPolicy=n.pinyin;root.dataset.cslMeaningPolicy=n.meaning;root.classList.toggle('csl-presentation-audio-first',!senior&&(n.audioOrder==='natural-first'||n.audioOrder==='slow-supportive'));root.classList.toggle('csl-presentation-context-first',!senior&&n.contextFirst);root.classList.toggle('csl-presentation-light-support',!senior&&n.density==='light');root.classList.toggle('csl-presentation-full-support',senior);return{version:VERSION,appliedAt:new Date().toISOString(),mode:n.mode,support:n.density,pinyin:n.pinyin,meaning:n.meaning,audioOrder:n.audioOrder,seniorOverride:senior,policy:{hintsOnly:true,noReorder:true,meaningAlwaysReachable:true,pinyinAlwaysReachable:true,accessibilityWins:true}}}
function boot(){var result=apply();try{if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('presentation-policy-ready',result||{version:VERSION})}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,2900)});else setTimeout(boot,2900);
window.addEventListener('storage',function(e){if(e.key==='csl_large_text')setTimeout(apply,0)});
window.CSLPresentationPolicy={version:VERSION,apply:apply,normalize:normalize};
})();