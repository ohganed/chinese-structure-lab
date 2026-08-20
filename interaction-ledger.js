(function(){
'use strict';
/* Chinese Structure Lab — Interaction Ledger v1
   Quietly connects learner-initiated surface actions to the learning underground.
   It records learning evidence, never correctness, grades, typed text, or identity. */
var VERSION=1,PAGE=(location.pathname.split('/').pop()||'index.html'),last={key:'',at:0};
function safe(fn){try{return fn()}catch(e){return null}}
function text(el){return(el&&el.textContent||'').replace(/\s+/g,' ').trim()}
function chinese(s){var m=String(s||'').match(/[\u3400-\u9fff]+/g);return m?m.join(''):''}
function currentSentence(){
 var selectors=['[data-csl-sentence-id]','.zh','#zh','[data-zh]','.sentence','.cn','.chinese'];
 for(var i=0;i<selectors.length;i++){var els=document.querySelectorAll(selectors[i]);for(var j=0;j<els.length;j++){var el=els[j],raw=text(el);if(el.hidden||!el.getClientRects().length)continue;if(chinese(raw))return{id:el.getAttribute('data-csl-sentence-id')||null,text:raw,element:el}}
 }return{id:null,text:'',element:null}
}
function detail(type,el,extra){var s=currentSentence(),d={page:PAGE,control:((el&&el.className)||'').toString().slice(0,120),label:text(el).slice(0,120),sentenceId:s.id,sentence:s.text,learnerInitiated:true,observer:'interaction-ledger-v1'};Object.keys(extra||{}).forEach(function(k){d[k]=extra[k]});return d}
function emit(name,d){safe(function(){if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit(name,d)});safe(function(){if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('learning-event',{type:name,page:PAGE})})}
function record(type,d,signal){safe(function(){if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent(type,d)});emit(signal||type.replace(/_/g,'-'),d)}
function recentEquivalent(type,d){var p=safe(function(){return window.CSLStorage&&CSLStorage.load()}),es=p&&p.learning&&p.learning.events||[],cut=Date.now()-700;for(var i=es.length-1;i>=0&&i>=es.length-8;i--){var e=es[i],x=e&&e.data||{};if(!e||Date.parse(e.at)<cut)break;if(e.type!==type)continue;if(d.sentence&&x.sentence&&d.sentence!==x.sentence)continue;if(d.word&&x.word&&d.word!==x.word)continue;return true}return false}
function rememberSentence(d){if(!d.sentence)return;safe(function(){var id=window.CSLStorage.resolveSentenceId(d.sentence,d.sentenceId||null),p=window.CSLStorage.load(),s=p.learning.sentences[id]||{},at=new Date().toISOString();window.CSLStorage.patchSentence(d.sentence,{firstSeenAt:s.firstSeenAt||at,lastSeenAt:at,extras:{lastPage:PAGE,lastLearnerActionAt:at}},id)})}
function classify(el){
 if(!el)return null;var c=(' '+(el.className||'')+' ').toLowerCase(),label=(text(el)+' '+(el.getAttribute('aria-label')||'')).toLowerCase(),onclick=(el.getAttribute('onclick')||'').toLowerCase();
 if(/\bword\b|csl-word-touch/.test(c))return{type:'word_touch',signal:'word-touched'};
 if(/natural|slow|listen|audio|play/.test(c+' '+label+' '+onclick)){var slow=/slow|0\.4|\.4\)|\.4,/.test(c+' '+label+' '+onclick);return{type:'audio_played',signal:'audio-played',extra:{rateBand:slow?'slow':'natural'}}}
 if(/pybtn|pinyin|拼音/.test(c+' '+label+' '+onclick))return{type:'pinyin_toggled',signal:'pinyin-toggled'};
 if(/fuzzy|unclear|曖昧/.test(c+' '+label+' '+onclick))return{type:'unclear_changed',signal:'unclear-changed'};
 if(/reveal|meaning|意味/.test(c+' '+label+' '+onclick))return{type:'meaning_revealed',signal:'meaning-revealed'};
 if(el.matches('summary')||/structure|grammar|chunk|network|detail|文法|構造|詳しく/.test(c+' '+label))return{type:'structure_opened',signal:'structure-opened'};
 if(el.closest&&el.closest('.nav')||/nextscene|prevscene|advance\(|next moment|previous moment|次の場面|前の場面/.test(label+' '+onclick))return{type:'scene_changed',signal:'scene-changed'};
 return null
}
function duplicate(key){var n=Date.now(),same=last.key===key&&n-last.at<900;last={key:key,at:n};return same}
function onClick(ev){var el=ev.target&&ev.target.closest?ev.target.closest('button,a[href],summary,[role="button"],[onclick]'):null,kind=classify(el);if(!kind)return;setTimeout(function(){var type=kind.type,signal=kind.signal;if(type==='structure_opened'&&el.parentElement&&el.parentElement.matches('details')&&!el.parentElement.open){type='structure_closed';signal='structure-closed'}var d=detail(type,el,kind.extra),word=type==='word_touch'?chinese(text(el)):'';if(word)d.word=word;var key=[type,d.page,d.sentence,d.word,d.label].join('|');if(duplicate(key)||recentEquivalent(type,d))return;record(type,d,signal);rememberSentence(d)},0)}
function pageView(){var d=detail('page_view',document.body,{learnerInitiated:false});record('learning_page_view',d,'sentence-viewed');if(d.sentence)rememberSentence(d)}
function snapshot(){var s=currentSentence();return{version:VERSION,page:PAGE,sentenceId:s.id,sentence:s.text,policy:{learnerActionsOnly:true,noCorrectness:true,noGrades:true,noTypedText:true,noIdentity:true,localProfileOnly:true}}}
function boot(){document.addEventListener('click',onClick,false);setTimeout(pageView,80)}
window.CSLInteractionLedger={version:VERSION,snapshot:snapshot};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
