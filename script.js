
/* FocusPocket Luxe - JS behavior (mobile-first) */
const LS_TX = 'fp_transactions_v2';
const LS_TASK = 'fp_tasks_v2';

const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);
const fmt = n => 'R$ ' + Number(n).toFixed(2).replace('.',',');

let transactions = JSON.parse(localStorage.getItem(LS_TX) || '[]');
let tasks = JSON.parse(localStorage.getItem(LS_TASK) || '[]');

const balanceEl = qs('#balanceValue');
const txListEl = qs('#txList');
const taskListEl = qs('#taskList');
const taskProgress = qs('#taskProgress');

function saveAll(){ localStorage.setItem(LS_TX, JSON.stringify(transactions)); localStorage.setItem(LS_TASK, JSON.stringify(tasks)); render(); }

function render(){
  const balance = transactions.reduce((s,t)=> s + Number(t.amount), 0);
  balanceEl.textContent = fmt(balance);
  balanceEl.className = balance < 0 ? 'tx-neg' : 'tx-pos';

  // tx list
  txListEl.innerHTML = '';
  const recent = transactions.slice().reverse().slice(0,6);
  recent.forEach((t,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<div>${t.desc}</div><div><span class="tx-amount ${t.amount<0?'tx-neg':'tx-pos'}">${fmt(t.amount)}</span> <button data-i="${transactions.length-1-i}" class="btnDel" aria-label="Remover">✖</button></div>`;
    txListEl.appendChild(li);
  });

  // tasks
  taskListEl.innerHTML = '';
  tasks.slice().reverse().slice(0,6).forEach((tk, idx)=>{
    const li = document.createElement('li');
    const checked = tk.done ? 'checked' : '';
    li.innerHTML = `<div style="display:flex;align-items:center;gap:10px"><input type="checkbox" data-i="${tasks.length-1-idx}" ${checked}><div style="min-width:0">${tk.desc}</div></div><div class="priority-${tk.priority}">${tk.priority}</div>`;
    taskListEl.appendChild(li);
  });

  const total = tasks.length;
  const done = tasks.filter(t=>t.done).length;
  taskProgress.textContent = total === 0 ? '0 / 0' : `${done} / ${total}`;
}

// forms
qs('#txForm').addEventListener('submit', e=>{
  e.preventDefault();
  const desc = qs('#txDesc').value.trim();
  const amount = Number(qs('#txAmount').value.replace(',','.'));
  const category = qs('#txCategory').value;
  if(!desc || isNaN(amount)) return alert('Preencha descrição e valor válido.');
  transactions.push({desc, amount, category, date:Date.now()});
  qs('#txDesc').value=''; qs('#txAmount').value='';
  saveAll();
});

qs('#taskForm').addEventListener('submit', e=>{
  e.preventDefault();
  const desc = qs('#taskDesc').value.trim();
  const priority = qs('#taskPriority').value;
  if(!desc) return alert('Escreve a tarefa.');
  tasks.push({desc, priority, done:false, created:Date.now()});
  qs('#taskDesc').value='';
  saveAll();
});

// delete transaction
document.addEventListener('click', e=>{
  if(e.target.matches('.btnDel')){
    const i = Number(e.target.dataset.i);
    transactions.splice(i,1);
    saveAll();
  }
});

// toggle views via bottom nav
qsa('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    qsa('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    qsa('.view').forEach(v=>v.classList.remove('active'));
    qs('#'+target).classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
  });
});

// fab quick-add (opens the view relevant)
qs('#fab').addEventListener('click', ()=>{
  // if on finances view, focus amount, else focus task input
  const active = document.querySelector('.nav-btn.active').dataset.target;
  if(active === 'financas'){ qs('#txDesc').focus(); qs('#txDesc').scrollIntoView({behavior:'smooth'}); }
  else { qs('#taskDesc').focus(); qs('#taskDesc').scrollIntoView({behavior:'smooth'}); }
});

// theme toggle
const themeToggle = qs('#themeToggle');
themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('theme-dark');
  document.body.classList.toggle('theme-light');
  // animate
  themeToggle.animate([{transform:'rotate(0)'},{transform:'rotate(180deg)'}],{duration:320});
});
// set default dark
if(!document.body.classList.contains('theme-dark') && !document.body.classList.contains('theme-light')){
  document.body.classList.add('theme-dark');
}

// clear buttons
qs('#clearTx').addEventListener('click', ()=>{ if(confirm('Limpar todas as transações?')){ transactions=[]; saveAll(); }});
qs('#clearTasks').addEventListener('click', ()=>{ if(confirm('Remover todas tarefas?')){ tasks=[]; saveAll(); }});

// checkbox handling for tasks (delegate)
taskListEl.addEventListener('change', e=>{
  if(e.target.matches('input[type="checkbox"]')){
    const i = Number(e.target.dataset.i);
    tasks[i].done = e.target.checked;
    saveAll();
  }
});

// initial render
render();
