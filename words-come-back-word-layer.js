(function(){
'use strict';
/* Chinese Structure Lab — Words Come Back Word Layer v4
   Shared lesson-page enhancement only.
   index.html now owns its Connected World discovery UI exclusively through
   index-word-birth-layer.js. Running both MutationObserver pipelines against
   #words caused repeated remounts, duplicate Sentence controls and iPhone
   flicker. Never attach this layer on the top Connected World page. */
var page=(location.pathname.split('/').pop()||'index.html');
if(page==='index.html'||page==='')return;
var VERSION=4,loading=null,timer=null;
var BANK_SCRIPTS=['sentence-bank.js','sentence-bank-expansion-01.js','sentence-bank-expansion-02.js','sentence-bank-expansion-03.js','sentence-bank-english-data.js','sentence-bank-english-layer.js'];
function norm(t){return String(t||'').replace(/\s+/g,'').replace(/[。！？!?，,；;：:“”‘’"'（）()、]/g,'')}
function hasHan(t){return /[\u3400-\u9fff]/.test(t||'')}
function ready(src){if(src==='word-touch-engine.js')return !!window.CSLWordTouch;if(src==='sentence-bank.js')return !!window.CSLSentenceBank;if(src==='sentence-bank-english-data.js')return !!window.CSLSentenceBankEnglishData;if(src==='sentence-bank-english-layer.js')return !!(window.CSLSentenceBank&&window.CSLSentenceBank.englishLayer);return false}
function loadOne(src){return new Promise(function(resolve,reject){if(ready(src)){resolve();return}var existing=document.querySelector('script[src$="/'+src+'"],script[src$="'+src+'"],script[data-csl-wcb="'+src+'"]');if(existing){if(ready(src)||(/^sentence-bank-expansion-/.test(src)&&window.CSLSentenceBank)){resolve();return}existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return}var s=document.createElement('script');s.src='./'+src;s.async=false;s.dataset.cslWcb=src;s.onload=resolve;s.onerror=function(){reject(new Error('Failed to load '+src))};document.head.appendChild(s)})}
function ensureRuntime(){if(window.CSLSentenceBank&&window.CSLSentenceBank.englishLayer&&window.CSLWordTouch)return Promise.resolve();if(loading)return loading;var chain=Promise.resolve();BANK_SCRIPTS.forEach(function(src){chain=chain.then(function(){return loadOne(src)})});chain=chain.then(function(){return loadOne('word-touch-engine.js')});loading=chain.catch(function(){loading=null});return loading}
function parseLegacyWord(raw,i,item){if(raw&&typeof raw==='object'&&!Array.isArray(raw))return raw;if(Array.isArray(raw))return{id:(item&&item.id?item.id:'scene')+'-w'+i,zh:raw[0]||'',pinyin:raw[1]||'',en:raw[2]||'',ja:raw[3]||''};var parts=String(raw||'').split(' · '),left=(parts.shift()||'').trim(),meaning=parts.join(' · ').trim(),bits=left.split(/\s+/),zh=bits.shift()||left,py=bits.join(' ');return{id:(item&&item.id?item.id:'wcb')+'-w'+i,zh:zh,pinyin:py,en:meaning,ja:''}}
function bankItemFor(text){var b=window.CSLSentenceBank,all=b&&b.all?b.all():[],n=norm(text);for(var i=0;i<all.length;i++){if(norm(all[i]&&all[i].zh)===n)return all[i]}return null}
function style(){if(document.getElementById('csl-wcb-word-style'))return;var s=document.createElement('style');s.id='csl-wcb-word-style';s.textContent='.csl-wcb-row{display:flex;gap:9px;flex-wrap:wrap;margin-top:10px}';document.head.appendChild(s)}
function sentenceNodes(label){var out=[],seen=[];function addScope(scope){if(!scope||!scope.querySelectorAll)return;scope.querySelectorAll('.zh,.sentenceZh,[data-zh],.cn,.chinese,.wz').forEach(function(el){var t=(el.textContent||'').trim();if(!hasHan(t)||t.length>120||seen.indexOf(el)>=0)return;seen.push(el);out.push(el)})}var primary=label.closest('section,.card,.scene,.lesson,.item,.entry,article')||label.parentElement;addScope(primary);return out}
function isWordsComeBackLabel(el){var t=((el.getAttribute&&el.getAttribute('data-en'))||'')+' '+((el.textContent||''));return /\bwords?\s+come\s+back\b/i.test(t)}
function labels(){return Array.prototype.filter.call(document.querySelectorAll('[data-en],.stageLabel,.eyebrow,h1,h2,h3,h4,h5,summary'),isWordsComeBackLabel)}
function attachToSentence(el){if(!el||el.dataset.cslWcbWords==='1')return;var item=bankItemFor((el.textContent||'').trim());if(!item||!Array.isArray(item.words)||!item.words.length)return;el.dataset.cslWcbWords='1';style();var box=document.createElement('div');box.className='csl-wcb-words';var row=document.createElement('div');row.className='csl-wcb-row';box.appendChild(row);el.insertAdjacentElement('afterend',box);var words=item.words.map(function(w,i){return parseLegacyWord(w,i,item)}).filter(function(w){return w&&w.zh});window.CSLWordTouch.mount(row,words,{course:'words-come-back',sentenceId:item.id||null,discovery:true})}
function apply(){ensureRuntime().then(function(){if(!window.CSLWordTouch)return;labels().forEach(function(label){sentenceNodes(label).forEach(attachToSentence)})})}
function schedule(){clearTimeout(timer);timer=setTimeout(apply,120)}
function boot(){apply();var mo=new MutationObserver(schedule);mo.observe(document.body,{childList:true,subtree:true});window.CSLWordsComeBackWords={version:VERSION,refresh:apply,policy:{a1a2Discovery:true,pedagogyOnly:true,bilingualBank:true,indexIsolation:true}}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();