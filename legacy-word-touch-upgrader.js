(function(){
'use strict';
/* Legacy Word Touch Upgrader v1
   Upgrades old .word buttons to the shared 4-step Word Touch behavior without rewriting course data.
   Initial Chinese only -> tap 1 audio -> tap 2 meaning -> tap 3 details -> tap 4 Chinese only.
   Details are derived conservatively from the nearest lesson sentence/pinyin/translation.
*/
var VERSION=1,seen=new WeakSet();
function txt(el,sel){var x=el&&el.querySelector&&el.querySelector(sel);return x?(x.textContent||'').trim():''}
function nearestLesson(btn){return btn.closest('.lesson,.card,.item,.entry,article,section')||btn.parentElement}
function parseLegacy(btn){
 var clone=btn.cloneNode(true),small=clone.querySelector('small'),meaning='';
 if(small){meaning=(small.textContent||'').trim();small.remove()}
 var raw=(clone.textContent||'').replace(/[▶🔊]/g,' ').replace(/\s+/g,' ').trim();
 var zh=raw.split(' ')[0]||raw;
 var lesson=nearestLesson(btn),sentence=txt(lesson,'.zh'),pinyin=txt(lesson,'.py'),en=txt(lesson,'.en'),ja=txt(lesson,'.ja');
 var examples=[];if(sentence)examples.push({zh:sentence,ja:ja||en||''});
 return{id:'legacy-word-'+zh,zh:zh,ja:meaning,detail:pinyin?('文の発音 '+pinyin):'',examples:examples};
}
function upgrade(btn){
 if(!btn||seen.has(btn)||btn.classList.contains('csl-word-touch'))return;
 if(!window.CSLWordTouch)return;
 seen.add(btn);
 var item=parseLegacy(btn),parent=btn.parentNode,newBtn=CSLWordTouch.mount(document.createElement('span'),[item],{course:location.pathname.split('/').pop()||'legacy-course',sentenceId:null}).firstChild;
 if(!newBtn)return;
 /* Preserve the host page's visual footprint while using the shared behavior. */
 newBtn.classList.add('word');newBtn.style.margin=btn.style.margin||'';
 parent.replaceChild(newBtn,btn);
}
function scan(root){
 if(!window.CSLWordTouch)return;
 (root||document).querySelectorAll('.word').forEach(upgrade);
}
function start(){scan(document);var mo=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.matches&&n.matches('.word'))upgrade(n);scan(n)})})});mo.observe(document.documentElement,{childList:true,subtree:true});window.CSLLegacyWordTouchUpgrader={version:VERSION,scan:scan,upgrade:upgrade}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
