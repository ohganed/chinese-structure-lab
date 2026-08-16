(function(){
  'use strict';
  var STYLE_ID='csl-situation-layer-style';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent='.csl-situation-strip{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:9px 11px;background:#f1efe9;border-radius:14px;width:max-content;max-width:100%;font-size:21px;line-height:1}.csl-situation-strip .csl-arrow{font-size:11px;color:#999}.senior .csl-situation-strip{font-size:30px;padding:12px 14px;border-radius:18px;gap:10px}.senior .csl-situation-strip .csl-arrow{font-size:16px}@media(max-width:430px){.csl-situation-strip{font-size:20px;gap:6px}}';
    document.head.appendChild(s);
  }
  function flow(a){return a.map(function(x,i){return '<span>'+x+'</span>'+(i<a.length-1?'<span class="csl-arrow">→</span>':'');}).join('');}
  function pageDefault(){
    var t=(document.title||'').toLowerCase();
    if(/food|restaurant/.test(t))return ['🪑','📖','🍜','💬'];
    if(/travel|transport/.test(t))return ['🏙️','📍','🚇','💬'];
    if(/shopping/.test(t))return ['👀','🏷️','💴','💬'];
    if(/people|family/.test(t))return ['🏠','👨‍👩‍👧','🙂','💬'];
    if(/work|study/.test(t))return ['📚','👥','💬','✅'];
    if(/story|stories/.test(t))return ['🎬','👀','➡️','💬'];
    if(/listening/.test(t))return ['🎧','👂','🧠','💬'];
    if(/a2/.test(t))return ['🌱','🧩','💬','➡️'];
    if(/b1/.test(t))return ['🌍','🧠','💬','➡️'];
    if(/b2/.test(t))return ['📰','⚖️','🧠','💬'];
    if(/c1/.test(t))return ['📰','🔍','🧠','💬'];
    if(/c2/.test(t))return ['🧠','🔍','💭','💬'];
    return ['👀','🧠','💬','➡️'];
  }
  function choose(z){
    z=(z||'').replace(/\s+/g,'');
    if(/你好|早上好|晚上好|晚安|明天见|再见|很高兴认识/.test(z))return ['🚪','👀','🙂','👋'];
    if(/叫什么|我叫|哪国人|日本人|我是|名字/.test(z))return ['🙂','💬','🪪','🤝'];
    if(/几点|点半|几点钟|现在.*点|六点|三点|时间/.test(z))return ['🕒','👀','📅','💬'];
    if(/妈妈|爸爸|哥哥|姐姐|弟弟|妹妹|家有|家人|几口人|朋友/.test(z))return ['🏠','👨‍👩‍👧','🙂','💬'];
    if(/菜单|吃|喝|茶|咖啡|菜|饭|辣|买单|水|餐厅|饭店|烤鸭/.test(z))return ['🪑','📖','🍜','💬'];
    if(/多少钱|便宜|贵|买|这个|那个|颜色|试一下|刷卡|支付|一共/.test(z))return ['👀','🏷️','💴','💬'];
    if(/地铁|车站|站台|高铁|公交|票|下一站|下车|出发|换车|末班车/.test(z))return ['🏙️','📍','🚇','🎫'];
    if(/左转|右转|一直走|怎么去|在哪儿|哪里|哪儿|方向|迷路/.test(z))return ['🗺️','😕','🙋','➡️'];
    if(/酒店|宾馆|房间|预订|护照|入住|早餐|换房|行李/.test(z))return ['🧳','🏨','🛎️','💬'];
    if(/下雨|天气|冷|热|风|晴|阴|雪|带伞/.test(z))return ['🌤️','👀','☂️','💬'];
    if(/医生|医院|药|头疼|发烧|不舒服|过敏|一天吃几次|疼/.test(z))return ['🤒','🏥','💊','❓'];
    if(/电话|消息|微信|发消息|打电话|联系/.test(z))return ['📱','💬','📩','🙂'];
    if(/周末|打算|计划|方便|见面|邀请|一起|明天|下午/.test(z))return ['🗓️','🤔','📩','🙂'];
    if(/喜欢|音乐|电影|公园|散步|照片|爱好|周末我看/.test(z))return ['🎧','🙂','🌿','💬'];
    if(/工作|上班|下班|同事|老师|学习|学|课|问题|写|填/.test(z))return ['📚','👥','🧠','💬'];
    if(/帮我|请再说|听不懂|慢一点|没问题|应该怎么|明白了/.test(z))return ['😕','🙋','💬','✅'];
    if(/去过|吃过|坐过|以前|上个月|旅行|拍了|昨天|那次/.test(z))return ['🕰️','🧳','📍','📸'];
    if(/比|更|最|没有.*贵|两个都|还是选|比较/.test(z))return ['👀','⚖️','🤔','💬'];
    if(/因为|所以|虽然|但是|如果|可是|既然|尽管|原因|结果/.test(z))return ['🧠','🔗','➡️','💬'];
    if(/开始|变了|现在我会|慢慢|习惯|已经/.test(z))return ['🕰️','🌱','🔄','💬'];
    if(/政策|政府|社会|经济|环境|教育|科技|技术|人工智能|AI|公平|制度/.test(z))return ['📰','⚖️','🧠','💬'];
    if(/观点|认为|我觉得|看来|意味着|问题不在于|关键|判断|解释|分析/.test(z))return ['🧠','🔍','⚖️','💬'];
    if(/暗示|省略|语气|含义|表达|讽刺|反讽|文体|措辞|立场|语境/.test(z))return ['🧠','🔍','💭','💬'];
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
