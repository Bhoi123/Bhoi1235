// Hindi modern demo logic
const COLORS = [
  {name:'लाल', code:'#ef4444'}, {name:'हरा', code:'#10b981'}, {name:'बैंगनी', code:'#8b5cf6'}
];

let selected = null;
let auto = true;
let interval = 60;
let timer = interval;
let rounds = 0, wins = 0, losses = 0;
let balance = 1000;
const payout = 18;

const colorsEl = document.getElementById('colors');
const selectedText = document.getElementById('selectedText');
const roundsEl = document.getElementById('rounds');
const winsEl = document.getElementById('wins');
const lossesEl = document.getElementById('losses');
const winpctEl = document.getElementById('winpct');
const balanceEl = document.getElementById('balance');
const latestEl = document.getElementById('latest');
const historyEl = document.getElementById('history');
const timerEl = document.getElementById('timer');
const manualBtn = document.getElementById('manual');
const autoBtn = document.getElementById('auto');
const resetBtn = document.getElementById('reset');
const stakeInput = document.getElementById('stake');
const intervalSelect = document.getElementById('interval');
const themeToggle = document.getElementById('themeToggle');

function renderColors(){
  colorsEl.innerHTML='';
  COLORS.forEach((c,i)=>{
    const b = document.createElement('div');
    b.className='color-btn';
    b.style.background=c.code;
    b.innerText=c.name[0];
    b.title=c.name;
    b.onclick = () => { selected=i; updateSelected(); };
    colorsEl.appendChild(b);
  });
  updateSelected();
}

function updateSelected(){
  selectedText.innerText = selected===null? 'चुना हुआ: —' : 'चुना हुआ: ' + COLORS[selected].name;
  Array.from(colorsEl.children).forEach((el, idx)=> el.classList.toggle('selected', idx===selected));
}

function draw(manual=false){
  const drawIdx = Math.floor(Math.random()*COLORS.length);
  const draw = COLORS[drawIdx];
  const stake = parseFloat(stakeInput.value) || 1;
  rounds++;
  let win=false;
  if(selected!==null && selected===drawIdx){
    const net = stake*(payout-1);
    balance += net;
    wins++; win=true;
  } else {
    balance -= stake;
    losses++;
  }
  latestEl.innerText = draw.name;
  latestEl.style.background = draw.code;
  latestEl.style.color = '#fff';
  addHistory(draw.name, win);
  updateStats();
  if(!manual){ timer = parseInt(intervalSelect.value) || interval; }
}

function addHistory(name, win){
  const div = document.createElement('div');
  div.className='history-item';
  const left = document.createElement('div'); left.innerText = name;
  const right = document.createElement('div'); right.innerText = win? 'WIN' : 'LOSS';
  right.style.color = win? '#16a34a' : '#ef4444';
  div.appendChild(left); div.appendChild(right);
  historyEl.prepend(div);
  while(historyEl.children.length>200) historyEl.removeChild(historyEl.lastChild);
}

function updateStats(){
  roundsEl.innerText = rounds;
  winsEl.innerText = wins;
  lossesEl.innerText = losses;
  winpctEl.innerText = rounds>0? ((wins/rounds)*100).toFixed(2) + '%' : '0%';
  balanceEl.innerText = balance.toFixed(2);
  timerEl.innerText = timer;
}

manualBtn.onclick = ()=> draw(true);
autoBtn.onclick = ()=> { auto = !auto; autoBtn.classList.toggle('active'); autoBtn.innerText = 'ऑटो: ' + (auto? 'ON' : 'OFF'); };
resetBtn.onclick = ()=> {
  if(!confirm('सभी आँकड़े और बैलेंस रीसेट करना है?')) return;
  rounds=0; wins=0; losses=0; balance=1000; historyEl.innerHTML=''; updateStats();
};

intervalSelect.onchange = ()=> { timer = parseInt(intervalSelect.value) || interval; updateStats(); };
stakeInput.onchange = ()=> updateStats();

// theme toggle - light/dark
themeToggle.onclick = ()=> {
  document.documentElement.classList.toggle('light');
};

// tick
setInterval(()=>{
  if(auto){
    timer--;
    if(timer<=0){
      draw(false);
      timer = parseInt(intervalSelect.value) || interval;
    }
    updateStats();
  }
}, 1000);

// init
renderColors();
updateStats();
