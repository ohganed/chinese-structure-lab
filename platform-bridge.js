(function(){
'use strict';

/*
  Chinese Structure Lab Platform Bridge
  ------------------------------------
  Stable app-facing API for platform services.
  Today: browser implementations.
  Future: Swift/WKWebView + CloudKit can override native methods without
  changing lesson pages or the learning model.
*/

var nativeHandler = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.cslPlatform;
var memoryFallback = {};

function hasLocalStorage(){
  try{
    var k='__csl_platform_test__';
    localStorage.setItem(k,'1');
    localStorage.removeItem(k);
    return true;
  }catch(e){ return false; }
}

var localOK = hasLocalStorage();

function nativePost(type,payload){
  if(!nativeHandler || !nativeHandler.postMessage) return false;
  try{ nativeHandler.postMessage({type:type,payload:payload||{}}); return true; }
  catch(e){ return false; }
}

function kvGet(key, fallback){
  try{
    if(localOK){
      var v=localStorage.getItem(key);
      return v===null ? fallback : v;
    }
  }catch(e){}
  return Object.prototype.hasOwnProperty.call(memoryFallback,key) ? memoryFallback[key] : fallback;
}

function kvSet(key,value){
  var s=String(value);
  try{ if(localOK){ localStorage.setItem(key,s); return true; } }catch(e){}
  memoryFallback[key]=s;
  return true;
}

function kvRemove(key){
  try{ if(localOK) localStorage.removeItem(key); }catch(e){}
  delete memoryFallback[key];
}

function vibrate(pattern){
  if(nativePost('haptic',{pattern:pattern})) return true;
  try{ if(navigator.vibrate){ navigator.vibrate(pattern); return true; } }catch(e){}
  return false;
}

function speak(text,options){
  options=options||{};
  if(!text) return false;
  if(nativePost('speak',{text:String(text),lang:options.lang||'zh-CN',rate:options.rate==null?0.9:Number(options.rate)})) return true;
  try{
    if(!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;
    var u=new SpeechSynthesisUtterance(String(text));
    u.lang=options.lang||'zh-CN';
    u.rate=options.rate==null?0.9:Number(options.rate);
    if(options.pitch!=null)u.pitch=Number(options.pitch);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  }catch(e){ return false; }
}

async function share(payload){
  payload=payload||{};
  if(nativePost('share',payload)) return {mode:'native-bridge'};
  try{
    if(navigator.share){ await navigator.share(payload); return {mode:'web-share'}; }
  }catch(e){ if(e && e.name==='AbortError') return {mode:'cancelled'}; }
  var text=payload.text||payload.url||'';
  try{
    if(navigator.clipboard && window.isSecureContext){ await navigator.clipboard.writeText(text); return {mode:'clipboard'}; }
  }catch(e){}
  return {mode:'unavailable'};
}

function capabilities(){
  return {
    bridgeVersion:1,
    runtime:nativeHandler?'native-webview':'web',
    persistentKV:localOK,
    nativeBridge:!!nativeHandler,
    speech:!!nativeHandler || !!(window.speechSynthesis && window.SpeechSynthesisUtterance),
    haptics:!!nativeHandler || !!navigator.vibrate,
    share:!!nativeHandler || !!navigator.share,
    cloudSync:false
  };
}

function emit(name,detail){
  try{ window.dispatchEvent(new CustomEvent('csl:'+name,{detail:detail||{}})); }catch(e){}
}

window.CSLPlatform={
  version:1,
  kv:{get:kvGet,set:kvSet,remove:kvRemove},
  haptic:vibrate,
  speak:speak,
  share:share,
  nativePost:nativePost,
  capabilities:capabilities,
  emit:emit
};

emit('platform-ready',capabilities());
})();