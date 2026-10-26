const fa=n=>new Intl.NumberFormat('fa-IR').format(n);
function tick(){const now=new Date();
const seconds=now.getSeconds(), minutes=now.getMinutes(), hours=now.getHours()%12;
document.getElementById('secondHand').style.transform=`translateX(-50%) rotate(${seconds*6}deg)`;
document.getElementById('minuteHand').style.transform=`translateX(-50%) rotate(${minutes*6+seconds*.1}deg)`;
document.getElementById('hourHand').style.transform=`translateX(-50%) rotate(${hours*30+minutes*.5}deg)`;document.getElementById('clock').textContent=now.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'});document.getElementById('date').textContent=now.toLocaleDateString('fa-IR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});}
tick();setInterval(tick,30000);
let tasks=JSON.parse(localStorage.getItem('vira_tasks')||'[]');
const taskBox=document.getElementById('tasks');
function save(){localStorage.setItem('vira_tasks',JSON.stringify(tasks));render();}
function render(){taskBox.innerHTML='';tasks.forEach((t,i)=>{const row=document.createElement('div');row.className='task'+(t.done?' done':'');const cb=document.createElement('input');cb.type='checkbox';cb.checked=t.done;cb.addEventListener('change',()=>{tasks[i].done=cb.checked;save()});const label=document.createElement('span');label.className='tasktext';label.textContent=t.text;const del=document.createElement('button');del.className='delete';del.textContent='×';del.title='حذف';del.onclick=()=>{tasks.splice(i,1);save()};row.append(cb,label,del);taskBox.append(row)});document.getElementById('todoCount').textContent=fa(tasks.filter(t=>!t.done).length);document.getElementById('doneCount').textContent=fa(tasks.filter(t=>t.done).length);}
document.getElementById('addTask').onclick=()=>{const text=prompt('عنوان کار جدید:');if(text&&text.trim()){tasks.unshift({text:text.trim(),done:false});save()}};
const note=document.getElementById('note');note.value=localStorage.getItem('vira_note')||'';note.addEventListener('input',()=>localStorage.setItem('vira_note',note.value));
// Search history and direct URL navigation
const searchInput=document.getElementById('search');
const historyBox=document.getElementById('searchHistory');
let searchHistory=JSON.parse(localStorage.getItem('vira_search_history')||'[]');
function saveSearchHistory(value){
  searchHistory=[value,...searchHistory.filter(x=>x.toLowerCase()!==value.toLowerCase())].slice(0,8);
  localStorage.setItem('vira_search_history',JSON.stringify(searchHistory));
}
function runSearch(value){
  const q=value.trim(); if(!q)return;
  saveSearchHistory(q); historyBox.hidden=true;
  const looksLikeUrl=/^(https?:\/\/|www\.)/i.test(q) || (/^[\w-]+(?:\.[\w-]+)+(?:[/:?#].*)?$/i.test(q) && !/\s/.test(q));
  if(looksLikeUrl){
    const url=/^https?:\/\//i.test(q)?q:'https://'+q;
    try{const parsed=new URL(url);if(parsed.protocol==='http:'||parsed.protocol==='https:'){location.href=parsed.href;return;}}catch(_){}
  }
  location.href='https://www.google.com/search?q='+encodeURIComponent(q);
}
function renderSearchHistory(){
  const q=searchInput.value.trim().toLowerCase();
  const items=searchHistory.filter(x=>!q||x.toLowerCase().includes(q));
  historyBox.innerHTML='';
  if(!items.length){historyBox.hidden=true;return;}
  items.forEach(item=>{
    const row=document.createElement('button');row.type='button';row.className='history-item';row.textContent='↶  '+item;
    row.addEventListener('click',()=>{searchInput.value=item;runSearch(item);});historyBox.append(row);
  });
  historyBox.hidden=false;
}
searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runSearch(searchInput.value);}if(e.key==='Escape')historyBox.hidden=true;});
searchInput.addEventListener('focus',renderSearchHistory);
searchInput.addEventListener('input',renderSearchHistory);
document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))historyBox.hidden=true;});
render();
// Editable greeting labels, saved locally in this Chrome profile
const profileDefaults={title:'سلام طراح! 👋',subtitle:'امروز قراره چه چیزی رو بسازی؟'};
const profile=JSON.parse(localStorage.getItem('vira_profile')||'{}');
function applyProfile(){document.getElementById('greetingTitle').textContent=profile.title||profileDefaults.title;document.getElementById('greetingSubtitle').textContent=profile.subtitle||profileDefaults.subtitle;}
applyProfile();
const editor=document.getElementById('profileEditor');
document.getElementById('editProfile').onclick=()=>{document.getElementById('titleInput').value=profile.title||profileDefaults.title;document.getElementById('subtitleInput').value=profile.subtitle||profileDefaults.subtitle;editor.hidden=false;};
document.getElementById('closeEditor').onclick=()=>editor.hidden=true;
document.getElementById('saveProfile').onclick=()=>{profile.title=document.getElementById('titleInput').value.trim()||profileDefaults.title;profile.subtitle=document.getElementById('subtitleInput').value.trim()||profileDefaults.subtitle;localStorage.setItem('vira_profile',JSON.stringify(profile));applyProfile();editor.hidden=true;};
document.getElementById('resetProfile').onclick=()=>{profile.title=profileDefaults.title;profile.subtitle=profileDefaults.subtitle;localStorage.setItem('vira_profile',JSON.stringify(profile));applyProfile();editor.hidden=true;};
