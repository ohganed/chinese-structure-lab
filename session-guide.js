(function(){
'use strict';
var KEY='csl_active_time_session_v1';
var raw=localStorage.getItem(KEY),s=null;try{s=raw?JSON.parse(raw):null}catch(e){}
if(!s||!s.startedAt||!s.minutes)return;
var path=(location.pathname||'').split('/').pop();
if(Number(s.minutes)===3&&path==='three-minute.html')return;
var start=Date.parse(s.startedAt);if(!isFinite(start)){localStorage.removeItem(KEY);return}
var duration=Math.max(1,Number(s.minutes)||1)*60000;
var elapsed=Date.now()-start;
if(elapsed>duration+6*60*60*1000){localStorage.removeItem(KEY);return}
var target=Math.max(1,Number(s.targetMoments)||({1:2,3:3,10:8,20:14,45:24}[Number(s.minutes)]||8));
var density=s.density||((s.minutes<=1)?'tiny':(s.minutes<=3)?'light':(s.minutes<=10)?'normal':(s.minutes<=20)?'wide':'deep');
s.targetMoments=target;s.density=density;s.moments=Number(s.moments)||0;try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}
document.body.classList.add('csl-session-'+density);
var st=document.createElement('style');st.textContent='#cslTimeGuide{position:fixed;left:14px;bottom:84px;z-index:9997;background:#ffffffee;border:1px solid #0001;border-radius:999px;padding:9px 12px;font:700 11px -apple-system,BlinkMacSystemFont,sans-serif;color:#666;box-shadow:0 5px 18px #0001;cursor:pointer}#cslTimeEnd{display:none;position:fixed;left:14px;right:14px;bottom:82px;z-index:9999;margin:auto;max-width:620px;background:#f7f5ef;border:1px solid #0001;border-radius:24px;padding:16px;box-shadow:0 14px 40px #0002;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#171717}#cslTimeEnd.on{display:block}#cslTimeEnd b{font-size:18px;display:block;margin-bottom:5px}#cslTimeEnd p{font-size:13px;color:#666;line-height:1.55;margin:0 0 12px}.cslTimeBtns{display:flex;gap:8px}.cslTimeBtns button,.cslTimeBtns a{flex:1;border:0;border-radius:15px;padding:12px;text-align:center;text-decoration:none;font:700 13px -apple-system,BlinkMacSystemFont,sans-serif}.cslTimeStop{background:#171717;color:#fff}.cslTimeMore{background:#e9e6de;color:#333}.csl-session-tiny details,.csl-session-tiny .network,.csl-session-tiny .branches,.csl-session-tiny .bridge,.csl-session-tiny .dialogue,.csl-session-tiny .teaching-note,.csl-session-tiny .deep-detail{display:none!important}.csl-session-light .network,.csl-session-light .branches,.csl-session-light .bridge,.csl-session-light .deep-detail{display:none!important}';document.head.appendChild(st);
var guide=document.createElement('div');guide.id='cslTimeGuide';document.body.appendChild(guide);
var end=document.createElement('div');end.id='cslTimeEnd';end.innerHTML='<b>今日はここまででも十分です。</b><p id="cslTimeEndText">選んだ時間・学習量の目安に届きました。ここで終えると、このセッションの記録を一度だけ分析して次回の学習に引き継ぎます。</p><div class="cslTimeBtns"><button class="cslTimeStop" id="cslTimeStop">学習を終了</button><button class="cslTimeMore" id="cslTimeMore">もう少し続ける</button></div>';document.body.appendChild(end);
function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function record(type,data){try{if(window.CSLLightEventBuffer&&CSLLightEventBuffer.emit)return CSLLightEventBuffer.emit(type,data)}catch(e){}try{if(window.CSLStorage&&CSLStorage.addEvent)CSLStorage.addEvent(type,data)}catch(e){}}
function finish(kind){record('time_session_end',{minutes:s.minutes,kind:kind,elapsedSeconds:Math.round((Date.now()-start)/1000),moments:s.moments,targetMoments:target,density:density});localStorage.removeItem(KEY)}
function endLearning(){var btn=document.getElementById('cslTimeStop');btn.disabled=true;btn.textContent='学習を整理中…';var meta={minutes:s.minutes,elapsedSeconds:Math.round((Date.now()-start)/1000),moments:s.moments,targetMoments:target,density:density,page:path};finish('stop');try{window.dispatchEvent(new CustomEvent('csl:session-ended',{detail:meta}))}catch(e){}var p=window.CSLSessionEndAnalyzer&&CSLSessionEndAnalyzer.analyze?CSLSessionEndAnalyzer.analyze(meta):Promise.resolve(null);Promise.resolve(p).then(function(){location.href='./index.html'}).catch(function(){location.href='./index.html'})}
document.getElementById('cslTimeStop').onclick=endLearning;
document.getElementById('cslTimeMore').onclick=function(){end.classList.remove('on');guide.textContent='学習を続けています · タップで終了';guide.onclick=function(){end.classList.add('on')};record('time_session_continued',{minutes:s.minutes,elapsedSeconds:Math.round((Date.now()-start)/1000),moments:s.moments,targetMoments:target,density:density});};
var shown=false;function showEnd(reason){if(shown)return;shown=true;document.getElementById('cslTimeEndText').textContent=reason==='amount'?'今日の学習量の目安に届きました。「学習を終了」を押すと、今の学習記録を一度だけ分析して次回へ引き継ぎます。':'選んだ時間になりました。「学習を終了」を押すと、今の学習記録を一度だけ分析して次回へ引き継ぎます。';end.classList.add('on');record('time_session_reached',{minutes:s.minutes,reason:reason,moments:s.moments,targetMoments:target,density:density})}
var lastKey='',lastAt=0;function meaningful(el){if(!el||!el.closest)return null;return el.closest('.word,.csl-word-touch,.reveal,.natural,.slow,.pybtn,.fuzzy,.play,.listen,.audio,[data-action="listen"],[onclick*="hear"],[onclick*="speak"],[onclick*="play"],.nav .primary')}
document.addEventListener('click',function(ev){if(ev.target&&ev.target.closest&&ev.target.closest('#cslTimeEnd,#cslTimeGuide,#cslFeedbackPanel'))return;var el=meaningful(ev.target);if(!el)return;var key=(el.className||'')+'|'+(el.textContent||'').trim().slice(0,30);var now=Date.now();if(key===lastKey&&now-lastAt<1800)return;lastKey=key;lastAt=now;s.moments=(Number(s.moments)||0)+1;save();if(!shown&&s.moments>=target)showEnd('amount')},true);
function tick(){var left=Math.max(0,duration-(Date.now()-start));var m=Math.ceil(left/60000);if(!guide.onclick)guide.textContent=left>0?'約'+m+'分 · '+Math.min(s.moments,target)+'/'+target:'ここまででもOK';if(left<=0&&!shown)showEnd('time')}
tick();setInterval(tick,15000);
})();