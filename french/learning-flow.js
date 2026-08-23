const FLOW=[
  ['listen','音から見る'],
  ['words','単語を開く'],
  ['chunks','意味のまとまり'],
  ['structure','構造を見る'],
  ['sound','音を深掘り']
];

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
