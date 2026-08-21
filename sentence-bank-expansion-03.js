(function(){
'use strict';
/* Shared Sentence Bank expansion batch 03.
   Compact, curated situation rows bring the shared bank from 180 to 300 items.
   The UI still loads only the four moments needed for a session. */
var B=window.CSLSentenceBank;if(!B)return;
var G=[
['daily','🏠','毎日の暮らし','日常の小さな場面で使います。',[
['我吃早饭了。','wǒ chī zǎofàn le','朝ごはんを食べました。'],['我先去洗脸。','wǒ xiān qù xǐliǎn','先に顔を洗います。'],['门还没关。','mén hái méi guān','ドアがまだ閉まっていません。'],['请把灯打开。','qǐng bǎ dēng dǎkāi','電気をつけてください。'],['我在洗衣服。','wǒ zài xǐ yīfu','洗濯をしています。'],['垃圾放在哪儿？','lājī fàng zài nǎr','ごみはどこに置きますか。'],['今天要打扫房间。','jīntiān yào dǎsǎo fángjiān','今日は部屋を掃除します。'],['冰箱里有牛奶。','bīngxiāng lǐ yǒu niúnǎi','冷蔵庫に牛乳があります。'],['我忘带钥匙了。','wǒ wàng dài yàoshi le','鍵を持ってくるのを忘れました。'],['晚饭以后我散步。','wǎnfàn yǐhòu wǒ sànbù','夕食後に散歩します。']]],
['food','🍜','食事とカフェ','注文や食事の場面で使います。',[
['请给我看菜单。','qǐng gěi wǒ kàn càidān','メニューを見せてください。'],['你们有什么推荐？','nǐmen yǒu shénme tuījiàn','おすすめは何ですか。'],['我要这个套餐。','wǒ yào zhège tàocān','このセットをください。'],['请少放一点儿盐。','qǐng shǎo fàng yìdiǎnr yán','塩を少なめにしてください。'],['我不能吃花生。','wǒ bù néng chī huāshēng','ピーナッツは食べられません。'],['这个菜不太辣。','zhège cài bú tài là','この料理はあまり辛くありません。'],['汤可以再热一下吗？','tāng kěyǐ zài rè yíxià ma','スープを温め直せますか。'],['我们一起点吧。','wǒmen yìqǐ diǎn ba','一緒に注文しましょう。'],['还要等多久？','hái yào děng duōjiǔ','あとどのくらい待ちますか。'],['请帮我打包。','qǐng bāng wǒ dǎbāo','持ち帰りにしてください。']]],
['travel','🚇','移動と旅行','駅や移動中の場面で使います。',[
['去机场怎么走？','qù jīchǎng zěnme zǒu','空港へはどう行きますか。'],['我要买两张票。','wǒ yào mǎi liǎng zhāng piào','切符を2枚買いたいです。'],['这趟车到北京吗？','zhè tàng chē dào Běijīng ma','この列車は北京に行きますか。'],['下一站是什么？','xià yí zhàn shì shénme','次の駅はどこですか。'],['请问几号站台？','qǐngwèn jǐ hào zhàntái','何番ホームですか。'],['火车晚点了。','huǒchē wǎndiǎn le','列車が遅れています。'],['我坐错车了。','wǒ zuò cuò chē le','乗る電車を間違えました。'],['可以在这里换车。','kěyǐ zài zhèlǐ huànchē','ここで乗り換えられます。'],['到站请告诉我。','dào zhàn qǐng gàosu wǒ','着いたら教えてください。'],['我的行李在那边。','wǒ de xíngli zài nàbian','私の荷物はあちらです。']]],
['shopping','🛍️','買い物','店で選び、確認する場面で使います。',[
['我想看看这件。','wǒ xiǎng kànkan zhè jiàn','これを見たいです。'],['有没有黑色的？','yǒu méiyǒu hēisè de','黒色はありますか。'],['这个尺寸合适。','zhège chǐcùn héshì','このサイズが合います。'],['试衣间在哪里？','shìyījiān zài nǎlǐ','試着室はどこですか。'],['可以便宜一点儿吗？','kěyǐ piányi yìdiǎnr ma','少し安くできますか。'],['我再考虑一下。','wǒ zài kǎolǜ yíxià','もう少し考えます。'],['这个可以退吗？','zhège kěyǐ tuì ma','これは返品できますか。'],['我没有现金。','wǒ méiyǒu xiànjīn','現金を持っていません。'],['请分开装。','qǐng fēnkāi zhuāng','別々に袋へ入れてください。'],['营业到几点？','yíngyè dào jǐ diǎn','何時まで営業していますか。']]],
['social','🙂','人との会話','人と自然にやり取りする場面で使います。',[
['你叫什么名字？','nǐ jiào shénme míngzi','お名前は何ですか。'],['我是日本人。','wǒ shì Rìběnrén','私は日本人です。'],['你住在哪里？','nǐ zhù zài nǎlǐ','どこに住んでいますか。'],['我也喜欢音乐。','wǒ yě xǐhuan yīnyuè','私も音楽が好きです。'],['周末一起吃饭吧。','zhōumò yìqǐ chīfàn ba','週末に一緒に食事しましょう。'],['今天见到你很开心。','jīntiān jiàndào nǐ hěn kāixīn','今日は会えてうれしいです。'],['代我向他问好。','dài wǒ xiàng tā wènhǎo','彼によろしく伝えてください。'],['下次再聊。','xià cì zài liáo','また今度話しましょう。'],['祝你生日快乐。','zhù nǐ shēngrì kuàilè','お誕生日おめでとう。'],['路上小心。','lùshang xiǎoxīn','気をつけて帰ってください。']]],
['work','💼','仕事と学習','仕事や勉強の場面で使います。',[
['我九点开始工作。','wǒ jiǔ diǎn kāishǐ gōngzuò','9時に仕事を始めます。'],['今天的会议取消了。','jīntiān de huìyì qǔxiāo le','今日の会議は中止になりました。'],['请把邮件发给我。','qǐng bǎ yóujiàn fā gěi wǒ','メールを送ってください。'],['这个问题很重要。','zhège wèntí hěn zhòngyào','この問題は重要です。'],['我需要确认一下。','wǒ xūyào quèrèn yíxià','確認する必要があります。'],['我们先休息十分钟。','wǒmen xiān xiūxi shí fēnzhōng','まず10分休みましょう。'],['报告已经写好了。','bàogào yǐjīng xiě hǎo le','報告書はもう書けました。'],['请告诉我截止日期。','qǐng gàosu wǒ jiézhǐ rìqī','締切を教えてください。'],['我同意这个办法。','wǒ tóngyì zhège bànfǎ','この方法に賛成です。'],['明天继续讨论。','míngtiān jìxù tǎolùn','明日、話し合いを続けます。']]],
['health','🏥','健康と診療','体調や診療の場面で使います。',[
['我肚子疼。','wǒ dùzi téng','おなかが痛いです。'],['我咳嗽了两天。','wǒ késou le liǎng tiān','2日間せきが出ています。'],['这里有点儿疼。','zhèlǐ yǒudiǎnr téng','ここが少し痛いです。'],['我对这个药过敏。','wǒ duì zhège yào guòmǐn','この薬にアレルギーがあります。'],['一天吃几次？','yì tiān chī jǐ cì','1日に何回飲みますか。'],['需要去医院吗？','xūyào qù yīyuàn ma','病院へ行く必要がありますか。'],['我没有预约。','wǒ méiyǒu yùyuē','予約していません。'],['请帮我量体温。','qǐng bāng wǒ liáng tǐwēn','体温を測ってください。'],['我今天好多了。','wǒ jīntiān hǎo duō le','今日はずっと良くなりました。'],['我需要休息一下。','wǒ xūyào xiūxi yíxià','少し休む必要があります。']]],
['service','🧭','困りごととサービス','助けや案内が必要な場面で使います。',[
['请问服务台在哪儿？','qǐngwèn fúwùtái zài nǎr','案内所はどこですか。'],['我需要你的帮助。','wǒ xūyào nǐ de bāngzhù','助けが必要です。'],['这个机器坏了。','zhège jīqi huài le','この機械は壊れています。'],['我的手机没电了。','wǒ de shǒujī méi diàn le','携帯の充電が切れました。'],['可以借我充电器吗？','kěyǐ jiè wǒ chōngdiànqì ma','充電器を貸してもらえますか。'],['我找不到出口。','wǒ zhǎo bú dào chūkǒu','出口が見つかりません。'],['请帮我叫警察。','qǐng bāng wǒ jiào jǐngchá','警察を呼んでください。'],['我的钱包丢了。','wǒ de qiánbāo diū le','財布をなくしました。'],['这里不能进去。','zhèlǐ bù néng jìnqu','ここには入れません。'],['问题已经解决了。','wèntí yǐjīng jiějué le','問題は解決しました。']]],
['hotel','🏨','ホテル','宿泊中のやり取りで使います。',[
['我订了两个晚上。','wǒ dìng le liǎng ge wǎnshang','2泊予約しました。'],['请登记您的名字。','qǐng dēngjì nín de míngzi','お名前を記入してください。'],['房间在几楼？','fángjiān zài jǐ lóu','部屋は何階ですか。'],['电梯在右边。','diàntī zài yòubian','エレベーターは右側です。'],['可以晚一点儿退房吗？','kěyǐ wǎn yìdiǎnr tuìfáng ma','少し遅くチェックアウトできますか。'],['请再给我一条毛巾。','qǐng zài gěi wǒ yì tiáo máojīn','タオルをもう1枚ください。'],['房间里没有网络。','fángjiān lǐ méiyǒu wǎngluò','部屋でネットが使えません。'],['晚上有点儿吵。','wǎnshang yǒudiǎnr chǎo','夜は少しうるさいです。'],['我把房卡忘在里面了。','wǒ bǎ fángkǎ wàng zài lǐmiàn le','ルームキーを中に忘れました。'],['谢谢你们的服务。','xièxie nǐmen de fúwù','サービスをありがとうございました。']]],
['plans','📅','予定と連絡','予定を決めたり変えたりする場面で使います。',[
['你明天有空吗？','nǐ míngtiān yǒu kòng ma','明日は空いていますか。'],['我们下午见。','wǒmen xiàwǔ jiàn','午後に会いましょう。'],['在哪里见面？','zài nǎlǐ jiànmiàn','どこで会いますか。'],['我可能会迟到。','wǒ kěnéng huì chídào','遅れるかもしれません。'],['计划有一点儿变化。','jìhuà yǒu yìdiǎnr biànhuà','予定が少し変わりました。'],['今天不太方便。','jīntiān bú tài fāngbiàn','今日はあまり都合がよくありません。'],['改到星期五吧。','gǎi dào xīngqīwǔ ba','金曜日に変えましょう。'],['出发前给我打电话。','chūfā qián gěi wǒ dǎ diànhuà','出発前に電話してください。'],['我到了以后联系你。','wǒ dào le yǐhòu liánxì nǐ','着いたら連絡します。'],['就这么决定吧。','jiù zhème juédìng ba','それで決めましょう。']]],
['weather','🌦️','天気と季節','天気や季節について話します。',[
['明天会下雪。','míngtiān huì xiàxuě','明日は雪が降ります。'],['今天比昨天暖和。','jīntiān bǐ zuótiān nuǎnhuo','今日は昨日より暖かいです。'],['外面的风很冷。','wàimiàn de fēng hěn lěng','外の風は冷たいです。'],['天气预报说有雨。','tiānqì yùbào shuō yǒu yǔ','天気予報では雨です。'],['别忘了带雨伞。','bié wàng le dài yǔsǎn','傘を忘れないでください。'],['春天快到了。','chūntiān kuài dào le','もうすぐ春です。'],['夏天白天很长。','xiàtiān báitiān hěn cháng','夏は昼が長いです。'],['秋天最舒服。','qiūtiān zuì shūfu','秋がいちばん過ごしやすいです。'],['冬天这里常下雪。','dōngtiān zhèlǐ cháng xiàxuě','冬はここでよく雪が降ります。'],['雨已经停了。','yǔ yǐjīng tíng le','雨はもうやみました。']]],
['leisure','🎬','余暇と外出','好きなことや休日について話します。',[
['我喜欢看电影。','wǒ xǐhuan kàn diànyǐng','映画を見るのが好きです。'],['周末我去爬山。','zhōumò wǒ qù páshān','週末は山登りに行きます。'],['这本书很有意思。','zhè běn shū hěn yǒuyìsi','この本はとても面白いです。'],['你会打网球吗？','nǐ huì dǎ wǎngqiú ma','テニスはできますか。'],['我们去公园走走吧。','wǒmen qù gōngyuán zǒuzou ba','公園を散歩しましょう。'],['我想学做中国菜。','wǒ xiǎng xué zuò Zhōngguó cài','中国料理を習いたいです。'],['这首歌很好听。','zhè shǒu gē hěn hǎotīng','この歌はとてもいいです。'],['展览几点开始？','zhǎnlǎn jǐ diǎn kāishǐ','展覧会は何時に始まりますか。'],['这里可以拍照吗？','zhèlǐ kěyǐ pāizhào ma','ここで写真を撮れますか。'],['今天玩得很开心。','jīntiān wán de hěn kāixīn','今日は楽しかったです。']]]
];
var X=[];G.forEach(function(g){g[4].forEach(function(r,i){var n=201+i;X.push({id:'csl-a'+(i%2?2:1)+'-'+g[0]+'-'+n,emoji:g[1],title:g[2]+' '+(i+1),context:g[3],zh:r[0],py:r[1],ja:r[2],words:[r[0]+' '+r[1]+' · '+r[2]],level:i%2?'A2':'A1',tags:[g[0],'tired','listening','three-minute']})})});
var A=B.all().concat(X);
function clone(x){return JSON.parse(JSON.stringify(x))}
function all(){return A.map(clone)}
function get(id){for(var i=0;i<A.length;i++)if(A[i].id===id)return clone(A[i]);return null}
function query(opts){opts=opts||{};var tags=opts.tags||[],level=opts.level||null;return A.filter(function(x){if(level&&x.level!==level)return false;for(var i=0;i<tags.length;i++)if(x.tags.indexOf(tags[i])<0)return false;return true}).map(clone)}
function forCourse(course){return A.filter(function(x){return x.tags.indexOf(course)>=0}).map(clone)}
function legacyTiredId(n){return B.legacyTiredId?B.legacyTiredId(n):null}
window.CSLSentenceBank={version:4,all:all,get:get,query:query,forCourse:forCourse,legacyTiredId:legacyTiredId,count:A.length};
})();
