(function(){
'use strict';
/* Shared Sentence Bank expansion batch 01.
   Adds reusable canonical sentences without changing existing IDs. */
var B=window.CSLSentenceBank;if(!B)return;
var X=[
{id:'csl-a1-home-101',emoji:'🏠 🌅',title:'朝は家にいる',context:'朝の予定を短く伝えます。',zh:'我早上在家。',py:'wǒ zǎoshang zài jiā',ja:'朝は家にいます。',words:['早上 zǎoshang · 朝','在家 zài jiā · 家にいる'],level:'A1',tags:['home','daily','tired','listening']},
{id:'csl-a1-home-102',emoji:'🏠 🚪',title:'今帰ってきた',context:'家に着いたことだけ伝えます。',zh:'我刚到家。',py:'wǒ gāng dào jiā',ja:'今、家に着きました。',words:['刚 gāng · たった今','到家 dào jiā · 家に着く'],level:'A2',tags:['home','daily','tired']},
{id:'csl-a1-home-103',emoji:'🍳 🏠',title:'家で食べる',context:'今日は外食せず家で食べます。',zh:'我今天在家吃饭。',py:'wǒ jīntiān zài jiā chīfàn',ja:'今日は家で食事します。',words:['在家 zài jiā · 家で','吃饭 chīfàn · 食事する'],level:'A1',tags:['home','food','daily','tired']},
{id:'csl-a1-home-104',emoji:'🧹 🏠',title:'部屋を片づける',context:'今やっていることを短く言います。',zh:'我在收拾房间。',py:'wǒ zài shōushi fángjiān',ja:'部屋を片づけています。',words:['收拾 shōushi · 片づける','房间 fángjiān · 部屋'],level:'A2',tags:['home','daily','tired']},
{id:'csl-a1-home-105',emoji:'🪟 🌬️',title:'窓を開ける',context:'少し空気を入れ替えます。',zh:'我把窗户打开了。',py:'wǒ bǎ chuānghu dǎkāi le',ja:'窓を開けました。',words:['窗户 chuānghu · 窓','打开 dǎkāi · 開ける'],level:'A2',tags:['home','daily','tired']},
{id:'csl-a1-home-106',emoji:'💡 🌙',title:'電気を消す',context:'寝る前に照明を消します。',zh:'我把灯关了。',py:'wǒ bǎ dēng guān le',ja:'電気を消しました。',words:['灯 dēng · 明かり','关 guān · 閉める／消す'],level:'A2',tags:['home','daily','tired']},
{id:'csl-a1-home-107',emoji:'📦 🏠',title:'荷物が届く',context:'家に荷物が届きました。',zh:'我的快递到了。',py:'wǒ de kuàidì dào le',ja:'荷物が届きました。',words:['快递 kuàidì · 宅配便','到了 dào le · 着いた'],level:'A2',tags:['home','service','daily','tired']},
{id:'csl-a1-home-108',emoji:'🛏️ 🌙',title:'もう寝る',context:'今日はもう休むことを伝えます。',zh:'我准备睡觉了。',py:'wǒ zhǔnbèi shuìjiào le',ja:'そろそろ寝ます。',words:['准备 zhǔnbèi · 〜するつもり','睡觉 shuìjiào · 寝る'],level:'A2',tags:['home','daily','tired']},

{id:'csl-a1-time-101',emoji:'⏰ ❓',title:'今何時か聞く',context:'時間だけ確認します。',zh:'现在几点？',py:'xiànzài jǐ diǎn',ja:'今何時ですか。',words:['现在 xiànzài · 今','几点 jǐ diǎn · 何時'],level:'A1',tags:['time','daily','tired','listening']},
{id:'csl-a1-time-102',emoji:'🕗 📅',title:'8時に始まる',context:'開始時刻を伝えます。',zh:'八点开始。',py:'bā diǎn kāishǐ',ja:'8時に始まります。',words:['八点 bā diǎn · 8時','开始 kāishǐ · 始まる'],level:'A1',tags:['time','work','study','tired']},
{id:'csl-a1-time-103',emoji:'⏳ 🙂',title:'まだ時間がある',context:'急がなくていいことを伝えます。',zh:'还有时间。',py:'hái yǒu shíjiān',ja:'まだ時間があります。',words:['还有 hái yǒu · まだある','时间 shíjiān · 時間'],level:'A1',tags:['time','daily','tired']},
{id:'csl-a1-time-104',emoji:'🏃 ⏰',title:'少し遅れる',context:'待ち合わせに少し遅れます。',zh:'我会晚一点儿。',py:'wǒ huì wǎn yìdiǎnr',ja:'少し遅れます。',words:['会 huì · 〜するだろう','晚一点儿 wǎn yìdiǎnr · 少し遅く'],level:'A2',tags:['time','plans','communication','tired']},
{id:'csl-a1-time-105',emoji:'📅 ➡️',title:'明日にする',context:'予定を明日に変えます。',zh:'我们明天再说吧。',py:'wǒmen míngtiān zài shuō ba',ja:'また明日話しましょう。',words:['明天 míngtiān · 明日','再说 zài shuō · また話す'],level:'A2',tags:['time','plans','communication','tired']},
{id:'csl-a1-time-106',emoji:'🕒 ✅',title:'3時で大丈夫',context:'提案された時間に同意します。',zh:'三点可以。',py:'sān diǎn kěyǐ',ja:'3時で大丈夫です。',words:['三点 sān diǎn · 3時','可以 kěyǐ · 大丈夫'],level:'A1',tags:['time','plans','tired']},
{id:'csl-a1-time-107',emoji:'⌛ ❓',title:'どのくらいかかる',context:'必要な時間を聞きます。',zh:'要多长时间？',py:'yào duō cháng shíjiān',ja:'どのくらい時間がかかりますか。',words:['多长时间 duō cháng shíjiān · どのくらいの時間','要 yào · 要する'],level:'A2',tags:['time','travel','service','tired']},
{id:'csl-a1-time-108',emoji:'⏰ ✅',title:'時間になった',context:'始める時間になったことを伝えます。',zh:'时间到了。',py:'shíjiān dào le',ja:'時間になりました。',words:['时间 shíjiān · 時間','到了 dào le · 〜になった'],level:'A1',tags:['time','daily','tired']},

{id:'csl-a1-weather-101',emoji:'☀️ 🙂',title:'今日は晴れ',context:'天気を一言だけ伝えます。',zh:'今天天气很好。',py:'jīntiān tiānqì hěn hǎo',ja:'今日は天気がいいです。',words:['天气 tiānqì · 天気','很好 hěn hǎo · とてもよい'],level:'A1',tags:['weather','daily','tired','listening']},
{id:'csl-a1-weather-102',emoji:'☔ 🌧️',title:'雨が降っている',context:'外の様子を伝えます。',zh:'外面在下雨。',py:'wàimiàn zài xiàyǔ',ja:'外は雨が降っています。',words:['外面 wàimiàn · 外','下雨 xiàyǔ · 雨が降る'],level:'A1',tags:['weather','daily','tired']},
{id:'csl-a1-weather-103',emoji:'❄️ 🥶',title:'今日は寒い',context:'気温について短く言います。',zh:'今天很冷。',py:'jīntiān hěn lěng',ja:'今日は寒いです。',words:['冷 lěng · 寒い'],level:'A1',tags:['weather','daily','tired']},
{id:'csl-a1-weather-104',emoji:'☀️ 🥵',title:'今日は暑い',context:'暑さを一言で伝えます。',zh:'今天太热了。',py:'jīntiān tài rè le',ja:'今日は暑すぎます。',words:['太…了 tài…le · あまりに〜だ','热 rè · 暑い'],level:'A1',tags:['weather','daily','tired']},
{id:'csl-a1-weather-105',emoji:'🌬️ 🧥',title:'風が強い',context:'外の風について伝えます。',zh:'今天风很大。',py:'jīntiān fēng hěn dà',ja:'今日は風が強いです。',words:['风 fēng · 風','大 dà · 強い／大きい'],level:'A2',tags:['weather','daily','tired']},
{id:'csl-a1-weather-106',emoji:'☂️ 🎒',title:'傘を持つ',context:'雨に備えて傘を持っていきます。',zh:'我带伞了。',py:'wǒ dài sǎn le',ja:'傘を持ってきました。',words:['带 dài · 持っていく','伞 sǎn · 傘'],level:'A1',tags:['weather','travel','daily','tired']},
{id:'csl-a1-weather-107',emoji:'🌧️ 📅',title:'午後は雨らしい',context:'天気予報の情報を伝えます。',zh:'下午可能会下雨。',py:'xiàwǔ kěnéng huì xiàyǔ',ja:'午後は雨が降るかもしれません。',words:['下午 xiàwǔ · 午後','可能 kěnéng · かもしれない'],level:'A2',tags:['weather','plans','daily','tired']},
{id:'csl-a1-weather-108',emoji:'🌤️ 🚶',title:'少し涼しくなった',context:'外が過ごしやすくなったことを伝えます。',zh:'现在凉快一点儿了。',py:'xiànzài liángkuai yìdiǎnr le',ja:'今は少し涼しくなりました。',words:['凉快 liángkuai · 涼しい','一点儿 yìdiǎnr · 少し'],level:'A2',tags:['weather','daily','tired']},

{id:'csl-a1-comm-101',emoji:'📱 ❓',title:'聞こえるか確認する',context:'電話で音声を確認します。',zh:'你听得到吗？',py:'nǐ tīngdedào ma',ja:'聞こえますか。',words:['听得到 tīngdedào · 聞こえる','吗 ma · 〜ですか'],level:'A2',tags:['communication','phone','tired','listening']},
{id:'csl-a1-comm-102',emoji:'📱 🔁',title:'もう一度言ってもらう',context:'聞き取れなかったので頼みます。',zh:'请再说一遍。',py:'qǐng zài shuō yí biàn',ja:'もう一度言ってください。',words:['再 zài · もう一度','一遍 yí biàn · 一回'],level:'A2',tags:['communication','phone','work','study','tired']},
{id:'csl-a1-comm-103',emoji:'🐢 💬',title:'ゆっくり話してもらう',context:'話す速度を少し落としてもらいます。',zh:'请说慢一点儿。',py:'qǐng shuō màn yìdiǎnr',ja:'もう少しゆっくり話してください。',words:['慢一点儿 màn yìdiǎnr · 少しゆっくり','说 shuō · 話す'],level:'A1',tags:['communication','tired','listening']},
{id:'csl-a1-comm-104',emoji:'🤔 💬',title:'よく分からない',context:'理解できていないことをそのまま伝えます。',zh:'我不太明白。',py:'wǒ bú tài míngbai',ja:'あまりよく分かりません。',words:['不太 bú tài · あまり〜ない','明白 míngbai · 分かる'],level:'A2',tags:['communication','work','study','tired']},
{id:'csl-a1-comm-105',emoji:'✍️ 📱',title:'書いてもらう',context:'聞き取りにくいので文字で見せてもらいます。',zh:'可以写下来吗？',py:'kěyǐ xiě xiàlai ma',ja:'書いてもらえますか。',words:['写 xiě · 書く','下来 xiàlai · 〜して残す'],level:'A2',tags:['communication','service','study','tired']},
{id:'csl-a1-comm-106',emoji:'💬 ✅',title:'分かったと伝える',context:'説明を理解したことを返します。',zh:'我明白了。',py:'wǒ míngbai le',ja:'分かりました。',words:['明白 míngbai · 分かる','了 le · 状態変化'],level:'A1',tags:['communication','daily','tired']},
{id:'csl-a1-comm-107',emoji:'📩 ⏳',title:'あとで返信する',context:'今すぐ返せないので後で返すと伝えます。',zh:'我晚一点儿回复你。',py:'wǒ wǎn yìdiǎnr huífù nǐ',ja:'少しあとで返信します。',words:['回复 huífù · 返信する','晚一点儿 wǎn yìdiǎnr · 少しあとで'],level:'A2',tags:['communication','plans','work','tired']},
{id:'csl-a1-comm-108',emoji:'📞 🚫',title:'今は話せない',context:'今電話で話せないことを伝えます。',zh:'我现在不方便说话。',py:'wǒ xiànzài bù fāngbiàn shuōhuà',ja:'今は話すのが難しいです。',words:['不方便 bù fāngbiàn · 都合が悪い','说话 shuōhuà · 話す'],level:'A2',tags:['communication','phone','work','tired']},

{id:'csl-a1-work-101',emoji:'💼 🌅',title:'仕事に行く',context:'今日の予定を短く言います。',zh:'我今天去上班。',py:'wǒ jīntiān qù shàngbān',ja:'今日は仕事に行きます。',words:['上班 shàngbān · 出勤する','去 qù · 行く'],level:'A1',tags:['work','daily','tired','listening']},
{id:'csl-a1-work-102',emoji:'💼 🏠',title:'今日は在宅',context:'働く場所を伝えます。',zh:'我今天在家工作。',py:'wǒ jīntiān zài jiā gōngzuò',ja:'今日は家で仕事をします。',words:['工作 gōngzuò · 仕事する','在家 zài jiā · 家で'],level:'A1',tags:['work','home','daily','tired']},
{id:'csl-a1-work-103',emoji:'📚 🏫',title:'今日は授業がある',context:'学校の予定を伝えます。',zh:'我今天有课。',py:'wǒ jīntiān yǒu kè',ja:'今日は授業があります。',words:['有课 yǒu kè · 授業がある'],level:'A1',tags:['study','school','daily','tired']},
{id:'csl-a1-work-104',emoji:'💻 📝',title:'今作業中',context:'今していることを伝えます。',zh:'我现在在工作。',py:'wǒ xiànzài zài gōngzuò',ja:'今仕事中です。',words:['现在 xiànzài · 今','工作 gōngzuò · 仕事する'],level:'A1',tags:['work','daily','tired']},
{id:'csl-a1-work-105',emoji:'📄 ❓',title:'資料を確認する',context:'資料を見るよう伝えます。',zh:'请看一下这个文件。',py:'qǐng kàn yíxià zhège wénjiàn',ja:'この資料をちょっと見てください。',words:['文件 wénjiàn · 資料／ファイル','看一下 kàn yíxià · ちょっと見る'],level:'A2',tags:['work','study','communication','tired']},
{id:'csl-a1-work-106',emoji:'🗓️ 🤝',title:'明日打ち合わせ',context:'明日の予定を共有します。',zh:'我们明天开会。',py:'wǒmen míngtiān kāihuì',ja:'明日は会議があります。',words:['开会 kāihuì · 会議をする','明天 míngtiān · 明日'],level:'A1',tags:['work','plans','tired']},
{id:'csl-a1-work-107',emoji:'✅ 📄',title:'終わったと伝える',context:'作業が終わったことを知らせます。',zh:'我已经做完了。',py:'wǒ yǐjīng zuòwán le',ja:'もう終わりました。',words:['已经 yǐjīng · すでに','做完 zuòwán · やり終える'],level:'A2',tags:['work','study','tired']},
{id:'csl-a1-work-108',emoji:'⏳ 💼',title:'もう少し時間が必要',context:'作業に時間が必要だと伝えます。',zh:'我还需要一点儿时间。',py:'wǒ hái xūyào yìdiǎnr shíjiān',ja:'もう少し時間が必要です。',words:['需要 xūyào · 必要とする','一点儿 yìdiǎnr · 少し'],level:'A2',tags:['work','study','communication','tired']},

{id:'csl-a1-food-101',emoji:'🍚 ❓',title:'何を食べるか聞く',context:'食事を決める前に相手に聞きます。',zh:'你想吃什么？',py:'nǐ xiǎng chī shénme',ja:'何を食べたいですか。',words:['想 xiǎng · 〜したい','什么 shénme · 何'],level:'A1',tags:['food','social','tired','listening']},
{id:'csl-a1-food-102',emoji:'🍜 🙂',title:'麺を食べたい',context:'食べたいものを短く言います。',zh:'我想吃面。',py:'wǒ xiǎng chī miàn',ja:'麺を食べたいです。',words:['想 xiǎng · 〜したい','面 miàn · 麺'],level:'A1',tags:['food','daily','tired']},
{id:'csl-a1-food-103',emoji:'🌶️ 🚫',title:'辛くしないで',context:'辛さを控えてもらいます。',zh:'不要太辣。',py:'bú yào tài là',ja:'あまり辛くしないでください。',words:['辣 là · 辛い','不要 bú yào · 〜しないで'],level:'A1',tags:['food','service','tired']},
{id:'csl-a1-food-104',emoji:'🥢 ❓',title:'箸を頼む',context:'必要なものを一つ頼みます。',zh:'可以给我筷子吗？',py:'kěyǐ gěi wǒ kuàizi ma',ja:'箸をもらえますか。',words:['筷子 kuàizi · 箸','给 gěi · 与える'],level:'A1',tags:['food','service','tired']},
{id:'csl-a1-food-105',emoji:'🍚 ➕',title:'ご飯をもう少し',context:'ご飯を少し追加してもらいます。',zh:'请再给我一点儿米饭。',py:'qǐng zài gěi wǒ yìdiǎnr mǐfàn',ja:'ご飯をもう少しください。',words:['米饭 mǐfàn · ご飯','再 zài · もう一度'],level:'A2',tags:['food','service','tired']},
{id:'csl-a1-food-106',emoji:'🥣 🔥',title:'少し熱い',context:'料理が熱いことを伝えます。',zh:'有点儿烫。',py:'yǒudiǎnr tàng',ja:'少し熱いです。',words:['烫 tàng · 熱い','有点儿 yǒudiǎnr · 少し'],level:'A2',tags:['food','daily','tired']},
{id:'csl-a1-food-107',emoji:'🍽️ ✅',title:'もうお腹いっぱい',context:'もう十分食べたことを伝えます。',zh:'我吃饱了。',py:'wǒ chībǎo le',ja:'お腹いっぱいです。',words:['吃饱 chībǎo · 満腹になる'],level:'A2',tags:['food','social','tired']},
{id:'csl-a1-food-108',emoji:'🥡 🏠',title:'持ち帰りたい',context:'残りを持ち帰りたいと伝えます。',zh:'我想打包。',py:'wǒ xiǎng dǎbāo',ja:'持ち帰りたいです。',words:['打包 dǎbāo · 持ち帰りにする'],level:'A2',tags:['food','service','tired']},

{id:'csl-a1-travel-101',emoji:'🏨 🧳',title:'予約している',context:'ホテルで予約があることを伝えます。',zh:'我有预订。',py:'wǒ yǒu yùdìng',ja:'予約しています。',words:['预订 yùdìng · 予約'],level:'A2',tags:['travel','hotel','service','tired']},
{id:'csl-a1-travel-102',emoji:'🏨 ❓',title:'部屋を確認する',context:'自分の部屋番号を確認します。',zh:'我的房间在哪儿？',py:'wǒ de fángjiān zài nǎr',ja:'私の部屋はどこですか。',words:['房间 fángjiān · 部屋','在哪儿 zài nǎr · どこに'],level:'A1',tags:['travel','hotel','tired']},
{id:'csl-a1-travel-103',emoji:'🗝️ 🙏',title:'鍵をお願いする',context:'部屋の鍵を受け取ります。',zh:'请给我房卡。',py:'qǐng gěi wǒ fángkǎ',ja:'ルームキーをください。',words:['房卡 fángkǎ · ルームキー','给 gěi · くれる'],level:'A1',tags:['travel','hotel','service','tired']},
{id:'csl-a1-travel-104',emoji:'🚕 ❓',title:'タクシーを呼ぶ',context:'移動のためタクシーを頼みます。',zh:'可以帮我叫出租车吗？',py:'kěyǐ bāng wǒ jiào chūzūchē ma',ja:'タクシーを呼んでもらえますか。',words:['帮 bāng · 手伝う','出租车 chūzūchē · タクシー'],level:'A2',tags:['travel','service','tired']},
{id:'csl-a1-travel-105',emoji:'🧳 🚉',title:'駅へ行きたい',context:'目的地を簡単に伝えます。',zh:'我想去火车站。',py:'wǒ xiǎng qù huǒchēzhàn',ja:'駅へ行きたいです。',words:['火车站 huǒchēzhàn · 駅','想去 xiǎng qù · 行きたい'],level:'A1',tags:['travel','city','tired']},
{id:'csl-a1-travel-106',emoji:'🚇 🔄',title:'乗り換えが必要か',context:'途中で乗り換えるか確認します。',zh:'需要换车吗？',py:'xūyào huànchē ma',ja:'乗り換えが必要ですか。',words:['换车 huànchē · 乗り換える','需要 xūyào · 必要'],level:'A2',tags:['travel','city','tired']},
{id:'csl-a1-travel-107',emoji:'🚌 🛑',title:'ここで降りるか',context:'降りる場所を確認します。',zh:'在这里下车吗？',py:'zài zhèlǐ xiàchē ma',ja:'ここで降りますか。',words:['这里 zhèlǐ · ここ','下车 xiàchē · 降りる'],level:'A1',tags:['travel','city','tired']},
{id:'csl-a1-travel-108',emoji:'🧭 📍',title:'着いたか確認する',context:'目的地に到着したか聞きます。',zh:'我们到了吗？',py:'wǒmen dào le ma',ja:'着きましたか。',words:['到了 dào le · 着いた','我们 wǒmen · 私たち'],level:'A1',tags:['travel','city','tired']},

{id:'csl-a1-shop-101',emoji:'🛍️ 👀',title:'別の色を見る',context:'違う色があるか聞きます。',zh:'有别的颜色吗？',py:'yǒu bié de yánsè ma',ja:'ほかの色はありますか。',words:['别的 bié de · ほかの','颜色 yánsè · 色'],level:'A2',tags:['shopping','service','tired']},
{id:'csl-a1-shop-102',emoji:'👕 📏',title:'少し小さい',context:'サイズが合わないことを伝えます。',zh:'这个有点儿小。',py:'zhège yǒudiǎnr xiǎo',ja:'これは少し小さいです。',words:['有点儿 yǒudiǎnr · 少し','小 xiǎo · 小さい'],level:'A1',tags:['shopping','tired']},
{id:'csl-a1-shop-103',emoji:'👕 📏',title:'大きいサイズを聞く',context:'大きいサイズがあるか尋ねます。',zh:'有大一点儿的吗？',py:'yǒu dà yìdiǎnr de ma',ja:'もう少し大きいものはありますか。',words:['大一点儿 dà yìdiǎnr · 少し大きい'],level:'A2',tags:['shopping','service','tired']},
{id:'csl-a1-shop-104',emoji:'💴 🤔',title:'少し高い',context:'値段について短く感想を言います。',zh:'有点儿贵。',py:'yǒudiǎnr guì',ja:'少し高いです。',words:['贵 guì · 高い','有点儿 yǒudiǎnr · 少し'],level:'A1',tags:['shopping','tired']},
{id:'csl-a1-shop-105',emoji:'🏷️ ❓',title:'安くできるか聞く',context:'少し値引きできるか聞きます。',zh:'可以便宜一点儿吗？',py:'kěyǐ piányi yìdiǎnr ma',ja:'少し安くできますか。',words:['便宜 piányi · 安い','一点儿 yìdiǎnr · 少し'],level:'A2',tags:['shopping','service','tired']},
{id:'csl-a1-shop-106',emoji:'💳 ✅',title:'カードで払う',context:'支払い方法を伝えます。',zh:'我刷卡。',py:'wǒ shuākǎ',ja:'カードで払います。',words:['刷卡 shuākǎ · カードで払う'],level:'A1',tags:['shopping','service','tired']},
{id:'csl-a1-shop-107',emoji:'🧾 ❓',title:'レシートを頼む',context:'会計後にレシートをお願いします。',zh:'请给我小票。',py:'qǐng gěi wǒ xiǎopiào',ja:'レシートをください。',words:['小票 xiǎopiào · レシート'],level:'A2',tags:['shopping','service','tired']},
{id:'csl-a1-shop-108',emoji:'🛍️ 👋',title:'今日は買わない',context:'今日は見るだけで帰ります。',zh:'我今天不买了。',py:'wǒ jīntiān bù mǎi le',ja:'今日は買わないことにします。',words:['不买 bù mǎi · 買わない'],level:'A2',tags:['shopping','tired']},

{id:'csl-a1-health-101',emoji:'🤒 🌙',title:'昨夜から具合が悪い',context:'症状が始まった時を伝えます。',zh:'我从昨天晚上开始不舒服。',py:'wǒ cóng zuótiān wǎnshang kāishǐ bù shūfu',ja:'昨夜から具合が悪いです。',words:['从 cóng · 〜から','开始 kāishǐ · 始まる','不舒服 bù shūfu · 具合が悪い'],level:'A2',tags:['health','service','tired']},
{id:'csl-a1-health-102',emoji:'🤧 🧑‍⚕️',title:'のどが痛い',context:'症状を一つ伝えます。',zh:'我嗓子疼。',py:'wǒ sǎngzi téng',ja:'のどが痛いです。',words:['嗓子 sǎngzi · のど','疼 téng · 痛い'],level:'A1',tags:['health','service','tired']},
{id:'csl-a1-health-103',emoji:'🤧 🤒',title:'せきが出る',context:'症状を短く伝えます。',zh:'我有点儿咳嗽。',py:'wǒ yǒudiǎnr késou',ja:'少しせきが出ます。',words:['咳嗽 késou · せき','有点儿 yǒudiǎnr · 少し'],level:'A2',tags:['health','service','tired']},
{id:'csl-a1-health-104',emoji:'💊 ⏰',title:'いつ薬を飲むか',context:'薬を飲む時間を確認します。',zh:'这个药什么时候吃？',py:'zhège yào shénme shíhou chī',ja:'この薬はいつ飲みますか。',words:['什么时候 shénme shíhou · いつ','药 yào · 薬'],level:'A2',tags:['health','service','tired']},
{id:'csl-a1-health-105',emoji:'💊 🍚',title:'食後か聞く',context:'薬を食後に飲むか確認します。',zh:'饭后吃吗？',py:'fànhòu chī ma',ja:'食後に飲みますか。',words:['饭后 fànhòu · 食後','吃 chī · 飲む'],level:'A2',tags:['health','service','tired']},
{id:'csl-a1-health-106',emoji:'🛏️ 🙂',title:'少し休む',context:'今日は無理をしないと伝えます。',zh:'我想休息一下。',py:'wǒ xiǎng xiūxi yíxià',ja:'少し休みたいです。',words:['休息一下 xiūxi yíxià · 少し休む'],level:'A1',tags:['health','home','tired']},
{id:'csl-a1-health-107',emoji:'🌡️ ❓',title:'熱があるか聞かれる',context:'熱があるか確認されます。',zh:'你发烧了吗？',py:'nǐ fāshāo le ma',ja:'熱がありますか。',words:['发烧 fāshāo · 発熱する'],level:'A1',tags:['health','service','tired','listening']},
{id:'csl-a1-health-108',emoji:'🙂 ✅',title:'少し良くなった',context:'体調が回復してきたことを伝えます。',zh:'我好多了。',py:'wǒ hǎo duō le',ja:'だいぶ良くなりました。',words:['好多了 hǎo duō le · だいぶ良くなった'],level:'A2',tags:['health','daily','tired']},

{id:'csl-a1-plan-101',emoji:'📅 ❓',title:'明日空いているか',context:'予定があるか軽く聞きます。',zh:'你明天有空吗？',py:'nǐ míngtiān yǒu kòng ma',ja:'明日空いていますか。',words:['有空 yǒu kòng · 暇がある','明天 míngtiān · 明日'],level:'A1',tags:['plans','social','tired']},
{id:'csl-a1-plan-102',emoji:'☕ 🤝',title:'一緒にお茶する',context:'気軽に誘います。',zh:'一起喝杯茶吧。',py:'yìqǐ hē bēi chá ba',ja:'一緒にお茶を飲みましょう。',words:['一起 yìqǐ · 一緒に','吧 ba · 〜しましょう'],level:'A2',tags:['plans','social','food','tired']},
{id:'csl-a1-plan-103',emoji:'📅 🚫',title:'今日は無理',context:'今日は都合がつかないことを伝えます。',zh:'我今天没时间。',py:'wǒ jīntiān méi shíjiān',ja:'今日は時間がありません。',words:['没时间 méi shíjiān · 時間がない'],level:'A1',tags:['plans','communication','tired']},
{id:'csl-a1-plan-104',emoji:'📅 ➡️',title:'別の日にする',context:'予定を別の日に変えます。',zh:'我们改天吧。',py:'wǒmen gǎitiān ba',ja:'また別の日にしましょう。',words:['改天 gǎitiān · 別の日に'],level:'A2',tags:['plans','social','communication','tired']},
{id:'csl-a1-plan-105',emoji:'📱 ✅',title:'着いたら連絡する',context:'到着後に連絡すると伝えます。',zh:'我到了以后联系你。',py:'wǒ dào le yǐhòu liánxì nǐ',ja:'着いたら連絡します。',words:['以后 yǐhòu · 〜したあと','联系 liánxì · 連絡する'],level:'A2',tags:['plans','travel','communication','tired']},
{id:'csl-a1-plan-106',emoji:'🚪 ⏳',title:'もうすぐ出る',context:'まもなく出発すると伝えます。',zh:'我马上出发。',py:'wǒ mǎshàng chūfā',ja:'すぐ出発します。',words:['马上 mǎshàng · すぐに','出发 chūfā · 出発する'],level:'A2',tags:['plans','travel','communication','tired']},
{id:'csl-a1-plan-107',emoji:'📍 ❓',title:'どこで会うか',context:'待ち合わせ場所を決めます。',zh:'我们在哪儿见？',py:'wǒmen zài nǎr jiàn',ja:'どこで会いますか。',words:['在哪儿 zài nǎr · どこで','见 jiàn · 会う'],level:'A1',tags:['plans','social','tired']},
{id:'csl-a1-plan-108',emoji:'🕓 🤝',title:'4時に会う',context:'待ち合わせ時間を決めます。',zh:'我们四点见。',py:'wǒmen sì diǎn jiàn',ja:'4時に会いましょう。',words:['四点 sì diǎn · 4時','见 jiàn · 会う'],level:'A1',tags:['plans','time','social','tired']}
];
var A=B.all().concat(X);
function clone(x){return JSON.parse(JSON.stringify(x))}
function all(){return A.map(clone)}
function get(id){for(var i=0;i<A.length;i++)if(A[i].id===id)return clone(A[i]);return null}
function query(opts){opts=opts||{};var tags=opts.tags||[],level=opts.level||null;return A.filter(function(x){if(level&&x.level!==level)return false;for(var i=0;i<tags.length;i++)if(x.tags.indexOf(tags[i])<0)return false;return true}).map(clone)}
function forCourse(course){return A.filter(function(x){return x.tags.indexOf(course)>=0}).map(clone)}
function legacyTiredId(n){return B.legacyTiredId?B.legacyTiredId(n):null}
window.CSLSentenceBank={version:2,all:all,get:get,query:query,forCourse:forCourse,legacyTiredId:legacyTiredId,count:A.length};
})();