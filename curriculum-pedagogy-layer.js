(function(){
'use strict';
/* Chinese Structure Lab · Curriculum Pedagogy Layer v1
   Applies to A2-C2 and thematic lesson pages.
   Additive by design: original sentence records remain intact for history compatibility.
   Only clear naturalness improvements are surfaced as preferred alternatives. */
var PAGE=(location.pathname.split('/').pop()||'');
var SKIP={'index.html':1,'doorways.html':1,'explore.html':1,'course-map.html':1,'memory.html':1,'garden.html':1,'tester.html':1,'a1-core-skills.html':1};
if(SKIP[PAGE])return;
var REFINE={
 '我的手机被我忘在酒店了。':{z:'我把手机落在酒店了。',p:'wǒ bǎ shǒujī là zài jiǔdiàn le',en:'I left my phone at the hotel.',ja:'携帯をホテルに置き忘れました。',why:'This is the natural everyday way to express accidentally leaving an object somewhere.'},
 '下午三点对我来说最好。':{z:'下午三点对我来说最合适。',p:'xiàwǔ sān diǎn duì wǒ láishuō zuì héshì',en:'Three in the afternoon works best for me.',ja:'私には午後3時が一番都合がいいです。',why:'最合适 is more idiomatic when talking about a suitable meeting time.'},
 '后来我发现，听得多比背规则更重要。':{z:'后来我发现，多听比背规则更重要。',p:'hòulái wǒ fāxiàn, duō tīng bǐ bèi guīzé gèng zhòngyào',en:'Later I realized that listening more matters more than memorizing rules.',ja:'その後、規則を暗記するより、たくさん聞く方が大切だと気づきました。',why:'多听 is cleaner and more idiomatic in this comparison.'},
 '这件事不是谁对谁错的问题。':{z:'这不是一个简单的谁对谁错的问题。',p:'zhè bú shì yí ge jiǎndān de shéi duì shéi cuò de wèntí',en:'This is not simply a matter of who is right and who is wrong.',ja:'これは単純に誰が正しい・間違っているという問題ではありません。',why:'Adding 一个简单的 makes the phrase sound more complete and natural.'},
 '有些话翻译成日语以后，感觉会变。':{z:'有些话翻成日语以后，感觉就变了。',p:'yǒuxiē huà fān chéng Rìyǔ yǐhòu, gǎnjué jiù biàn le',en:'Some expressions feel different once translated into Japanese.',ja:'日本語に訳すと、感じが変わってしまう表現があります。',why:'翻成… and 就变了 are more natural in ordinary spoken explanation.'},
 '这一点对我们来说是最重要的条件。':{z:'这是我们最看重的条件。',p:'zhè shì wǒmen zuì kànzhòng de tiáojiàn',en:'This is the condition that matters most to us.',ja:'これは私たちが最も重視している条件です。',why:'最看重 is concise and natural in negotiation.'},
 '那我们按照这个方向准备新的方案。':{z:'那我们就按这个方向准备一份新的方案。',p:'nà wǒmen jiù àn zhège fāngxiàng zhǔnbèi yí fèn xīn de fāng’àn',en:'Then we’ll prepare a new proposal along these lines.',ja:'では、この方向で新しい案を一つ準備しましょう。',why:'按…方向 and 一份方案 sound more natural in business discussion.'},
 'AI可以提高效率，但最终责任不能交给机器。':{z:'AI可以提高效率，但最终责任仍然要由人承担。',p:'AI kěyǐ tígāo xiàolǜ, dàn zuìzhōng zérèn réngrán yào yóu rén chéngdān',en:'AI can improve efficiency, but people must still bear ultimate responsibility.',ja:'AIは効率を上げられますが、最終的な責任はやはり人が負う必要があります。',why:'This is more precise and idiomatic for formal argument.'},
 '一个政策是否有效，不能只看它原来的目标。':{z:'评价一个政策是否有效，不能只看它最初的目标。',p:'píngjià yí ge zhèngcè shìfǒu yǒuxiào, bù néng zhǐ kàn tā zuìchū de mùbiāo',en:'To judge whether a policy is effective, we cannot look only at its original goal.',ja:'政策が有効かを評価するには、当初の目標だけを見ることはできません。',why:'评价 makes the logical subject of the judgment explicit.'},
 '成熟的语言能力，包含知道什么时候不把话说满。':{z:'成熟的语言能力，也包括知道什么时候不把话说满。',p:'chéngshú de yǔyán nénglì, yě bāokuò zhīdào shénme shíhou bù bǎ huà shuō mǎn',en:'Mature language ability also includes knowing when not to say everything too absolutely.',ja:'成熟した言語能力には、断定しきらない方がよい場面を知ることも含まれます。',why:'也包括 is more idiomatic than 包含 here.'},
 '好的论证不是把反对意见藏起来，而是把它处理掉。':{z:'好的论证不是回避反对意见，而是正面回应这些意见。',p:'hǎo de lùnzhèng bú shì huíbì fǎnduì yìjiàn, ér shì zhèngmiàn huíyìng zhèxiē yìjiàn',en:'A good argument does not avoid objections; it addresses them directly.',ja:'良い論証とは反対意見を避けるのではなく、正面から応答することです。',why:'处理掉 sounds mechanically eliminative; 正面回应 is natural argumentative Chinese.'},
 '高级阅读不是把每个词都翻译出来，而是判断哪些词承担了真正的重量。':{z:'高级阅读不是把每个词都翻译出来，而是判断哪些词真正起关键作用。',p:'gāojí yuèdú bú shì bǎ měi ge cí dōu fānyì chūlái, ér shì pànduàn nǎxiē cí zhēnzhèng qǐ guānjiàn zuòyòng',en:'Advanced reading is not translating every word, but judging which words actually play a key role.',ja:'高度な読解とは全語を訳すことではなく、どの語が本当に重要な役割を果たすかを判断することです。',why:'起关键作用 is idiomatic; 承担重量 is overly literal as an analytical metaphor.'}
};
var FOLLOW={
 '你什么时候方便？':['我周六下午有空。','I’m free Saturday afternoon.','土曜の午後なら空いています。','📅'],
 '到时候给我发消息。':['好，我到了就联系你。','Sure. I’ll contact you when I arrive.','はい、着いたら連絡します。','📱'],
 '我不知道应该怎么填。':['没关系，我给你看一下。','No problem. I’ll show you.','大丈夫です。見せますね。','📝'],
 '我已经跟负责人谈过了，他说明天会回复。':['那我们明天再确认一次。','Then let’s check again tomorrow.','では明日もう一度確認しましょう。','📩'],
 '我理解你的观点，不过我不完全同意这个结论。':['没关系，你觉得问题在哪里？','That’s fine. Where do you think the problem is?','大丈夫です。どこに問題があると思いますか。','💬'],
 '如果双方都能接受，我觉得今天就可以确定下来。':['好，那我们把细节再确认一遍。','Good. Then let’s confirm the details once more.','では、細部をもう一度確認しましょう。','🤝'],
 '无论支持还是反对，都应该先说明理由。':['那我们先把事实和判断分开。','Then let’s separate the facts from the judgments first.','ではまず、事実と判断を分けましょう。','⚖️'],
 '在没有更多信息的情况下，最好暂时保留判断。':['等有了新的证据，我们再重新评估。','When we have new evidence, we can reassess it.', '新しい証拠が出たら、改めて評価しましょう。','🔎'],
 '承认不确定性并不等于放弃判断。':['关键是说明我们有多确定。','The key is to state how certain we are.','重要なのは、どの程度確かかを示すことです。','📊'],
 '他说“可以考虑”，并不一定真的表示他愿意接受。':['还要看他的语气和当时的情况。','You also need to consider his tone and the situation.', '口調やその時の状況も見る必要があります。','🗣️']
};
var STRUCT=[
 [/过/,'过 · experience / prior occurrence'],[/把/,'把 · affected-object structure'],[/被/,'被 · passive / affected perspective'],[/比/,'比 · comparison'],[/如果.*就/,'如果…就… · condition → result'],[/虽然.*但是|虽然.*但/,'虽然…但是… · concession'],[/因为.*所以/,'因为…所以… · reason → result'],[/越来越/,'越来越 · gradual change'],[/与其.*不如/,'与其…不如… · compare alternatives'],[/即使.*也/,'即使…也… · even if'],[/无论.*都/,'无论…都… · regardless of'],[/不在于.*而在于|不是.*而是/,'reframing contrast'],[/未必|不一定/,'calibrated uncertainty'],[/所谓/,'所谓 · framing a concept critically']
];
function say(t){if(window.CSLPlatform&&CSLPlatform.speak)return CSLPlatform.speak(t,{lang:'zh-CN'});if(window.speechSynthesis){var u=new SpeechSynthesisUtterance(t);u.lang='zh-CN';speechSynthesis.cancel();speechSynthesis.speak(u)}}
function style(){if(document.getElementById('csl-curriculum-ped-style'))return;var s=document.createElement('style');s.id='csl-curriculum-ped-style';s.textContent='.csl-ped{margin-top:12px;border-top:1px solid #eee;padding-top:10px}.csl-ped details{border:0!important;margin:0!important;padding:0!important}.csl-ped summary{font-size:13px;color:#666;font-weight:750;cursor:pointer}.csl-ped-box{margin-top:8px;background:#f7f6f1;border-radius:14px;padding:11px 12px}.csl-ped-label{font-size:11px;font-weight:800;letter-spacing:.06em;color:#858078}.csl-ped-zh{font-size:19px;font-weight:750;line-height:1.45;margin-top:5px}.csl-ped-py{font-size:12px;color:#686868;margin-top:2px}.csl-ped-en{font-size:13px;margin-top:5px}.csl-ped-ja{font-size:11px;color:#888;margin-top:2px}.csl-ped-why{font-size:12px;color:#666;line-height:1.55;margin-top:6px}.csl-ped-say{border:0;background:transparent;font-size:17px;padding:4px 6px}.csl-connection{margin-top:7px;font-size:11px;color:#7b756d}.senior .csl-ped summary{font-size:18px}.senior .csl-ped-label{font-size:16px}.senior .csl-ped-zh{font-size:27px}.senior .csl-ped-py,.senior .csl-ped-en,.senior .csl-ped-why{font-size:18px}.senior .csl-ped-ja,.senior .csl-connection{font-size:17px}.senior .csl-ped-say{font-size:23px;min-height:48px}';document.head.appendChild(s)}
function textOf(card){var z=card.querySelector('.zh,.wz,[data-zh]');return z?(z.textContent||'').trim():''}
function connection(t){for(var i=0;i<STRUCT.length;i++)if(STRUCT[i][0].test(t))return STRUCT[i][1];return''}
function add(){style();document.querySelectorAll('.card,.lesson,.scene').forEach(function(card){if(card.dataset.cslPedDone)return;var t=textOf(card);if(!t||t.length>120)return;var r=REFINE[t],f=FOLLOW[t],c=connection(t);if(!r&&!f&&!c){card.dataset.cslPedDone='1';return}var wrap=document.createElement('div');wrap.className='csl-ped';var h='<details><summary>Language in context ›</summary><div class="csl-ped-box">';if(r){h+='<div class="csl-ped-label">PREFERRED NATURAL FORM</div><div class="csl-ped-zh">'+r.z+' <button class="csl-ped-say" data-say="'+r.z+'">🔊</button></div><div class="csl-ped-py">'+r.p+'</div><div class="csl-ped-en">'+r.en+'</div><div class="csl-ped-ja">'+r.ja+'</div><div class="csl-ped-why">'+r.why+'</div>'}if(f){h+='<div style="margin-top:10px;padding-top:9px;border-top:1px dashed #ddd"><div class="csl-ped-label">'+f[3]+' A NATURAL NEXT MOVE</div><div class="csl-ped-zh">'+f[0]+' <button class="csl-ped-say" data-say="'+f[0]+'">🔊</button></div><div class="csl-ped-en">'+f[1]+'</div><div class="csl-ped-ja">'+f[2]+'</div></div>'}if(c)h+='<div class="csl-connection">↗ '+c+' · this structure can return in other situations.</div>';h+='</div></details>';wrap.innerHTML=h;wrap.querySelectorAll('[data-say]').forEach(function(b){b.onclick=function(e){e.preventDefault();e.stopPropagation();say(this.getAttribute('data-say'))}});card.appendChild(wrap);card.dataset.cslPedDone='1'})}
function boot(){setTimeout(add,250);setTimeout(add,900);setTimeout(add,1800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.CSLCurriculumPedagogy={version:1,refresh:add,refinements:Object.keys(REFINE).length};
})();