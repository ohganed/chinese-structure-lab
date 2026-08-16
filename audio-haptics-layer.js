(function(){
'use strict';

/*
  Chinese Structure Lab · Audio & Haptics Layer
  --------------------------------------------
  Keeps lesson pages platform-neutral.
  Web today -> CSLPlatform browser implementations.
  Native later -> the same calls can be handled by Swift/WKWebView.
*/

var previousSpeak = typeof window.speak === 'function' ? window.speak : null;
var lastHapticAt = 0;

function platform(){
  return window.CSLPlatform || null;
}

function speak(text, rate, options){
  options = options || {};
  var p = platform();
  var r = rate == null ? (options.rate == null ? 0.9 : Number(options.rate)) : Number(rate);
  if(p && typeof p.speak === 'function'){
    return p.speak(String(text || ''), {
      lang: options.lang || 'zh-CN',
      rate: isFinite(r) ? r : 0.9,
      pitch: options.pitch
    });
  }
  if(previousSpeak){
    try{return previousSpeak(text,r);}catch(e){}
  }
  return false;
}

function haptic(kind){
  var now = Date.now();
  if(now-lastHapticAt<70)return false;
  lastHapticAt=now;
  var p=platform();
  if(!p || typeof p.haptic!=='function')return false;
  var pattern;
  switch(kind){
    case 'confirm': pattern=[45,35,65]; break;
    case 'soft': pattern=28; break;
    case 'audio': pattern=20; break;
    default: pattern=18;
  }
  return p.haptic(pattern);
}

window.CSLAudio={version:1,speak:speak,haptic:haptic};
window.cslSpeak=speak;
window.cslHaptic=haptic;

/*
  Most existing lesson pages already call a global speak(text, rate).
  Replacing that one function lets old pages adopt the bridge without
  changing their visible UI or learning content.
*/
if(previousSpeak){
  window.speak=function(text,rate){return speak(text,rate);};
}

/*
  Quiet tactile acknowledgement only for controls that already produce audio.
  This is intentionally not attached to every button: no gamification and no
  constant buzzing. Web browsers that do not support vibration simply ignore it;
  a future native shell can translate the same call into Core Haptics.
*/
document.addEventListener('click',function(ev){
  var target=ev.target && ev.target.closest ? ev.target.closest('.word,.natural,.slow,[data-csl-audio]') : null;
  if(target)haptic('audio');
},true);

try{
  if(platform() && platform().emit){
    platform().emit('audio-haptics-ready',{version:1});
  }
}catch(e){}
})();