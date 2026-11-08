/* Chinese-only Cognition Checkpoint v1: parallel-form assessment prompts.
 * Diagnostic, not a validated language-proficiency exam.
 * Responses remain in the input box and are not persisted.
 */
(function (global) {
'use strict';
var phases = {
  initial: {
    title:'初回診断',
    description:'現在の生成能力を記録します。すでに学習済みなら、学習前の得点とは解釈しません。',
    items:[
      {id:'ck1-state',category:'位置・在',ja:'通学かばんは椅子の上にあります。',answer:'书包在椅子上。',pinyin:'shūbāo zài yǐzi shàng',accepted:['书包在椅子上。'],explanation:'状態を伝える文では、书包 が話題となる物、在椅子上 が場所を表します。'},
      {id:'ck1-ba',category:'把・動作と結果',ja:'彼女はスマートフォンをテーブルの上に置きました。',answer:'她把手机放在桌子上了。',pinyin:'tā bǎ shǒujī fàng zài zhuōzi shàng le',accepted:['她把手机放在桌子上了。','她把手机放到了桌子上。','她把手机放到桌子上了。'],explanation:'把 の後ろで対象を示し、放在／放到 で置く動作と到達位置を伝えます。'},
      {id:'ck1-relative',category:'的・修飾節',ja:'先生が知っている留学生が来ました。',answer:'老师认识的留学生来了。',pinyin:'lǎoshī rènshi de liúxuéshēng lái le',accepted:['老师认识的留学生来了。'],explanation:'「老师认识的」が留学生を修飾します。认识 の動作主は老师です。'},
      {id:'ck1-motion',category:'方向補語',ja:'女の子は走って部屋に入りました。',answer:'女孩跑进房间了。',pinyin:'nǚhái pǎo jìn fángjiān le',accepted:['女孩跑进房间了。','女孩子跑进房间了。'],explanation:'跑 は走る動作、进 は内側への移動を表します。'},
      {id:'ck1-result',category:'結果補語・完',ja:'彼は新聞を読み終えました。',answer:'他看完报纸了。',pinyin:'tā kàn wán bàozhǐ le',accepted:['他看完报纸了。','他把报纸看完了。'],explanation:'完 は最後まで終えた結果を表します。把構文でも同じ出来事を表現できます。'},
      {id:'ck1-give',category:'给・授受',ja:'私は弟に本を一冊あげました。',answer:'我给了弟弟一本书。',pinyin:'wǒ gěi le dìdi yì běn shū',accepted:['我给了弟弟一本书。','我给弟弟一本书了。'],explanation:'我 が渡す人、弟弟 が受け取る人、一本书 が渡すものです。'}
    ]
  },
  delayed:{
    title:'7日後の再診断',
    description:'異なる人物・物・方向を用いた問題です。初回診断から7日後に受けられます。',
    items:[
      {id:'ck7-state',category:'位置・在',ja:'傘はドアのそばにあります。',answer:'伞在门旁边。',pinyin:'sǎn zài mén pángbiān',accepted:['伞在门旁边。','雨伞在门旁边。','伞在门边。','雨伞在门边。'],explanation:'在门旁边／在门边 は場所を表します。'},
      {id:'ck7-ba',category:'把・動作と結果',ja:'彼はコートをベッドの上に置きました。',answer:'他把外套放在床上了。',pinyin:'tā bǎ wàitào fàng zài chuáng shàng le',accepted:['他把外套放在床上了。','他把外套放到了床上。','他把外套放到床上了。'],explanation:'把 の後ろで影響を受ける対象を示し、動作と到達先を述べます。'},
      {id:'ck7-relative',category:'的・修飾節',ja:'先生を知っている留学生が来ました。',answer:'认识老师的留学生来了。',pinyin:'rènshi lǎoshī de liúxuéshēng lái le',accepted:['认识老师的留学生来了。'],explanation:'认识 の動作主は留学生です。「老师认识的」とは関係が逆になります。'},
      {id:'ck7-motion',category:'方向補語',ja:'男の子は歩いて部屋から出ました。',answer:'男孩走出房间了。',pinyin:'nánhái zǒu chū fángjiān le',accepted:['男孩走出房间了。','男孩子走出房间了。'],explanation:'走 は歩く動作、出 は外へ向かう方向を表します。'},
      {id:'ck7-result',category:'結果補語・完',ja:'彼女は手紙を書き終えました。',answer:'她写完信了。',pinyin:'tā xiě wán xìn le',accepted:['她写完信了。','她把信写完了。'],explanation:'写完 は書く動作の完了を表します。'},
      {id:'ck7-give',category:'给・授受',ja:'彼女は友達に水を一杯渡しました。',answer:'她给了朋友一杯水。',pinyin:'tā gěi le péngyou yì bēi shuǐ',accepted:['她给了朋友一杯水。','她给朋友一杯水了。'],explanation:'她 → 朋友 の授受関係です。量詞 杯 は水を一杯数えるのに使います。'}
    ]
  }
};
function validate(){
 var errors=[],ids={};
 Object.keys(phases).forEach(function(phase){
  var p=phases[phase];
  if(!p.items||p.items.length!==6)errors.push(phase+': expected six prompts');
  (p.items||[]).forEach(function(x){
   if(!x.id || ids[x.id])errors.push(x.id+': missing or duplicate id');
   ids[x.id]=1;
   if(!x.ja||!x.answer||!x.pinyin||!x.explanation)errors.push(x.id+': missing field');
   if(!Array.isArray(x.accepted)||!x.accepted.includes(x.answer))errors.push(x.id+': canonical answer not accepted');
  });
 });
 return {ok:errors.length===0,errors:errors};
}
global.CognitionCheckpointData=Object.freeze({version:'1.0.0',phases:phases,validate:validate});
})(window);
