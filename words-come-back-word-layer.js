(function(){
'use strict';
/* Chinese Structure Lab — Words Come Back Word Layer v2
   Pedagogical surface only. No learner analysis runs here.
   The Shared Sentence Bank + English layer are lazy-loaded only when a
   "Words come back" section is actually present. Canonical structured
   word objects are passed directly to Word Touch. */
var VERSION=2,loading=null,timer=null;
var BANK_SCRIPTS=['sentence-bank.js','sentence-bank-expansion-01.js','sentence-bank-expansion-02.js','sentence-bank-expansion-03.js','sentence-bank-english-data.js','sentence-bank-english-layer.js'];
function norm(t){return String(t||'').replace(/\s+/g,'').replace(/[。！？!?，,；;：:“”‘’"'（）()、]/g,'')}
function hasHan(t){return /[\u3400-\u9fff]/.test(t||'')}
function ready(src){
 if(src==='word-touch-engine.js')return !!window.CSLWordTouch;
 if(src==='sentence-bank.js')return !!window.CSLSentenceBank;
 if(src==='sentence-bank-english-data.js')return !!window.CSLSentenceBankEnglishData;
 if(src==='sentence-bank-english-layer.js')return !!(window.CSLSentenceBank&&window.CSLSentenceBank.englishLayer);
 return false;
}
function loadOne(src){return new Promise(function(resolve,reject){
 if(ready(src)){resolve();return}
 var existing=document.querySelector('script[src$="/'+src+'"],script[src$="'+src+'"],script[data-csl-wcb="'+src+'"]');
 if(existing){
  if(ready(src)){resolve();return}
  /* An expansion script may already have finished before this layer starts.
     In that case its side effect is already in the bank; do not wait forever. */
  if(/^sentence-bank-expansion-/.test(src)&&window.CSLSentenceBank){resolve();return}
  existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return
 }
 var s=document.createElement('script');s.src='./'+src;s.async=false;s.dataset.cslWcb=src;s.onload=resolve;s.onerror=function(){reject(new Error('Failed to load '+src))};document.head.appendChild(s)
})}
function ensureRuntime(){
 if(window.CSLSentenceBank&&window.CSLSentenceBank.englishLayer&&window.CSLWordTouch)return Promise.resolve();
 if(loading)return loading;
 var chain=Promise.resolve();
 BANK_SCRIPTS.forEach(function(src){chain=chain.then(function(){return loadOne(src)})});
 chain=chain.then(function(){return loadOne('word-touch-engine.js')});
 loading=chain.catch(function(){loading=null});return loading
}
function parseLegacyWord(raw,i,item){
 if(raw&&typeof raw==='object')return raw;
 var parts=String(raw||'').split(' · '),left=(parts.shift()||'').trim(),meaning=parts.join(' · ').trim();
 var bits=left.split(/\s+/),zh=bits.shift()||left,py=bits.join(' ');
 return{id:(item&&item.id?item.id:'wcb')+'-w'+i,zh:zh,py:py,ja:meaning,en:''}
}
function bankItemFor(text){
 var b=window.CSLSentenceBank,all=b&&b.all?b.all():[],n=norm(text);
 for(var i=0;i<all.length;i++){if(norm(all[i]&&all[i].zh)===n)return all[i]}
 return null
}
function style(){
 if(document.getElementById('csl-wcb-word-style'))return;
 var s=document.createElement('style');s.id='csl-wcb-word-style';s.textContent=
 '.csl-wcb-words{margin:12px 0 4px;padding-top:10px;border-top:1px solid #0000000b}.csl-wcb-label{font:750 10px/1.3 -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;letter-spacing:.08em;color:#999;margin-bottom:8px;text-transform:uppercase}.csl-wcb-row{display:flex;gap:8px;flex-wrap:wrap}.csl-wcb-row .csl-word-touch{min-width:0;min-height:48px;padding:10px 12px;border-radius:14px;font-size:20px}.csl-wcb-row .csl-word-touch.csl-word-detail{width:100%}.senior .csl-wcb-label{font-size:15px}.senior .csl-wcb-row .csl-word-touch{font-size:26px;min-height:58px}';document.head.appendChild(s)
}
function sentenceNodes(label){
 var out=[],seen=[];
 function addScope(scope){if(!scope||!scope.querySelectorAll)return;scope.querySelectorAll('.zh,.sentenceZh,[data-zh],.cn,.chinese,.wz').forEach(function(el){var t=(el.textContent||'').trim();if(!hasHan(t)||t.length>120||seen.indexOf(el)>=0)return;seen.push(el);out.push(el)})}
 var primary=label.closest('section,.card,.scene,.lesson,.item,.entry,article')||label.parentElement;addScope(primary);
 var p=label.parentElement,n=p&&p.nextElementSibling,count=0;while(n&&count<3){addScope(n);n=n.nextElementSibling;count++}
 return out
}
function isWordsComeBackLabel(el){var t=((el.getAttribute&&el.getAttribute('data-en'))||'')+' '+((el.textContent||''));return /\bwords?\s+come\s+back\b/i.test(t)}
function labels(){return Array.prototype.filter.call(document.querySelectorAll('[data-en],.stageLabel,.eyebrow,h1,h2,h3,h4,h5,summary'),isWordsComeBackLabel)}
function attachToSentence(el){
 if(!el||el.dataset.cslWcbWords==='1')return;
 var item=bankItemFor((el.textContent||'').trim());if(!item||!Array.isArray(item.words)||!item.words.length)return;
 el.dataset.cslWcbWords='1';style();
 var box=document.createElement('div');box.className='csl-wcb-words';box.setAttribute('data-csl-wcb-sentence-id',item.id||'');
 var lab=document.createElement('div');lab.className='csl-wcb-label';lab.textContent='WORDS IN THIS SENTENCE';
 var row=document.createElement('div');row.className='csl-wcb-row';box.appendChild(lab);box.appendChild(row);el.insertAdjacentElement('afterend',box);
 var words=item.words.map(function(w,i){return parseLegacyWord(w,i,item)}).filter(function(w){return w&&w.zh});
 window.CSLWordTouch.mount(row,words,{course:'words-come-back',sentenceId:item.id||null});
}
function apply(){var ls=labels();if(!ls.length)return;ensureRuntime().then(function(){if(!window.CSLSentenceBank||!window.CSLSentenceBank.englishLayer||!window.CSLWordTouch)return;ls.forEach(function(label){sentenceNodes(label).forEach(attachToSentence)})})}
function schedule(){clearTimeout(timer);timer=setTimeout(apply,120)}
function boot(){apply();var mo=new MutationObserver(schedule);mo.observe(document.body,{childList:true,subtree:true});window.CSLWordsComeBackWords={version:VERSION,refresh:apply,policy:{pedagogyOnly:true,noRealtimeAnalysis:true,lazySentenceBank:true,bilingualBank:true}}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();