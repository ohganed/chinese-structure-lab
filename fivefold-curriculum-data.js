(function(){
'use strict';
/* Chinese Structure Lab — Fivefold Curriculum Data v1
   Adds exactly +1,248 A1 lines and +240 A2 lines without enlarging the always-loaded
   Shared Sentence Bank. Data is generated deterministically from curated, natural
   situation frames. Stable IDs follow generation order and must never be reassigned. */
var A1=[],A2=[];
function w(z,p,j){return z+' '+p+' · '+j}
function row(level,family,n,category,context,zh,py,ja,words){
 return{id:'csl-'+level.toLowerCase()+'x-'+family+'-'+String(n).padStart(3,'0'),level:level,category:category,context:context,zh:zh,py:py,ja:ja,words:words,tags:[level.toLowerCase(),'fivefold',category]};
}
function pairGenerate(target,level,family,category,context,left,right,build){var n=0;left.forEach(function(a){right.forEach(function(b){n++;target.push(row(level,family,n,category,context,build(a,b).zh,build(a,b).py,build(a,b).ja,build(a,b).words))})})}
var T=[
 ['今天早上','jīntiān zǎoshang','今朝'],['今天下午','jīntiān xiàwǔ','今日の午後'],['今天晚上','jīntiān wǎnshang','今夜'],['明天早上','míngtiān zǎoshang','明日の朝'],
 ['明天下午','míngtiān xiàwǔ','明日の午後'],['明天晚上','míngtiān wǎnshang','明日の夜'],['周六上午','zhōuliù shàngwǔ','土曜の午前'],['周日下午','zhōurì xiàwǔ','日曜の午後']
];
var ACT=[
 ['去上班','qù shàngbān','仕事に行きます'],['去学校','qù xuéxiào','学校へ行きます'],['去超市','qù chāoshì','スーパーへ行きます'],['做饭','zuòfàn','料理をします'],
 ['洗衣服','xǐ yīfu','洗濯をします'],['打扫房间','dǎsǎo fángjiān','部屋を掃除します'],['学习中文','xuéxí Zhōngwén','中国語を勉強します'],['看书','kàn shū','本を読みます'],
 ['散步','sànbù','散歩します'],['运动','yùndòng','運動します'],['休息','xiūxi','休みます'],['给朋友打电话','gěi péngyou dǎ diànhuà','友達に電話します']
];
pairGenerate(A1,'A1','routine','daily','時間と日常行動を結びつけます。',T,ACT,function(a,b){return{zh:'我'+a[0]+b[0]+'。',py:'wǒ '+a[1]+' '+b[1],ja:'私は'+a[2]+'、'+b[2]+'。',words:[w('我','wǒ','私'),w(a[0],a[1],a[2]),w(b[0],b[1],b[2])]}});
var PL=[
 ['学校','xuéxiào','学校'],['公司','gōngsī','会社'],['超市','chāoshì','スーパー'],['银行','yínháng','銀行'],['医院','yīyuàn','病院'],['车站','chēzhàn','駅'],
 ['咖啡店','kāfēidiàn','カフェ'],['图书馆','túshūguǎn','図書館'],['公园','gōngyuán','公園'],['饭店','fàndiàn','レストラン'],['商场','shāngchǎng','ショッピングモール'],['机场','jīchǎng','空港']
];
pairGenerate(A1,'A1','go-place','travel','時間を決めて場所へ向かいます。',T,PL,function(a,b){return{zh:'我'+a[0]+'去'+b[0]+'。',py:'wǒ '+a[1]+' qù '+b[1],ja:'私は'+a[2]+'、'+b[2]+'へ行きます。',words:[w('我','wǒ','私'),w(a[0],a[1],a[2]),w('去','qù','行く'),w(b[0],b[1],b[2])]}});
var P=[['我','wǒ','私'],['我朋友','wǒ péngyou','私の友達'],['我妈妈','wǒ māma','私の母'],['我爸爸','wǒ bàba','私の父'],['我姐姐','wǒ jiějie','私の姉'],['我哥哥','wǒ gēge','私の兄'],['王明','Wáng Míng','王明'],['小林','Xiǎolín','小林']];
var H=[['看电影','kàn diànyǐng','映画を見ること'],['听音乐','tīng yīnyuè','音楽を聴くこと'],['看书','kàn shū','読書'],['做饭','zuòfàn','料理'],['散步','sànbù','散歩'],['跑步','pǎobù','ランニング'],['打篮球','dǎ lánqiú','バスケットボール'],['踢足球','tī zúqiú','サッカー'],['拍照','pāizhào','写真を撮ること'],['旅行','lǚxíng','旅行'],['喝茶','hē chá','お茶を飲むこと'],['学中文','xué Zhōngwén','中国語を学ぶこと']];
pairGenerate(A1,'A1','likes','social','身近な人の好きなことを話します。',P,H,function(a,b){return{zh:a[0]+'喜欢'+b[0]+'。',py:a[1]+' xǐhuan '+b[1],ja:a[2]+'は'+b[2]+'が好きです。',words:[w(a[0],a[1],a[2]),w('喜欢','xǐhuan','好き'),w(b[0],b[1],b[2])]}});
pairGenerate(A1,'A1','where-now','daily','今いる場所を短く伝えます。',P,PL,function(a,b){return{zh:a[0]+'现在在'+b[0]+'。',py:a[1]+' xiànzài zài '+b[1],ja:a[2]+'は今、'+b[2]+'にいます。',words:[w(a[0],a[1],a[2]),w('现在','xiànzài','今'),w('在','zài','〜にいる'),w(b[0],b[1],b[2])]}});
var POS=[['一个问题','yí ge wèntí','一つ質問'],['一张票','yì zhāng piào','切符を一枚'],['一把伞','yì bǎ sǎn','傘を一本'],['一张地图','yì zhāng dìtú','地図を一枚'],['一个朋友','yí ge péngyou','友達が一人'],['一辆自行车','yí liàng zìxíngchē','自転車を一台'],['一部手机','yí bù shǒujī','携帯電話を一台'],['一本书','yì běn shū','本を一冊'],['一张卡','yì zhāng kǎ','カードを一枚'],['一瓶水','yì píng shuǐ','水を一本'],['一点儿时间','yìdiǎnr shíjiān','少し時間'],['一个办法','yí ge bànfǎ','一つ方法']];
pairGenerate(A1,'A1','has','daily','持っているものや状況を表します。',P,POS,function(a,b){return{zh:a[0]+'有'+b[0]+'。',py:a[1]+' yǒu '+b[1],ja:a[2]+'には'+b[2]+'あります。',words:[w(a[0],a[1],a[2]),w('有','yǒu','ある／持っている'),w(b[0],b[1],b[2])]}});
var RF=[['我要','wǒ yào','〜をください'],['我想要','wǒ xiǎng yào','〜がほしいです'],['请给我','qǐng gěi wǒ','〜をください'],['麻烦给我','máfan gěi wǒ','〜をお願いします'],['我还要','wǒ hái yào','さらに〜もください'],['我需要','wǒ xūyào','〜が必要です'],['可以给我','kěyǐ gěi wǒ','〜をもらえますか'],['请再给我','qǐng zài gěi wǒ','もう一つ〜をください']];
var RI=[['一杯水','yì bēi shuǐ','水を一杯'],['一杯茶','yì bēi chá','お茶を一杯'],['一杯咖啡','yì bēi kāfēi','コーヒーを一杯'],['一瓶水','yì píng shuǐ','水を一本'],['一张票','yì zhāng piào','切符を一枚'],['一张地图','yì zhāng dìtú','地図を一枚'],['一条毛巾','yì tiáo máojīn','タオルを一枚'],['一个袋子','yí ge dàizi','袋を一つ'],['一双筷子','yì shuāng kuàizi','箸を一膳'],['一把勺子','yì bǎ sháozi','スプーンを一本'],['一张纸','yì zhāng zhǐ','紙を一枚'],['一支笔','yì zhī bǐ','ペンを一本']];
pairGenerate(A1,'A1','requests','service','必要なものを自然に頼みます。',RF,RI,function(a,b){var q=a[0]==='可以给我';return{zh:a[0]+b[0]+(q?'吗？':'。'),py:a[1]+' '+b[1]+(q?' ma':''),ja:a[2].replace('〜',b[2])+(q?'':'。'),words:[w(a[0],a[1],a[2]),w(b[0],b[1],b[2])]}});
var LQ=[
 ['{x}在哪儿？','{p} zài nǎr','{j}はどこですか。'],['请问，{x}在哪儿？','qǐngwèn, {p} zài nǎr','すみません、{j}はどこですか。'],['不好意思，请问{x}在哪儿？','bù hǎoyìsi, qǐngwèn {p} zài nǎr','すみません、{j}はどこですか。'],['我想问一下，{x}在哪儿？','wǒ xiǎng wèn yíxià, {p} zài nǎr','ちょっと聞きたいのですが、{j}はどこですか。'],
 ['麻烦问一下，{x}在哪儿？','máfan wèn yíxià, {p} zài nǎr','お尋ねしますが、{j}はどこですか。'],['你知道{x}在哪儿吗？','nǐ zhīdào {p} zài nǎr ma','{j}がどこか知っていますか。'],['请问怎么去{x}？','qǐngwèn zěnme qù {p}','{j}へはどう行きますか。'],['从这里去{x}远吗？','cóng zhèlǐ qù {p} yuǎn ma','ここから{j}までは遠いですか。']
];
pairGenerate(A1,'A1','location-questions','travel','場所を尋ねる言い方を場面ごとに変えます。',LQ,PL,function(a,b){function r(s,k,v){return s.replace(k,v)}var z=r(a[0],'{x}',b[0]),p=r(a[1],'{p}',b[1]),j=r(a[2],'{j}',b[2]);return{zh:z,py:p,ja:j,words:[w(b[0],b[1],b[2]),w('在哪儿','zài nǎr','どこに'),w('怎么去','zěnme qù','どう行く')]}});
var SHOPP=[['{x}多少钱？','{p} duōshao qián','{j}はいくらですか。'],['{x}贵吗？','{p} guì ma','{j}は高いですか。'],['{x}有便宜一点儿的吗？','{p} yǒu piányi yìdiǎnr de ma','{j}でもう少し安いものはありますか。'],['我想看看{x}。','wǒ xiǎng kànkan {p}','{j}を見てみたいです。'],['我可以看看{x}吗？','wǒ kěyǐ kànkan {p} ma','{j}を見てもいいですか。'],['我可以买{x}吗？','wǒ kěyǐ mǎi {p} ma','{j}を買えますか。'],['买{x}可以刷卡吗？','mǎi {p} kěyǐ shuākǎ ma','{j}を買うときカードで払えますか。'],['我就要{x}。','wǒ jiù yào {p}','{j}にします。']];
var SHOPO=[['这本书','zhè běn shū','この本'],['这件衣服','zhè jiàn yīfu','この服'],['这双鞋','zhè shuāng xié','この靴'],['这个杯子','zhège bēizi','このカップ'],['这把伞','zhè bǎ sǎn','この傘'],['这张票','zhè zhāng piào','この切符'],['这个包','zhège bāo','このバッグ'],['这瓶水','zhè píng shuǐ','この水'],['这个帽子','zhège màozi','この帽子'],['这条裤子','zhè tiáo kùzi','このズボン'],['这部手机','zhè bù shǒujī','この携帯'],['这个充电器','zhège chōngdiànqì','この充電器']];
pairGenerate(A1,'A1','shopping','shopping','商品を見て、値段や購入方法を確認します。',SHOPP,SHOPO,function(a,b){return{zh:a[0].replace('{x}',b[0]),py:a[1].replace('{p}',b[1]),ja:a[2].replace('{j}',b[2]),words:[w(b[0],b[1],b[2]),w('多少钱','duōshao qián','いくら'),w('可以','kěyǐ','〜できる')]}});
var PERM=[['这里可以{x}吗？','zhèlǐ kěyǐ {p} ma','ここで{j}してもいいですか。'],['请问，这里可以{x}吗？','qǐngwèn, zhèlǐ kěyǐ {p} ma','すみません、ここで{j}してもいいですか。'],['不好意思，这里可以{x}吗？','bù hǎoyìsi, zhèlǐ kěyǐ {p} ma','すみません、ここで{j}してもいいですか。'],['我可以在这里{x}吗？','wǒ kěyǐ zài zhèlǐ {p} ma','私はここで{j}してもいいですか。'],['请问我可以在这里{x}吗？','qǐngwèn wǒ kěyǐ zài zhèlǐ {p} ma','ここで{j}してよいか教えてください。'],['这里能{x}吗？','zhèlǐ néng {p} ma','ここで{j}できますか。'],['我想在这里{x}，可以吗？','wǒ xiǎng zài zhèlǐ {p}, kěyǐ ma','ここで{j}したいのですが、いいですか。'],['在这里{x}没问题吗？','zài zhèlǐ {p} méi wèntí ma','ここで{j}しても問題ないですか。']];
var PA=[['拍照','pāizhào','写真を撮る'],['坐一下','zuò yíxià','少し座る'],['等一会儿','děng yíhuìr','少し待つ'],['充电','chōngdiàn','充電する'],['吃东西','chī dōngxi','食べる'],['喝水','hē shuǐ','水を飲む'],['用手机','yòng shǒujī','携帯を使う'],['上网','shàngwǎng','インターネットを使う'],['进去','jìnqu','入る'],['出去','chūqu','出る'],['停车','tíngchē','駐車する'],['买票','mǎi piào','切符を買う']];
pairGenerate(A1,'A1','permission','service','許可や可能性を丁寧に確認します。',PERM,PA,function(a,b){return{zh:a[0].replace('{x}',b[0]),py:a[1].replace('{p}',b[1]),ja:a[2].replace('{j}',b[2]),words:[w('可以','kěyǐ','〜してよい／できる'),w(b[0],b[1],b[2])]}});
var FOOD=[['米饭','mǐfàn','ご飯'],['面条','miàntiáo','麺'],['饺子','jiǎozi','餃子'],['鸡蛋','jīdàn','卵'],['鱼','yú','魚'],['鸡肉','jīròu','鶏肉'],['蔬菜','shūcài','野菜'],['水果','shuǐguǒ','果物'],['苹果','píngguǒ','りんご'],['香蕉','xiāngjiāo','バナナ'],['面包','miànbāo','パン'],['中国菜','Zhōngguó cài','中国料理']];
pairGenerate(A1,'A1','food-like','food','人の食の好みを話します。',P,FOOD,function(a,b){return{zh:a[0]+'喜欢吃'+b[0]+'。',py:a[1]+' xǐhuan chī '+b[1],ja:a[2]+'は'+b[2]+'を食べるのが好きです。',words:[w(a[0],a[1],a[2]),w('喜欢吃','xǐhuan chī','食べるのが好き'),w(b[0],b[1],b[2])]}});
pairGenerate(A1,'A1','food-want','food','食べたいものを短く伝えます。',P,FOOD,function(a,b){return{zh:a[0]+'想吃'+b[0]+'。',py:a[1]+' xiǎng chī '+b[1],ja:a[2]+'は'+b[2]+'を食べたいです。',words:[w(a[0],a[1],a[2]),w('想吃','xiǎng chī','食べたい'),w(b[0],b[1],b[2])]}});
var LANG=[['中文','Zhōngwén','中国語'],['日语','Rìyǔ','日本語'],['英语','Yīngyǔ','英語'],['法语','Fǎyǔ','フランス語'],['西班牙语','Xībānyáyǔ','スペイン語'],['俄语','Éyǔ','ロシア語'],['韩语','Hányǔ','韓国語'],['德语','Déyǔ','ドイツ語'],['意大利语','Yìdàlìyǔ','イタリア語'],['阿拉伯语','Ālābóyǔ','アラビア語'],['泰语','Tàiyǔ','タイ語'],['越南语','Yuènányǔ','ベトナム語']];
pairGenerate(A1,'A1','languages','work','話せる言語について話します。',P,LANG,function(a,b){return{zh:a[0]+'会说'+b[0]+'。',py:a[1]+' huì shuō '+b[1],ja:a[2]+'は'+b[2]+'を話せます。',words:[w(a[0],a[1],a[2]),w('会说','huì shuō','話せる'),w(b[0],b[1],b[2])]}});
var SA=[['吃饭','chīfàn','食事をします'],['喝咖啡','hē kāfēi','コーヒーを飲みます'],['看电影','kàn diànyǐng','映画を見ます'],['去公园','qù gōngyuán','公園へ行きます'],['去买东西','qù mǎi dōngxi','買い物へ行きます'],['学中文','xué Zhōngwén','中国語を勉強します'],['打电话','dǎ diànhuà','電話します'],['见面','jiànmiàn','会います'],['散步','sànbù','散歩します'],['聊天','liáotiān','おしゃべりします'],['去旅行','qù lǚxíng','旅行へ行きます'],['去运动','qù yùndòng','運動しに行きます']];
pairGenerate(A1,'A1','with-friends','social','友達とする予定を時間と結びつけます。',T,SA,function(a,b){return{zh:'我'+a[0]+'跟朋友'+b[0]+'。',py:'wǒ '+a[1]+' gēn péngyou '+b[1],ja:'私は'+a[2]+'、友達と'+b[2]+'。',words:[w('跟朋友','gēn péngyou','友達と'),w(a[0],a[1],a[2]),w(b[0],b[1],b[2])]}});
/* A2: 5 families × 48 = 240. */
var P6=P.slice(0,6),CITY=[['北京','Běijīng','北京'],['上海','Shànghǎi','上海'],['广州','Guǎngzhōu','広州'],['成都','Chéngdū','成都'],['西安','Xī’ān','西安'],['杭州','Hángzhōu','杭州'],['深圳','Shēnzhèn','深圳'],['南京','Nánjīng','南京']];
pairGenerate(A2,'A2','experience','travel','経験を「过」で表します。',P6,CITY,function(a,b){return{zh:a[0]+'去过'+b[0]+'。',py:a[1]+' qùguo '+b[1],ja:a[2]+'は'+b[2]+'へ行ったことがあります。',words:[w(a[0],a[1],a[2]),w('去过','qùguo','行ったことがある'),w(b[0],b[1],b[2])]}});
var PT=[['早上','zǎoshang','朝'],['上午','shàngwǔ','午前'],['中午','zhōngwǔ','昼'],['下午','xiàwǔ','午後'],['晚饭前','wǎnfàn qián','夕食前'],['刚才','gāngcái','さっき']];
var DONE=[['吃过饭','chīguo fàn','食事を済ませました'],['买好票','mǎi hǎo piào','切符を買い終えました'],['写完作业','xiě wán zuòyè','宿題を書き終えました'],['收拾好房间','shōushi hǎo fángjiān','部屋を片づけ終えました'],['给朋友打过电话','gěi péngyou dǎguo diànhuà','友達に電話しました'],['看过邮件','kànguo yóujiàn','メールを確認しました'],['准备好东西','zhǔnbèi hǎo dōngxi','必要な物を準備しました'],['订好酒店','dìng hǎo jiǔdiàn','ホテルを予約しました']];
pairGenerate(A2,'A2','already','daily','完了したことを「已经…了」で表します。',PT,DONE,function(a,b){return{zh:'我'+a[0]+'已经'+b[0]+'了。',py:'wǒ '+a[1]+' yǐjīng '+b[1]+' le',ja:'私は'+a[2]+'にはもう'+b[2]+'。',words:[w('已经','yǐjīng','すでに'),w(a[0],a[1],a[2]),w(b[0],b[1],b[2])]}});
var FT=[['明天','míngtiān','明日'],['后天','hòutiān','明後日'],['周六','zhōuliù','土曜日'],['周日','zhōurì','日曜日'],['下周一','xià zhōuyī','来週月曜日'],['下个月','xià ge yuè','来月']];
var PLAN=[['去北京','qù Běijīng','北京へ行く'],['看朋友','kàn péngyou','友達に会う'],['买东西','mǎi dōngxi','買い物をする'],['在家休息','zài jiā xiūxi','家で休む'],['学中文','xué Zhōngwén','中国語を勉強する'],['去运动','qù yùndòng','運動しに行く'],['去医院','qù yīyuàn','病院へ行く'],['去银行','qù yínháng','銀行へ行く']];
pairGenerate(A2,'A2','plans','plans','少し先の予定を「打算」で話します。',FT,PLAN,function(a,b){return{zh:'我'+a[0]+'打算'+b[0]+'。',py:'wǒ '+a[1]+' dǎsuàn '+b[1],ja:'私は'+a[2]+'、'+b[2]+'予定です。',words:[w('打算','dǎsuàn','〜するつもり'),w(a[0],a[1],a[2]),w(b[0],b[1],b[2])]}});
var OBJACT=[['门','mén','ドア','关上','guānshang','閉めました'],['灯','dēng','電気','打开','dǎkāi','つけました'],['书','shū','本','放在桌上','fàng zài zhuōshang','机の上に置きました'],['手机','shǒujī','携帯','放进包里','fàng jìn bāo lǐ','バッグに入れました'],['作业','zuòyè','宿題','写完','xiě wán','終えました'],['房间','fángjiān','部屋','收拾好了','shōushi hǎo le','片づけました'],['邮件','yóujiàn','メール','发出去了','fā chūqu le','送信しました'],['票','piào','切符','买好了','mǎi hǎo le','買っておきました']];
pairGenerate(A2,'A2','ba','daily','「把」で対象への働きかけを表します。',P6,OBJACT,function(a,b){return{zh:a[0]+'把'+b[0]+b[3]+'。',py:a[1]+' bǎ '+b[1]+' '+b[4],ja:a[2]+'は'+b[2]+'を'+b[5]+'。',words:[w(a[0],a[1],a[2]),w('把','bǎ','対象を取り上げる'),w(b[0],b[1],b[2]),w(b[3],b[4],b[5])]}});
var COND=[
 ['有时间','yǒu shíjiān','時間があれば','去运动','qù yùndòng','運動しに行きます'],['累了','lèi le','疲れたら','早点休息','zǎodiǎn xiūxi','早めに休みます'],['不舒服','bù shūfu','具合が悪ければ','去医院','qù yīyuàn','病院へ行きます'],['迷路了','mílù le','道に迷ったら','问别人','wèn biérén','人に尋ねます'],['忘了带伞','wàng le dài sǎn','傘を忘れたら','去买一把','qù mǎi yì bǎ','一本買いに行きます'],['迟到了','chídào le','遅れたら','先发消息','xiān fā xiāoxi','先にメッセージを送ります'],['听不懂','tīngbudǒng','聞き取れなければ','请对方再说一遍','qǐng duìfāng zài shuō yí biàn','相手にもう一度言ってもらいます'],['没带现金','méi dài xiànjīn','現金を持っていなければ','刷卡','shuākǎ','カードで払います']
];
pairGenerate(A2,'A2','if-then','daily','条件と結果を「如果…就…」でつなぎます。',P6,COND,function(a,b){return{zh:'如果'+a[0]+b[0]+'，'+a[0]+'就'+b[3]+'。',py:'rúguǒ '+a[1]+' '+b[1]+', '+a[1]+' jiù '+b[4],ja:'もし'+a[2]+'が'+b[2]+'、'+a[2]+'は'+b[5]+'。',words:[w('如果…就…','rúguǒ…jiù…','もし〜なら…'),w(a[0],a[1],a[2]),w(b[0],b[1],b[2]),w(b[3],b[4],b[5])]}});
function uniq(items){var ids={},text={};items.forEach(function(x){if(ids[x.id])throw new Error('duplicate id '+x.id);if(text[x.zh])throw new Error('duplicate sentence '+x.zh);ids[x.id]=1;text[x.zh]=1})}
uniq(A1);uniq(A2);
if(A1.length!==1248)throw new Error('A1 fivefold expansion count must be 1248, got '+A1.length);
if(A2.length!==240)throw new Error('A2 fivefold expansion count must be 240, got '+A2.length);
function clone(x){return JSON.parse(JSON.stringify(x))}
window.CSLFivefoldCurriculum={version:1,counts:{A1:A1.length,A2:A2.length},all:function(level){var a=level==='A2'?A2:A1;return a.map(clone)},get:function(id){var a=A1.concat(A2);for(var i=0;i<a.length;i++)if(a[i].id===id)return clone(a[i]);return null}};
})();
