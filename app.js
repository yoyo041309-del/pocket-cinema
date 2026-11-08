const storeKey = 'pocket-cinema-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storeKey) || '{}') || {}; } catch { saved = {}; }
let filter = '全部';
const grid = document.querySelector('#grid');
const search = document.querySelector('#search');
const dialog = document.querySelector('#detail');
const detailBody = document.querySelector('#detail-body');
function getState(id) { return saved[id] || {favorite:false, watched:false}; }
function persist(id, changes) { saved[id] = {...getState(id), ...changes}; try { localStorage.setItem(storeKey, JSON.stringify(saved)); } catch {} }
function poster(w) { return `<div class="poster ${w.color}" aria-hidden="true"><span class="poster-label">${w.type} · ${w.year}</span><span class="poster-glyph">${w.initial}</span></div>`; }
function render(){
 const q=search.value.trim().toLocaleLowerCase();
 const items=WORKS.filter(w=>(filter==='全部'||(filter==='收藏'?getState(w.id).favorite:w.type===filter)) && (w.title+' '+w.original+' '+w.tag).toLocaleLowerCase().includes(q));
 document.querySelector('#result-count').textContent=`${String(items.length).padStart(2,'0')} 個故事`;
 document.querySelector('#empty').hidden=items.length>0;
 grid.innerHTML=items.map(w=>`<article class="card">${poster(w)}<div class="card-body"><div class="card-type">${w.type} / ${w.tag} <span>· ${w.year}</span></div><h3>${w.title}</h3><div class="original">${w.original}</div><div class="card-bottom"><button data-open="${w.id}" aria-label="查看${w.title}詳細資料">看看故事 ↗</button><button class="heart" data-fav="${w.id}" aria-label="${getState(w.id).favorite?'取消收藏':'收藏'}${w.title}" aria-pressed="${getState(w.id).favorite}">${getState(w.id).favorite?'♥':'♡'}</button></div></div></article>`).join('');
}
function openDetail(id){const w=WORKS.find(x=>x.id===id); if(!w){if(dialog.open)dialog.close();return;} const state=getState(id);detailBody.innerHTML=`<div class="detail-content">${poster(w)}<div class="card-type">${w.type} / ${w.tag} · ${w.year}</div><h2>${w.title}</h2><div class="original">${w.original}</div><p>${w.description}</p><p class="detail-note">這是一筆示範作品，歡迎之後換成自己的真實心得。</p><div class="detail-actions"><button id="detail-fav" class="${state.favorite?'selected':''}" aria-pressed="${state.favorite}">${state.favorite?'♥ 已收藏':'♡ 加入收藏'}</button><button id="detail-watch" class="${state.watched?'selected':''}" aria-pressed="${state.watched}">${state.watched?'✓ 已看過':'標記已看過'}</button></div></div>`;document.querySelector('#detail-fav').onclick=()=>{persist(id,{favorite:!getState(id).favorite});render();openDetail(id)};document.querySelector('#detail-watch').onclick=()=>{persist(id,{watched:!getState(id).watched});openDetail(id)};if(!dialog.open)dialog.showModal();}
grid.addEventListener('click',event=>{const fav=event.target.closest('[data-fav]'),open=event.target.closest('[data-open]');if(fav){const id=fav.dataset.fav;persist(id,{favorite:!getState(id).favorite});render()}if(open)location.hash='work/'+open.dataset.open;});
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.filter;document.querySelectorAll('.filter').forEach(x=>{let active=x===btn;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});render()}));
search.addEventListener('input',render);document.querySelector('#close-detail').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog.addEventListener('close',()=>{if(location.hash.startsWith('#work/'))history.replaceState(null,'',location.pathname+location.search+'#collection')});window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#work/'))openDetail(location.hash.slice(6));else if(dialog.open)dialog.close()});render();if(location.hash.startsWith('#work/'))openDetail(location.hash.slice(6));

