(function(){
'use strict';
/* Opportunity Matching Engine v1
   Matches retrieval need with the current situation. Proposes; never forces. */
var VERSION=1,EXT='opportunityMatchingV1';
function S(){return window.CSLStorage||null}function R(){return window.CSLRetrievalNeed||null}function G(){return window.CSLSituationGraph||null}
function now(){return new Date().toISOString()}function clamp(x){return Math.max(0,Math.min(1,x))}
var cues={cafe:/茶|咖啡|喝|杯|点|服务员|菜单|位子|吃/,restaurant:/吃|菜|菜单|服务员|位子|买单|结账/,hotel:/酒店|宾馆|房间|入住|退房|护照|前台|钥匙/,transport:/车|站|票|地铁|公交|火车|机场|出租车|换乘|末班/,shopping:/买|卖|钱|块|贵|便宜|试|商店|超市|多少钱/,health:/医生|医院|疼|痛|药|不舒服|发烧|休息|病/,home:/家|房子|厨房|睡|起床|做饭|洗澡/,study:/学习|老师|学生|中文|汉语|课|学校|作业|练习/,social:/朋友|一起|见面|周末|有空|邀请|生日/};
function fit(text,ctx){if(!text||!ctx||ctx==='general')return .2;var r=cues[ctx];if(r&&r.test(text))return 1;return .12}
function build(){var re=R()&&R().get?R().get():null,sg=G()&&G().get?G().get():null,ctx=sg&&sg.context&&sg.context.primaryContext||'general',items=re&&re.ranked||[],matches=items.map(function(x){var f=fit(x.text,ctx),score=clamp((Number(x.retrievalNeed)||0)*.72+f*.28);return{id:x.id,text:x.text,context:ctx,retrievalNeed:x.retrievalNeed,contextFit:f,opportunityScore:score,action:score>=.68&&f>=.8?'natural-now':score>=.48?'keep-available':'do-not-surface'}}).sort(function(a,b){return b.opportunityScore-a.opportunityScore});return{version:VERSION,builtAt:now(),context:ctx,matches:matches.slice(0,30),recommendations:matches.filter(function(x){return x.action==='natural-now'}).slice(0,2),policy:{maxNaturalInsertions:2,neverForce:true,neverInterrupt:true,contextMustMakeSense:true,noQuizLanguage:true}}}
function save(g){var s=S();if(!s||!s.load||!s.save)return g;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=g;s.save(p);return g}function refresh(){return save(build())}function get(){return refresh()}function recommend(){var g=refresh();return g?g.recommendations:[]}
window.CSLOpportunityMatching={version:VERSION,get:get,refresh:refresh,recommend:recommend};setTimeout(function(){try{var g=refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('opportunity-matching-ready',{version:VERSION,context:g.context,recommendations:g.recommendations.length})}catch(e){}},2750);
})();