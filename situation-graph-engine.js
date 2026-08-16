(function(){
'use strict';
/* Chinese Structure Lab · Situation Graph Engine v1
   Connects people, places, goals, events and language. Quiet infrastructure only. */
var VERSION=1,EXT='situationGraphV1';
function S(){return window.CSLStorage||null}function P(){return window.CSLReencounterPlanner||null}
function text(){return (document.body&&document.body.innerText||'').replace(/\s+/g,' ').trim()}
function has(re){return re.test(text())}
function page(){return location.pathname.split('/').pop()||'index.html'}
function now(){return new Date().toISOString()}
var rules=[
 {id:'cafe',place:'cafe',people:['friend','server'],goals:['order','choose','pay'],test:/咖啡|茶|菜单|买单|cafe|restaurant/i},
 {id:'transport',place:'station',people:['staff','friend'],goals:['find','buy-ticket','navigate'],test:/地铁|车站|站台|票|subway|station|transport/i},
 {id:'hotel',place:'hotel',people:['receptionist'],goals:['check-in','request','change-room'],test:/酒店|房间|入住|预订|hotel|room/i},
 {id:'shopping',place:'shop',people:['clerk'],goals:['compare','choose','pay'],test:/多少钱|试一下|便宜|刷卡|购物|shopping/i},
 {id:'health',place:'clinic-pharmacy',people:['doctor','pharmacist'],goals:['describe-symptom','get-help','medicine'],test:/不舒服|头疼|发烧|药|医生|health|clinic|pharmacy/i},
 {id:'home-family',place:'home',people:['family'],goals:['introduce','describe','routine'],test:/妈妈|爸爸|家|family|home/i},
 {id:'study',place:'study-space',people:['teacher','learner'],goals:['understand','clarify','practice'],test:/学习|不明白|什么意思|再说一遍|study|lesson/i},
 {id:'social',place:'social',people:['friend'],goals:['invite','plan','meet'],test:/朋友|一起|周末|见|invite|plan|friend/i}
];
function infer(){var t=(document.title+' '+text()).slice(0,12000),matches=[];rules.forEach(function(r){if(r.test.test(t))matches.push(r)});var primary=matches[0]||{id:'general',place:'general',people:[],goals:['communicate']};return{page:page(),at:now(),primaryContext:primary.id,place:primary.place,people:primary.people.slice(),goals:primary.goals.slice(),contexts:matches.map(function(x){return x.id})}}
function languageTokens(){var out={},els=document.querySelectorAll('.zh,#zh,[data-zh],.sentence,.cn,.chinese,.word');els.forEach(function(el){var z=(el.textContent||'').trim();if(/[\u3400-\u9fff]/.test(z)){z.replace(/[\u3400-\u9fff]{1,4}/g,function(x){if(x.length<=4)out[x]=1;return x})}});return Object.keys(out).slice(0,80)}
function build(){var c=infer(),tokens=languageTokens(),plan=P()&&P().suggestions?P().suggestions(8):[],edges=[];tokens.forEach(function(tok){edges.push({from:'context:'+c.primaryContext,to:'lang:'+tok,type:'contains'})});c.goals.forEach(function(g){edges.push({from:'context:'+c.primaryContext,to:'goal:'+g,type:'supports'})});c.people.forEach(function(p){edges.push({from:'context:'+c.primaryContext,to:'person:'+p,type:'involves'})});
 var ranked=plan.map(function(x){var score=Number(x.score)||0;if(x.kind==='word'&&tokens.indexOf(x.text)>=0)score+=4;if(c.primaryContext==='hotel'&&/要|房|预订|入住/.test(x.text||''))score+=2.5;if(c.primaryContext==='transport'&&/要|票|站|去/.test(x.text||''))score+=2.5;if(c.primaryContext==='cafe'&&/要|茶|咖啡|杯/.test(x.text||''))score+=2.5;if(c.primaryContext==='shopping'&&/要|这个|多少钱|比/.test(x.text||''))score+=2;return Object.assign({},x,{situationScore:score})}).sort(function(a,b){return b.situationScore-a.situationScore});
 return{version:VERSION,builtAt:now(),context:c,nodes:{languages:tokens,goals:c.goals,people:c.people,places:[c.place]},edges:edges,reencounterMatches:ranked.slice(0,5),policy:{contextBeforeDrill:true,noForcedInsertion:true,preferMeaningfulReuse:true}}}
function save(g){var s=S();if(!s||!s.load||!s.save)return g;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=g;s.save(p);return g}
function refresh(){return save(build())}function get(){return refresh()}
function bestReencounters(n){var g=refresh();return g.reencounterMatches.slice(0,n||3)}
window.CSLSituationGraph={version:VERSION,get:get,refresh:refresh,bestReencounters:bestReencounters};
setTimeout(function(){try{var g=refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('situation-graph-ready',{version:VERSION,context:g.context.primaryContext})}catch(e){}},1450);
})();