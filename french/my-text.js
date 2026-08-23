const MY_TEXT_KEY='fsl.mytext.v1';
const LEXICON_PATH='./data/lexicon/a1-core.json';
const LEXEME_PATH='./data/lexemes/a1-core.json';
const EXPRESSION_PATH='./data/expressions/a1-core.json';
const $=(s)=>document.querySelector(s);

let store=loadStore();
let lexicon=null;
let lexemes=null;
let expressions=null;
let activeObservation=null;

initMyText();

function initMyText(){
  const open=$('#openMyText'),panel=$('#myTextPanel'),close=$('#closeMyText'),save=$('#saveMyText'),speak=$('#speakMyText'),exportButton=$('#exportMyText'),importInput=$('#importMyText'),list=$('#myTextList'),observe=$('#myTextObserve');
  if(!open||!panel||!close||!save||!speak||!exportButton||!importInput||!list||!observe)return;
  open.addEventListener('click',()=>{panel.hidden=false;renderList();$('#myTextInput')?.focus();});
  close.addEventListener('click',()=>{panel.hidden=true;});
  save.addEventListener('click',saveCurrentText);
  speak.addEventListener('click',()=>speakFrench($('#myTextInput')?.value||''));
  exportButton.addEventListener('click',exportJson);
  importInput.addEventListener('change',importJson);
  list.addEventListener('click',(event)=>{const loadButton=event.target.closest('[data-mytext-load]');if(loadButton){loadItem(loadButton.dataset.mytextLoad);return;}const observeButton=event.target.closest('[data-mytext-observe]');if(observeButton){openObservation(observeButton.dataset.mytextObserve);return;}const deleteButton=event.target.closest('[data-mytext-delete]');if(deleteButton)deleteItem(deleteButton.dataset.mytextDelete);});
  observe.addEventListener('click',(event)=>{const token=event.target.closest('[data-token-index]');if(token){selectObservedToken(Number(token.dataset.tokenIndex));return;}const expression=event.target.closest('[data-expression-match]');if(expression){selectExpression(Number(expression.dataset.expressionMatch));return;}const saveNote=event.target.closest('[data-save-token-note]');if(saveNote)saveTokenNote(Number(saveNote.dataset.saveTokenNote));});
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!panel.hidden)panel.hidden=true;});
  renderList();
}

function emptyStore(){return{schema_version:'1.0',items:[]};}
function loadStore(){try{const raw=localStorage.getItem(MY_TEXT_KEY);if(!raw)return emptyStore();const parsed=JSON.parse(raw);return parsed?.schema_version==='1.0'&&Array.isArray(parsed.items)?parsed:emptyStore();}catch{return emptyStore();}}
function persist(){try{localStorage.setItem(MY_TEXT_KEY,JSON.stringify(store));}catch{}}

function saveCurrentText(){const input=$('#myTextInput');const text=(input?.value||'').trim();if(!text)return;const existingId=input.dataset.itemId;if(existingId){const item=store.items.find(x=>x.id===existingId);if(item){item.text=text;item.updated_at=new Date().toISOString();}}else{store.items.unshift({id:`my-${Date.now().toString(36)}`,text,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),source:'user',confidence:'unverified',annotations:{}});if(store.items.length>100)store.items=store.items.slice(0,100);}persist();renderList();input.value='';delete input.dataset.itemId;setStatus('端末内に保存しました。');}
function loadItem(id){const item=store.items.find(x=>x.id===id);if(!item)return;const input=$('#myTextInput');input.value=item.text;input.dataset.itemId=id;setStatus('保存済みテキストを開きました。');}
function deleteItem(id){store.items=store.items.filter(x=>x.id!==id);if(activeObservation?.itemId===id)closeObservation();persist();renderList();setStatus('端末内のテキストを削除しました。');}
function renderList(){const list=$('#myTextList');if(!list)return;if(!store.items.length){list.innerHTML='<p class="hint">保存したMy Textはまだありません。</p>';return;}list.innerHTML=store.items.map(item=>`<article class="mytext-item"><p lang="fr">${escapeHtml(item.text)}</p><div class="mytext-actions"><button type="button" data-mytext-observe="${escapeHtml(item.id)}">観察</button><button type="button" data-mytext-load="${escapeHtml(item.id)}">開く</button><button type="button" data-mytext-delete="${escapeHtml(item.id)}">削除</button></div></article>`).join('');}

async function ensureReferenceData(){
  if(lexicon&&lexemes&&expressions)return;
  try{
    const [lexiconRes,lexemeRes,expressionRes]=await Promise.all([fetch(LEXICON_PATH,{cache:'no-store'}),fetch(LEXEME_PATH,{cache:'no-store'}),fetch(EXPRESSION_PATH,{cache:'no-store'})]);
    if(!lexiconRes.ok||!lexemeRes.ok||!expressionRes.ok)throw new Error();
    const [lexiconData,lexemeData,expressionData]=await Promise.all([lexiconRes.json(),lexemeRes.json(),expressionRes.json()]);
    lexicon=new Map((lexiconData.entries||[]).map(entry=>[normalizeToken(entry.form),entry]));
    lexemes=new Map((lexemeData.lexemes||[]).map(entry=>[entry.id,entry]));
    expressions=Array.isArray(expressionData.expressions)?expressionData.expressions:[];
  }catch{lexicon=lexicon||new Map();lexemes=lexemes||new Map();expressions=expressions||[];setStatus('内蔵参照データを読み込めませんでした。My Text自体は引き続き利用できます。',true);}
}

async function openObservation(id){const item=store.items.find(x=>x.id===id);if(!item)return;await ensureReferenceData();const tokens=tokenizeFrench(item.text);activeObservation={itemId:id,tokens,selectedIndex:null,selectedExpression:null,matches:findExpressionMatches(tokens)};renderObservation();}
function closeObservation(){activeObservation=null;const area=$('#myTextObserve');if(area){area.hidden=true;area.innerHTML='';}}

function renderObservation(){
  const area=$('#myTextObserve');if(!area||!activeObservation)return;const item=store.items.find(x=>x.id===activeObservation.itemId);if(!item){closeObservation();return;}
  const tokens=activeObservation.tokens;const matched=tokens.filter(token=>lexicon?.has(normalizeToken(token))).length;const expressionHtml=activeObservation.matches.length?`<section class="expression-match-section"><div class="sound-section-label">VERIFIED EXPRESSIONS</div><div class="expression-list">${activeObservation.matches.map((match,index)=>`<button type="button" class="expression-card" data-expression-match="${index}" aria-pressed="${activeObservation.selectedExpression===index}"><small>${escapeHtml(match.expression.type)}</small><b>${escapeHtml(match.surface)}</b><span>${escapeHtml(match.expression.meaning_ja)}</span></button>`).join('')}</div></section>`:'<p class="hint">現在の検証済み内蔵表現とは一致しませんでした。未知の表現を推測して作りません。</p>';
  area.hidden=false;area.innerHTML=`<div class="observe-head"><div><div class="eyebrow">MY TEXT OBSERVATION · UNVERIFIED</div><p lang="fr">${escapeHtml(item.text)}</p></div><small>${matched}/${tokens.length} 語が内蔵教材と照合</small></div>${expressionHtml}<div class="sound-section-label">WORDS</div><div class="token-row">${tokens.map((token,index)=>{const known=lexicon?.has(normalizeToken(token));return `<button type="button" class="token-chip ${known?'known':'unknown'}" data-token-index="${index}" aria-pressed="${activeObservation.selectedIndex===index}">${escapeHtml(token)}<small>${known?'既知':'未登録'}</small></button>`;}).join('')}</div>${renderSelectedDetail(item)}`;
}

function renderSelectedDetail(item){if(activeObservation.selectedExpression!==null)return renderExpressionDetail(activeObservation.matches[activeObservation.selectedExpression]);return renderTokenDetail(item);}
function renderExpressionDetail(match){if(!match)return'';const x=match.expression;return `<section class="token-detail"><div class="sound-section-label">SELECTED EXPRESSION</div><h3 lang="fr">${escapeHtml(match.surface)}</h3><div class="token-detail-grid"><div><b>意味</b><span>${escapeHtml(x.meaning_ja)}</span></div><div><b>種類</b><span>${escapeHtml(x.type)}</span></div><div><b>使用域</b><span>${escapeHtml(x.register||'—')}</span></div><div><b>確信度</b><span>${escapeHtml(x.confidence||'—')}</span></div></div><p class="hint">内蔵教材に登録済みの表現だけを表示しています。</p></section>`;}
function renderTokenDetail(item){const index=activeObservation?.selectedIndex;if(index===null||index===undefined)return '<p class="hint">語または表現を押すと、内蔵教材に確認済み情報がある場合だけ表示します。未登録項目は推測しません。</p>';const token=activeObservation.tokens[index];const entry=lexicon?.get(normalizeToken(token));const shared=entry?.lexeme_id?lexemes?.get(entry.lexeme_id):null;const note=item.annotations?.[annotationKey(index,token)]||'';const verified=entry?`<div class="token-detail-grid"><div><b>内蔵教材での形</b><span>${escapeHtml(entry.form)}</span></div><div><b>IPA</b><span>${entry.ipa?`/${escapeHtml(entry.ipa)}/`:'—'}</span></div><div><b>文脈例での意味</b><span>${escapeHtml(entry.meaning_ja||'—')}</span></div><div><b>辞書形</b><span>${escapeHtml(entry.lemma||'—')}</span></div><div><b>品詞</b><span>${escapeHtml(entry.pos||'—')}</span></div>${shared?`<div class="wide"><b>共有lexeme</b><span>${escapeHtml(shared.lemma)} · ${escapeHtml(shared.meaning_ja)} · ${escapeHtml(shared.pos)}</span></div>`:''}${entry.detail_ja?`<div class="wide"><b>確認済み注記</b><span>${escapeHtml(entry.detail_ja)}</span></div>`:''}</div>`:`<div class="unknown-note"><b>未登録</b><p>この語について、現在の内蔵教材から安全に照合できる情報はありません。意味・品詞・発音を推測して補いません。</p></div>`;return `<section class="token-detail"><div class="sound-section-label">SELECTED WORD</div><h3 lang="fr">${escapeHtml(token)}</h3>${verified}<label class="token-note-label"><span>自分の注釈</span><textarea rows="2" data-token-note="${index}" placeholder="自分で気づいたことを記録">${escapeHtml(note)}</textarea></label><button type="button" class="history-clear" data-save-token-note="${index}">注釈を保存</button></section>`;}

function selectObservedToken(index){if(!activeObservation||!activeObservation.tokens[index])return;activeObservation.selectedIndex=index;activeObservation.selectedExpression=null;renderObservation();}
function selectExpression(index){if(!activeObservation||!activeObservation.matches[index])return;activeObservation.selectedExpression=index;activeObservation.selectedIndex=null;renderObservation();}
function saveTokenNote(index){if(!activeObservation||activeObservation.selectedIndex!==index)return;const item=store.items.find(x=>x.id===activeObservation.itemId),token=activeObservation.tokens[index],input=$(`[data-token-note="${index}"]`);if(!item||!token||!input)return;item.annotations=item.annotations&&typeof item.annotations==='object'?item.annotations:{};const key=annotationKey(index,token),value=input.value.trim();if(value)item.annotations[key]=value;else delete item.annotations[key];item.updated_at=new Date().toISOString();persist();setStatus('注釈を端末内に保存しました。');renderObservation();}

function findExpressionMatches(tokens){
  const normalized=tokens.map(normalizeToken),results=[];
  for(const expression of expressions||[]){const candidates=[expression.tokens,...(expression.match_forms||[])].filter(Array.isArray).map(seq=>seq.map(normalizeToken));for(const candidate of candidates){for(let start=0;start<=normalized.length-candidate.length;start++){if(candidate.every((token,offset)=>normalized[start+offset]===token)){results.push({expression,start,end:start+candidate.length-1,surface:tokens.slice(start,start+candidate.length).join(expression.tokens?.[0]?.endsWith("'")?"":" ")});break;}}}}
  return results.sort((a,b)=>(b.end-b.start)-(a.end-a.start)||a.start-b.start);
}
function tokenizeFrench(text){const matches=(text.match(/[\p{L}À-ÖØ-öø-ÿ]+(?:['’][\p{L}À-ÖØ-öø-ÿ]+)?/gu)||[]),result=[];for(const raw of matches){const normalized=raw.replace(/’/g,"'"),apostrophe=normalized.indexOf("'");if(apostrophe>0&&apostrophe<normalized.length-1){result.push(normalized.slice(0,apostrophe+1));result.push(normalized.slice(apostrophe+1));}else result.push(normalized);}return result;}
function normalizeToken(value=''){return String(value).replace(/’/g,"'").toLocaleLowerCase('fr-FR');}
function annotationKey(index,token){return `${index}:${normalizeToken(token)}`;}

function exportJson(){const payload={schema_version:'1.0',kind:'french-structure-lab-my-text',exported_at:new Date().toISOString(),items:store.items};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='french-structure-lab-my-text.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);setStatus('JSONを書き出しました。');}
async function importJson(event){const file=event.target.files?.[0];if(!file)return;try{const parsed=JSON.parse(await file.text());if(parsed?.schema_version!=='1.0'||!Array.isArray(parsed.items))throw new Error('対応していないJSON形式です。');const safe=parsed.items.filter(x=>x&&typeof x.text==='string'&&x.text.trim()).slice(0,100).map(x=>({id:typeof x.id==='string'?x.id:`my-${Math.random().toString(36).slice(2)}`,text:x.text.trim(),created_at:x.created_at||new Date().toISOString(),updated_at:x.updated_at||new Date().toISOString(),source:'user',confidence:'unverified',annotations:x.annotations&&typeof x.annotations==='object'&&!Array.isArray(x.annotations)?x.annotations:{}}));store={schema_version:'1.0',items:safe};closeObservation();persist();renderList();setStatus(`${safe.length}件を読み込みました。`);}catch(error){setStatus(error.message||'JSONを読み込めませんでした。',true);}finally{event.target.value='';}}
function speakFrench(text){if(!text.trim()||!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.9;speechSynthesis.speak(u);}
function setStatus(message,error=false){const el=$('#myTextStatus');if(!el)return;el.textContent=message;el.classList.toggle('error-text',error);}
function escapeHtml(value=''){return String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
window.FSL_MYTEXT_DEBUG={tokenizeFrench,normalizeToken,findExpressionMatches};
