/* Chinese Structure Lab — grounded contrast and transfer data, v1.
   Pure lesson data: can be replaced by another language's content later.
   All examples here are Chinese; no changes to other language apps.
*/
(function(global){
'use strict';
var lessons = [
{
 id:'zh-ba-action-book-01',language:'zh',level:'A2',category:'把構文 / state → action',
 scene:{ja:'本が手元から机の上へ移されました。',en:'A book moves from someone’s hand onto a desk.',actor:'私',object:'📕 本',movement:'手元 → 机',result:'机の上'},
 goal:{ja:'本を置いたという動作と結果を伝えたい。',en:'Say that I put the book on the desk.'},
 question:{ja:'どちらが「置いた」という動作を表す？',en:'Which sentence reports the action of putting it down?'},
 target:{text:'我把书放在桌子上了。',reading:'wǒ bǎ shū fàng zài zhuōzi shàng le',meaning:'私は本を机の上に置きました。'},
 contrast:{text:'书在桌子上。',reading:'shū zài zhuōzi shàng',meaning:'本は机の上にあります。'},
 structure:{brackets:'[我] [[把 书] [放在 桌子上]] 了',
  chunks:[{text:'我',role:'動作主'},{text:'把书',role:'対象'},{text:'放',role:'動作'},{text:'在桌子上',role:'到達先'},{text:'了',role:'成立・変化'}],
  noteJa:'把構文では、影響を受ける対象「书」を動詞の前に示します。ここでは「放在桌子上」が置く動作と到達先を表します。',
  boundaryJa:'「書物がどこにあるか」という状態だけなら把構文は必要ありません。'},
 transfer:{promptJa:'今度は「私がコップを机の上に置いた」と言ってください。',target:{text:'我把杯子放在桌子上了。',reading:'wǒ bǎ bēizi fàng zài zhuōzi shàng le',meaning:'私はコップを机の上に置きました。'},noteJa:'対象を本からコップに替えても、動作と結果を表す構造は維持されます。'},
 words:[{text:'把',reading:'bǎ',meaning:'対象を前に示す'},{text:'放',reading:'fàng',meaning:'置く'},{text:'桌子',reading:'zhuōzi',meaning:'机'}]
},
{
 id:'zh-ba-state-book-02',language:'zh',level:'A1',category:'存在・所在 / state',
 scene:{ja:'本は今、机の上にあります。移動させた人や動作は問題ではありません。',en:'The book is currently on the desk. No action is being reported.',actor:'（不問）',object:'📕 本',movement:'動作は問わない',result:'机の上'},
 goal:{ja:'現在の本の場所を説明したい。',en:'Say where the book is now.'},
 question:{ja:'どちらが「現在の位置」だけを伝える？',en:'Which sentence simply gives the book’s location?'},
 target:{text:'书在桌子上。',reading:'shū zài zhuōzi shàng',meaning:'本は机の上にあります。'},
 contrast:{text:'我把书放在桌子上了。',reading:'wǒ bǎ shū fàng zài zhuōzi shàng le',meaning:'私は本を机の上に置きました。'},
 structure:{brackets:'[书] [在 [桌子 上]]',
  chunks:[{text:'书',role:'位置を説明するもの'},{text:'在桌子上',role:'所在を表す述語'}],
  noteJa:'在は場所を表す述語として機能しています。動作の結果を報告する文ではありません。',
  boundaryJa:'状態と動作の違いを、単語の訳だけでなく「何を伝えるか」から判断します。'},
 transfer:{promptJa:'同じ構造で「コップは机の上にあります」と言ってください。',target:{text:'杯子在桌子上。',reading:'bēizi zài zhuōzi shàng',meaning:'コップは机の上にあります。'},noteJa:'主語を替えるだけで現在の所在を伝えられます。'},
 words:[{text:'在',reading:'zài',meaning:'〜にある'},{text:'上',reading:'shàng',meaning:'上'}]
},
{
 id:'zh-relative-object-03',language:'zh',level:'B1',category:'的 / 連体修飾',
 scene:{ja:'先生が生徒を知っています。その生徒がやって来ました。',en:'A teacher knows a student. That student has arrived.',actor:'先生',object:'🧑‍🎓 生徒',movement:'知る：先生 → 生徒',result:'生徒が来た'},
 goal:{ja:'「先生が知っている生徒」が来たと伝えたい。',en:'Say that the student whom the teacher knows arrived.'},
 question:{ja:'「知っている」の主語は先生です。どちらの文？',en:'The teacher is the one who knows. Which sentence fits?'},
 target:{text:'老师认识的学生来了。',reading:'lǎoshī rènshi de xuésheng lái le',meaning:'先生が知っている生徒が来ました。'},
 contrast:{text:'认识老师的学生来了。',reading:'rènshi lǎoshī de xuésheng lái le',meaning:'先生を知っている生徒が来ました。'},
 structure:{brackets:'[[老师 认识 __] 的 学生] 来了',
  chunks:[{text:'老师认识的',role:'生徒を修飾する節'},{text:'学生',role:'修飾される名詞'},{text:'来了',role:'文の述語'}],
  noteJa:'中国語では「先生が知っている」という修飾節が、名詞「学生」の前に来ます。関係の空所は「知る」の対象です。',
  boundaryJa:'同じ「老师・认识・学生」でも、修飾節の内部での役割が変わると意味が逆転します。'},
 transfer:{promptJa:'先生を医者、生徒を患者に替え「医者が知っている患者が来た」と言ってください。',target:{text:'医生认识的病人来了。',reading:'yīshēng rènshi de bìngrén lái le',meaning:'医者が知っている患者が来ました。'},noteJa:'名詞を替えても、修飾節の内部関係を維持します。'},
 words:[{text:'认识',reading:'rènshi',meaning:'知っている'},{text:'的',reading:'de',meaning:'修飾節と名詞をつなぐ'},{text:'来',reading:'lái',meaning:'来る'}]
},
{
 id:'zh-relative-subject-04',language:'zh',level:'B1',category:'的 / 主語と目的語',
 scene:{ja:'生徒が先生を知っています。その生徒がやって来ました。',en:'A student knows a teacher. That student has arrived.',actor:'生徒',object:'🧑‍🏫 先生',movement:'知る：生徒 → 先生',result:'生徒が来た'},
 goal:{ja:'「先生を知っている生徒」が来たと伝えたい。',en:'Say that the student who knows the teacher arrived.'},
 question:{ja:'「知っている」の主語は生徒です。どちらの文？',en:'The student is the one who knows. Which sentence fits?'},
 target:{text:'认识老师的学生来了。',reading:'rènshi lǎoshī de xuésheng lái le',meaning:'先生を知っている生徒が来ました。'},
 contrast:{text:'老师认识的学生来了。',reading:'lǎoshī rènshi de xuésheng lái le',meaning:'先生が知っている生徒が来ました。'},
 structure:{brackets:'[[__ 认识 老师] 的 学生] 来了',
  chunks:[{text:'认识老师的',role:'生徒を修飾する節'},{text:'学生',role:'修飾される名詞'},{text:'来了',role:'文の述語'}],
  noteJa:'修飾される「学生」が、修飾節の動作主にあたります。誰が誰を知るかを、節の内部関係として捉えます。',
  boundaryJa:'「的」の前の語順だけを機械的に訳すのではなく、動作主と対象を対応させます。'},
 transfer:{promptJa:'生徒を患者、先生を医者に替え「医者を知っている患者が来た」と言ってください。',target:{text:'认识医生的病人来了。',reading:'rènshi yīshēng de bìngrén lái le',meaning:'医者を知っている患者が来ました。'},noteJa:'役割は変えず、登場人物だけを入れ替えます。'},
 words:[{text:'医生',reading:'yīshēng',meaning:'医者'},{text:'病人',reading:'bìngrén',meaning:'患者'},{text:'的',reading:'de',meaning:'修飾に使う'}]
},
{
 id:'zh-motion-in-05',language:'zh',level:'A2',category:'方向補語 / 進',
 scene:{ja:'彼は教室の外にいます。ドアを通って中に入りました。',en:'He starts outside the classroom and walks in.',actor:'彼',object:'🚪 教室',movement:'外 → 内',result:'教室の中'},
 goal:{ja:'中に入ったことを伝えたい。',en:'Report movement into the classroom.'},
 question:{ja:'移動先が「教室の中」になるのは？',en:'Which sentence describes entering?'},
 target:{text:'他走进教室了。',reading:'tā zǒu jìn jiàoshì le',meaning:'彼は歩いて教室に入りました。'},
 contrast:{text:'他走出教室了。',reading:'tā zǒu chū jiàoshì le',meaning:'彼は歩いて教室から出ました。'},
 structure:{brackets:'[他] [[走 + 进] [教室]] 了',
  chunks:[{text:'他',role:'動作主'},{text:'走',role:'移動の仕方'},{text:'进',role:'内向き'},{text:'教室',role:'到達先'},{text:'了',role:'成立・変化'}],
  noteJa:'走は歩く動作、进は内側への方向を表します。組み合わせることで、動作の仕方と経路が結びつきます。',
  boundaryJa:'出と進を入れ替えると、同じ教室でも移動方向が逆になります。'},
 transfer:{promptJa:'今度は「彼は走って教室に入った」と言ってください。',target:{text:'他跑进教室了。',reading:'tā pǎo jìn jiàoshì le',meaning:'彼は走って教室に入りました。'},noteJa:'歩く→走るに替えても「内に入る」の方向は保たれます。'},
 words:[{text:'走',reading:'zǒu',meaning:'歩く'},{text:'进',reading:'jìn',meaning:'入る方向'},{text:'出',reading:'chū',meaning:'出る方向'},{text:'跑',reading:'pǎo',meaning:'走る'}]
},
{
 id:'zh-motion-out-06',language:'zh',level:'A2',category:'方向補語 / 出',
 scene:{ja:'彼は教室の中にいます。ドアを通って外へ出ました。',en:'He starts inside the classroom and walks out.',actor:'彼',object:'🚪 教室',movement:'内 → 外',result:'教室の外'},
 goal:{ja:'外に出たことを伝えたい。',en:'Report movement out of the classroom.'},
 question:{ja:'移動先が「教室の外」になるのは？',en:'Which sentence describes leaving?'},
 target:{text:'他走出教室了。',reading:'tā zǒu chū jiàoshì le',meaning:'彼は歩いて教室から出ました。'},
 contrast:{text:'他走进教室了。',reading:'tā zǒu jìn jiàoshì le',meaning:'彼は歩いて教室に入りました。'},
 structure:{brackets:'[他] [[走 + 出] [教室]] 了',
  chunks:[{text:'他',role:'動作主'},{text:'走',role:'移動の仕方'},{text:'出',role:'外向き'},{text:'教室',role:'出発位置'},{text:'了',role:'成立・変化'}],
  noteJa:'方向補語「出」は内側から外側への移動を表します。どこにいるかという状態ではなく、経路を捉えます。',
  boundaryJa:'進と出の違いを、意味のない暗記対立でなく、移動経路として考えます。'},
 transfer:{promptJa:'今度は「彼は走って教室から出た」と言ってください。',target:{text:'他跑出教室了。',reading:'tā pǎo chū jiàoshì le',meaning:'彼は走って教室から出ました。'},noteJa:'歩く→走るに替えても「外へ出る」方向が保たれます。'},
 words:[{text:'出',reading:'chū',meaning:'外へ'},{text:'跑',reading:'pǎo',meaning:'走る'},{text:'进',reading:'jìn',meaning:'中へ'}]
},
{
 id:'zh-result-finish-07',language:'zh',level:'A2',category:'結果補語 / 完',
 scene:{ja:'彼は食事を始め、最後まで食べ終えました。今は食事中ではありません。',en:'He finished eating his meal.',actor:'彼',object:'🍚 食事',movement:'開始 → 完了',result:'食べ終えた'},
 goal:{ja:'食べ終えたという結果を伝えたい。',en:'Say he has finished the meal.'},
 question:{ja:'「食べ終えた」とはっきり言うのは？',en:'Which sentence explicitly says he finished eating?'},
 target:{text:'他吃完饭了。',reading:'tā chī wán fàn le',meaning:'彼は食事を食べ終えました。'},
 contrast:{text:'他正在吃饭。',reading:'tā zhèngzài chī fàn',meaning:'彼は今、食事をしています。'},
 structure:{brackets:'[他] [[吃 + 完] 饭] 了',
  chunks:[{text:'他',role:'動作主'},{text:'吃',role:'動作'},{text:'完',role:'完了した結果'},{text:'饭',role:'対象'},{text:'了',role:'成立・変化'}],
  noteJa:'完は動作を最後まで完了したことを示す結果補語です。正在は進行中であることを表し、別の時間的状況です。',
  boundaryJa:'了だけを機械的に「過去」と訳すのではなく、完と動作全体の組合せを解釈します。'},
 transfer:{promptJa:'今度は「彼女は本を読み終えました」と言ってください。',target:{text:'她看完书了。',reading:'tā kàn wán shū le',meaning:'彼女は本を読み終えました。'},noteJa:'吃完饭の完了という関係を看完书に転用します。'},
 words:[{text:'完',reading:'wán',meaning:'終える'},{text:'吃',reading:'chī',meaning:'食べる'},{text:'正在',reading:'zhèngzài',meaning:'今まさに〜している'}]
},
{
 id:'zh-give-perspective-08',language:'zh',level:'A1',category:'授受 / 視点の反転',
 scene:{ja:'私は一冊の本を手に持っています。それを彼に渡しました。',en:'I give a book to him.',actor:'私',object:'📕 本',movement:'私 → 彼',result:'彼が受け取る'},
 goal:{ja:'私が渡した側だと伝えたい。',en:'Say that I was the giver.'},
 question:{ja:'どちらが「私が彼に渡した」という意味？',en:'Which sentence says I gave it to him?'},
 target:{text:'我给他一本书。',reading:'wǒ gěi tā yì běn shū',meaning:'私は彼に本を一冊あげます。'},
 contrast:{text:'他给我一本书。',reading:'tā gěi wǒ yì běn shū',meaning:'彼は私に本を一冊くれます。'},
 structure:{brackets:'[我] [给 [他] [一本书]]',
  chunks:[{text:'我',role:'渡す人'},{text:'给',role:'授受'},{text:'他',role:'受け取る人'},{text:'一本书',role:'渡すもの'}],
  noteJa:'我と他の位置を入れ替えると、誰が渡す側で誰が受け取る側かが変わります。会話の意図から役割を設定します。',
  boundaryJa:'同じ単語でも、文中での構造的位置によって授受の向きが反転します。'},
 transfer:{promptJa:'今度は「私は彼女にお茶を一杯あげます」と言ってください。',target:{text:'我给她一杯茶。',reading:'wǒ gěi tā yì bēi chá',meaning:'私は彼女にお茶を一杯あげます。'},noteJa:'受け取る人と渡すものを替えても授受関係は保たれます。'},
 words:[{text:'给',reading:'gěi',meaning:'与える'},{text:'本',reading:'běn',meaning:'本の量詞'},{text:'杯',reading:'bēi',meaning:'杯の量詞'}]
}
];
global.CognitionChineseLessons=Object.freeze(lessons);
})(window);
