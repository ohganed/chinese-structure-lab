(function(){
'use strict';
/* Legacy Word Touch Upgrader v4
   Preserves legacy English word glosses when converting old .word buttons.
   This fixes false "English meaning unavailable" states where the source
   lesson already contains an English gloss.
*/
var VERSION=4,seen=new WeakSet();
function txt(el,sel){var x=el&&el.querySelector&&el.querySelector(sel);return x?(x.textContent||'').trim():''}
function nearestLesson(btn){return btn.closest('.lesson,.card,.item,.entry,article,section')||btn.parentElement}
function chineseOnly(raw){
 var parts=String(raw||'').match(/[\u3400-\u9FFF\uF900-\uFAFF]+/g);
 return parts&&parts.length?parts.join(''):String(raw||'').trim();
}
function englishGloss(btn,zh){
 var direct=txt(btn,'.wordgloss')||txt(btn,'[data-en]');
 if(direct)return direct;
 var small=btn&&btn.querySelector&&btn.querySelector('small');
 if(small){var s=(small.textContent||'').trim();if(/[A-Za-z]/.test(s))return s}
 var raw=(btn&&btn.textContent||'').replace(/[▶🔊🔉🔈]/g,' ').replace(/\s+/g,' ').trim();
 if(zh&&raw.indexOf(zh)===0)raw=raw.slice(zh.length).trim();
 return /[A-Za-z]/.test(raw)?raw:'';
}
function japaneseGloss(btn){
 var direct=txt(btn,'.wordja')||txt(btn,'[data-ja]');
 if(direct)return direct;
 var small=btn&&btn.querySelector&&btn.querySelector('small');
 if(small){var s=(small.textContent||'').trim();if(/[\u3040-\u30ff\u3400-\u9fff]/.test(s)&&!/[A-Za-z]/.test(s))return s}
 return '';
}
function parseLegacy(btn){
 var zh=txt(btn,'.wordzh')||chineseOnly(btn.textContent||'');
 var en=englishGloss(btn,zh),ja=japaneseGloss(btn);
 var lesson=nearestLesson(btn),sentence=txt(lesson,'.zh'),sentencePy=txt(lesson,'.py'),sentenceEn=txt(lesson,'.en'),sentenceJa=txt(lesson,'.ja');
 var examples=[];
 if(sentence)examples.push({zh:sentence,en:sentenceEn||'',ja:sentenceJa||''});
 return{
  id:'legacy-word-'+zh,
  zh:zh,
  en:en,
  ja:ja,
  detailEn:sentencePy?('Sentence pinyin: '+sentencePy):'',
  detailJa:sentencePy?('文全体の拼音: '+sentencePy):'',
  examples:examples
 };
}
function ensureStyle(){
 if(document.getElementById('cslLegacyWordTouchStyle'))return;
 var st=document.createElement('style');st.id='cslLegacyWordTouchStyle';st.textContent=
 '.csl-word-touch{border:0;background:#efede7;border-radius:18px;min-width:104px;min-height:64px;padding:14px 16px;font:780 24px/1.25 -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;color:#171717;text-align:left;box-shadow:none}' +
 '.csl-word-touch [data-csl-word-zh]{display:block;font-size:1em;line-height:1.25}' +
 '.csl-word-touch [data-csl-word-helper]{font-size:17px!important;line-height:1.45!important;margin-top:7px!important;font-weight:650!important;white-space:pre-line!important;color:#555}' +
 '.csl-word-touch.csl-word-detail{display:block;width:100%;max-width:100%;padding:16px 18px}' +
 '.csl-word-touch.csl-word-detail [data-csl-word-helper]{font-size:16px!important;font-weight:560!important}' +
 '.senior .csl-word-touch{font-size:30px;min-height:74px;padding:16px 18px}' +
 '.senior .csl-word-touch [data-csl-word-helper]{font-size:21px!important}' +
 '@media(max-width:430px){.csl-word-touch{font-size:23px;min-width:112px}.csl-word-touch [data-csl-word-helper]{font-size:17px!important}}';
 document.head.appendChild(st);
}
function upgrade(btn){
 if(!btn||seen.has(btn)||btn.classList.contains('csl-word-touch'))return;
 if(!window.CSLWordTouch)return;
 seen.add(btn);ensureStyle();
 var item=parseLegacy(btn),holder=document.createElement('span');
 CSLWordTouch.mount(holder,[item],{course:location.pathname.split('/').pop()||'legacy-course',sentenceId:null});
 var newBtn=holder.firstChild;if(!newBtn)return;
 newBtn.classList.add('csl-legacy-upgraded-word');
 newBtn.removeAttribute('onclick');
 btn.parentNode.replaceChild(newBtn,btn);
}
function scan(root){if(!window.CSLWordTouch)return;(root||document).querySelectorAll('.word').forEach(upgrade)}
function start(){ensureStyle();scan(document);var mo=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.matches&&n.matches('.word'))upgrade(n);scan(n)})})});mo.observe(document.documentElement,{childList:true,subtree:true});window.CSLLegacyWordTouchUpgrader={version:VERSION,scan:scan,upgrade:upgrade,chineseOnly:chineseOnly,parseLegacy:parseLegacy}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
