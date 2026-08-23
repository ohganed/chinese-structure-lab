const MY_TEXT_KEY='fsl.mytext.v1';
const $=(s)=>document.querySelector(s);

let store=loadStore();

initMyText();

function initMyText(){
  const open=$('#openMyText');
  const panel=$('#myTextPanel');
  const close=$('#closeMyText');
  const save=$('#saveMyText');
  const speak=$('#speakMyText');
  const exportButton=$('#exportMyText');
  const importInput=$('#importMyText');
  const list=$('#myTextList');
  if(!open||!panel||!close||!save||!speak||!exportButton||!importInput||!list)return;

  open.addEventListener('click',()=>{panel.hidden=false;renderList();$('#myTextInput')?.focus();});
  close.addEventListener('click',()=>{panel.hidden=true;});
  save.addEventListener('click',saveCurrentText);
  speak.addEventListener('click',()=>speakFrench($('#myTextInput')?.value||''));
  exportButton.addEventListener('click',exportJson);
  importInput.addEventListener('change',importJson);
  list.addEventListener('click',(event)=>{
    const loadButton=event.target.closest('[data-mytext-load]');
    if(loadButton){loadItem(loadButton.dataset.mytextLoad);return;}
    const deleteButton=event.target.closest('[data-mytext-delete]');
    if(deleteButton){deleteItem(deleteButton.dataset.mytextDelete);}
  });
  document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!panel.hidden)panel.hidden=true;});
  renderList();
}

function emptyStore(){return{schema_version:'1.0',items:[]};}
function loadStore(){try{const raw=localStorage.getItem(MY_TEXT_KEY);if(!raw)return emptyStore();const parsed=JSON.parse(raw);return parsed?.schema_version==='1.0'&&Array.isArray(parsed.items)?parsed:emptyStore();}catch{return emptyStore();}}
function persist(){try{localStorage.setItem(MY_TEXT_KEY,JSON.stringify(store));}catch{}}

function saveCurrentText(){
  const input=$('#myTextInput');const text=(input?.value||'').trim();if(!text)return;
  const existingId=input.dataset.itemId;
  if(existingId){const item=store.items.find(x=>x.id===existingId);if(item){item.text=text;item.updated_at=new Date().toISOString();}}
  else{store.items.unshift({id:`my-${Date.now().toString(36)}`,text,created_at:new Date().toISOString(),updated_at:new Date().toISOString(),source:'user',confidence:'unverified'});if(store.items.length>100)store.items=store.items.slice(0,100);}
  persist();renderList();input.value='';delete input.dataset.itemId;setStatus('端末内に保存しました。');
}

function loadItem(id){const item=store.items.find(x=>x.id===id);if(!item)return;const input=$('#myTextInput');input.value=item.text;input.dataset.itemId=id;setStatus('保存済みテキストを開きました。');}
function deleteItem(id){store.items=store.items.filter(x=>x.id!==id);persist();renderList();setStatus('端末内のテキストを削除しました。');}

function renderList(){
  const list=$('#myTextList');if(!list)return;
  if(!store.items.length){list.innerHTML='<p class="hint">保存したMy Textはまだありません。</p>';return;}
  list.innerHTML=store.items.map(item=>`<article class="mytext-item"><p lang="fr">${escapeHtml(item.text)}</p><div class="mytext-actions"><button type="button" data-mytext-load="${escapeHtml(item.id)}">開く</button><button type="button" data-mytext-delete="${escapeHtml(item.id)}">削除</button></div></article>`).join('');
}

function exportJson(){
  const payload={schema_version:'1.0',kind:'french-structure-lab-my-text',exported_at:new Date().toISOString(),items:store.items};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='french-structure-lab-my-text.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);setStatus('JSONを書き出しました。');
}

async function importJson(event){
  const file=event.target.files?.[0];if(!file)return;
  try{const parsed=JSON.parse(await file.text());if(parsed?.schema_version!=='1.0'||!Array.isArray(parsed.items))throw new Error('対応していないJSON形式です。');const safe=parsed.items.filter(x=>x&&typeof x.text==='string'&&x.text.trim()).slice(0,100).map(x=>({id:typeof x.id==='string'?x.id:`my-${Math.random().toString(36).slice(2)}`,text:x.text.trim(),created_at:x.created_at||new Date().toISOString(),updated_at:x.updated_at||new Date().toISOString(),source:'user',confidence:'unverified'}));store={schema_version:'1.0',items:safe};persist();renderList();setStatus(`${safe.length}件を読み込みました。`);}catch(error){setStatus(error.message||'JSONを読み込めませんでした。',true);}finally{event.target.value='';}
}

function speakFrench(text){if(!text.trim()||!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.9;speechSynthesis.speak(u);}
function setStatus(message,error=false){const el=$('#myTextStatus');if(!el)return;el.textContent=message;el.classList.toggle('error-text',error);}
function escapeHtml(value=''){return String(value).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
