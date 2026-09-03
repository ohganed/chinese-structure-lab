window.KOTONOHA_QUESTIONS = [
  {
    id: 'l1-reading-001', level: 1, skill: 'reading', genre: 'notice', difficulty: 1.0,
    text: '明日の集合時間は10時です。ただし、受付は9時45分までに済ませてください。',
    prompt: '何時までに受付をすればよいですか？',
    choices: ['9時45分', '10時', '10時15分', '時間は決まっていない'],
    answer: 0,
    explanation: '集合時間は10時ですが、受付はその前の9時45分までに済ませる必要があります。',
    vocab: [
      {term:'集合', reading:'しゅうごう', meaning:'人が一つの場所に集まること', role:'incidental'},
      {term:'済ませる', reading:'すませる', meaning:'必要なことを終える', role:'direct'}
    ]
  },
  {
    id: 'l1-reading-002', level: 1, skill: 'reading', genre: 'message', difficulty: 1.05,
    text: '雨が強い場合、試合は中止です。小雨なら予定どおり行います。',
    prompt: '小雨のとき、試合はどうなりますか？',
    choices: ['中止になる', '予定どおり行う', '翌日にする', 'まだ決まっていない'],
    answer: 1,
    explanation: '「小雨なら予定どおり行います」と書かれています。',
    vocab: [
      {term:'中止', reading:'ちゅうし', meaning:'予定していたことをやめること', role:'incidental'},
      {term:'予定どおり', reading:'よていどおり', meaning:'前もって決めたとおり', role:'incidental'}
    ]
  },
  {
    id: 'l1-reading-003', level: 1, skill: 'reading', genre: 'work', difficulty: 1.1,
    text: '資料は今日中に確認してください。返事は明日の午前中でかまいません。',
    prompt: '今日中にする必要があるのは何ですか？',
    choices: ['返事をする', '資料を確認する', '資料を提出する', '電話をする'],
    answer: 1,
    explanation: '「今日中に確認してください」とあるので、今日必要なのは資料の確認です。',
    vocab: [
      {term:'確認', reading:'かくにん', meaning:'正しいか、問題がないか確かめること', role:'direct'},
      {term:'かまいません', reading:'かまいません', meaning:'それで問題ありません', role:'incidental'}
    ]
  },
  {
    id: 'l1-reading-004', level: 1, skill: 'reading', genre: 'daily', difficulty: 1.15,
    text: 'この店は火曜日が休みです。ただし、祝日の火曜日は営業し、翌日の水曜日が休みになります。',
    prompt: '祝日の火曜日はどうなりますか？',
    choices: ['休み', '営業する', '午前だけ営業する', '文だけでは分からない'],
    answer: 1,
    explanation: '通常は火曜休みですが、祝日の火曜は例外として営業します。',
    vocab: [
      {term:'営業', reading:'えいぎょう', meaning:'店などが仕事をして客を受け入れること', role:'direct'},
      {term:'翌日', reading:'よくじつ', meaning:'次の日', role:'incidental'}
    ]
  },
  {
    id: 'l1-reading-005', level: 1, skill: 'reading', genre: 'message', difficulty: 1.2,
    text: '明日の会議は10時からの予定でしたが、11時開始に変更になりました。',
    prompt: '会議は何時からですか？',
    choices: ['9時', '10時', '11時', 'まだ未定'],
    answer: 2,
    explanation: 'もとの予定は10時ですが、11時開始に変更されています。',
    vocab: [
      {term:'変更', reading:'へんこう', meaning:'決まっていた内容を別のものに変えること', role:'direct'},
      {term:'予定', reading:'よてい', meaning:'これから行うつもりとして決めていること', role:'incidental'}
    ]
  },
  {
    id: 'l1-reading-006', level: 1, skill: 'reading', genre: 'public', difficulty: 1.25,
    text: '図書館では飲み物を飲めますが、ふたの閉まる容器に入ったものだけです。',
    prompt: '図書館で飲んでよいものはどれですか？',
    choices: ['紙コップのコーヒー', 'ふた付きボトルの水', 'ふたのない缶ジュース', 'どんな飲み物でもよい'],
    answer: 1,
    explanation: '条件は「ふたの閉まる容器」です。ふた付きボトルの水が当てはまります。',
    vocab: [
      {term:'容器', reading:'ようき', meaning:'物を入れるための入れ物', role:'direct'},
      {term:'閉まる', reading:'しまる', meaning:'開いていたものが閉じた状態になる', role:'incidental'}
    ]
  },
  {
    id: 'l1-reading-007', level: 1, skill: 'reading', genre: 'work', difficulty: 1.3,
    text: '新しい機械の導入は、予算の確認が終わるまで見送ることになりました。',
    prompt: '機械の導入について、今決まっていることは何ですか？',
    choices: ['すぐ導入する', '導入をやめた', 'しばらく実施しない', '予算を増やす'],
    answer: 2,
    explanation: '「見送る」は、ここでは今すぐ実施せず、いったん控えるという意味です。',
    vocab: [
      {term:'導入', reading:'どうにゅう', meaning:'新しい仕組みや機械などを取り入れること', role:'incidental'},
      {term:'見送る', reading:'みおくる', meaning:'ここでは、実施をいったん控えること', role:'direct'},
      {term:'予算', reading:'よさん', meaning:'使えるお金について前もって立てる計画', role:'incidental'}
    ]
  },
  {
    id: 'l1-reading-008', level: 1, skill: 'reading', genre: 'service', difficulty: 1.35,
    text: '商品が壊れて届いた場合は代金を補償します。ただし、使用後の傷は対象になりません。',
    prompt: '補償の対象になるのはどれですか？',
    choices: ['使ったあとについた傷', '届いた時点ですでに壊れていた商品', '気に入らなかった商品', 'すべての商品'],
    answer: 1,
    explanation: '届いた時点で壊れていた場合は補償されます。使用後の傷は対象外です。',
    vocab: [
      {term:'補償', reading:'ほしょう', meaning:'損害や不利益を埋め合わせること', role:'direct'},
      {term:'対象', reading:'たいしょう', meaning:'ある扱いや判断が向けられるもの', role:'incidental'}
    ]
  }
];