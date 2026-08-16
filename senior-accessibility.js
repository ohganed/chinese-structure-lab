(function(){
'use strict';
/* Senior Accessibility Layer v1
   Completes large-text mode by lifting tiny helper text too, without redesigning pages. */
var ID='csl-senior-accessibility-style';
function css(){if(document.getElementById(ID))return;var s=document.createElement('style');s.id=ID;s.textContent=`
/* Normal mode: avoid extremely tiny essential text on phones. */
@media (max-width:760px){
  .eyebrow,.stageLabel,.progress,.memory,.bridge,.dialogue,.who span,.worldline small,.word small,.branch span{font-size:max(12px,0.75rem)!important;line-height:1.45}
}
/* Large/senior mode: secondary information must grow with primary text. */
.senior .eyebrow,.senior .stageLabel,.senior .progress{font-size:17px!important;line-height:1.45!important;letter-spacing:.045em!important}
.senior .memory,.senior .bridge,.senior .dialogue,.senior .who span,.senior .worldline small,.senior .word small,.senior .branch span{font-size:18px!important;line-height:1.55!important}
.senior .tabs a,.senior .bottom a{font-size:18px!important;line-height:1.3!important;min-height:52px;display:flex;align-items:center;justify-content:center}
.senior summary,.senior details summary{font-size:20px!important;line-height:1.45!important;min-height:48px;display:flex;align-items:center}
.senior .pybtn{font-size:18px!important;min-height:48px;padding:10px 14px!important}
.senior button,.senior [role="button"],.senior a.csl-cue{min-height:48px}
.senior p,.senior li{line-height:1.65}
@media(max-width:430px){
 .senior .eyebrow,.senior .stageLabel,.senior .progress{font-size:16px!important}
 .senior .memory,.senior .bridge,.senior .dialogue,.senior .word small,.senior .branch span{font-size:17px!important}
}
`;document.head.appendChild(s)}
function sync(){css();var large=localStorage.getItem('csl_large_text')==='1';document.documentElement.classList.toggle('csl-senior-root',large);if(large&&document.body&&!document.body.classList.contains('senior'))document.body.classList.add('senior')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
window.addEventListener('storage',function(e){if(e.key==='csl_large_text')sync()});
var oldSet=Storage.prototype.setItem;/* observe same-tab setting changes without changing app APIs */
if(!window.__cslSeniorStorageHook){window.__cslSeniorStorageHook=true;Storage.prototype.setItem=function(k,v){oldSet.apply(this,arguments);if(k==='csl_large_text')setTimeout(sync,0)}}
window.CSLSeniorAccessibility={version:1,refresh:sync};
})();