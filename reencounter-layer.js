(function(){
'use strict';
var PAGE=(location.pathname.split('/').pop()||'index.html');
var IGNORE={'doorways.html':1,'explore.html':1,'course-map.html':1,'memory.html':1,'garden.html':1,'tester.html':1};
if(IGNORE[PAGE])return;
var STYLE='csl-reencounter-style',TOAST='csl-reencounter-toast';
var SINGLE_OK={'要':1,'想':1,'会':1,'能':1,'把':1,'被':1,'给':1,'去':1,'来':1,'在':1,'有':1,'过':1,'比':1,'才':1,'就':1,'还':1,'再':1};
var STOP={'我':1,'你':1,'他':1,'她':1,'它':1,'的':1,'了':1,'是':1,'不':1,'很':1,'吗':1,'呢':1,'也':1,'都':1,'这':1,'那':1,'一':1,'个':1,'们':1,'和':1,'又':1};
var PATTERNS=[
 {id:'keyi-ma',label:'可以…吗？',test:function(t){return/可以.*吗/.test(t)}},
 {id:'you-meiyou',label:'有没有…？',test:function(t){return/有没有/.test(t)}},
 {id:'yinwei-suoyi',label:'因为…所以…',test:function(t){return/因为/.test(t)&&/所以/.test(t)}},
 {id:'suiran-danshi',label:'虽然…但是…',test:function(t){return/虽然/.test(t)&&/(但是|可是)/.test(t)}},
 {id:'ruguo-jiu',label:'如果…就…',test:function(t){return/如果/.test(t)&&/就/.test(t)}},
 {id:'xian-zai',label:'先…再…',test:function(t){return/先/.test(t)&&/再/.test(t)}},
 {id:'yibian-yibian',label:'一边…一边…',test:function(t){return(t.match(/一边/g)||[]).length>=2}},
 {id:'yi-jiu',label:'一…就…',test:function(t){return/一.+就/.test(t)}},
 {id:'ba',label:'把構文',test:function(t){return/把/.test(t)}},
 {id:'bei',label:'被構文',test:function(t){return/被/.test(t)}},
 {id:'bi',label:'比を使う比較',test:function(t){return/比/.test(t)}},
 {id:'guo',label:'経験の「过」',test:function(t){return/过/.test(t)}}
];
var SENSES={
 '要':function(t){
   t=normalize(t);
   if(/要是/.test(t))return{id:'if',label:'要是 = if'};
   if(/不要/.test(t))return{id:'negative-want',label:'不要 = don’t want / don’t'};
   if(/要.+了$/.test(t)||/快要/.test(t))return{id:'about-to',label:'要 = about to'};
   if(/要去|要来|要回|要上班|要学习|要工作|要看|要做|要吃|要喝|要买|要换|要找|要说|要走|要睡/.test(t))return{id:'intend',label:'要 = intend / going to'};
   if(/需要|得要/.test(t))return{id:'need',label:'要 = need'};
   if(/我要|你要|他要|她要|我们要|他们要/.test(t))return{id:'want',label:'要 = want / would like'};
   return{id:'general',label:'要'};
 },
 '想':function(t){
   t=normalize(t);
   if(/想起|想起来/.test(t))return{id:'remember',label:'想起 = remember'};
   if(/想念/.test(t))return{id:'miss',label:'想念 = miss'};
   if(/想想|想一想|想了想/.test(t))return{id:'think',label:'想 = think'};
   if(/想去|想来|想回|想吃|想喝|想买|想看|想做|想学|想说|想问|想找|想换/.test(t))return{id:'would-like',label:'想 = would like to'};
   return{id:'think',label:'想 = think / want to'};
 },
 '会':function(t){
   t=normalize(t);
   if(/不会|会不会/.test(t))return{id:'ability-question',label:'会 = know how / can'};
   if(/会说|会写|会读|会开|会游泳|会做|会用|会唱|会弹/.test(t))return{id:'learned-ability',label:'会 = learned ability'};
   if(/明天会|以后会|可能会|一定会|应该会|还会|就会|会下雨|会变|会发生|会越来越/.test(t))return{id:'prediction',label:'会 = will / likely to'};
   return{id:'general',label:'会'};
 },
 '过':function(t){
   t=normalize(t);
   if(/不过/.test(t))return{id:'however',label:'不过 = however'};
   if(/过去/.test(t))return{id:'past-go',label:'过去'};
   if(/过来/.test(t))return{id:'come-over',label:'过来'};
   if(/过年|过生日|过周末|过日子/.test(t))return{id:'spend-pass',label:'过 = spend / pass'};
   if(/[看去吃喝坐做学住听说买见来写读游].*过/.test(t)||/去过|吃过|看过|喝过|坐过|做过|学过|住过|听过|说过|买过|见过|来过/.test(t))return{id:'experience',label:'过 = past experience'};
   return{id:'general',label:'过'};
 }
};
function profile(){try{return window.CSLStorage&&CSLStorage.load?CSLStorage.load():null}catch(e){return null}}
function fuzzyItems(){var p=profile(),out=[];if(!p||!p.learning||!p.learning.sentences)return out;Object.keys(p.learning.sentences).forEach(function(id){var s=p.learning.sentences[id];if(s&&s.fuzzy&&(s.legacyText||s.text)){out.push({id:id,text:(s.legacyText||s.text).trim(),extras:s.extras||{}})}});return out}
function currentTexts(){var els=document.querySelectorAll('.zh,#zh,[data-zh],.sentence,.cn,.chinese');var out=[];els.forEach(function(el){var t=(el.textContent||'').trim();if(t&&/[\u3400-\u9fff]/.test(t))out.push({el:el,text:t})});return out}
function normalize(t){return(t||'').replace(/\s+/g,'').replace(/[。！？!?，,；;：:“”‘’"'（）()、]/g,'')}
function hanOnly(t){return normalize(t).replace(/[^\u3400-\u9fff]/g,'')}
function addStyle(){if(document.getElementById(STYLE))return;var s=document.createElement('style');s.id=STYLE;s.textContent='#'+TOAST+'{position:fixed;left:50%;transform:translateX(-50%);bottom:84px;z-index:9996;background:#eef0e9ee;border:1px solid #0001;border-radius:18px;padding:10px 14px;max-width:min(86vw,520px);font:650 12px -apple-system,BlinkMacSystemFont,sans-serif;color:#596158;box-shadow:0 7px 24px #0001;opacity:0;pointer-events:none;transition:opacity .25s ease}#'+TOAST+'.on{opacity:1}.csl-reencounter-mark{display:inline-block;margin-top:7px;background:#eef0e9;border-radius:999px;padding:6px 9px;font:650 11px -apple-system,BlinkMacSystemFont,sans-serif;color:#65705f}';document.head.appendChild(s)}
function toast(text){addStyle();var t=document.getElementById(TOAST);if(!t){t=document.createElement('div');t.id=TOAST;document.body.appendChild(t)}t.textContent=text;t.classList.add('on');setTimeout(function(){t.classList.remove('on')},4200)}
function mark(el,text){if(!el||!el.parentNode||el.parentNode.querySelector('.csl-reencounter-mark'))return;var m=document.createElement('span');m.className='csl-reencounter-mark';m.textContent=text;el.insertAdjacentElement('afterend',m)}
function priorEvent(type,itemId,feature,extra){var p=profile(),events=p&&p.learning&&Array.isArray(p.learning.events)?p.learning.events:[];for(var i=events.length-1;i>=0&&i>events.length-2500;i--){var e=events[i],d=e&&e.data||{};if(e&&e.type===type&&d.sourceSentenceId===itemId&&d.feature===feature&&d.page===PAGE&&(!extra||d.sensePair===extra))return true}return false}
function addEvent(type,data){try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent(type,data)}catch(e){}}
function updateExact(item,el){var ex=item.extras||{},pages=Array.isArray(ex.seenPages)?ex.seenPages.slice():[],last=ex.lastContextPage||null,already=pages.indexOf(PAGE)>=0;if(!already)pages.push(PAGE);var different=!!last&&last!==PAGE&&!already;var count=Number(ex.reencounterCount)||0;if(different)count++;
try{if(window.CSLStorage&&CSLStorage.patchSentence)CSLStorage.patchSentence(item.text,{extras:{seenPages:pages.slice(-24),lastContextPage:PAGE,reencounterCount:count,lastReencounterAt:different?new Date().toISOString():(ex.lastReencounterAt||null)}} ,item.id)}catch(e){}
if(different){mark(el,'また会いました');toast('前に少し曖昧だった中国語が、別の場面で戻ってきました。');addEvent('natural_reencounter',{sentenceId:item.id,text:item.text,page:PAGE,previousPage:last})}return different}
function ngrams(t,n){var h=hanOnly(t),m={};for(var i=0;i<=h.length-n;i++){var x=h.slice(i,i+n);m[x]=1}return m}
function lexicalMatch(a,b){var ah=hanOnly(a),bh=hanOnly(b);if(!ah||!bh)return null;var best=null;
for(var n=3;n>=2;n--){var g=ngrams(ah,n),ks=Object.keys(g);for(var i=0;i<ks.length;i++){var x=ks[i];if(bh.indexOf(x)>=0){if(!best||x.length>best.length)best=x}}if(best)return best}
var chars={};for(var j=0;j<ah.length;j++)chars[ah[j]]=1;var candidates=Object.keys(chars).filter(function(c){return bh.indexOf(c)>=0&&SINGLE_OK[c]&&!STOP[c]});return candidates.length?candidates[0]:null}
function constructionMatch(a,b){for(var i=0;i<PATTERNS.length;i++){var p=PATTERNS[i];if(p.test(a)&&p.test(b))return p}return null}
function senseOf(feature,text){return SENSES[feature]?SENSES[feature](text):null}
function updateSemantic(item,el,feature,currentText){var a=senseOf(feature,item.text),b=senseOf(feature,currentText);if(!a||!b)return false;var pair=a.id+'>'+b.id;if(priorEvent('semantic_reencounter',item.id,feature,pair))return false;var shifted=a.id!==b.id&&a.id!=='general'&&b.id!=='general';var label=shifted?'意味が少し変わって再会':'同じ意味で再会';var message=shifted?'「'+feature+'」が、前とは少し違う意味で戻ってきました。':'「'+feature+'」が、別の文でも同じ働きで戻ってきました。';mark(el,'また会いました · '+feature);toast(message);addEvent('semantic_reencounter',{sourceSentenceId:item.id,sourceText:item.text,feature:feature,page:PAGE,currentText:currentText,sourceSense:a.id,sourceSenseLabel:a.label,currentSense:b.id,currentSenseLabel:b.label,sensePair:pair,shifted:shifted});return true}
function updateFeature(item,el,kind,feature,label,currentText){if(kind==='lexical'&&SENSES[feature]&&updateSemantic(item,el,feature,currentText))return true;var type=kind==='construction'?'construction_reencounter':'lexical_reencounter';if(priorEvent(type,item.id,feature))return false;var message=kind==='construction'?'「'+label+'」の形が、別の文で戻ってきました。':'「'+feature+'」が、別の文で戻ってきました。';mark(el,'また会いました · '+(kind==='construction'?label:feature));toast(message);addEvent(type,{sourceSentenceId:item.id,sourceText:item.text,feature:feature,label:label||feature,page:PAGE,currentText:currentText});return true}
var lastSignature='';function scan(){var fuzzy=fuzzyItems();if(!fuzzy.length)return;var texts=currentTexts();if(!texts.length)return;var sig=texts.map(function(x){return x.text}).join('|');if(sig===lastSignature)return;lastSignature=sig;
for(var i=0;i<fuzzy.length;i++){var f=fuzzy[i],nf=normalize(f.text);if(!nf)continue;for(var j=0;j<texts.length;j++){var cur=texts[j],nc=normalize(cur.text);if(!nc)continue;if(nc===nf){if(updateExact(f,cur.el))return;continue}var cm=constructionMatch(f.text,cur.text);if(cm&&updateFeature(f,cur.el,'construction',cm.id,cm.label,cur.text))return;var lm=lexicalMatch(f.text,cur.text);if(lm&&updateFeature(f,cur.el,'lexical',lm,lm,cur.text))return}}}
setTimeout(scan,350);var mo=new MutationObserver(function(){clearTimeout(window.__cslReencounterTimer);window.__cslReencounterTimer=setTimeout(scan,180)});mo.observe(document.body,{childList:true,subtree:true,characterData:true});
})();