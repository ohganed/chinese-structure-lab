(function(){
  'use strict';
  var STYLE_ID='csl-situation-layer-style';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent='.csl-situation-strip{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:9px 11px;background:#f1efe9;border-radius:14px;width:max-content;max-width:100%;font-size:22px;line-height:1}.csl-situation-strip .csl-arrow{font-size:11px;color:#999}.senior .csl-situation-strip{font-size:31px;padding:12px 14px;border-radius:18px;gap:10px}.senior .csl-situation-strip .csl-arrow{font-size:16px}@media(max-width:430px){.csl-situation-strip{font-size:21px;gap:6px}}';
    document.head.appendChild(s);
  }
  function flow(a){return a.map(function(x,i){return '<span>'+x+'</span>'+(i<a.length-1?'<span class="csl-arrow">→</span>':'');}).join('');}
  function pageDefault(){
    var t=(document.title||'').toLowerCase();
    if(/food|restaurant/.test(t))return ['🪑','📋','🍽️'];
    if(/travel|transport/.test(t))return ['🧳','🏙️','📍'];
    if(/shopping/.test(t))return ['🛍️','👀','🏷️'];
    if(/people|family/.test(t))return ['🏠','👨‍👩‍👧'];
    if(/work/.test(t))return ['🏢','👥','🗂️'];
    if(/study/.test(t))return ['🏫','📚','✏️'];
    if(/story|stories/.test(t))return ['🎬','👥','📍'];
    if(/listening/.test(t))return ['🎧','👂'];
    return ['👀','📍'];
  }
  function choose(z){
    z=(z||'').replace(/\s+/g,'');

    /* greetings and identity */
    if(/^你好|早上好|晚上好/.test(z))return ['👀','🙂','👋'];
    if(/很高兴认识你/.test(z))return ['👋','🙂','🤝'];
    if(/晚安/.test(z))return ['🌙','😴'];
    if(/明天见/.test(z))return ['🌙','➡️','☀️','👋'];
    if(/再见/.test(z))return ['👋','🚶'];
    if(/叫什么名字|我叫|名字/.test(z))return ['👤','🗣️','🏷️','🤝'];
    if(/哪国人|日本人|中国人|美国人|法国人/.test(z))return ['👤','🌍','🏳️'];
    if(/住在哪儿|住在/.test(z))return ['👤','🏠','📍'];

    /* time and daily routine */
    if(/现在几点|几点钟/.test(z))return ['👀','🕒','❓'];
    if(/点半/.test(z))return ['🕒','➗','2️⃣'];
    if(/六点起床|起床/.test(z))return ['⏰','🛏️','🧍'];
    if(/上班/.test(z))return ['🏠','🚶','🏢'];
    if(/下班/.test(z))return ['🏢','🚶','🏠'];
    if(/回家了|回家/.test(z))return ['🚶','🏠'];
    if(/有点儿累|累/.test(z))return ['🏢','😮‍💨','🛋️'];
    if(/今天忙吗|很忙/.test(z))return ['📅','🗂️','😵'];
    if(/下午有时间|有时间/.test(z))return ['🕒','✅','🙂'];

    /* family and people */
    if(/这是我妈妈|妈妈/.test(z))return ['👤','➡️','👩'];
    if(/爸爸/.test(z))return ['👤','➡️','👨'];
    if(/哥哥/.test(z))return ['👤','➡️','👨‍🦱'];
    if(/姐姐/.test(z))return ['👤','➡️','👩‍🦱'];
    if(/几口人/.test(z))return ['🏠','👨‍👩‍👧','🔢','❓'];
    if(/三口人|四口人|五口人/.test(z))return ['🏠','👨‍👩‍👧','🔢'];
    if(/朋友/.test(z))return ['🙂','🤝','🙂'];

    /* food and restaurants */
    if(/有菜单吗|菜单/.test(z))return ['🪑','📋','❓'];
    if(/请坐/.test(z))return ['🚪','🪑'];
    if(/两位/.test(z))return ['👥','2️⃣','🪑'];
    if(/这个是什么/.test(z))return ['👀','🍽️','❓'];
    if(/好吃吗/.test(z))return ['🍽️','👅','❓'];
    if(/很好吃/.test(z))return ['🍽️','😋'];
    if(/我要一杯茶/.test(z))return ['🪑','📋','🍵','🙋'];
    if(/想喝咖啡/.test(z))return ['☕','🙂','🙋'];
    if(/不要糖/.test(z))return ['☕','🍬','❌'];
    if(/不吃辣/.test(z))return ['🍽️','🌶️','❌'];
    if(/少放一点儿盐/.test(z))return ['🍳','🧂','🤏'];
    if(/有素菜吗/.test(z))return ['📋','🥬','❓'];
    if(/花生过敏/.test(z))return ['🥜','⚠️','🤒'];
    if(/再来一杯/.test(z))return ['🥤','➕','🥤'];
    if(/给我水/.test(z))return ['🙋','💧','🤲'];
    if(/够了/.test(z))return ['🍽️','✋','🙂'];
    if(/买单/.test(z))return ['🍽️','🧾','💴'];
    if(/^多少钱/.test(z))return ['🧾','💴','❓'];

    /* shopping */
    if(/这个多少钱/.test(z))return ['👀','🏷️','💴','❓'];
    if(/那个呢/.test(z))return ['👀','👉','❓'];
    if(/太小了/.test(z))return ['👕','📏','😕'];
    if(/大一点/.test(z))return ['👕','📏','⬆️'];
    if(/蓝色/.test(z))return ['👕','🔵','🙂'];
    if(/黑色/.test(z))return ['👕','⚫','❓'];
    if(/试一下/.test(z))return ['👕','🪞','🙂'];
    if(/比较好|更好看/.test(z))return ['👀','1️⃣','2️⃣','👍'];
    if(/我要这个|就这个吧/.test(z))return ['👀','👉','🛒'];
    if(/刷卡/.test(z))return ['🧾','💳','❓'];
    if(/手机支付/.test(z))return ['🧾','📱','✅'];
    if(/一共多少钱/.test(z))return ['🛍️','🧾','💴','❓'];
    if(/便宜一点/.test(z))return ['🏷️','💴','⬇️'];
    if(/太贵了/.test(z))return ['🏷️','💴','😣'];

    /* directions and transport */
    if(/地铁站在哪儿/.test(z))return ['🏙️','😕','🚇','❓'];
    if(/洗手间在哪儿/.test(z))return ['😕','🚻','❓'];
    if(/怎么去车站/.test(z))return ['📍','🚉','❓'];
    if(/一直走/.test(z))return ['🚶','⬆️','⬆️'];
    if(/左转/.test(z))return ['🚶','⬅️'];
    if(/右转/.test(z))return ['🚶','➡️'];
    if(/一张票/.test(z))return ['🚉','🎫','1️⃣'];
    if(/去北京/.test(z))return ['📍','🚄','🏙️'];
    if(/几点出发/.test(z))return ['🚉','🕒','❓'];
    if(/哪个站台|站台/.test(z))return ['🚉','🔢','❓'];
    if(/下一站/.test(z))return ['🚇','➡️','📍','❓'];
    if(/到了吗/.test(z))return ['🚇','📍','❓'];
    if(/这里下车/.test(z))return ['🚇','📍','🚶'];
    if(/换车/.test(z))return ['🚇','🔁','🚇'];
    if(/末班车/.test(z))return ['🌙','🚇','⏰'];
    if(/坐错车/.test(z))return ['🚇','❌','😕'];

    /* hotel */
    if(/有预订/.test(z))return ['🧳','🏨','📱','✅'];
    if(/护照/.test(z))return ['🏨','🛎️','🛂'];
    if(/房间在哪儿/.test(z))return ['🏨','🛏️','❓'];
    if(/有早餐吗/.test(z))return ['🏨','🍳','❓'];
    if(/办理入住|入住/.test(z))return ['🧳','🏨','🛎️','🔑'];
    if(/换房间/.test(z))return ['🛏️','😕','🔁','🛏️'];
    if(/寄存行李/.test(z))return ['🧳','🏨','📦'];

    /* weather */
    if(/下雨/.test(z))return ['☁️','🌧️','☂️'];
    if(/带伞/.test(z))return ['🌧️','☂️','🚶'];
    if(/天气好/.test(z))return ['☀️','🙂','🚶'];
    if(/很冷|冷多了/.test(z))return ['🌡️','⬇️','🥶'];
    if(/很热/.test(z))return ['☀️','🌡️','🥵'];
    if(/下雪|雪/.test(z))return ['☁️','❄️','🧥'];
    if(/有风|风很大/.test(z))return ['🌬️','🧥'];

    /* health */
    if(/我不舒服/.test(z))return ['🙂','➡️','🤒'];
    if(/头疼/.test(z))return ['🤕','🧠'];
    if(/发烧/.test(z))return ['🌡️','⬆️','🤒'];
    if(/看医生/.test(z))return ['🤒','🏥','👩‍⚕️'];
    if(/附近有药店/.test(z))return ['🤒','📍','💊','❓'];
    if(/一天吃几次/.test(z))return ['💊','📅','🔢','❓'];
    if(/这个药过敏/.test(z))return ['💊','⚠️','🤒'];

    /* calls, plans, invitations */
    if(/给我发消息|发消息/.test(z))return ['📱','✍️','📩'];
    if(/打电话/.test(z))return ['📱','📞','👂'];
    if(/什么时候方便/.test(z))return ['📅','🕒','❓'];
    if(/周末去看朋友/.test(z))return ['📅','🚶','🙂','🤝'];
    if(/我们三点在车站见/.test(z))return ['🕒','🚉','👥','🤝'];
    if(/一起去|一起吃饭|一起学习/.test(z))return ['🙂','➕','🙂','🚶'];
    if(/邀请|请我吃饭/.test(z))return ['🙂','📩','🍽️'];

    /* hobbies */
    if(/喜欢音乐/.test(z))return ['🎧','🎵','🙂'];
    if(/看电影/.test(z))return ['🎬','🍿','🙂'];
    if(/去公园/.test(z))return ['🏠','🚶','🌳'];
    if(/散步/.test(z))return ['🚶','🌳','🙂'];
    if(/拍.*照片|拍了很多照片/.test(z))return ['📍','📷','🖼️'];

    /* study and work */
    if(/开始吧/.test(z))return ['👥','📚','▶️'];
    if(/今天学什么/.test(z))return ['📅','📚','❓'];
    if(/准备好了/.test(z))return ['📚','✅','🙂'];
    if(/不明白/.test(z))return ['📖','😕'];
    if(/这是什么意思/.test(z))return ['👀','📝','❓'];
    if(/请再说一遍/.test(z))return ['👂','😕','🔁','🗣️'];
    if(/说慢一点/.test(z))return ['👂','😕','🐢','🗣️'];
    if(/可以写一下/.test(z))return ['👂','😕','✍️'];
    if(/有一个问题/.test(z))return ['📚','❓','🙋'];
    if(/下午我有课/.test(z))return ['🕒','🏫','📚'];
    if(/明天我工作/.test(z))return ['☀️','🏢','🗂️'];
    if(/今天学了很多/.test(z))return ['📚','📚','📚','🙂'];
    if(/明天继续/.test(z))return ['🌙','➡️','☀️','📚'];
    if(/辛苦了/.test(z))return ['💼','😮‍💨','🙏'];
    if(/怎么填|写你的名字/.test(z))return ['📄','✍️','❓'];

    /* experience and storytelling */
    if(/去过北京两次/.test(z))return ['🧳','🏙️','2️⃣'];
    if(/吃过北京烤鸭/.test(z))return ['🏙️','🦆','🍽️','❓'];
    if(/没坐过高铁/.test(z))return ['🕰️','🚄','❌'];
    if(/上个月.*上海/.test(z))return ['📅','🚄','🏙️'];
    if(/那次旅行/.test(z))return ['🧳','📍','🙂'];
    if(/昨天.*回家/.test(z))return ['📅','🏢','🚶','🏠'];
    if(/下班以后.*吃饭/.test(z))return ['🏢','➡️','🍽️','👥'];
    if(/新开的饭店/.test(z))return ['🚶','🆕','🍽️'];
    if(/人很多.*菜上得很快/.test(z))return ['🍽️','👥👥','⏳','🍜⚡'];
    if(/吃完以后.*咖啡/.test(z))return ['🍽️','✅','➡️','☕'];
    if(/回家的时候已经很晚/.test(z))return ['🌙','🚶','🏠','😮‍💨'];

    /* comparison and change */
    if(/比.*便宜/.test(z))return ['1️⃣🏷️','⚖️','2️⃣🏷️','💴⬇️'];
    if(/比昨天冷/.test(z))return ['📅','⚖️','📅','🥶'];
    if(/蓝色的更好看/.test(z))return ['👕🔵','⚖️','👕','👍'];
    if(/没有.*贵/.test(z))return ['🏪1️⃣','💴⬇️','🏪2️⃣'];
    if(/两个都可以/.test(z))return ['1️⃣','2️⃣','✅✅'];
    if(/还是选这个/.test(z))return ['1️⃣','2️⃣','🤔','👉'];
    if(/开始学做中国菜/.test(z))return ['🕰️','🍳','🇨🇳','🌱'];
    if(/现在我会做两个菜了/.test(z))return ['🍳','1️⃣','2️⃣','✅'];
    if(/以前.*不太喜欢喝茶/.test(z))return ['🕰️','🍵','😐'];
    if(/现在.*每天都喝/.test(z))return ['📅','🍵','🙂','🔁'];
    if(/习惯慢慢变了/.test(z))return ['🕰️','🔄','🙂'];

    /* reasons and conditions: show concrete cause/effect where possible */
    if(/因为今天很忙.*没去/.test(z))return ['📅','💼💼','😣','❌🚶'];
    if(/如果天气好.*公园/.test(z))return ['☀️','✅','➡️','🌳'];
    if(/虽然人很多.*但是/.test(z))return ['👥👥','😕','➡️','✅'];

    /* public themes: concrete world before abstraction */
    if(/公共交通|地铁|公交/.test(z)&&/投资|政府|政策/.test(z))return ['🏙️','🚌','💰','🏛️'];
    if(/教育|学校|学生/.test(z)&&/政策|政府|制度|公平/.test(z))return ['🏫','👩‍🎓','⚖️','🏛️'];
    if(/人工智能|AI|算法/.test(z))return ['💻','🤖','👥','⚖️'];
    if(/环境|气候|污染|排放/.test(z))return ['🏭','🌫️','🌍','🏛️'];
    if(/经济|物价|收入|就业/.test(z))return ['🏙️','💴','👥','📊'];
    if(/医疗|养老|社会保障/.test(z))return ['👥','🏥','💴','🏛️'];
    if(/政府|政策|制度/.test(z))return ['👥','🏛️','📄','⚖️'];

    /* pragmatics and C1/C2 */
    if(/省略掉的内容比说出来的内容更重要/.test(z))return ['👥','🤐','💭','🗣️'];
    if(/省略|没说|不说/.test(z))return ['👥','🤐','💭'];
    if(/讽刺|反讽/.test(z))return ['🙂','🗣️','↔️','😏'];
    if(/语气/.test(z))return ['🗣️','🎚️','🙂'];
    if(/措辞|表达方式|文体/.test(z))return ['✍️','📝','🎭'];
    if(/立场|观点|认为|我觉得/.test(z))return ['👤','🗣️','⚖️'];
    if(/意味着|含义|暗示/.test(z))return ['🗣️','➡️','💭'];
    if(/问题不在于.*而在于/.test(z))return ['❌','1️⃣','➡️','✅','2️⃣'];
    if(/关键/.test(z))return ['🔎','🎯'];
    if(/判断|分析|解释/.test(z))return ['📄','🔎','🧩'];

    return pageDefault();
  }
  function chineseEnough(t){return /[\u3400-\u9fff]/.test(t||'') && (t||'').trim().length>1;}
  function decorate(el){
    if(!el||el.dataset.cslSituation==='1')return;
    var txt=(el.textContent||'').trim();
    if(!chineseEnough(txt))return;
    if(el.closest('.csl-situation-strip'))return;
    var d=document.createElement('div');
    d.className='csl-situation-strip';
    d.setAttribute('aria-hidden','true');
    d.innerHTML=flow(choose(txt));
    el.parentNode.insertBefore(d,el);
    el.dataset.cslSituation='1';
  }
  function scan(){
    addStyle();
    document.querySelectorAll('.zh').forEach(decorate);
  }
  var timer=null;
  function later(){clearTimeout(timer);timer=setTimeout(scan,40);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan);else scan();
  new MutationObserver(later).observe(document.documentElement,{childList:true,subtree:true});
})();
