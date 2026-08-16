(function(){
'use strict';
/* Meaning / Sense Graph v1 — distinguish meanings of familiar forms.
   Conservative rules only; uncertain cases remain unclassified. */
var VERSION=1,EXT='meaningSenseGraphV1';
function S(){return window.CSLStorage||null}function LG(){return window.CSLLanguageGraph||null}
function now(){return new Date().toISOString()}function uniq(a){var o={};return a.filter(function(x){if(!x||o[x])return false;o[x]=1;return true})}
var lexicon={
 '要':[
  {id:'want',label:'want / would like',test:/我要(一|两|这|那|杯|张|个|份|点|买|吃|喝|看|换|住)/},
  {id:'need',label:'need / have to',test:/要(不要|准备|带|付|等|多久|多长|多少|什么|怎么)/},
  {id:'intend',label:'intend / be going to',test:/(明天|今天|下午|晚上|周末|下周|以后|待会儿|一会儿).{0,6}要|要去|要来|要回|要学|要做|要工作/},
  {id:'likely',label:'be about to / likely',test:/快要|就要/}
 ],
 '会':[
  {id:'ability',label:'learned ability',test:/会(说|写|读|开|游泳|做)/},
  {id:'future',label:'will / likely',test:/会(来|去|下雨|变|发生|影响|继续|成为)/}
 ],
 '可以':[
  {id:'permission',label:'permission',test:/可以(吗|进去|坐|用|看|拿|拍|试)/},
  {id:'possibility',label:'possibility / option',test:/可以(考虑|选择|通过|理解|看作|认为|解决)/}
 ],
 '看':[
  {id:'look',label:'look / watch',test:/看(一下|看|电影|电视|书|菜单|地图)/},
  {id:'medical',label:'see a doctor / receive care',test:/看(医生|病)/},
  {id:'view',label:'regard / in one’s view',test:/看来|看作|看成/}
 ]
};
function sentences(){var g=LG()&&LG().get?LG().get():null;if(!g)return[];return Object.keys(g.nodes||{}).map(function(k){return g.nodes[k]}).filter(function(n){return n.type==='sentence'}).map(function(n){return{id:n.id,text:n.label}})}
function classify(word,text){var rs=lexicon[word]||[],hits=rs.filter(function(r){return r.test.test(text)});return hits.length===1?hits[0]:null}
function build(){var ss=sentences(),nodes={},edges=[],coverage={};Object.keys(lexicon).forEach(function(w){nodes['form:'+w]={id:'form:'+w,type:'form',label:w};coverage[w]={classified:0,unclassified:0};(lexicon[w]||[]).forEach(function(r){var id='sense:'+w+':'+r.id;nodes[id]={id:id,type:'sense',label:r.label,form:w};edges.push({from:'form:'+w,to:id,type:'has-sense'})})});ss.forEach(function(s){Object.keys(lexicon).forEach(function(w){if(s.text.indexOf(w)<0)return;var r=classify(w,s.text);if(!r){coverage[w].unclassified++;return}var id='sense:'+w+':'+r.id;coverage[w].classified++;edges.push({from:id,to:s.id,type:'realized-in',evidence:s.text})})});return{version:VERSION,builtAt:now(),coverage:coverage,nodes:nodes,edges:edges,policy:{doNotGuessAmbiguous:true,formIsNotMastery:true,senseExposureMatters:true}}}
function save(g){var s=S();if(!s||!s.load||!s.save)return g;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=g;s.save(p);return g}function refresh(){return save(build())}function get(){return refresh()}
function exposure(word){var g=refresh(),out={};g.edges.forEach(function(e){if(e.from.indexOf('sense:'+word+':')===0&&e.type==='realized-in'){out[e.from]=(out[e.from]||0)+1}});return out}
window.CSLMeaningSenseGraph={version:VERSION,get:get,refresh:refresh,exposure:exposure};setTimeout(function(){try{var g=refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('meaning-sense-graph-ready',{version:VERSION,edges:g.edges.length})}catch(e){}},2100);
})();