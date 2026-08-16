(function(){
'use strict';
/* Chinese Structure Lab · Language Graph Engine v1
   Connects characters/words/chunks/sentences/structures with situations and the persistent world.
   Additive derived data only; raw learning history remains untouched. */
var VERSION=1,EXT='languageGraphV1';
function S(){return window.CSLStorage||null}function SG(){return window.CSLSituationGraph||null}function W(){return window.CSLPersistentWorld||null}
function now(){return new Date().toISOString()}function page(){return location.pathname.split('/').pop()||'index.html'}
function uniq(a){var o={};return a.filter(function(x){if(!x||o[x])return false;o[x]=1;return true})}
function chinese(s){return /[\u3400-\u9fff]/.test(s||'')}
function texts(){var out=[];document.querySelectorAll('.zh,#zh,[data-zh],.sentence,.cn,.chinese,.word,.csl-ped-zh').forEach(function(el){var t=(el.getAttribute('data-zh')||el.textContent||'').trim();if(chinese(t)&&t.length<=120)out.push(t.replace(/🔊/g,'').trim())});return uniq(out).slice(0,180)}
var structures=[
 ['want-intend',/要/,'要 · want / need / intention'],['ba',/把/,'把 construction'],['passive',/被/,'被 passive'],['comparison',/比/,'比 comparison'],['experience',/过/,'过 experience'],['change',/越来越/,'越来越 gradual change'],['condition',/如果.*就/,'如果…就… condition'],['concession',/虽然.*但|虽然.*可是/,'虽然…但是… concession'],['reason',/因为.*所以/,'因为…所以… reason-result'],['regardless',/无论.*都/,'无论…都… regardless'],['uncertainty',/未必|不一定|可能|也许/,'calibrated uncertainty'],['reframe',/不是.*而是|不在于.*而在于/,'reframing contrast']
];
function wordsFrom(t){var x=[];t.replace(/[\u3400-\u9fff]{1,4}/g,function(w){if(w.length<=4)x.push(w);return w});return uniq(x)}
function build(){var ts=texts(),nodes={},edges=[];function node(id,type,label,meta){if(!nodes[id])nodes[id]={id:id,type:type,label:label,meta:meta||{}}}function edge(a,b,type,weight){edges.push({from:a,to:b,type:type,weight:weight||1})}
 var sg=SG()&&SG().get?SG().get():null,world=W()&&W().get?W().get():null,ctx=sg&&sg.context&&sg.context.primaryContext||'general';node('context:'+ctx,'context',ctx);ts.forEach(function(t,i){var sid='sentence:'+page()+':'+i;node(sid,'sentence',t,{page:page()});edge('context:'+ctx,sid,'used-in',2);wordsFrom(t).forEach(function(w){var wid='word:'+w;node(wid,'word',w);edge(wid,sid,'appears-in',1);if(t.indexOf(w)===0)edge(wid,sid,'opens',1.2)});structures.forEach(function(r){if(r[1].test(t)){var id='structure:'+r[0];node(id,'structure',r[2]);edge(id,sid,'realized-as',2);edge('context:'+ctx,id,'supports',1)}})});
 if(world&&world.entities){Object.keys(world.entities).forEach(function(id){var e=world.entities[id];node('world:'+id,e.type||'world',e.label||id,{encounters:e.encounters||0});if(e.lastContext===ctx||e.contexts&&e.contexts.indexOf&&e.contexts.indexOf(ctx)>=0)edge('context:'+ctx,'world:'+id,'involves',2)})}
 var degrees={};edges.forEach(function(e){degrees[e.from]=(degrees[e.from]||0)+e.weight;degrees[e.to]=(degrees[e.to]||0)+e.weight});var hubs=Object.keys(degrees).sort(function(a,b){return degrees[b]-degrees[a]}).slice(0,16).map(function(id){return{id:id,label:nodes[id]&&nodes[id].label||id,type:nodes[id]&&nodes[id].type||'',weight:degrees[id]}});
 return{version:VERSION,builtAt:now(),page:page(),context:ctx,nodes:nodes,edges:edges,hubs:hubs,policy:{derivedOnly:true,noForcedDrill:true,connectMeaningBeforeMemorization:true}}}
function save(g){var s=S();if(!s||!s.load||!s.save)return g;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=g;s.save(p);return g}function refresh(){return save(build())}function get(){return refresh()}
function neighbors(id){var g=refresh(),ids={};g.edges.forEach(function(e){if(e.from===id)ids[e.to]=1;if(e.to===id)ids[e.from]=1});return Object.keys(ids).map(function(k){return g.nodes[k]}).filter(Boolean)}
window.CSLLanguageGraph={version:VERSION,get:get,refresh:refresh,neighbors:neighbors};setTimeout(function(){try{var g=refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('language-graph-ready',{version:VERSION,nodes:Object.keys(g.nodes).length,edges:g.edges.length})}catch(e){}},1850);
})();