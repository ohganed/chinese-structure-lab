(function(){
'use strict';
/* Chinese Structure Lab — Fivefold English Learner Layer v1
   Additive EN layer keyed by stable curriculum IDs/families.
   Chinese and stable IDs are never changed. English is derived from Chinese structure,
   not by translating the Japanese gloss. */
var B=window.CSLFivefoldCurriculum;if(!B||!B.all)return;
function cp(x){return JSON.parse(JSON.stringify(x))}
function family(id){var m=String(id||'').match(/^csl-a[12]x-([a-z0-9-]+)-\d+$/);return m?m[1]:''}
var contextEn={
 'food-like':'Talk about what people like to eat.',
 'food-want':'Say what someone wants to eat.',
 'go-place':'Connect a time expression with going to a place.',
 'has':'Talk about something someone has.',
 'languages':'Talk about languages someone can speak.',
 'likes':'Talk about activities people like doing.',
 'location-questions':'Ask for locations in several everyday ways.',
 'permission':'Politely check whether something is allowed or possible.',
 'requests':'Ask naturally for something you need.',
 'routine':'Connect time expressions with everyday actions.',
 'shopping':'Check prices and buying options while looking at products.',
 'where-now':'Say briefly where someone is now.',
 'with-friends':'Connect plans with friends to a time.',
 'already':'Express completed actions with 已经…了.',
 'ba':'Use 把 to foreground what happens to an affected object.',
 'experience':'Talk about past experience with 过.',
 'if-then':'Connect a condition and result with 如果…就….',
 'plans':'Talk about near-future plans with 打算.'
};
var people={'我':'I','我朋友':'my friend','我妈妈':'my mother','我爸爸':'my father','我姐姐':'my older sister','我哥哥':'my older brother','王明':'Wang Ming','小林':'Xiaolin'};
var places={'学校':'school','公司':'the office','超市':'the supermarket','银行':'the bank','医院':'the hospital','车站':'the station','咖啡店':'the café','图书馆':'the library','公园':'the park','饭店':'the restaurant','商场':'the mall','机场':'the airport'};
var times={'今天早上':'this morning','今天下午':'this afternoon','今天晚上':'tonight','明天早上':'tomorrow morning','明天下午':'tomorrow afternoon','明天晚上':'tomorrow evening','周六上午':'Saturday morning','周日下午':'Sunday afternoon','明天':'tomorrow','后天':'the day after tomorrow','周六':'Saturday','周日':'Sunday','下周一':'next Monday','下个月':'next month','早上':'this morning','上午':'this morning','中午':'by noon','下午':'this afternoon','晚饭前':'before dinner','刚才':'just now'};
var foods={'米饭':'rice','面条':'noodles','饺子':'dumplings','面包':'bread','鸡蛋':'eggs','鸡肉':'chicken','鱼':'fish','蔬菜':'vegetables','水果':'fruit','苹果':'apples','香蕉':'bananas','中国菜':'Chinese food'};
var languages={'中文':'Chinese','英语':'English','日语':'Japanese','法语':'French','德语':'German','西班牙语':'Spanish','俄语':'Russian','韩语':'Korean','泰语':'Thai','越南语':'Vietnamese','意大利语':'Italian','阿拉伯语':'Arabic'};
var hobbies={'看电影':'watching movies','听音乐':'listening to music','看书':'reading','做饭':'cooking','散步':'going for walks','跑步':'running','打篮球':'playing basketball','踢足球':'playing soccer','拍照':'taking photos','旅行':'traveling','喝茶':'drinking tea','学中文':'learning Chinese'};
var routine={'起床':'get up','吃早饭':'have breakfast','洗脸':'wash my face','洗澡':'take a shower','做饭':'cook','洗衣服':'do the laundry','打扫房间':'clean my room','学习中文':'study Chinese','看书':'read','散步':'go for a walk','运动':'exercise','休息':'rest','吃午饭':'have lunch','喝咖啡':'have coffee','去买东西':'go shopping','吃晚饭':'have dinner','看电视':'watch TV','准备睡觉':'get ready for bed'};
var possessions={'一个问题':'a question','一张票':'a ticket','一把伞':'an umbrella','一张地图':'a map','一个朋友':'a friend','一辆自行车':'a bicycle','一部手机':'a phone','一本书':'a book','一张卡':'a card','一瓶水':'a bottle of water','一点儿时间':'a little time','一个办法':'an idea'};
var requestItems={'一杯水':'a glass of water','一杯茶':'a cup of tea','一杯咖啡':'a cup of coffee','一瓶水':'a bottle of water','一张票':'a ticket','一张地图':'a map','一条毛巾':'a towel','一个袋子':'a bag','一双筷子':'a pair of chopsticks','一把勺子':'a spoon','一张纸':'a sheet of paper','一支笔':'a pen'};
var shopObjects={'这本书':'this book','这件衣服':'this item of clothing','这双鞋':'these shoes','这个杯子':'this cup','这把伞':'this umbrella','这张票':'this ticket','这个包':'this bag','这瓶水':'this bottle of water','这个帽子':'this hat','这条裤子':'these pants','这部手机':'this phone','这个充电器':'this charger'};
var shopNouns={'书':'book','衣服':'clothing','鞋':'shoes','杯子':'cup','伞':'umbrella','票':'ticket','包':'bag','水':'water','帽子':'hat','裤子':'pants','手机':'phone','充电器':'charger'};
var cities={'北京':'Beijing','上海':'Shanghai','广州':'Guangzhou','深圳':'Shenzhen','成都':'Chengdu','杭州':'Hangzhou','西安':"Xi'an",'南京':'Nanjing'};
var pronounVerb={I:'I',other:'they'};
function subj(z){return people[z]||z}
function isI(z){return z==='我'}
function possessiveSubject(z){return subj(z)}
function stripPunct(s){return String(s||'').replace(/[。？！?！]$/,'')}
function cap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s}
function third(base,z){if(isI(z))return base;var irregular={'have':'has','go':'goes','do':'does','watch':'watches','study':'studies','wash':'washes'};return irregular[base]||(/(?:s|sh|ch|x|z)$/.test(base)?base+'es':base+'s')}
function actionEnglish(z,subjectZh){var a=routine[z];if(!a)return z;if(!isI(subjectZh)){
 if(a==='get up')return'gets up';if(a==='have breakfast')return'has breakfast';if(a==='wash my face')return'washes their face';if(a==='take a shower')return'takes a shower';if(a==='cook')return'cooks';if(a==='do the laundry')return'does the laundry';if(a==='clean my room')return'cleans their room';if(a==='study Chinese')return'studies Chinese';if(a==='read')return'reads';if(a==='go for a walk')return'goes for a walk';if(a==='exercise')return'exercises';if(a==='rest')return'rests';if(a==='have lunch')return'has lunch';if(a==='have coffee')return'has coffee';if(a==='go shopping')return'goes shopping';if(a==='have dinner')return'has dinner';if(a==='watch TV')return'watches TV';if(a==='get ready for bed')return'gets ready for bed';
 }return a}
function placeEn(z){return places[z]||cities[z]||z}
function nounFromShopObject(z){return shopObjects[z]||z}
function naturalTime(t){return times[t]||t}
function requestSentence(prefix,item){var o=requestItems[item]||item;
 if(prefix==='我要'||prefix==='我想要')return"I'd like "+o+'.';
 if(prefix==='请给我')return'Please give me '+o+'.';
 if(prefix==='麻烦给我')return'Could I have '+o+', please?';
 if(prefix==='我还要')return"I'd like another "+o.replace(/^(a|an) /,'')+'.';
 if(prefix==='我需要')return'I need '+o+'.';
 if(prefix==='可以给我')return'Could you give me '+o+'?';
 if(prefix==='请再给我')return'Could I have another '+o.replace(/^(a|an) /,'')+', please?';
 return'';
}
function translateA1(x,f){var z=stripPunct(x.zh),m,s,t,o,a;
 if(f==='food-like'&&(m=z.match(/^(.+?)喜欢吃(.+)$/))){s=subj(m[1]);return cap(s)+' '+(isI(m[1])?'like':'likes')+' eating '+(foods[m[2]]||m[2])+'.'}
 if(f==='food-want'&&(m=z.match(/^(.+?)想吃(.+)$/))){s=subj(m[1]);return cap(s)+' '+(isI(m[1])?'want':'wants')+' to eat '+(foods[m[2]]||m[2])+'.'}
 if(f==='go-place'&&(m=z.match(/^我(.+?)去(.+)$/)))return"I'm going to "+placeEn(m[2])+' '+naturalTime(m[1])+'.';
 if(f==='has'&&(m=z.match(/^(.+?)有(.+)$/))){s=subj(m[1]);return cap(s)+' '+(isI(m[1])?'have':'has')+' '+(possessions[m[2]]||m[2])+'.'}
 if(f==='languages'&&(m=z.match(/^(.+?)会说(.+)$/))){s=subj(m[1]);return cap(s)+' can speak '+(languages[m[2]]||m[2])+'.'}
 if(f==='likes'&&(m=z.match(/^(.+?)喜欢(.+)$/))){s=subj(m[1]);return cap(s)+' '+(isI(m[1])?'like':'likes')+' '+(hobbies[m[2]]||m[2])+'.'}
 if(f==='where-now'&&(m=z.match(/^(.+?)现在在(.+)$/))){s=subj(m[1]);return cap(s)+' '+(isI(m[1])?'am':'is')+' at '+placeEn(m[2])+' now.'}
 if(f==='routine'&&(m=z.match(/^我(.+?)(起床|吃早饭|洗脸|洗澡|做饭|洗衣服|打扫房间|学习中文|看书|散步|运动|休息|吃午饭|喝咖啡|去买东西|吃晚饭|看电视|准备睡觉)$/)))return'I '+actionEnglish(m[2],'我')+' '+naturalTime(m[1])+'.';
 if(f==='with-friends'&&(m=z.match(/^我(.+?)跟朋友(.+)$/))){var act={'吃饭':'have a meal','喝咖啡':'have coffee','聊天':'chat','见面':'meet up','看电影':'watch a movie','去公园':'go to the park','去旅行':'go on a trip','去运动':'go exercise','打电话':'make a call','散步':'go for a walk','拍照':'take photos','买东西':'go shopping'}[m[2]]||m[2];return"I'm going to "+act+' with friends '+naturalTime(m[1])+'.'}
 if(f==='requests'){
  var prefixes=['请再给我','可以给我','麻烦给我','我想要','我还要','我需要','请给我','我要'];for(var i=0;i<prefixes.length;i++){if(z.indexOf(prefixes[i])===0){var rest=z.slice(prefixes[i].length).replace(/吗$/,'');return requestSentence(prefixes[i],rest)}}
 }
 if(f==='location-questions'){
  if((m=z.match(/^(.+)在哪儿$/)))return'Where is '+placeEn(m[1])+'?';
  if((m=z.match(/^请问，(.+)在哪儿$/)))return'Excuse me, where is '+placeEn(m[1])+'?';
  if((m=z.match(/^不好意思，请问(.+)在哪儿$/)))return'Excuse me, could you tell me where '+placeEn(m[1])+' is?';
  if((m=z.match(/^我想问一下，(.+)在哪儿$/))||(m=z.match(/^想问一下，(.+)在哪儿$/)))return'Could I ask where '+placeEn(m[1])+' is?';
  if((m=z.match(/^你知道(.+)在哪儿吗$/)))return'Do you know where '+placeEn(m[1])+' is?';
  if((m=z.match(/^请问怎么去(.+)$/)))return'Excuse me, how do I get to '+placeEn(m[1])+'?';
  if((m=z.match(/^从这里去(.+)远吗$/)))return'Is '+placeEn(m[1])+' far from here?';
 }
 if(f==='shopping'){
  if((m=z.match(/^(.+)多少钱$/)))return'How much is '+nounFromShopObject(m[1])+'?';
  if((m=z.match(/^(.+)贵吗$/)))return'Is '+nounFromShopObject(m[1])+' expensive?';
  if((m=z.match(/^有没有便宜一点儿的(.+)$/)))return'Do you have a cheaper '+(shopNouns[m[1]]||m[1])+'?';
  if((m=z.match(/^我想看看(.+)$/)))return"I'd like to take a look at "+nounFromShopObject(m[1])+'.';
  if((m=z.match(/^我可以看看(.+)吗$/)))return'Can I take a look at '+nounFromShopObject(m[1])+'?';
  if((m=z.match(/^我想买(.+)$/)))return"I'd like to buy "+nounFromShopObject(m[1])+'.';
  if((m=z.match(/^买(.+)可以刷卡吗$/)))return'Can I pay by card for '+nounFromShopObject(m[1])+'?';
  if((m=z.match(/^我就要(.+)$/)))return"I'll take "+nounFromShopObject(m[1])+'.';
 }
 if(f==='permission'){
  var acts={'拍照':'take photos','停车':'park','上网':'use the internet','充电':'charge my phone','用手机':'use my phone','吃东西':'eat','喝水':'drink water','坐一下':'sit here for a moment','等一会儿':'wait here for a moment','进去':'go in','出去':'go out','买票':'buy a ticket'};
  for(var az in acts){if(z.indexOf(az)>=0){var ae=acts[az];if(/^请问/.test(z)||/^不好意思/.test(z))return'Excuse me, is it okay to '+ae+' here?';return'Can I '+ae+' here?'}}
 }
 return'';
}
function translateA2(x,f){var z=stripPunct(x.zh),m,s,time,act;
 if(f==='experience'&&(m=z.match(/^(.+?)去过(.+)$/))){s=subj(m[1]);return cap(s)+' '+(isI(m[1])?"have":"has")+' been to '+(cities[m[2]]||m[2])+'.'}
 if(f==='plans'&&(m=z.match(/^我(.+?)打算去(.+)$/)))return"I'm planning to go to "+placeEn(m[2])+' '+naturalTime(m[1])+'.';
 if(f==='already'){
  var tm=['晚饭前','刚才','早上','上午','中午','下午'];for(var i=0;i<tm.length;i++){if(z.indexOf('我'+tm[i]+'已经')===0){time=tm[i];act=z.slice(('我'+time+'已经').length).replace(/了$/,'');break}}
  if(!act&&(m=z.match(/^我已经(.+)了$/)))act=m[1];
  var am={'吃过饭':'eaten','看过邮件':'checked my email','给朋友打过电话':'called my friend','写完作业':'finished my homework','买好票':'bought the ticket','收拾好房间':'tidied the room','准备好东西':'got everything ready','订好酒店':'booked the hotel'};
  if(act){var ev=am[act]||act;if(time==='刚才')return"I've just "+ev+'.';if(time)return'I had already '+ev+' '+naturalTime(time)+'.';return"I've already "+ev+'.'}
 }
 if(f==='ba'){
  var sm=z.match(/^(.+?)把(.+?)(关上|打开|放在桌上|放进包里|写完|发出去了|收拾好了|买好了)了?$/);if(sm){s=subj(sm[1]);var obj={'门':'the door','灯':'the light','书':'the book','手机':'the phone','作业':'the homework','邮件':'the email','房间':'the room','票':'the ticket'}[sm[2]]||sm[2];var rv={'关上':'closed','打开':'turned on','放在桌上':'put on the table','放进包里':'put in the bag','写完':'finished','发出去了':'sent','收拾好了':'tidied up','买好了':'bought'}[sm[3]]||sm[3];return cap(s)+' '+rv+' '+obj+'.'}
 }
 if(f==='if-then'){
  var im=z.match(/^如果(.+?)(有时间|不舒服|累了|迟到了|迷路了|忘了带伞|听不懂|没带现金)，(.+?)就(.+)$/);if(im){s=subj(im[1]);var cond={'有时间':'has time','不舒服':'doesn\'t feel well','累了':'gets tired','迟到了':'is late','迷路了':'gets lost','忘了带伞':'forgets an umbrella','听不懂':'can\'t understand','没带现金':'doesn\'t have cash'}[im[2]]||im[2];if(isI(im[1]))cond=cond.replace(/^has /,'have ').replace(/^doesn\'t /,"don't ").replace(/^gets /,'get ').replace(/^is /,'am ').replace(/^forgets /,'forget ').replace(/^can\'t /,"can't ");var res={'去运动':'go exercise','去医院':'go to the hospital','在家休息':'rest at home','早点休息':'get some rest early','先发消息':'send a message first','问别人':'ask someone','去买一把':'go buy one','请对方再说一遍':'ask them to say it again','刷卡':'pay by card'}[im[4]]||im[4];return'If '+s+' '+cond+', '+s+' will '+res+'.'}
 }
 return'';
}
var wordEn={
 '我':'I / me','我朋友':'my friend','我妈妈':'my mother','我爸爸':'my father','我姐姐':'my older sister','我哥哥':'my older brother','王明':'Wang Ming','小林':'Xiaolin',
 '喜欢':'like','喜欢吃':'like eating','想吃':'want to eat','会说':'can speak','有':'have / there is','现在':'now','在':'be at / in','去':'go','跟朋友':'with friends','可以':'can / may','可以吗':'is it okay?','请问':'excuse me / may I ask','想问一下':'may I ask','在哪儿':'where','怎么去':'how to get to','多少钱':'how much','便宜一点儿':'a little cheaper','有没有':'do you have / is there',
 '我要':"I'd like…",'我想要':"I'd like…",'请给我':'please give me…','麻烦给我':'could I have…?','我还要':"I'd like another…",'我需要':'I need…','可以给我':'could you give me…?','请再给我':'could I have another…?',
 '把':'marks the affected object','已经':'already','了':'signals a completed or changed situation','打算':'plan to / intend to','去过':'have been to','如果…就…':'if… then…',
 '今天早上':'this morning','今天下午':'this afternoon','今天晚上':'tonight','明天早上':'tomorrow morning','明天下午':'tomorrow afternoon','明天晚上':'tomorrow evening','周六上午':'Saturday morning','周日下午':'Sunday afternoon','明天':'tomorrow','后天':'the day after tomorrow','周六':'Saturday','周日':'Sunday','下周一':'next Monday','下个月':'next month','早上':'morning','上午':'morning','中午':'noon','下午':'afternoon','晚饭前':'before dinner','刚才':'just now',
 '学校':'school','公司':'office / company','超市':'supermarket','银行':'bank','医院':'hospital','车站':'station','咖啡店':'café','图书馆':'library','公园':'park','饭店':'restaurant','商场':'mall','机场':'airport',
 '米饭':'rice','面条':'noodles','饺子':'dumplings','面包':'bread','鸡蛋':'egg / eggs','鸡肉':'chicken','鱼':'fish','蔬菜':'vegetables','水果':'fruit','苹果':'apple / apples','香蕉':'banana / bananas','中国菜':'Chinese food',
 '中文':'Chinese','英语':'English','日语':'Japanese','法语':'French','德语':'German','西班牙语':'Spanish','俄语':'Russian','韩语':'Korean','泰语':'Thai','越南语':'Vietnamese','意大利语':'Italian','阿拉伯语':'Arabic',
 '起床':'get up','吃早饭':'have breakfast','洗脸':'wash your face','洗澡':'take a shower','做饭':'cook','洗衣服':'do the laundry','打扫房间':'clean the room','学习中文':'study Chinese','看书':'read','散步':'go for a walk','运动':'exercise','休息':'rest','吃午饭':'have lunch','喝咖啡':'drink coffee','去买东西':'go shopping','吃晚饭':'have dinner','看电视':'watch TV','准备睡觉':'get ready for bed',
 '看电影':'watch movies','听音乐':'listen to music','跑步':'run','打篮球':'play basketball','踢足球':'play soccer','拍照':'take photos','旅行':'travel','喝茶':'drink tea','学中文':'learn Chinese',
 '北京':'Beijing','上海':'Shanghai','广州':'Guangzhou','深圳':'Shenzhen','成都':'Chengdu','杭州':'Hangzhou','西安':"Xi\'an",'南京':'Nanjing',
 '手机':'phone','书':'book','票':'ticket','门':'door','灯':'light','房间':'room','邮件':'email','作业':'homework','刷卡':'pay by card','有时间':'have time','不舒服':'not feel well','累了':'get tired','迟到了':'be late','迷路了':'get lost','忘了带伞':'forget an umbrella','听不懂':'not understand','没带现金':'not have cash','去运动':'go exercise','去医院':'go to the hospital','在家休息':'rest at home','早点休息':'get some rest early','先发消息':'send a message first','问别人':'ask someone','请对方再说一遍':'ask them to say it again',
 '关上':'close','打开':'turn on / open','放在桌上':'put on the table','放进包里':'put in the bag','写完':'finish','发出去了':'send out','收拾好了':'tidy up','买好了':'buy / get ready','吃过饭':'have eaten','看过邮件':'have checked email','给朋友打过电话':'have called a friend','写完作业':'have finished homework','买好票':'have bought the ticket','收拾好房间':'have tidied the room','准备好东西':'have got everything ready','订好酒店':'have booked the hotel'
};
Object.keys(places).forEach(function(k){wordEn[k]=wordEn[k]||places[k]});Object.keys(foods).forEach(function(k){wordEn[k]=wordEn[k]||foods[k]});Object.keys(languages).forEach(function(k){wordEn[k]=wordEn[k]||languages[k]});Object.keys(requestItems).forEach(function(k){wordEn[k]=requestItems[k]});Object.keys(possessions).forEach(function(k){wordEn[k]=possessions[k]});Object.keys(shopObjects).forEach(function(k){wordEn[k]=shopObjects[k]});Object.keys(shopNouns).forEach(function(k){wordEn[k]=shopNouns[k]});
function wordObject(raw,i,id){if(raw&&typeof raw==='object'){var o=cp(raw);o.en=o.en||wordEn[o.zh||o.word]||'';return o}var s=String(raw||''),parts=s.split(' · '),left=parts[0]||'',sp=left.indexOf(' '),zh=sp<0?left:left.slice(0,sp),py=sp<0?'':left.slice(sp+1),ja=parts[1]||'';return{id:id+'-w'+i,zh:zh,py:py,ja:ja,en:wordEn[zh]||''}}
function patch(x){x=cp(x);var f=family(x.id);x.contextEn=contextEn[f]||x.contextEn||'';x.en=(x.level==='A2'?translateA2(x,f):translateA1(x,f))||x.en||'';x.words=(x.words||[]).map(function(w,i){return wordObject(w,i,x.id)});return x}
var oldAll=B.all.bind(B),oldGet=B.get&&B.get.bind(B),oldQuery=B.query&&B.query.bind(B),oldForCourse=B.forCourse&&B.forCourse.bind(B);
B.all=function(level){return oldAll(level).map(patch)};
if(oldGet)B.get=function(id){var x=oldGet(id);return x?patch(x):x};
if(oldQuery)B.query=function(opts){return oldQuery(opts).map(patch)};
if(oldForCourse)B.forCourse=function(course){return oldForCourse(course).map(patch)};
B.englishLearnerLayer={version:1,stableIds:true,source:'Chinese structure, not Japanese gloss',families:Object.keys(contextEn)};
})();
