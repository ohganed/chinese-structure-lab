(function(){
'use strict';
/* A1 Pedagogy Layer v1
   Keeps original lesson IDs/history intact. Adds natural alternatives and tiny scene continuations.
   This is additive so existing learner history remains valid. */
var ALT={
'有两个人的座位吗？':{natural:'两位，有位子吗？',py:'liǎng wèi, yǒu wèizi ma',en:'A table for two?',ja:'2人ですが、席はありますか。',note:'In a restaurant, this is shorter and more conversational.'},
'请让我过一下。':{natural:'麻烦让一下。',py:'máfan ràng yíxià',en:'Excuse me, could I get through?',ja:'すみません、ちょっと通してください。',note:'A very common polite phrase in a crowded place.'},
'末班车几点？':{natural:'末班车几点发车？',py:'mòbānchē jǐ diǎn fāchē',en:'What time does the last service leave?',ja:'最終便は何時に出ますか。',note:'Adding 发车 makes the question more explicit and natural.'},
'请给我发票。':{natural:'麻烦给我开张发票。',py:'máfan gěi wǒ kāi zhāng fāpiào',en:'Could you issue me an invoice, please?',ja:'領収書（発票）をお願いします。',note:'开张发票 is a natural service-counter expression.'}
};
var NEXT={
'我想看医生。':['哪里不舒服？','Where are you feeling unwell?','どこが具合悪いですか。','🧑‍⚕️'],
'我头很疼。':['从什么时候开始的？','When did it start?','いつからですか。','🕐'],
'我们还没决定。':['没关系，慢慢看。','No problem, take your time.','大丈夫です。ゆっくり選んでください。','📖'],
'你推荐什么？':['这个很受欢迎。','This one is very popular.','これはとても人気があります。','🍽️'],
'我要换车吗？':['要，在下一站换。','Yes. Transfer at the next stop.','はい、次の駅で乗り換えます。','🚉'],
'我坐错车了。':['没关系，下一站下车吧。','No problem. Get off at the next stop.','大丈夫です。次の駅で降りましょう。','↩️'],
'我想办理入住。':['好的，请给我看一下护照。','Certainly. May I see your passport?','はい、パスポートを見せてください。','🛎️'],
'房间有点儿冷。':['我帮您看看空调。','I’ll check the air conditioner for you.','エアコンを確認しますね。','🌡️'],
'可以换房间吗？':['可以，我帮您查一下。','Yes. I’ll check for you.','はい、確認いたします。','🔑']
};
function speak(t){if(window.CSLPlatform&&CSLPlatform.speak)return CSLPlatform.speak(t,{lang:'zh-CN'});if(window.speechSynthesis){var u=new SpeechSynthesisUtterance(t);u.lang='zh-CN';speechSynthesis.speak(u)}}
function style(){if(document.getElementById('a1-ped-style'))return;var s=document.createElement('style');s.id='a1-ped-style';s.textContent='.csl-life{margin-top:12px;padding:12px 13px;border-radius:15px;background:#f7f6f1}.csl-life-label{font-size:12px;font-weight:800;letter-spacing:.05em;color:#777}.csl-life-zh{font-size:20px;font-weight:750;margin-top:6px}.csl-life-py{font-size:13px;color:#666;margin-top:2px}.csl-life-en{font-size:14px;margin-top:5px}.csl-life-ja{font-size:11px;color:#888;margin-top:2px}.csl-life button{border:0;background:transparent;font-size:18px;padding:5px 7px}.csl-next{margin-top:10px;padding-top:10px;border-top:1px dashed #ddd}.senior .csl-life-label{font-size:17px}.senior .csl-life-zh{font-size:28px}.senior .csl-life-py,.senior .csl-life-en{font-size:18px}.senior .csl-life-ja{font-size:17px}.senior .csl-life button{font-size:23px;min-height:48px}';document.head.appendChild(s)}
function add(){style();document.querySelectorAll('.lesson').forEach(function(card){if(card.querySelector('.csl-life'))return;var z=card.querySelector('.zh');if(!z)return;var text=(z.textContent||'').trim(),a=ALT[text],n=NEXT[text];if(!a&&!n)return;var box=document.createElement('div');box.className='csl-life';var h='';if(a)h+='<div class="csl-life-label">HOW PEOPLE MAY SAY IT</div><div class="csl-life-zh">'+a.natural+' <button type="button" data-say="'+a.natural+'">🔊</button></div><div class="csl-life-py">'+a.py+'</div><div class="csl-life-en">'+a.en+'</div><div class="csl-life-ja">'+a.ja+'</div>';if(n)h+='<div class="csl-next"><div class="csl-life-label">'+n[3]+' WHAT HAPPENS NEXT?</div><div class="csl-life-zh">'+n[0]+' <button type="button" data-say="'+n[0]+'">🔊</button></div><div class="csl-life-en">'+n[1]+'</div><div class="csl-life-ja">'+n[2]+'</div></div>';box.innerHTML=h;box.querySelectorAll('[data-say]').forEach(function(b){b.onclick=function(){speak(this.getAttribute('data-say'))}});card.appendChild(box)});}
function boot(){if(!/a1-core-skills\.html$/.test(location.pathname))return;setTimeout(add,250);setTimeout(add,900)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.CSLA1Pedagogy={version:1,refresh:add};
})();