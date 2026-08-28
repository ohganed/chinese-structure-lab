(function(){
'use strict';
/* Natural Chinese Audit correction layer v1.
   Stable sentence IDs are never changed. This layer corrects surface language,
   pinyin, Japanese glosses and word/chunk data after deterministic generation. */
var B=window.CSLFivefoldCurriculum;if(!B||!B.all)return;
function W(z,p,j){return z+' '+p+' · '+j}
function cp(x){return JSON.parse(JSON.stringify(x))}
function set(x,zh,py,ja,words,note){x.zh=zh;x.py=py;x.ja=ja;x.words=words;if(note)x.auditNote=note;return x}
/* Routine rows are generated in blocks of 12 actions per time expression.
   Correct only combinations that are poor default teaching examples, while
   retaining each permanent sentence ID. */
var time={
 '013':['今天下午','jīntiān xiàwǔ','今日の午後','吃午饭','chī wǔfàn','昼ごはんを食べます'],
 '014':['今天下午','jīntiān xiàwǔ','今日の午後','喝咖啡','hē kāfēi','コーヒーを飲みます'],
 '015':['今天下午','jīntiān xiàwǔ','今日の午後','去买东西','qù mǎi dōngxi','買い物に行きます'],
 '025':['今天晚上','jīntiān wǎnshang','今夜','吃晚饭','chī wǎnfàn','夕食を食べます'],
 '026':['今天晚上','jīntiān wǎnshang','今夜','看电视','kàn diànshì','テレビを見ます'],
 '027':['今天晚上','jīntiān wǎnshang','今夜','准备睡觉','zhǔnbèi shuìjiào','寝る準備をします'],
 '049':['明天下午','míngtiān xiàwǔ','明日の午後','吃午饭','chī wǔfàn','昼ごはんを食べます'],
 '050':['明天下午','míngtiān xiàwǔ','明日の午後','喝咖啡','hē kāfēi','コーヒーを飲みます'],
 '051':['明天下午','míngtiān xiàwǔ','明日の午後','去买东西','qù mǎi dōngxi','買い物に行きます'],
 '061':['明天晚上','míngtiān wǎnshang','明日の夜','吃晚饭','chī wǎnfàn','夕食を食べます'],
 '062':['明天晚上','míngtiān wǎnshang','明日の夜','看电视','kàn diànshì','テレビを見ます'],
 '063':['明天晚上','míngtiān wǎnshang','明日の夜','准备睡觉','zhǔnbèi shuìjiào','寝る準備をします'],
 '085':['周日下午','zhōurì xiàwǔ','日曜の午後','吃午饭','chī wǔfàn','昼ごはんを食べます'],
 '086':['周日下午','zhōurì xiàwǔ','日曜の午後','喝咖啡','hē kāfēi','コーヒーを飲みます'],
 '087':['周日下午','zhōurì xiàwǔ','日曜の午後','去买东西','qù mǎi dōngxi','買い物に行きます']
};
var shopNouns=[
 ['书','shū','本'],['衣服','yīfu','服'],['鞋','xié','靴'],['杯子','bēizi','カップ'],['伞','sǎn','傘'],['票','piào','切符'],['包','bāo','バッグ'],['水','shuǐ','水'],['帽子','màozi','帽子'],['裤子','kùzi','ズボン'],['手机','shǒujī','携帯'],['充电器','chōngdiànqì','充電器']
];
function patch(x){x=cp(x);var m;
 if((m=x.id.match(/^csl-a1x-routine-(\d{3})$/))&&time[m[1]]){
  var a=time[m[1]],zh='我'+a[0]+a[3]+'。',py='wǒ '+a[1]+' '+a[4],ja='私は'+a[2]+'、'+a[5]+'。';
  return set(x,zh,py,ja,[W('我','wǒ','私'),W(a[0],a[1],a[2]),W(a[3],a[4],a[5])],'semantic-time-action correction');
 }
 if((m=x.id.match(/^csl-a1x-shopping-(\d{3})$/))){var n=Number(m[1]);
  if(n>=25&&n<=36){var o=shopNouns[n-25];return set(x,'有没有便宜一点儿的'+o[0]+'？','yǒu méiyǒu piányi yìdiǎnr de '+o[1]+'?','もう少し安い'+o[2]+'はありますか。',[W('有没有','yǒu méiyǒu','ありますか'),W('便宜一点儿','piányi yìdiǎnr','もう少し安い'),W(o[0],o[1],o[2])],'natural shopping request');}
  if(n>=61&&n<=72){var so=[['这本书','zhè běn shū','この本'],['这件衣服','zhè jiàn yīfu','この服'],['这双鞋','zhè shuāng xié','この靴'],['这个杯子','zhège bēizi','このカップ'],['这把伞','zhè bǎ sǎn','この傘'],['这张票','zhè zhāng piào','この切符'],['这个包','zhège bāo','このバッグ'],['这瓶水','zhè píng shuǐ','この水'],['这个帽子','zhège màozi','この帽子'],['这条裤子','zhè tiáo kùzi','このズボン'],['这部手机','zhè bù shǒujī','この携帯'],['这个充电器','zhège chōngdiànqì','この充電器']][n-61];return set(x,'我想买'+so[0]+'。','wǒ xiǎng mǎi '+so[1],so[2]+'を買いたいです。',[W('我想买','wǒ xiǎng mǎi','買いたい'),W(so[0],so[1],so[2])],'replace permission-like purchase sentence');}
 }
 if(/^csl-a1x-location-questions-/.test(x.id)&&x.zh.indexOf('麻烦问一下，')===0){x.zh=x.zh.replace('麻烦问一下，','想问一下，');x.py=x.py.replace(/^máfan wèn yíxià, /,'xiǎng wèn yíxià, ');x.ja=x.ja.replace(/^お尋ねしますが、/,'ちょっと聞きたいのですが、');x.words=[W('想问一下','xiǎng wèn yíxià','ちょっと聞きたい'),x.words[0],W('在哪儿','zài nǎr','どこ')];x.auditNote='lighter everyday question';}
 return x;
}
var oldAll=B.all.bind(B),oldGet=B.get&&B.get.bind(B),oldQuery=B.query&&B.query.bind(B),oldForCourse=B.forCourse&&B.forCourse.bind(B);
B.all=function(level){return oldAll(level).map(patch)};
if(oldGet)B.get=function(id){var x=oldGet(id);return x?patch(x):x};
if(oldQuery)B.query=function(opts){return oldQuery(opts).map(patch)};
if(oldForCourse)B.forCourse=function(course){return oldForCourse(course).map(patch)};
B.naturalChineseAudit={version:1,stableIds:true,correctedFamilies:['routine','shopping','location-questions']};
})();
