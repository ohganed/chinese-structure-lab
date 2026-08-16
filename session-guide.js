(function(){
'use strict';
var KEY='csl_active_time_session_v1';
var raw=localStorage.getItem(KEY),s=null;try{s=raw?JSON.parse(raw):null}catch(e){}
if(!s||!s.startedAt||!s.minutes)return;
var start=Date.parse(s.startedAt);if(!isFinite(start)){localStorage.removeItem(KEY);return}
var duration=Math.max(1,Number(s.minutes)||1)*60000;
var elapsed=Date.now()-start;
if(elapsed>duration+6*60*60*1000){localStorage.removeItem(KEY);return}
var st=document.createElement('style');st.textContent='#cslTimeGuide{position:fixed;left:14px;bottom:84px;z-index:9997;background:#ffffffee;border:1px solid #0001;border-radius:999px;padding:9px 12px;font:700 11px -apple-system,BlinkMacSystemFont,sans-serif;color:#666;box-shadow:0 5px 18px #0001}#cslTimeEnd{display:none;position:fixed;left:14px;right:14px;bottom:82px;z-index:9999;margin:auto;max-width:620px;background:#f7f5ef;border:1px solid #0001;border-radius:24px;padding:16px;box-shadow:0 14px 40px #0002;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#171717}#cslTimeEnd.on{display:block}#cslTimeEnd b{font-size:18px;display:block;margin-bottom:5px}#cslTimeEnd p{font-size:13px;color:#666;line-height:1.55;margin:0 0 12px}.cslTimeBtns{display:flex;gap:8px}.cslTimeBtns button,.cslTimeBtns a{flex:1;border:0;border-radius:15px;padding:12px;text-align:center;text-decoration:none;font:700 13px -apple-system,BlinkMacSystemFont,sans-serif}.cslTimeStop{background:#171717;color:#fff}.cslTimeMore{background:#e9e6de;color:#333}';document.head.appendChild(st);
var guide=document.createElement('div');guide.id='cslTimeGuide';document.body.appendChild(guide);
var end=document.createElement('div');end.id='cslTimeEnd';end.innerHTML='<b>今日はここまででも十分です。</b><p>選んだ時間になりました。ここで終えても、もう少し続けても大丈夫です。</p><div class="cslTimeBtns"><a class="cslTimeStop" href="./index.html" id="cslTimeStop">ここで終える</a><button class="cslTimeMore" id="cslTimeMore">もう少し続ける</button></div>';document.body.appendChild(end);
function finish(kind){try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent('time_session_end',{minutes:s.minutes,kind:kind,elapsedSeconds:Math.round((Date.now()-start)/1000)})}catch(e){}localStorage.removeItem(KEY)}
document.getElementById('cslTimeStop').onclick=function(){finish('stop')};document.getElementById('cslTimeMore').onclick=function(){finish('continue');end.classList.remove('on');guide.remove()};
var shown=false;function tick(){var left=Math.max(0,duration-(Date.now()-start));var m=Math.ceil(left/60000);guide.textContent=left>0?'約'+m+'分の入口':'ここまででもOK';if(left<=0&&!shown){shown=true;end.classList.add('on');try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent('time_session_reached',{minutes:s.minutes})}catch(e){}}}
tick();setInterval(tick,15000);
})();