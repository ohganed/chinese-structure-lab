const style=document.createElement('style');
style.textContent=`
.flow-guide{margin:16px 0 4px;padding:14px 14px 12px;border:1px solid var(--line);border-radius:20px;background:var(--surface)}
.flow-guide-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
.flow-guide-head span{font-size:11px;font-weight:800;letter-spacing:.08em;color:var(--muted)}
.flow-guide-head small{font-size:11px;color:var(--muted)}
.flow-guide-track{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding:2px}
.flow-guide-track button{display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:8px 11px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--muted);white-space:nowrap;font-weight:700}
.flow-guide-track button span{display:grid;place-items:center;width:20px;height:20px;border:1px solid var(--line);border-radius:50%;font-size:10px}
.flow-guide-track button.active{background:var(--soft);color:var(--ink);border-color:var(--ink)}
.flow-guide-track button.active span{background:var(--ink);color:var(--surface);border-color:var(--ink)}
.flow-guide-track button:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
@media(max-width:460px){.flow-guide{margin-top:12px;padding:12px}.flow-guide-head small{display:none}.flow-guide-track button{min-height:38px;padding:7px 10px;font-size:12px}}
@media(prefers-reduced-motion:reduce){.flow-guide-track{scroll-behavior:auto!important}}
`;
document.head.appendChild(style);

function setFlowCurrent(mode){
  document.querySelectorAll('[data-flow-mode]').forEach(button=>{
    const active=button.dataset.flowMode===mode;
    button.classList.toggle('active',active);
    if(active)button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
  });
}

document.addEventListener('click',event=>{
  const flowButton=event.target.closest('[data-flow-mode]');
  if(flowButton){
    const target=document.querySelector(`.mode-tabs [data-mode="${flowButton.dataset.flowMode}"]`);
    if(target){target.click();target.scrollIntoView({block:'nearest',inline:'center'});}
    return;
  }
  const modeButton=event.target.closest('.mode-tabs [data-mode]');
  if(modeButton)setFlowCurrent(modeButton.dataset.mode);
});

setFlowCurrent('listen');
