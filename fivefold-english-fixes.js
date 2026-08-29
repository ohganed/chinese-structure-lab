(function(){
'use strict';
/* Fivefold English completion fixes v1.
   Small additive correction layer after fivefold-english-layer.js.
   Stable IDs, Chinese, Japanese and learning history are untouched. */
var B=window.CSLFivefoldCurriculum;if(!B||!B.all)return;
function cp(x){return JSON.parse(JSON.stringify(x))}
var wordEn={
 '我想买':"I'd like to buy…",
 '坐一下':'sit for a moment',
 '等一会儿':'wait for a moment',
 '充电':'charge a device',
 '吃东西':'eat something',
 '喝水':'drink water',
 '用手机':'use a phone',
 '上网':'use the internet',
 '进去':'go in',
 '出去':'go out',
 '停车':'park',
 '买票':'buy a ticket',
 '在这里':'here / in this place',
 '吃饭':'have a meal',
 '去公园':'go to the park',
 '打电话':'make a phone call',
 '见面':'meet / meet up',
 '聊天':'chat',
 '去旅行':'go on a trip',
 '去北京':'go to Beijing',
 '看朋友':'see a friend',
 '买东西':'go shopping',
 '去银行':'go to the bank',
 '去买一把':'go buy one'
};
var timeEn={
 '明天':'tomorrow',
 '后天':'the day after tomorrow',
 '周六':'on Saturday',
 '周日':'on Sunday',
 '下周一':'next Monday',
 '下个月':'next month'
};
var planAction={
 '看朋友':'see a friend',
 '买东西':'go shopping',
 '在家休息':'rest at home',
 '学中文':'study Chinese'
};
var people={
 '我':'I',
 '我朋友':'my friend',
 '我妈妈':'my mother',
 '我爸爸':'my father',
 '我姐姐':'my older sister',
 '我哥哥':'my older brother'
};
var cities={'北京':'Beijing','上海':'Shanghai','广州':'Guangzhou','深圳':'Shenzhen','成都':'Chengdu','杭州':'Hangzhou','西安':"Xi'an",'南京':'Nanjing'};
function patch(x){
 x=cp(x);
 if(/^csl-a2x-plans-/.test(x.id)&&!x.en){
  var m=x.zh.match(/^我(.+?)打算(.+)。$/);
  if(m&&planAction[m[2]])x.en="I'm planning to "+planAction[m[2]]+' '+(timeEn[m[1]]||m[1])+'.';
 }
 if(/^csl-a2x-experience-/.test(x.id)){
  var e=x.zh.match(/^(.+?)去过(.+)。$/);
  if(e){
   var who=people[e[1]]||e[1],city=cities[e[2]]||e[2];
   x.en=e[1]==='我'?"I've been to "+city+'.':who.charAt(0).toUpperCase()+who.slice(1)+' has been to '+city+'.';
  }
 }
 x.words=(x.words||[]).map(function(w){
  if(w&&typeof w==='object'&&!w.en&&wordEn[w.zh]){w=cp(w);w.en=wordEn[w.zh]}
  return w;
 });
 return x;
}
var oldAll=B.all.bind(B),oldGet=B.get&&B.get.bind(B),oldQuery=B.query&&B.query.bind(B),oldForCourse=B.forCourse&&B.forCourse.bind(B);
B.all=function(level){return oldAll(level).map(patch)};
if(oldGet)B.get=function(id){var x=oldGet(id);return x?patch(x):x};
if(oldQuery)B.query=function(opts){return oldQuery(opts).map(patch)};
if(oldForCourse)B.forCourse=function(course){return oldForCourse(course).map(patch)};
B.englishCompletionFixes={version:1,stableIds:true};
})();
