(function(){
'use strict';
/* Chinese Structure Lab — Shared Sentence Bank v1
   Canonical sentence assets shared across courses.
   Stable IDs are permanent. Course membership is metadata, not ownership. */
var VERSION=1;
var S=[
{id:'csl-a1-social-001',legacyTiredIndex:0,emoji:'👋 🙂',title:'顔を合わせる',context:'知っている人に会いました。短いあいさつだけ。',zh:'你好。',py:'nǐ hǎo',ja:'こんにちは。',words:['你 nǐ · あなた','好 hǎo · よい'],level:'A1',tags:['social','greeting','tired','three-minute','listening','daily']},
{id:'csl-a1-social-002',emoji:'🙂 👋',title:'名前を伝える',context:'初めて会った人に、名前だけ伝えます。',zh:'我叫小林。',py:'wǒ jiào Xiǎolín',ja:'私は小林といいます。',words:['我 wǒ · 私','叫 jiào · 〜という'],level:'A1',tags:['social','greeting','tired','daily']},
{id:'csl-a1-social-003',emoji:'🙂 ❓',title:'相手にも聞く',context:'自分のことを言ったあと、相手にも聞きます。',zh:'你呢？',py:'nǐ ne',ja:'あなたは？',words:['你 nǐ · あなた','呢 ne · 〜は？'],level:'A1',tags:['social','conversation','tired','daily']},
{id:'csl-a1-social-004',emoji:'🤝 🙂',title:'会えてうれしい',context:'初対面の最後に、短く気持ちを伝えます。',zh:'很高兴认识你。',py:'hěn gāoxìng rènshi nǐ',ja:'お会いできてうれしいです。',words:['高兴 gāoxìng · うれしい','认识 rènshi · 知り合う'],level:'A1',tags:['social','greeting','tired','daily']},
{id:'csl-a1-social-005',emoji:'👋 🌙',title:'また明日',context:'今日はここまで。次に会う時間だけ伝えます。',zh:'明天见。',py:'míngtiān jiàn',ja:'また明日。',words:['明天 míngtiān · 明日','见 jiàn · 会う'],level:'A1',tags:['social','farewell','tired','daily']},
{id:'csl-a1-social-006',legacyTiredIndex:9,emoji:'🙂 🙏',title:'最後にお礼だけ',context:'今日はこれだけでも十分です。',zh:'谢谢。',py:'xièxie',ja:'ありがとうございます。',words:['谢谢 xièxie · ありがとう'],level:'A1',tags:['social','thanks','tired','three-minute','listening','daily']},
{id:'csl-a1-social-007',emoji:'🙏 🙂',title:'どういたしまして',context:'お礼を言われたら、軽く返します。',zh:'不客气。',py:'bú kèqi',ja:'どういたしまして。',words:['不客气 bú kèqi · どういたしまして'],level:'A1',tags:['social','thanks','tired','daily']},
{id:'csl-a1-social-008',emoji:'😅 🙏',title:'軽く謝る',context:'少しぶつかったとき、短く謝ります。',zh:'对不起。',py:'duìbuqǐ',ja:'すみません。',words:['对不起 duìbuqǐ · すみません'],level:'A1',tags:['social','apology','tired','daily']},

{id:'csl-a1-food-001',legacyTiredIndex:1,emoji:'☕ 🍵',title:'飲み物を頼む',context:'いつもの店で、ひとことだけ伝えます。',zh:'我要一杯茶。',py:'wǒ yào yì bēi chá',ja:'お茶を一杯ください。',words:['要 yào · ほしい','一杯 yì bēi · 一杯','茶 chá · お茶'],level:'A1',tags:['food','cafe','tired','three-minute','listening']},
{id:'csl-a1-food-002',emoji:'☕ 🙋',title:'コーヒーを頼む',context:'飲みたいものをそのまま伝えます。',zh:'我要一杯咖啡。',py:'wǒ yào yì bēi kāfēi',ja:'コーヒーを一杯ください。',words:['咖啡 kāfēi · コーヒー','一杯 yì bēi · 一杯'],level:'A1',tags:['food','cafe','tired','listening']},
{id:'csl-a1-food-003',emoji:'🥤 🙋',title:'水を頼む',context:'水を一杯だけお願いします。',zh:'麻烦给我一杯水。',py:'máfan gěi wǒ yì bēi shuǐ',ja:'お水を一杯お願いします。',words:['麻烦 máfan · お手数ですが','给 gěi · 与える','水 shuǐ · 水'],level:'A1',tags:['food','cafe','tired','service']},
{id:'csl-a1-food-004',emoji:'🍜 😋',title:'おいしいと伝える',context:'食べてみて、ひとこと感想を伝えます。',zh:'很好吃。',py:'hěn hǎochī',ja:'とてもおいしいです。',words:['好吃 hǎochī · おいしい'],level:'A1',tags:['food','cafe','tired','daily']},
{id:'csl-a1-food-005',emoji:'🍬 🚫',title:'砂糖はいらない',context:'飲み物はそのままで飲みたいと伝えます。',zh:'我不要糖。',py:'wǒ bú yào táng',ja:'砂糖はいりません。',words:['不要 bú yào · いらない','糖 táng · 砂糖'],level:'A1',tags:['food','cafe','tired']},
{id:'csl-a1-food-006',emoji:'🍵 ➕',title:'もう一杯',context:'同じものをもう一杯だけ頼みます。',zh:'再来一杯。',py:'zài lái yì bēi',ja:'もう一杯ください。',words:['再 zài · もう一度','来 lái · 来る／持ってくる'],level:'A1',tags:['food','cafe','tired']},
{id:'csl-a1-food-007',emoji:'🧾 🙋',title:'会計をお願いする',context:'食事が終わったので、会計を頼みます。',zh:'麻烦结账。',py:'máfan jiézhàng',ja:'お会計をお願いします。',words:['结账 jiézhàng · 会計する'],level:'A1',tags:['food','cafe','service','tired']},
{id:'csl-a1-food-008',emoji:'🍜 ❓',title:'これは何か聞く',context:'見慣れない料理を指して聞きます。',zh:'这是什么？',py:'zhè shì shénme',ja:'これは何ですか。',words:['这 zhè · これ','什么 shénme · 何'],level:'A1',tags:['food','cafe','tired','question']},

{id:'csl-a1-city-001',legacyTiredIndex:2,emoji:'🚇 ❓',title:'駅を探す',context:'道を急がず、場所だけ聞きます。',zh:'地铁站在哪儿？',py:'dìtiě zhàn zài nǎr',ja:'地下鉄の駅はどこですか。',words:['地铁站 dìtiě zhàn · 地下鉄駅','在哪儿 zài nǎr · どこに'],level:'A1',tags:['travel','city','tired','three-minute','listening']},
{id:'csl-a1-city-002',emoji:'👉 🚇',title:'前か確認する',context:'相手が前を指しました。方向だけ確認します。',zh:'在前面吗？',py:'zài qiánmiàn ma',ja:'前の方ですか。',words:['前面 qiánmiàn · 前','吗 ma · 〜ですか'],level:'A1',tags:['travel','city','tired','three-minute']},
{id:'csl-a1-city-003',emoji:'🎫 🙋',title:'切符を一枚',context:'駅で必要な切符を一枚だけ頼みます。',zh:'我要一张票。',py:'wǒ yào yì zhāng piào',ja:'切符を一枚ください。',words:['一张 yì zhāng · 一枚','票 piào · 切符'],level:'A1',tags:['travel','city','tired','three-minute']},
{id:'csl-a1-city-004',emoji:'🚌 ❓',title:'バス停を探す',context:'近くのバス停を聞きます。',zh:'公交车站在哪儿？',py:'gōngjiāochē zhàn zài nǎr',ja:'バス停はどこですか。',words:['公交车站 gōngjiāochē zhàn · バス停'],level:'A1',tags:['travel','city','tired']},
{id:'csl-a1-city-005',emoji:'🚕 🏨',title:'ホテルまで行く',context:'タクシーで目的地を短く伝えます。',zh:'请去这个酒店。',py:'qǐng qù zhège jiǔdiàn',ja:'このホテルへ行ってください。',words:['去 qù · 行く','酒店 jiǔdiàn · ホテル'],level:'A1',tags:['travel','hotel','tired']},
{id:'csl-a1-city-006',emoji:'🗺️ 🤔',title:'遠いか聞く',context:'歩けそうか、距離だけ確認します。',zh:'远吗？',py:'yuǎn ma',ja:'遠いですか。',words:['远 yuǎn · 遠い','吗 ma · 〜ですか'],level:'A1',tags:['travel','city','tired']},
{id:'csl-a1-city-007',emoji:'🚶 ⏱️',title:'歩いて行けるか',context:'徒歩で行ける距離か聞きます。',zh:'可以走路去吗？',py:'kěyǐ zǒulù qù ma',ja:'歩いて行けますか。',words:['可以 kěyǐ · 〜できる','走路 zǒulù · 歩く'],level:'A2',tags:['travel','city','tired']},
{id:'csl-a1-city-008',emoji:'🧭 🙏',title:'道を教えてもらう',context:'道を教えてもらったので、お礼を言います。',zh:'谢谢你告诉我。',py:'xièxie nǐ gàosu wǒ',ja:'教えてくれてありがとう。',words:['告诉 gàosu · 教える'],level:'A2',tags:['travel','city','tired']},

{id:'csl-a1-shop-001',legacyTiredIndex:3,emoji:'👀 🏷️',title:'値段を見る',context:'買うかどうかは決めず、値段だけ聞きます。',zh:'这个多少钱？',py:'zhège duōshao qián',ja:'これはいくらですか。',words:['这个 zhège · これ','多少钱 duōshao qián · いくら'],level:'A1',tags:['shopping','tired','three-minute','listening']},
{id:'csl-a1-shop-002',legacyTiredIndex:4,emoji:'👕 👀',title:'まだ見ているだけ',context:'決めなくても大丈夫。ひとことだけ。',zh:'我随便看看。',py:'wǒ suíbiàn kànkan',ja:'ちょっと見ているだけです。',words:['随便 suíbiàn · 気ままに','看看 kànkan · ちょっと見る'],level:'A2',tags:['shopping','tired','three-minute']},
{id:'csl-a1-shop-003',emoji:'✅ 🛍️',title:'これに決める',context:'気に入ったので、そのまま伝えます。',zh:'我要这个。',py:'wǒ yào zhège',ja:'これをください。',words:['要 yào · ほしい','这个 zhège · これ'],level:'A1',tags:['shopping','tired','three-minute']},
{id:'csl-a1-shop-004',emoji:'👕 📏',title:'大きいサイズ',context:'もう少し大きいものがあるか聞きます。',zh:'有大一点儿的吗？',py:'yǒu dà yìdiǎnr de ma',ja:'もう少し大きいものはありますか。',words:['大一点儿 dà yìdiǎnr · 少し大きい','有 yǒu · ある'],level:'A2',tags:['shopping','tired']},
{id:'csl-a1-shop-005',emoji:'👕 🚪',title:'試着したい',context:'服を買う前に、試してみます。',zh:'我可以试一下吗？',py:'wǒ kěyǐ shì yíxià ma',ja:'試着してもいいですか。',words:['可以 kěyǐ · 〜してよい','试一下 shì yíxià · 試してみる'],level:'A2',tags:['shopping','tired']},
{id:'csl-a1-shop-006',emoji:'💳 ❓',title:'カードが使えるか',context:'支払い方法を確認します。',zh:'可以刷卡吗？',py:'kěyǐ shuākǎ ma',ja:'カードで払えますか。',words:['刷卡 shuākǎ · カードで払う'],level:'A2',tags:['shopping','service','tired']},
{id:'csl-a1-shop-007',emoji:'🛍️ 🙏',title:'袋はいらない',context:'袋が不要なら短く伝えます。',zh:'不用袋子，谢谢。',py:'bú yòng dàizi, xièxie',ja:'袋はいりません、ありがとう。',words:['不用 bú yòng · 必要ない','袋子 dàizi · 袋'],level:'A2',tags:['shopping','tired']},
{id:'csl-a1-shop-008',emoji:'🧾 ❓',title:'レシートをもらう',context:'必要なので、レシートを頼みます。',zh:'请给我小票。',py:'qǐng gěi wǒ xiǎopiào',ja:'レシートをください。',words:['小票 xiǎopiào · レシート','给 gěi · 与える'],level:'A2',tags:['shopping','service','tired']},

{id:'csl-a1-home-001',legacyTiredIndex:7,emoji:'🏠 🌙',title:'今日は家にいる',context:'予定を説明しすぎず、今のことだけ。',zh:'我今天在家。',py:'wǒ jīntiān zài jiā',ja:'今日は家にいます。',words:['今天 jīntiān · 今日','在家 zài jiā · 家にいる'],level:'A1',tags:['home','daily','tired','listening']},
{id:'csl-a1-home-002',legacyTiredIndex:10,emoji:'🌧️ 🏠',title:'今日は出かけない',context:'予定を一つだけ言います。',zh:'我今天不出去。',py:'wǒ jīntiān bù chūqù',ja:'今日は出かけません。',words:['不 bù · 〜ない','出去 chūqù · 出かける'],level:'A1',tags:['home','daily','tired']},
{id:'csl-a1-home-003',legacyTiredIndex:11,emoji:'😴 🌙',title:'もう休みたい',context:'疲れている日は、この一文で終わってもいい。',zh:'我想早点儿休息。',py:'wǒ xiǎng zǎodiǎnr xiūxi',ja:'少し早めに休みたいです。',words:['想 xiǎng · 〜したい','早点儿 zǎodiǎnr · 少し早めに','休息 xiūxi · 休む'],level:'A2',tags:['home','daily','tired','listening']},
{id:'csl-a1-home-004',emoji:'🌅 ☕',title:'朝はお茶を飲む',context:'いつもの朝のことを短く言います。',zh:'我早上喝茶。',py:'wǒ zǎoshang hē chá',ja:'朝はお茶を飲みます。',words:['早上 zǎoshang · 朝','喝 hē · 飲む'],level:'A1',tags:['home','daily','tired']},
{id:'csl-a1-home-005',emoji:'🍚 🏠',title:'家で食べる',context:'今日は外食せず、家で食べます。',zh:'我在家吃饭。',py:'wǒ zài jiā chīfàn',ja:'家でご飯を食べます。',words:['吃饭 chīfàn · 食事する','在家 zài jiā · 家で'],level:'A1',tags:['home','daily','tired']},
{id:'csl-a1-home-006',emoji:'🛁 🌙',title:'お風呂のあと休む',context:'夜の流れをひとことだけ言います。',zh:'洗完澡我就休息。',py:'xǐ wán zǎo wǒ jiù xiūxi',ja:'お風呂のあと、すぐ休みます。',words:['洗澡 xǐzǎo · 入浴する','休息 xiūxi · 休む'],level:'A2',tags:['home','daily','tired']},
{id:'csl-a1-home-007',emoji:'📺 🚫',title:'今日はテレビを見ない',context:'今夜は静かに過ごします。',zh:'我今天不看电视。',py:'wǒ jīntiān bú kàn diànshì',ja:'今日はテレビを見ません。',words:['看电视 kàn diànshì · テレビを見る'],level:'A1',tags:['home','daily','tired']},
{id:'csl-a1-home-008',emoji:'🛏️ ⏰',title:'明日は早い',context:'明日の朝が早いことを伝えます。',zh:'我明天要早起。',py:'wǒ míngtiān yào zǎoqǐ',ja:'明日は早起きしなければなりません。',words:['明天 míngtiān · 明日','早起 zǎoqǐ · 早起きする'],level:'A2',tags:['home','daily','tired']},

{id:'csl-a1-work-001',emoji:'💻 🏠',title:'今日は家で仕事',context:'今日の働く場所を短く伝えます。',zh:'我今天在家工作。',py:'wǒ jīntiān zài jiā gōngzuò',ja:'今日は家で仕事をします。',words:['工作 gōngzuò · 仕事する','在家 zài jiā · 家で'],level:'A1',tags:['work','daily','tired','listening']},
{id:'csl-a1-work-002',emoji:'📚 ☕',title:'少し勉強する',context:'長くやらず、少しだけ勉強します。',zh:'我想学习一会儿。',py:'wǒ xiǎng xuéxí yíhuìr',ja:'少し勉強したいです。',words:['学习 xuéxí · 勉強する','一会儿 yíhuìr · 少しの間'],level:'A2',tags:['study','daily','tired']},
{id:'csl-a1-work-003',emoji:'🏫 ⏰',title:'学校へ行く時間',context:'出発する時間を簡単に伝えます。',zh:'我八点去学校。',py:'wǒ bā diǎn qù xuéxiào',ja:'8時に学校へ行きます。',words:['八点 bā diǎn · 8時','学校 xuéxiào · 学校'],level:'A1',tags:['study','time','tired']},
{id:'csl-a1-work-004',emoji:'💻 ⏸️',title:'少し休憩する',context:'作業を止めて、短く休みます。',zh:'我先休息一下。',py:'wǒ xiān xiūxi yíxià',ja:'先に少し休みます。',words:['先 xiān · 先に','休息一下 xiūxi yíxià · 少し休む'],level:'A2',tags:['work','tired','daily']},
{id:'csl-a1-work-005',emoji:'📄 🤔',title:'まだ終わっていない',context:'作業が残っていることだけ伝えます。',zh:'我还没做完。',py:'wǒ hái méi zuòwán',ja:'まだ終わっていません。',words:['还没 hái méi · まだ〜していない','做完 zuòwán · やり終える'],level:'A2',tags:['work','study','tired']},
{id:'csl-a1-work-006',emoji:'📅 ❓',title:'明日でいいか',context:'今日は難しいので、明日にできるか聞きます。',zh:'明天可以吗？',py:'míngtiān kěyǐ ma',ja:'明日でもいいですか。',words:['明天 míngtiān · 明日','可以 kěyǐ · よい／できる'],level:'A1',tags:['work','plans','tired']},
{id:'csl-a1-work-007',emoji:'📝 ✅',title:'分かりました',context:'説明を聞いて、短く返事をします。',zh:'我明白了。',py:'wǒ míngbai le',ja:'分かりました。',words:['明白 míngbai · 分かる','了 le · 状態の変化'],level:'A2',tags:['work','study','tired']},
{id:'csl-a1-work-008',emoji:'❓ 🙋',title:'もう一度お願いする',context:'聞き取れなかったので、もう一度頼みます。',zh:'请再说一遍。',py:'qǐng zài shuō yí biàn',ja:'もう一度言ってください。',words:['再 zài · もう一度','一遍 yí biàn · 一回'],level:'A2',tags:['work','study','communication','tired','listening']},

{id:'csl-a1-health-001',legacyTiredIndex:5,emoji:'😣 🏥',title:'少し具合が悪い',context:'説明を増やさず、状態だけ伝えます。',zh:'我有点儿不舒服。',py:'wǒ yǒudiǎnr bù shūfu',ja:'少し具合が悪いです。',words:['有点儿 yǒudiǎnr · 少し','不舒服 bù shūfu · 具合が悪い'],level:'A2',tags:['health','service','tired','three-minute','listening']},
{id:'csl-a1-health-002',emoji:'🤕 🧑‍⚕️',title:'頭が痛い',context:'どこがつらいかを短く伝えます。',zh:'我头疼。',py:'wǒ tóu téng',ja:'頭が痛いです。',words:['头 tóu · 頭','疼 téng · 痛い'],level:'A1',tags:['health','service','tired','three-minute']},
{id:'csl-a1-health-003',emoji:'💊 ❓',title:'薬があるか聞く',context:'薬局で、必要な薬があるか聞きます。',zh:'有这个药吗？',py:'yǒu zhège yào ma',ja:'この薬はありますか。',words:['药 yào · 薬','有 yǒu · ある'],level:'A1',tags:['health','service','tired']},
{id:'csl-a1-health-004',emoji:'💊 🥤',title:'薬の飲み方を聞く',context:'いつ飲むのかだけ確認します。',zh:'这个药怎么吃？',py:'zhège yào zěnme chī',ja:'この薬はどう飲みますか。',words:['怎么 zěnme · どうやって','吃 chī · 食べる／薬を飲む'],level:'A2',tags:['health','service','tired']},
{id:'csl-a1-health-005',emoji:'🌡️ 🤒',title:'熱がある',context:'体調を一つだけ伝えます。',zh:'我发烧了。',py:'wǒ fāshāo le',ja:'熱が出ました。',words:['发烧 fāshāo · 発熱する'],level:'A2',tags:['health','service','tired']},
{id:'csl-a1-health-006',emoji:'😷 🛏️',title:'今日は休む',context:'無理をせず、今日は休むことを伝えます。',zh:'我今天想休息。',py:'wǒ jīntiān xiǎng xiūxi',ja:'今日は休みたいです。',words:['想 xiǎng · 〜したい','休息 xiūxi · 休む'],level:'A1',tags:['health','home','tired']},
{id:'csl-a1-health-007',legacyTiredIndex:8,emoji:'🚌 ⏳',title:'少し待つ',context:'急がず、相手に少し待ってもらいます。',zh:'请等一下。',py:'qǐng děng yíxià',ja:'少し待ってください。',words:['请 qǐng · 〜してください','等一下 děng yíxià · 少し待つ'],level:'A1',tags:['service','communication','tired','listening']},
{id:'csl-a1-health-008',emoji:'🧑‍⚕️ 🙏',title:'助けてもらう',context:'対応してもらったので、お礼を言います。',zh:'谢谢你的帮助。',py:'xièxie nǐ de bāngzhù',ja:'助けてくれてありがとうございます。',words:['帮助 bāngzhù · 助ける／助け'],level:'A2',tags:['health','service','tired']},

{id:'csl-a1-plan-001',legacyTiredIndex:6,emoji:'📱 🙂',title:'あとで連絡する',context:'今すぐ話さなくても大丈夫。',zh:'我晚点儿联系你。',py:'wǒ wǎndiǎnr liánxì nǐ',ja:'あとで連絡します。',words:['晚点儿 wǎndiǎnr · あとで','联系 liánxì · 連絡する'],level:'A2',tags:['plans','communication','tired','listening']},
{id:'csl-a1-plan-002',emoji:'📅 ☕',title:'明日会う',context:'次に会う予定を短く決めます。',zh:'我们明天见吧。',py:'wǒmen míngtiān jiàn ba',ja:'明日会いましょう。',words:['我们 wǒmen · 私たち','吧 ba · 〜しましょう'],level:'A2',tags:['plans','social','tired']},
{id:'csl-a1-plan-003',emoji:'⏰ ❓',title:'何時か聞く',context:'会う時間だけ確認します。',zh:'几点见？',py:'jǐ diǎn jiàn',ja:'何時に会いますか。',words:['几点 jǐ diǎn · 何時','见 jiàn · 会う'],level:'A1',tags:['plans','time','tired']},
{id:'csl-a1-plan-004',emoji:'🌧️ ☂️',title:'雨が降っている',context:'外の様子を短く伝えます。',zh:'外面下雨了。',py:'wàimiàn xiàyǔ le',ja:'外は雨が降っています。',words:['外面 wàimiàn · 外','下雨 xiàyǔ · 雨が降る'],level:'A2',tags:['weather','daily','tired']}
];
function clone(x){return JSON.parse(JSON.stringify(x))}
function all(){return S.map(clone)}
function get(id){for(var i=0;i<S.length;i++)if(S[i].id===id)return clone(S[i]);return null}
function query(opts){opts=opts||{};var tags=opts.tags||[],level=opts.level||null;return S.filter(function(x){if(level&&x.level!==level)return false;for(var i=0;i<tags.length;i++)if(x.tags.indexOf(tags[i])<0)return false;return true}).map(clone)}
function forCourse(course){return S.filter(function(x){return x.tags.indexOf(course)>=0}).map(clone)}
function legacyTiredId(n){for(var i=0;i<S.length;i++)if(S[i].legacyTiredIndex===Number(n))return S[i].id;return null}
window.CSLSentenceBank={version:VERSION,all:all,get:get,query:query,forCourse:forCourse,legacyTiredId:legacyTiredId,count:S.length};
})();