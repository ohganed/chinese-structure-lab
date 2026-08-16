(function(){
'use strict';
/* Adaptive Presentation Engine v1
   Chooses HOW to present, not WHAT the learner must do.
   Advice only in v1: existing UI is not forcibly rearranged. */
var VERSION=1,EXT='adaptivePresentationV1';
function S(){return window.CSLStorage||null}function L(){return window.CSLLearnerModel||null}function Q(){return window.CSLEncounterQuality||null}function O(){return window.CSLOpportunityMatching||null}
function now(){return new Date().toISOString()}
function build(){var learner=L()&&L().get?L().get():null,quality=Q()&&Q().get?Q().get():null,opp=O()&&O().get?O().get():null;
 var pref=learner&&learner.preferences||{},dim=learner&&learner.dimensions||{},avg=quality&&quality.summary?Number(quality.summary.averageRichness)||0:0,evidence=learner&&learner.evidenceLevel||'very-low';
 var plan={version:VERSION,builtAt:now(),evidenceLevel:evidence,defaults:{situationFirst:true,showChinese:true,pinyin:'on-demand',meaning:'on-demand',audio:'available',grammar:'collapsed'},adaptive:{},policy:{adviceOnly:true,neverHideRecoveryControls:true,neverRemoveMeaning:true,neverForceAudio:true,seniorModeOverridesDensity:true,lowEvidenceMeansConservative:true}};
 if(evidence==='very-low'||evidence==='low'){plan.adaptive={presentation:'conservative',audioOrder:'neutral',pinyin:'available-nearby',meaning:'available-nearby',explanationDensity:'normal'};return plan}
 var audio=(dim.audioEngagement&&dim.audioEngagement.score)||0,context=(dim.contextConnection&&dim.contextConnection.score)||0,form=(dim.formFamiliarity&&dim.formFamiliarity.score)||0;
 plan.adaptive.presentation=context>=.55?'context-first':'balanced';plan.adaptive.audioOrder=audio>=.55?(pref.audioPace==='slow-supportive'?'slow-supportive':'natural-first'):'neutral';plan.adaptive.pinyin=form>=.62&&avg>=.42?'on-demand':'available-nearby';plan.adaptive.meaning=avg>=.58?'on-demand':'available-nearby';plan.adaptive.explanationDensity=avg>=.62?'light':'normal';plan.adaptive.reencounterHint=opp&&opp.recommendations&&opp.recommendations.length?'quiet-natural-opportunity':'none';return plan}
function save(x){var s=S();if(!s||!s.load||!s.save)return x;var p=s.load();p.extensions=p.extensions||{};p.extensions[EXT]=x;s.save(p);return x}function refresh(){return save(build())}function get(){return refresh()}
window.CSLAdaptivePresentation={version:VERSION,get:get,refresh:refresh};setTimeout(function(){try{var g=refresh();if(window.CSLPlatform&&CSLPlatform.emit)CSLPlatform.emit('adaptive-presentation-ready',{version:VERSION,evidence:g.evidenceLevel})}catch(e){}},2950);
})();