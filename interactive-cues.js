(function(){
'use strict';
/* Subtle affordance cues: show that something will happen when tapped.
   Never rely on color alone; preserve existing layout and labels. */
var STYLE='csl-interactive-cue-style';
function installStyle(){if(document.getElementById(STYLE))return;var s=document.createElement('style');s.id=STYLE;s.textContent=`
:root{--csl-cue-bg:rgba(88,86,214,.07);--csl-cue-border:rgba(88,86,214,.20);--csl-cue-ink:currentColor}
.csl-cue{position:relative;transition:background .16s ease,border-color .16s ease,transform .08s ease;cursor:pointer}
.csl-cue:not(.csl-cue-audio){background-image:linear-gradient(var(--csl-cue-bg),var(--csl-cue-bg));border-color:var(--csl-cue-border)!important}
.csl-cue:not(.csl-cue-audio)::after{content:'›';display:inline-block;margin-left:.38em;font-weight:700;opacity:.58;transform:translateY(-.02em)}
.csl-cue[aria-expanded="true"]::after{content:'⌄'}
.csl-cue-audio::after{content:'🔊';font-size:.82em;margin-left:.32em;opacity:.72}
.csl-cue:active{transform:scale(.985)}
.csl-cue:focus-visible{outline:2px solid currentColor;outline-offset:3px}
@media (prefers-reduced-motion:reduce){.csl-cue{transition:none}}
@media (prefers-contrast:more){.csl-cue{outline:1px solid currentColor}.csl-cue::after{opacity:1}}
`;document.head.appendChild(s)}
function visible(el){var st=getComputedStyle(el);return st.display!=='none'&&st.visibility!=='hidden'&&el.getClientRects().length>0}
function isAudio(el){var t=((el.textContent||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.className||'')).toLowerCase();return /listen|audio|sound|speak|natural|slow|voice|pronun|音声|発音/.test(t)}
function actionable(el){if(el.disabled||el.getAttribute('aria-disabled')==='true')return false;if(el.matches('button,a[href],[role="button"],summary'))return true;if(el.hasAttribute('onclick'))return true;return false}
function mark(root){installStyle();var els=(root||document).querySelectorAll('button,a[href],[role="button"],summary,[onclick]');els.forEach(function(el){if(!actionable(el)||!visible(el)||el.classList.contains('csl-no-cue'))return;el.classList.add('csl-cue');if(isAudio(el))el.classList.add('csl-cue-audio');if(!el.hasAttribute('aria-label')&&!(el.textContent||'').trim())el.setAttribute('aria-label','Open');});}
function boot(){mark(document);var timer=null;new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(function(){mark(document)},90)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','hidden','aria-expanded']});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.CSLInteractiveCues={refresh:function(){mark(document)},version:1};
})();