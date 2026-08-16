(function(){
'use strict';
var KEY='csl_active_time_session_v1';
var raw=localStorage.getItem(KEY),s=null;try{s=raw?JSON.parse(raw):null}catch(e){}
if(!s||!s.startedAt||!s.minutes)return;
var start=Date.parse(s.startedAt);if(!isFinite(start)){localStorage.removeItem(KEY);return}
var duration=Math.max(1,Number(s.minutes)||1)*60000;
var elapsed=Date.now()-start;
if(elapsed>duration+6*60*60*1000){localStorage.removeItem(KEY);return}
var target=Math.max(1,Number(s.targetMoments)||({1:2,3:4,10:8,20:14,45:24}[Number(s.minutes)]||8));
var density=s.density||((s.minutes<=1)?'tiny':(s.minutes<=3)?'light':(s.minutes<=10)?'normal':(s.minutes<=20)?'wide':'deep');
s.targetMoments=target;s.density=density;s.moments=Number(s.moments)||0;try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}
document.body.classList.add('csl-session-'+density);
var st=document.createElement('style');st.textContent='#cslTimeGuide{position:fixed;left:14px;bottom:84px;z-index:9997;background:#ffffffee;border:1px solid #0001;border-radius:999px;padding:9px 12px;font:700 11px -apple-system,BlinkMacSystemFont,sans-serif;color:#666;box-shadow:0 5px 18px #0001}#cslTimeEnd{display:none;position:fixed;left:14px;right:14px;bottom:82px;z-index:9999;margin:auto;max-width:620px;background:#f7f5ef;border:1px solid #0001;border-radius:24px;padding:16px;box-shadow:0 14px 40px #0002;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#171717}#cslTimeEnd.on{display:block}#cslTimeEnd b{font-size:18px;display:block;margin-bottom:5px}#cslTimeEnd p{font-size:13px;color:#666;line-height:1.55;margin:0 0 12px}.cslTimeBtns{display:flex;gap:8px}.cslTimeBtns button,.cslTimeBtns a{flex:1;border:0;border-radius:15px;padding:12px;text-align:center;text-decoration:none;font:700 13px -apple-system,BlinkMacSystemFont,sans-serif}.cslTimeStop{background:#171717;color:#fff}.cslTimeMore{background:#e9e6de;color:#333}.csl-session-tiny details,.csl-session-tiny .network,.csl-session-tiny .branches,.csl-session-tiny .bridge,.csl-session-tiny .dialogue,.csl-session-tiny .teaching-note,.csl-session-tiny .deep-detail{display:none!important}.csl-session-light .network,.csl-session-light .branches,.csl-session-light .bridge,.csl-session-light .deep-detail{display:none!important}';document.head.appendChild(st);
var guide=document.createElement('div');guide.id='cslTimeGuide';document.body.appendChild(guide);
var end=document.createElement('div');end.id='cslTimeEnd';end.innerHTML='<b>今日はここまででも十分です。</b><p id="cslTimeEndText">選んだ時間・学習量の目安に届きました。ここで終えても、もう少し続けても大丈夫です。</p><div class="cslTimeBtns"><a class="cslTimeStop" href="./index.html" id="cslTimeStop">ここで終える</a><button class="cslTimeMore" id="cslTimeMore">もう少し続ける</button></div>';document.body.appendChild(end);
function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function finish(kind){try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent('time_session_end',{minutes:s.minutes,kind:kind,elapsedSeconds:Math.round((Date.now()-start)/1000),moments:s.moments,targetMoments:target,density:density})}catch(e){}localStorage.removeItem(KEY)}
document.getElementById('cslTimeStop').onclick=function(){finish('stop')};document.getElementById('cslTimeMore').onclick=function(){finish('continue');end.classList.remove('on');guide.remove();document.body.classList.remove('csl-session-'+density)};
var shown=false;function showEnd(reason){if(shown)return;shown=true;document.getElementById('cslTimeEndText').textContent=reason==='amount'?'今日の学習量の目安に届きました。ここで終えても、もう少し続けても大丈夫です。':'選んだ時間になりました。ここで終えても、もう少し続けても大丈夫です。';end.classList.add('on');try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent('time_session_reached',{minutes:s.minutes,reason:reason,moments:s.moments,targetMoments:target,density:density})}catch(e){}}
var lastKey='',lastAt=0;function meaningful(el){if(!el||!el.closest)return null;return el.closest('.word,.reveal,.natural,.slow,.pybtn,.fuzzy,.play,.listen,.audio,[data-action="listen"],[onclick*="hear"],[onclick*="speak"],[onclick*="play"],.nav .primary')}
document.addEventListener('click',function(ev){if(shown)return;var el=meaningful(ev.target);if(!el)return;if(el.closest('#cslTimeEnd,#cslFeedbackPanel'))return;var key=(el.className||'')+'|'+(el.textContent||'').trim().slice(0,30);var now=Date.now();if(key===lastKey&&now-lastAt<1800)return;lastKey=key;lastAt=now;s.moments=(Number(s.moments)||0)+1;save();if(s.moments>=target)showEnd('amount')},true);
function tick(){var left=Math.max(0,duration-(Date.now()-start));var m=Math.ceil(left/60000);guide.textContent=left>0?'約'+m+'分 · '+Math.min(s.moments,target)+'/'+target:'ここまででもOK';if(left<=0)showEnd('time')}
tick();setInterval(tick,15000);
})();