(function(){
'use strict';
/* Interactive cues v4.
   A chevron is reserved for controls that actually open/reveal something.
   Word controls own their audio UI completely: this shared layer must never
   inject a speaker glyph into .word or .csl-word-touch, even transiently. */
var STYLE='csl-interactive-cue-style';
function installStyle(){var old=document.getElementById(STYLE);if(old)return old;var s=document.createElement('style');s.id=STYLE;s.textContent=`
:root{--csl-cue-bg:rgba(88,86,214,.07);--csl-cue-border:rgba(88,86,214,.20)}
.csl-cue{position:relative;transition:background .16s ease,border-color .16s ease,transform .08s ease;cursor:pointer}
.csl-cue{background-image:linear-gradient(var(--csl-cue-bg),var(--csl-cue-bg));border-color:var(--csl-cue-border)!important}
.csl-cue-expand::after{content:'›';display:inline-block;margin-left:.38em;font-weight:700;opacity:.62;transform:translateY(-.02em)}
.csl-cue-expand[aria-expanded="true"]::after{content:'⌄'}
.csl-cue-audio::after{content:'🔊';font-size:.82em;margin-left:.32em;opacity:.72}
.csl-cue:active{transform:scale(.985)}
.csl-cue:focus-visible{outline:2px solid currentColor;outline-offset:3px}
@media (prefers-reduced-motion:reduce){.csl-cue{transition:none}}
@media (prefers-contrast:more){.csl-cue{outline:1px solid currentColor}.csl-cue::after{opacity:1}}
`;document.head.appendChild(s);return s}
function visible(el){var st=getComputedStyle(el);return st.display!=='none'&&st.visibility!=='hidden'&&el.getClientRects().length>0}
function isAudio(el){var t=((el.textContent||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.className||'')).toLowerCase();return /listen|audio|sound|speak|natural|slow|voice|pronun|音声|発音/.test(t)}
function hasAudioGlyph(el){var t=(el.textContent||'')+' '+(el.getAttribute('aria-label')||'');return /🔊|🔈|🔉|📢|🎧/.test(t)||el.hasAttribute('data-csl-has-audio-cue')}
function ownsAudioUI(el){return el.matches('.word,.csl-word-touch,[data-csl-word]')}
function actionable(el){if(el.disabled||el.getAttribute('aria-disabled')==='true')return false;return el.matches('button,a[href],[role="button"],summary')||el.hasAttribute('onclick')}
function expands(el){if(el.matches('summary'))return true;if(el.hasAttribute('aria-expanded'))return true;if(el.hasAttribute('aria-controls'))return true;var t=((el.textContent||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.className||'')).toLowerCase();return /open|detail|more|words|meaning|explain|show|reveal|詳しく|詳細|意味|単語|開く|表示/.test(t)}
function mark(root){installStyle();var els=(root||document).querySelectorAll('button,a[href],[role="button"],summary,[onclick]');els.forEach(function(el){var cue=actionable(el)&&visible(el)&&!el.classList.contains('csl-no-cue'),wordOwned=ownsAudioUI(el),audio=cue&&!wordOwned&&isAudio(el)&&!hasAudioGlyph(el),expand=cue&&!audio&&expands(el);el.classList.toggle('csl-cue',cue);el.classList.toggle('csl-cue-audio',audio);el.classList.toggle('csl-cue-expand',expand);if(wordOwned)el.classList.remove('csl-cue-audio');if(cue&&!el.hasAttribute('aria-label')&&!(el.textContent||'').trim())el.setAttribute('aria-label','Action')})}
function boot(){mark(document);var timer=null;new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(function(){mark(document)},90)}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class','hidden','aria-expanded','aria-controls','aria-label']})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.CSLInteractiveCues={refresh:function(){mark(document)},version:4};
})();
