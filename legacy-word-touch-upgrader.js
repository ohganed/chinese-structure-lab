(function(){
'use strict';
/* Legacy Word Touch Upgrader v7
   A1/A2 migration path:
   - A1/A2 sentence text, pinyin and meanings never show initially
   - whole-sentence discovery always works, even when a legacy page has no word buttons
   - existing word/chunk buttons become blank discovery buttons
   - word/chunk sequence: sound -> pinyin -> English -> Japanese -> Hanzi/details
   - no mechanical one-Hanzi fallback segmentation
   Higher-level pages keep their legacy presentation.

   IMPORTANT: index.html has its own dedicated word-birth controller.
   Never upgrade the Connected World index here; otherwise both layers mutate
   #words/.scene and can create duplicate Sentence UI and visible flicker.
*/
if(/\/(?:index\.html)?$/.test(location.pathname))return;
var VERSION=7,seen=new WeakSet(),lessonSeen=new WeakSet();
function txt(el,sel){var x=el&&el.querySelector&&el.querySelector(sel);return x?(x.textContent||'').trim():''}
function nearestLesson(btn){return btn.closest('.lesson,.card,.item,.entry,.scene,article,section')||btn.parentElement}
function chineseOnly(raw){var parts=String(raw||'').match(/[\u3400-\u9FFF\uF900-\uFAFF]+/g);return parts&&parts.length?parts.join(''):String(raw||'').trim()}
function hanOnly(s){return (String(s||'').match(/[\u3400-\u9FFF\uF900-\uFAFF]/g)||[]).join('')}
function isA1A2(){var probe=(document.title+' '+(document.body&&document.body.textContent||'').slice(0,2200));return /(^|\W)A1(\W|$)|(^|\W)A2(\W|$)/i.test(probe)}
function englishGloss(btn,zh){var direct=txt(btn,'.wordgloss')||txt(btn,'[data-en]');if(direct)return direct;var small=btn&&btn.querySelector&&btn.querySelector('small');if(small){var s=(small.textContent||'').trim();if(/[A-Za-z]/.test(s))return s}var raw=(btn&&btn.textContent||'').replace(/[▶🔊🔉🔈]/g,' ').replace(/\s+/g,' ').trim();if(zh&&raw.indexOf(zh)===0)raw=raw.slice(zh.length).trim();return /[A-Za-z]/.test(raw)?raw:''}
function japaneseGloss(btn){return txt(btn,'.wordja')||txt(btn,'[data-ja]')||''}
function pinyinTokens(s){return String(s||'').replace(/[，。！？、；：“”‘’（）,.!?;:()]/g,' ').split(/\s+/).filter(Boolean)}
function derivePinyin(lesson,zh){var sentence=txt(lesson,'.zh'),fullPy=txt(lesson,'.py');if(!sentence||!fullPy||!zh)return'';var hs=hanOnly(sentence),hw=hanOnly(zh),start=hs.indexOf(hw);if(start<0)return'';var toks=pinyinTokens(fullPy);if(toks.length<start+hw.length)return'';return toks.slice(start,start+hw.length).join(' ')}
function parseLegacy(btn){var zh=txt(btn,'.wordzh')||chineseOnly(btn.textContent||''),lesson=nearestLesson(btn);return{id:'legacy-word-'+zh,zh:zh,pinyin:derivePinyin(lesson,zh),en:englishGloss(btn,zh),ja:japaneseGloss(btn),detailEn:txt(lesson,'.note'),detailJa:txt(lesson,'.note')}}
function ensureStyle(){if(document.getElementById('cslLegacyWordTouchStyle'))return;var st=document.createElement('style');st.id='cslLegacyWordTouchStyle';st.textContent='.csl-word-touch{border:0;background:#efede7;border-radius:18px;min-width:104px;min-height:68px;padding:14px 16px;font:780 24px/1.25 -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;color:#171717;text-align:center;box-shadow:none}.csl-word-touch [data-csl-word-zh]{display:block}.csl-word-touch [data-csl-word-helper]{font-size:16px!important;line-height:1.4!important;margin-top:7px!important;font-weight:560!important;white-space:pre-line!important;color:#555}.csl-word-touch.csl-word-detail{width:100%;max-width:100%}.csl-a1a2-sentence{display:block!important;width:100%!important;margin-top:14px;background:#171717!important;color:#fff!important}.csl-a1a2-sentence [data-csl-word-helper]{color:#ddd!important}.csl-a1a2-hidden-source{display:none!important}.csl-a1a2-legacy-audio{display:none!important}.csl-a1a2-no-chunks{font-size:12px;color:#888;margin-top:10px;line-height:1.5}@media(max-width:430px){.csl-word-touch{font-size:22px;min-width:96px}}';document.head.appendChild(st)}
function sentenceItem(lesson){return{zh:txt(lesson,'.zh'),pinyin:txt(lesson,'.py'),en:txt(lesson,'.en'),ja:txt(lesson,'.ja'),detailEn:txt(lesson,'.note'),detailJa:txt(lesson,'.note')}}
function hideLegacyPresentation(lesson){['.zh','.py','.en','.ja'].forEach(function(sel){var e=lesson.querySelector(sel);if(e)e.classList.add('csl-a1a2-hidden-source')});lesson.querySelectorAll('.speak,.btn,.nat,.slow').forEach(function(b){if(!b.classList.contains('csl-word-touch'))b.classList.add('csl-a1a2-legacy-audio')})}
function addSentenceDiscovery(lesson,item){if(lesson.querySelector('.csl-a1a2-sentence-holder'))return;var holder=document.createElement('div');holder.className='csl-a1a2-sentence-holder';CSLWordTouch.mount(holder,[item],{course:location.pathname.split('/').pop()||'legacy-course',discovery:true,sentence:true});var b=holder.firstChild;if(b)b.classList.add('csl-a1a2-sentence');var words=lesson.querySelector('.words,.csl-word-list,.word-list');if(words&&words.parentNode)words.parentNode.insertBefore(holder,words.nextSibling);else lesson.appendChild(holder)}
function upgradeLesson(lesson){if(!lesson||lessonSeen.has(lesson)||!isA1A2()||!window.CSLWordTouch)return;var item=sentenceItem(lesson);if(!item.zh)return;lessonSeen.add(lesson);hideLegacyPresentation(lesson);addSentenceDiscovery(lesson,item);var hasChunks=!!lesson.querySelector('.word,.csl-word-touch');if(!hasChunks){var n=document.createElement('div');n.className='csl-a1a2-no-chunks';n.textContent='Sentence discovery is ready. Word/chunk data for this legacy item is being migrated.';lesson.appendChild(n)}}
function upgrade(btn){if(!btn||seen.has(btn)||btn.classList.contains('csl-word-touch')||!window.CSLWordTouch)return;seen.add(btn);ensureStyle();var lesson=nearestLesson(btn),item=parseLegacy(btn),holder=document.createElement('span'),discovery=isA1A2();CSLWordTouch.mount(holder,[item],{course:location.pathname.split('/').pop()||'legacy-course',sentenceId:null,discovery:discovery});var newBtn=holder.firstChild;if(!newBtn)return;newBtn.classList.add('csl-legacy-upgraded-word');btn.parentNode.replaceChild(newBtn,btn);if(discovery)upgradeLesson(lesson)}
function scan(root){if(!window.CSLWordTouch)return;var base=root||document;base.querySelectorAll('.word').forEach(upgrade);if(isA1A2())base.querySelectorAll('.lesson,.card,.scene').forEach(upgradeLesson)}
function start(){ensureStyle();scan(document);var mo=new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;if(n.matches&&n.matches('.word'))upgrade(n);scan(n)})})});mo.observe(document.documentElement,{childList:true,subtree:true});window.CSLLegacyWordTouchUpgrader={version:VERSION,scan:scan,upgrade:upgrade,upgradeLesson:upgradeLesson,derivePinyin:derivePinyin,isA1A2:isA1A2}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();