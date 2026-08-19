(function(){
'use strict';
var B=window.CSLSentenceBank;if(!B)return;
var X=[
{id:'csl-a1-social-101',emoji:'🙂 👋',title:'久しぶりに会う',context:'久しぶりに会った人へ自然に声をかけます。',zh:'好久不见。',py:'hǎojiǔ bú jiàn',ja:'お久しぶりです。',words:['好久不见 hǎojiǔ bú jiàn · 久しぶり'],level:'A2',tags:['social','daily','tired','listening']},
{id:'csl-a1-social-102',emoji:'🙂 ❓',title:'最近どうか聞く',context:'近況を軽く尋ねます。',zh:'你最近怎么样？',py:'nǐ zuìjìn zěnmeyàng',ja:'最近どうですか。',words:['最近 zuìjìn · 最近','怎么样 zěnmeyàng · どう'],level:'A2',tags:['social','conversation','tired']},
{id:'csl-a1-social-103',emoji:'😊 ✅',title:'元気だと返す',context:'近況を短く返します。',zh:'我挺好的。',py:'wǒ tǐng hǎo de',ja:'元気です。',words:['挺好的 tǐng hǎo de · かなり元気'],level:'A2',tags:['social','conversation','tired']},
{id:'csl-a1-social-104',emoji:'🏠 🙋',title:'家に招く',context:'気軽に家へ誘います。',zh:'有空来我家吧。',py:'yǒu kòng lái wǒ jiā ba',ja:'時間があったら家に来てください。',words:['有空 yǒu kòng · 時間がある','来 lái · 来る'],level:'A2',tags:['social','plans','home','tired']},
{id:'csl-a1-social-105',emoji:'🎁 🙂',title:'受け取ってもらう',context:'小さな物を相手に渡します。',zh:'这个给你。',py:'zhège gěi nǐ',ja:'これ、あなたにどうぞ。',words:['给 gěi · あげる','这个 zhège · これ'],level:'A1',tags:['social','daily','tired']},
{id:'csl-a1-social-106',emoji:'🙏 🚫',title:'遠慮する',context:'申し出をやんわり断ります。',zh:'不用了，谢谢。',py:'bú yòng le, xièxie',ja:'大丈夫です、ありがとう。',words:['不用 bú yòng · 必要ない','谢谢 xièxie · ありがとう'],level:'A2',tags:['social','service','tired']},
{id:'csl-a1-social-107',emoji:'🙂 👍',title:'それでいい',context:'相手の提案に同意します。',zh:'这样就可以。',py:'zhèyàng jiù kěyǐ',ja:'それで大丈夫です。',words:['这样 zhèyàng · このように','就可以 jiù kěyǐ · それでよい'],level:'A2',tags:['social','communication','tired']},
{id:'csl-a1-social-108',emoji:'👋 🌙',title:'また連絡する',context:'別れ際に自然に伝えます。',zh:'回头联系。',py:'huítóu liánxì',ja:'また連絡します。',words:['回头 huítóu · あとで','联系 liánxì · 連絡する'],level:'A2',tags:['social','communication','tired']},

{id:'csl-a1-service-101',emoji:'🙋 ❓',title:'手伝ってもらう',context:'困ったときに助けを頼みます。',zh:'可以帮我一下吗？',py:'kěyǐ bāng wǒ yíxià ma',ja:'ちょっと手伝ってもらえますか。',words:['帮 bāng · 手伝う','一下 yíxià · ちょっと'],level:'A1',tags:['service','communication','tired']},
{id:'csl-a1-service-102',emoji:'📍 ❓',title:'ここでいいか確認',context:'場所が合っているか聞きます。',zh:'这里可以吗？',py:'zhèlǐ kěyǐ ma',ja:'ここで大丈夫ですか。',words:['这里 zhèlǐ · ここ','可以 kěyǐ · 大丈夫'],level:'A1',tags:['service','travel','tired']},
{id:'csl-a1-service-103',emoji:'🧾 🔁',title:'もう一度確認する',context:'内容をもう一度確認します。',zh:'我确认一下。',py:'wǒ quèrèn yíxià',ja:'ちょっと確認します。',words:['确认 quèrèn · 確認する','一下 yíxià · ちょっと'],level:'A2',tags:['service','work','communication','tired']},
{id:'csl-a1-service-104',emoji:'🚫 😕',title:'うまくいかない',context:'機械や手続きがうまくいかないことを伝えます。',zh:'这个不能用。',py:'zhège bù néng yòng',ja:'これは使えません。',words:['不能 bù néng · できない','用 yòng · 使う'],level:'A1',tags:['service','problems','tired']},
{id:'csl-a1-service-105',emoji:'🔌 ❓',title:'充電できるか聞く',context:'充電場所を探しています。',zh:'这里可以充电吗？',py:'zhèlǐ kěyǐ chōngdiàn ma',ja:'ここで充電できますか。',words:['充电 chōngdiàn · 充電する','这里 zhèlǐ · ここ'],level:'A2',tags:['service','travel','tired']},
{id:'csl-a1-service-106',emoji:'🚻 ❓',title:'トイレを探す',context:'場所だけを簡単に聞きます。',zh:'洗手间在哪儿？',py:'xǐshǒujiān zài nǎr',ja:'トイレはどこですか。',words:['洗手间 xǐshǒujiān · トイレ','在哪儿 zài nǎr · どこに'],level:'A1',tags:['service','travel','tired','listening']},
{id:'csl-a1-service-107',emoji:'📶 ❓',title:'Wi-Fiを聞く',context:'ネット接続について聞きます。',zh:'这里有无线网吗？',py:'zhèlǐ yǒu wúxiànwǎng ma',ja:'ここにWi-Fiはありますか。',words:['无线网 wúxiànwǎng · Wi-Fi','有 yǒu · ある'],level:'A2',tags:['service','hotel','travel','tired']},
{id:'csl-a1-service-108',emoji:'🔑 😕',title:'鍵をなくした',context:'困ったことを短く伝えます。',zh:'我的钥匙找不到了。',py:'wǒ de yàoshi zhǎo bú dào le',ja:'鍵が見つかりません。',words:['钥匙 yàoshi · 鍵','找不到 zhǎo bú dào · 見つからない'],level:'A2',tags:['service','problems','home','tired']},

{id:'csl-a1-study-101',emoji:'📚 ✍️',title:'中国語を勉強する',context:'今学んでいることを伝えます。',zh:'我在学中文。',py:'wǒ zài xué Zhōngwén',ja:'中国語を勉強しています。',words:['学 xué · 学ぶ','中文 Zhōngwén · 中国語'],level:'A1',tags:['study','language','tired','listening']},
{id:'csl-a1-study-102',emoji:'📖 🤔',title:'この字が分からない',context:'読めない漢字を指して聞きます。',zh:'这个字我不认识。',py:'zhège zì wǒ bú rènshi',ja:'この字は分かりません。',words:['字 zì · 字','认识 rènshi · 知っている'],level:'A2',tags:['study','language','tired']},
{id:'csl-a1-study-103',emoji:'🔊 ❓',title:'読み方を聞く',context:'発音を確認します。',zh:'这个怎么读？',py:'zhège zěnme dú',ja:'これはどう読みますか。',words:['怎么 zěnme · どう','读 dú · 読む'],level:'A1',tags:['study','language','listening','tired']},
{id:'csl-a1-study-104',emoji:'✍️ ❓',title:'書き方を聞く',context:'文字の書き方を確認します。',zh:'这个字怎么写？',py:'zhège zì zěnme xiě',ja:'この字はどう書きますか。',words:['怎么写 zěnme xiě · どう書く','字 zì · 字'],level:'A1',tags:['study','language','tired']},
{id:'csl-a1-study-105',emoji:'💬 🔁',title:'もう一回練習する',context:'同じ表現をもう一度やります。',zh:'我想再练习一次。',py:'wǒ xiǎng zài liànxí yí cì',ja:'もう一度練習したいです。',words:['练习 liànxí · 練習する','一次 yí cì · 一回'],level:'A2',tags:['study','language','tired']},
{id:'csl-a1-study-106',emoji:'🎧 🙂',title:'聞けば分かる',context:'理解の仕方を説明します。',zh:'我听得懂一点儿。',py:'wǒ tīngdedǒng yìdiǎnr',ja:'少し聞き取れます。',words:['听得懂 tīngdedǒng · 聞いて分かる','一点儿 yìdiǎnr · 少し'],level:'A2',tags:['study','language','listening','tired']},
{id:'csl-a1-study-107',emoji:'🗣️ 😅',title:'話すのはまだ難しい',context:'今の感覚をそのまま伝えます。',zh:'我还不太会说。',py:'wǒ hái bú tài huì shuō',ja:'まだあまり話せません。',words:['还 hái · まだ','不太会 bú tài huì · あまりできない'],level:'A2',tags:['study','language','speaking','tired']},
{id:'csl-a1-study-108',emoji:'📚 ✅',title:'今日はここまで',context:'学習を終えるときに使います。',zh:'今天先学到这里。',py:'jīntiān xiān xué dào zhèlǐ',ja:'今日はひとまずここまで勉強します。',words:['先 xiān · ひとまず','到这里 dào zhèlǐ · ここまで'],level:'A2',tags:['study','language','tired']},

{id:'csl-a1-hotel-101',emoji:'🏨 🧳',title:'チェックインする',context:'ホテルに着いて手続きを始めます。',zh:'我想办理入住。',py:'wǒ xiǎng bànlǐ rùzhù',ja:'チェックインしたいです。',words:['办理 bànlǐ · 手続きする','入住 rùzhù · チェックイン'],level:'A2',tags:['hotel','travel','service','tired']},
{id:'csl-a1-hotel-102',emoji:'🪪 🙋',title:'パスポートを渡す',context:'受付で必要書類を渡します。',zh:'这是我的护照。',py:'zhè shì wǒ de hùzhào',ja:'これは私のパスポートです。',words:['护照 hùzhào · パスポート','这是 zhè shì · これは〜です'],level:'A1',tags:['hotel','travel','service','tired']},
{id:'csl-a1-hotel-103',emoji:'🛏️ ❓',title:'静かな部屋を頼む',context:'部屋について希望を伝えます。',zh:'可以给我安静一点儿的房间吗？',py:'kěyǐ gěi wǒ ānjìng yìdiǎnr de fángjiān ma',ja:'もう少し静かな部屋にしてもらえますか。',words:['安静 ānjìng · 静か','房间 fángjiān · 部屋'],level:'A2',tags:['hotel','travel','service','tired']},
{id:'csl-a1-hotel-104',emoji:'🚿 😕',title:'お湯が出ない',context:'部屋の問題を伝えます。',zh:'没有热水。',py:'méiyǒu rèshuǐ',ja:'お湯が出ません。',words:['热水 rèshuǐ · お湯','没有 méiyǒu · ない'],level:'A1',tags:['hotel','problems','service','tired']},
{id:'csl-a1-hotel-105',emoji:'❄️ 😕',title:'エアコンが動かない',context:'設備の不具合を伝えます。',zh:'空调不能用。',py:'kōngtiáo bù néng yòng',ja:'エアコンが使えません。',words:['空调 kōngtiáo · エアコン','不能用 bù néng yòng · 使えない'],level:'A1',tags:['hotel','problems','service','tired']},
{id:'csl-a1-hotel-106',emoji:'🧳 🕛',title:'荷物を預ける',context:'出発まで荷物を預けたいと伝えます。',zh:'可以帮我保管行李吗？',py:'kěyǐ bāng wǒ bǎoguǎn xíngli ma',ja:'荷物を預かってもらえますか。',words:['保管 bǎoguǎn · 預かる','行李 xíngli · 荷物'],level:'A2',tags:['hotel','travel','service','tired']},
{id:'csl-a1-hotel-107',emoji:'🍳 ❓',title:'朝食時間を聞く',context:'朝食の時間を確認します。',zh:'早餐几点开始？',py:'zǎocān jǐ diǎn kāishǐ',ja:'朝食は何時からですか。',words:['早餐 zǎocān · 朝食','开始 kāishǐ · 始まる'],level:'A1',tags:['hotel','food','time','tired']},
{id:'csl-a1-hotel-108',emoji:'🏨 👋',title:'チェックアウトする',context:'ホテルを出る手続きをします。',zh:'我要退房。',py:'wǒ yào tuìfáng',ja:'チェックアウトします。',words:['退房 tuìfáng · チェックアウトする'],level:'A2',tags:['hotel','travel','service','tired']},

{id:'csl-a1-leisure-101',emoji:'🚶 🌳',title:'散歩に行く',context:'少し外へ出ることを伝えます。',zh:'我出去走走。',py:'wǒ chūqù zǒuzou',ja:'少し散歩してきます。',words:['出去 chūqù · 外へ出る','走走 zǒuzou · 少し歩く'],level:'A2',tags:['leisure','daily','tired']},
{id:'csl-a1-leisure-102',emoji:'☕ 📖',title:'カフェで休む',context:'静かに過ごす予定を伝えます。',zh:'我想去咖啡店坐一会儿。',py:'wǒ xiǎng qù kāfēidiàn zuò yíhuìr',ja:'カフェで少し休みたいです。',words:['咖啡店 kāfēidiàn · カフェ','一会儿 yíhuìr · 少しの間'],level:'A2',tags:['leisure','food','tired']},
{id:'csl-a1-leisure-103',emoji:'🎬 🙂',title:'映画を見る',context:'今夜の予定を短く言います。',zh:'我晚上想看电影。',py:'wǒ wǎnshang xiǎng kàn diànyǐng',ja:'夜は映画を見たいです。',words:['电影 diànyǐng · 映画','晚上 wǎnshang · 夜'],level:'A1',tags:['leisure','plans','tired']},
{id:'csl-a1-leisure-104',emoji:'🎵 🎧',title:'音楽を聞く',context:'今していることを伝えます。',zh:'我在听音乐。',py:'wǒ zài tīng yīnyuè',ja:'音楽を聞いています。',words:['音乐 yīnyuè · 音楽','听 tīng · 聞く'],level:'A1',tags:['leisure','daily','tired']},
{id:'csl-a1-leisure-105',emoji:'📷 🌆',title:'写真を撮る',context:'景色を見て写真を撮ります。',zh:'我想拍一张照片。',py:'wǒ xiǎng pāi yì zhāng zhàopiàn',ja:'写真を一枚撮りたいです。',words:['拍 pāi · 撮る','照片 zhàopiàn · 写真'],level:'A1',tags:['leisure','travel','tired']},
{id:'csl-a1-leisure-106',emoji:'🌳 🙂',title:'ここは静か',context:'場所の雰囲気を伝えます。',zh:'这里很安静。',py:'zhèlǐ hěn ānjìng',ja:'ここはとても静かです。',words:['这里 zhèlǐ · ここ','安静 ānjìng · 静か'],level:'A1',tags:['leisure','travel','tired']},
{id:'csl-a1-leisure-107',emoji:'☕ 😌',title:'少し休みたい',context:'無理せず休憩したいと伝えます。',zh:'我想休息一会儿。',py:'wǒ xiǎng xiūxi yíhuìr',ja:'少し休みたいです。',words:['休息 xiūxi · 休む','一会儿 yíhuìr · 少しの間'],level:'A1',tags:['leisure','health','tired']},
{id:'csl-a1-leisure-108',emoji:'🌙 🏠',title:'そろそろ帰る',context:'今日はもう帰ることを伝えます。',zh:'我差不多该回家了。',py:'wǒ chàbuduō gāi huí jiā le',ja:'そろそろ家に帰る時間です。',words:['差不多 chàbuduō · そろそろ','该 gāi · 〜すべき／〜する頃'],level:'A2',tags:['leisure','home','plans','tired']}
];
var A=B.all().concat(X);
function clone(x){return JSON.parse(JSON.stringify(x))}
function all(){return A.map(clone)}
function get(id){for(var i=0;i<A.length;i++)if(A[i].id===id)return clone(A[i]);return null}
function query(opts){opts=opts||{};var tags=opts.tags||[],level=opts.level||null;return A.filter(function(x){if(level&&x.level!==level)return false;for(var i=0;i<tags.length;i++)if(x.tags.indexOf(tags[i])<0)return false;return true}).map(clone)}
function forCourse(course){return A.filter(function(x){return x.tags.indexOf(course)>=0}).map(clone)}
function legacyTiredId(n){return B.legacyTiredId?B.legacyTiredId(n):null}
window.CSLSentenceBank={version:3,all:all,get:get,query:query,forCourse:forCourse,legacyTiredId:legacyTiredId,count:A.length};
})();