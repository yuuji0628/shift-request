
const HTML_HEADERS = {
  "content-type": "text/html; charset=UTF-8",
  "cache-control": "no-store",
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "no-store",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function layout(title, body, extraHead = "") {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${escapeHtml(title)}</title>
<style>
:root{
  --bg:#f4f7fb;
  --card:#fff;
  --text:#172033;
  --muted:#697386;
  --line:#dfe5ee;
  --accent:#2563eb;
  --accent2:#1d4ed8;
  --ok:#0f9f6e;
  --danger:#dc2626;
  --warn:#d97706;
}
*{box-sizing:border-box}
body{
  margin:0;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans JP",sans-serif;
  background:var(--bg);
  color:var(--text);
}
.wrap{max-width:760px;margin:0 auto;padding:18px 14px 48px}
.hero{
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:#fff;
  padding:24px 18px;
  border-radius:22px;
  margin-bottom:16px;
  box-shadow:0 10px 30px rgba(37,99,235,.18);
}
.hero h1{font-size:28px;margin:0 0 6px}
.hero p{margin:0;opacity:.9}
.card{
  background:var(--card);
  border:1px solid var(--line);
  border-radius:18px;
  padding:16px;
  margin-bottom:14px;
  box-shadow:0 4px 16px rgba(15,23,42,.04);
}
label{display:block;font-weight:700;margin:0 0 7px}
input,select,textarea,button{
  width:100%;
  font-size:16px;
  border-radius:12px;
}
input,select,textarea{
  border:1px solid #cfd7e3;
  background:#fff;
  padding:13px 12px;
  margin-bottom:14px;
}
textarea{min-height:100px;resize:vertical}
.row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.choice{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-bottom:14px;
}
.choice button{
  padding:14px 10px;
  border:1px solid var(--line);
  background:#fff;
  font-weight:800;
}
.choice button.active.available{background:#ecfdf5;border-color:#10b981;color:#047857}
.choice button.active.off{background:#fef2f2;border-color:#ef4444;color:#b91c1c}
.primary{
  border:0;
  background:var(--accent);
  color:#fff;
  padding:15px 14px;
  font-weight:800;
}
.primary:active{background:var(--accent2)}
.secondary{
  border:1px solid var(--line);
  background:#fff;
  color:var(--text);
  padding:12px 14px;
  font-weight:700;
}
.small{font-size:13px;color:var(--muted)}
.msg{display:none;padding:13px;border-radius:12px;margin-top:12px;font-weight:700}
.msg.ok{display:block;background:#ecfdf5;color:#047857}
.msg.err{display:block;background:#fef2f2;color:#b91c1c}
.topnav{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:14px}
.topnav a{text-decoration:none;color:var(--accent);font-weight:700}
.filters{display:grid;grid-template-columns:1fr auto;gap:8px}
.day{
  background:#fff;
  border:1px solid var(--line);
  border-radius:16px;
  margin-bottom:12px;
  overflow:hidden;
}
.dayhead{
  padding:14px 15px;
  font-size:18px;
  font-weight:900;
  background:#f8fafc;
  border-bottom:1px solid var(--line);
}
.person{padding:13px 15px;border-bottom:1px solid #eef2f7}
.person:last-child{border-bottom:0}
.person .name{font-weight:900;font-size:17px}
.badge{
  display:inline-block;
  padding:3px 8px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  margin-left:6px;
}
.badge.available{background:#dcfce7;color:#166534}
.badge.off{background:#fee2e2;color:#991b1b}
.meta{margin-top:5px;color:#475569}
.note{margin-top:5px;color:#64748b;white-space:pre-wrap}
.empty{padding:18px;text-align:center;color:var(--muted)}
.login{max-width:440px;margin:60px auto}
.danger{
  border:1px solid #fecaca;
  background:#fff;
  color:#b91c1c;
  padding:8px 10px;
  width:auto;
  font-size:13px;
  font-weight:800;
}
@media(max-width:520px){
  .row{grid-template-columns:1fr}
  .hero h1{font-size:24px}
}
</style>
${extraHead}
</head>
<body>${body}</body></html>`;
}


function staffPage() {
  const body = `
  <div class="wrap">
    <section class="hero">
      <h1>シフト希望提出</h1>
      <p>カレンダーから複数の日付を選び、まとめて送信できます。</p>
    </section>

    <section class="card">
      <label for="name">名前</label>
      <input id="name" autocomplete="name" placeholder="例：山田 太郎">

      <label>希望日を選択</label>
      <div class="calendar-head">
        <button type="button" class="secondary" id="prevMonth">‹</button>
        <div id="monthTitle" class="month-title"></div>
        <button type="button" class="secondary" id="nextMonth">›</button>
      </div>
      <div class="weekday-row">
        <div>日</div><div>月</div><div>火</div><div>水</div><div>木</div><div>金</div><div>土</div>
      </div>
      <div id="calendar" class="calendar"></div>
      <p class="small">日付をタップすると選択／解除できます。複数選択できます。</p>

      <div class="row" style="margin-top:10px">
        <button type="button" class="secondary" id="copyTime">最初の時間を全日にコピー</button>
        <button type="button" class="secondary" id="clearAll">選択を全部解除</button>
      </div>
    </section>

    <div id="selectedArea"></div>

    <section class="card">
      <button class="primary" id="submitAll" type="button">選択した日をまとめて送信</button>
      <div id="message" class="msg"></div>
    </section>

    <p class="small" style="text-align:center">
      同じ名前・同じ日付で再送信すると、その日の内容は最新の内容に更新されます。
    </p>
  </div>

<style>
.calendar-head{display:grid;grid-template-columns:56px 1fr 56px;gap:8px;align-items:center;margin-bottom:10px}
.month-title{text-align:center;font-weight:900;font-size:19px}
.weekday-row,.calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.weekday-row{margin-bottom:6px;color:var(--muted);font-size:12px;text-align:center;font-weight:700}
.calendar-day{aspect-ratio:1/1;border:1px solid var(--line);background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:800;cursor:pointer}
.calendar-day.selected{background:#dbeafe;border-color:#2563eb;color:#1d4ed8}
.calendar-day.today{box-shadow:inset 0 0 0 2px #93c5fd}
.selected-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px;margin-bottom:14px}
.selected-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.selected-title strong{font-size:18px}
.remove-day{width:auto;border:0;background:transparent;color:#dc2626;font-weight:800;padding:4px 8px}

/* compact mobile layout */
.selected-card{
  padding:12px;
  margin-bottom:10px;
  border-radius:14px;
}
.selected-title{
  margin-bottom:8px;
}
.selected-title strong{
  font-size:17px;
}
.selected-card .choice{
  gap:8px;
  margin-bottom:10px;
}
.selected-card .choice button{
  padding:10px 8px;
  font-size:15px;
}
.selected-card .time-area label,
.selected-card > label{
  margin-bottom:5px;
}
.selected-card .row{
  grid-template-columns:1fr 1fr !important;
  gap:8px;
}
.selected-card input{
  padding:10px 8px;
  margin-bottom:10px;
}
.selected-card textarea{
  min-height:66px;
  height:66px;
  padding:10px;
  margin-bottom:0;
}
.remove-day{
  font-size:14px;
}

</style>

<script>
const calendarEl = document.getElementById('calendar');
const monthTitle = document.getElementById('monthTitle');
const selectedArea = document.getElementById('selectedArea');
const message = document.getElementById('message');

const today = new Date();
today.setHours(0,0,0,0);

let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
const selected = new Map();

function fmtDate(date){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+d;
}
function labelDate(iso){
  const d = new Date(iso+'T00:00:00');
  return new Intl.DateTimeFormat('ja-JP',{year:'numeric',month:'numeric',day:'numeric',weekday:'short'}).format(d);
}
function renderCalendar(){
  monthTitle.textContent = viewYear+'年 '+(viewMonth+1)+'月';
  calendarEl.innerHTML = '';
  const first = new Date(viewYear, viewMonth, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();

  for(let i=0;i<startDay;i++) calendarEl.appendChild(document.createElement('div'));

  for(let day=1; day<=daysInMonth; day++){
    const d = new Date(viewYear, viewMonth, day);
    const iso = fmtDate(d);
    const btn = document.createElement('button');
    btn.type='button';
    btn.className='calendar-day';
    btn.textContent=day;
    if(d.getTime()===today.getTime()) btn.classList.add('today');
    if(selected.has(iso)) btn.classList.add('selected');
    btn.addEventListener('click',()=>{
      if(selected.has(iso)) selected.delete(iso);
      else selected.set(iso,{status:'available',start_time:'',end_time:'',note:''});
      renderCalendar();
      renderSelected();
    });
    calendarEl.appendChild(btn);
  }
}
function renderSelected(){
  const dates = [...selected.keys()].sort();
  if(!dates.length){
    selectedArea.innerHTML='<section class="card empty">まだ日付が選択されていません。</section>';
    return;
  }
  selectedArea.innerHTML = dates.map(iso=>{
    const item = selected.get(iso);
    return '<section class="selected-card" data-date="'+iso+'">'
      + '<div class="selected-title"><strong>'+labelDate(iso)+'</strong><button type="button" class="remove-day">削除</button></div>'
      + '<div class="choice">'
      + '<button type="button" class="available '+(item.status==='available'?'active':'')+'" data-action="available">出勤できます</button>'
      + '<button type="button" class="off '+(item.status==='off'?'active':'')+'" data-action="off">休み希望</button>'
      + '</div>'
      + '<div class="time-area" style="'+(item.status==='off'?'display:none':'')+'">'
      + '<label>希望時間</label><div class="row">'
      + '<input class="startTime" type="time" value="'+(item.start_time||'')+'" aria-label="開始時間">'
      + '<input class="endTime" type="time" value="'+(item.end_time||'')+'" aria-label="終了時間">'
      + '</div></div>'
      + '<label>備考</label>'
      + '<textarea class="note" placeholder="例：17時まで／時間相談可 など">'+(item.note||'')+'</textarea>'
      + '</section>';
  }).join('');

  document.querySelectorAll('.selected-card').forEach(card=>{
    const iso = card.dataset.date;
    const item = selected.get(iso);
    const availableBtn = card.querySelector('[data-action="available"]');
    const offBtn = card.querySelector('[data-action="off"]');
    const startInput = card.querySelector('.startTime');
    const endInput = card.querySelector('.endTime');
    const noteInput = card.querySelector('.note');

    availableBtn.addEventListener('click',()=>{item.status='available';renderSelected();renderCalendar();});
    offBtn.addEventListener('click',()=>{item.status='off';item.start_time='';item.end_time='';renderSelected();renderCalendar();});
    startInput.addEventListener('change',()=>item.start_time=startInput.value);
    endInput.addEventListener('change',()=>item.end_time=endInput.value);
    noteInput.addEventListener('input',()=>item.note=noteInput.value);
    card.querySelector('.remove-day').addEventListener('click',()=>{selected.delete(iso);renderSelected();renderCalendar();});
  });
}

document.getElementById('prevMonth').addEventListener('click',()=>{
  viewMonth--; if(viewMonth<0){viewMonth=11;viewYear--;} renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click',()=>{
  viewMonth++; if(viewMonth>11){viewMonth=0;viewYear++;} renderCalendar();
});
document.getElementById('clearAll').addEventListener('click',()=>{
  selected.clear(); renderSelected(); renderCalendar();
});
document.getElementById('copyTime').addEventListener('click',()=>{
  const dates=[...selected.keys()].sort();
  if(!dates.length){
    message.className='msg err'; message.textContent='先に日付を選択してください。'; return;
  }
  const source = dates.map(d=>selected.get(d)).find(v=>v.status==='available' && (v.start_time || v.end_time));
  if(!source){
    message.className='msg err'; message.textContent='まず1日分の希望時間を入力してください。'; return;
  }
  dates.forEach(d=>{
    const item=selected.get(d);
    if(item.status==='available'){item.start_time=source.start_time;item.end_time=source.end_time;}
  });
  message.className='msg ok'; message.textContent='希望時間を出勤可能日の全日にコピーしました。';
  renderSelected();
});
document.getElementById('submitAll').addEventListener('click', async ()=>{
  const name=document.getElementById('name').value.trim();
  const dates=[...selected.keys()].sort();
  message.className='msg'; message.textContent='';

  if(!name){message.className='msg err';message.textContent='名前を入力してください。';return;}
  if(!dates.length){message.className='msg err';message.textContent='少なくとも1日選択してください。';return;}

  const items=dates.map(date=>{
    const v=selected.get(date);
    return {date,status:v.status,start_time:v.status==='available'?v.start_time:'',end_time:v.status==='available'?v.end_time:'',note:v.note||''};
  });

  try{
    const res=await fetch('/api/multi',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,items})});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'送信に失敗しました');
    message.className='msg ok';
    message.textContent=items.length+'日分をまとめて送信しました。';
  }catch(err){
    message.className='msg err';
    message.textContent=err.message||'送信に失敗しました';
  }
});

renderCalendar();
renderSelected();
</script>`;
  return new Response(layout("シフト希望提出", body), { headers: HTML_HEADERS });
}

function adminLoginPage(error = "") {
  const body = `
  <div class="wrap">
    <div class="login">
      <section class="hero">
        <h1>管理画面</h1>
        <p>管理者パスワードを入力してください。</p>
      </section>
      <section class="card">
        <form method="post" action="/admin/login">
          <label for="password">パスワード</label>
          <input id="password" name="password" type="password" required>
          <button class="primary" type="submit">ログイン</button>
          ${error ? `<div class="msg err">${escapeHtml(error)}</div>` : ""}
        </form>
      </section>
    </div>
  </div>`;
  return new Response(layout("管理画面ログイン", body), { headers: HTML_HEADERS });
}

async function hashText(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function isAdmin(request, env) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/shift_admin=([^;]+)/);
  if (!match || !env.ADMIN_PASSWORD) return false;
  const expected = await hashText(env.ADMIN_PASSWORD);
  return match[1] === expected;
}

async function adminPage(request, env) {
  const url = new URL(request.url);
  const month = url.searchParams.get("month") || new Date().toISOString().slice(0, 7);

  const rows = await env.DB.prepare(`
    SELECT id, name, shift_date, status, start_time, end_time, note, updated_at
    FROM shift_requests
    WHERE substr(shift_date,1,7) = ?
    ORDER BY shift_date ASC,
      CASE WHEN status='available' THEN 0 ELSE 1 END,
      start_time ASC,
      name ASC
  `).bind(month).all();

  const grouped = {};
  for (const r of rows.results || []) {
    (grouped[r.shift_date] ||= []).push(r);
  }

  const days = Object.entries(grouped).map(([date, people]) => {
    const d = new Date(date + "T00:00:00");
    const label = new Intl.DateTimeFormat("ja-JP", {
      month: "long", day: "numeric", weekday: "short"
    }).format(d);

    const items = people.map(p => `
      <div class="person">
        <div>
          <span class="name">${escapeHtml(p.name)}</span>
          <span class="badge ${p.status === "available" ? "available" : "off"}">
            ${p.status === "available" ? "出勤可" : "休み"}
          </span>
        </div>
        <div class="meta">
          ${p.status === "available"
            ? (p.start_time || p.end_time
              ? `${escapeHtml(p.start_time || "未定")} 〜 ${escapeHtml(p.end_time || "未定")}`
              : "希望時間：未指定")
            : "休み希望"}
        </div>
        ${p.note ? `<div class="note">備考：${escapeHtml(p.note)}</div>` : ""}
        <div style="margin-top:8px">
          <button class="danger" onclick="deleteEntry(${p.id})">削除</button>
        </div>
      </div>
    `).join("");

    return `<section class="day"><div class="dayhead">${escapeHtml(label)}</div>${items}</section>`;
  }).join("");

  const body = `
  <div class="wrap">
    <div class="topnav">
      <div>
        <h1 style="margin:0">シフト希望 管理</h1>
        <div class="small">日付ごとに出勤可能者・休み希望を確認できます。</div>
      </div>
    </div>

    <section class="card">
      <form method="get" action="/admin" class="filters">
        <input type="month" name="month" value="${escapeHtml(month)}" style="margin:0">
        <button class="secondary" type="submit">表示</button>
      </form>
    </section>

    ${days || '<section class="card empty">この月の提出はまだありません。</section>'}
  </div>

<script>
async function deleteEntry(id){
  if(!confirm('この提出を削除しますか？')) return;
  const res = await fetch('/api/admin/delete?id='+encodeURIComponent(id), {method:'POST'});
  if(res.ok) location.reload();
  else alert('削除できませんでした');
}
</script>`;

  return new Response(layout("シフト希望 管理", body), { headers: HTML_HEADERS });
}


async function handleApiMulti(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let data;
  try { data = await request.json(); }
  catch { return json({ error: "入力内容を読み取れませんでした" }, 400); }

  const name = String(data.name || "").trim();
  const items = Array.isArray(data.items) ? data.items : [];
  if (!name) return json({ error: "名前を入力してください" }, 400);
  if (name.length > 80) return json({ error: "名前が長すぎます" }, 400);
  if (!items.length) return json({ error: "日付を選択してください" }, 400);
  if (items.length > 62) return json({ error: "一度に送信できる日数が多すぎます" }, 400);

  const stmts = [];
  for (const item of items) {
    const date = String(item.date || "").trim();
    const status = item.status === "off" ? "off" : "available";
    const start = status === "available" ? String(item.start_time || "").trim() : "";
    const end = status === "available" ? String(item.end_time || "").trim() : "";
    const note = String(item.note || "").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "日付データに不備があります" }, 400);
    if (note.length > 500) return json({ error: "備考が長すぎます" }, 400);

    stmts.push(env.DB.prepare(`
      INSERT INTO shift_requests (name, shift_date, status, start_time, end_time, note, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+9 hours'))
      ON CONFLICT(name, shift_date) DO UPDATE SET
        status=excluded.status,
        start_time=excluded.start_time,
        end_time=excluded.end_time,
        note=excluded.note,
        updated_at=datetime('now', '+9 hours')
    `).bind(name, date, status, start, end, note));
  }
  await env.DB.batch(stmts);
  return json({ ok: true, count: items.length });
}

async function handleApiWeek(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "入力内容を読み取れませんでした" }, 400);
  }

  const name = String(data.name || "").trim();
  const items = Array.isArray(data.items) ? data.items : [];

  if (!name) return json({ error: "名前を入力してください" }, 400);
  if (name.length > 80) return json({ error: "名前が長すぎます" }, 400);
  if (items.length !== 7) return json({ error: "7日分のデータが必要です" }, 400);

  const stmts = [];

  for (const item of items) {
    const date = String(item.date || "").trim();
    const status = item.status === "off" ? "off" : "available";
    const start = status === "available" ? String(item.start_time || "").trim() : "";
    const end = status === "available" ? String(item.end_time || "").trim() : "";
    const note = String(item.note || "").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return json({ error: "日付データに不備があります" }, 400);
    }
    if (note.length > 500) {
      return json({ error: "備考が長すぎます" }, 400);
    }

    stmts.push(
      env.DB.prepare(`
        INSERT INTO shift_requests (name, shift_date, status, start_time, end_time, note, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+9 hours'))
        ON CONFLICT(name, shift_date) DO UPDATE SET
          status=excluded.status,
          start_time=excluded.start_time,
          end_time=excluded.end_time,
          note=excluded.note,
          updated_at=datetime('now', '+9 hours')
      `).bind(name, date, status, start, end, note)
    );
  }

  await env.DB.batch(stmts);
  return json({ ok: true, count: 7 });
}

async function handleApiShift(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "入力内容を読み取れませんでした" }, 400);
  }

  const name = String(data.name || "").trim();
  const date = String(data.date || "").trim();
  const status = data.status === "off" ? "off" : "available";
  const start = status === "available" ? String(data.start_time || "").trim() : "";
  const end = status === "available" ? String(data.end_time || "").trim() : "";
  const note = String(data.note || "").trim();

  if (!name) return json({ error: "名前を入力してください" }, 400);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "日付を選択してください" }, 400);
  if (name.length > 80 || note.length > 500) return json({ error: "入力が長すぎます" }, 400);

  await env.DB.prepare(`
    INSERT INTO shift_requests (name, shift_date, status, start_time, end_time, note, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+9 hours'))
    ON CONFLICT(name, shift_date) DO UPDATE SET
      status=excluded.status,
      start_time=excluded.start_time,
      end_time=excluded.end_time,
      note=excluded.note,
      updated_at=datetime('now', '+9 hours')
  `).bind(name, date, status, start, end, note).run();

  return json({ ok: true });
}

async function handleAdminLogin(request, env) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!env.ADMIN_PASSWORD) {
    return adminLoginPage("Cloudflare側で ADMIN_PASSWORD を設定してください。");
  }
  const form = await request.formData();
  const password = String(form.get("password") || "");
  if (password !== env.ADMIN_PASSWORD) return adminLoginPage("パスワードが違います。");

  const token = await hashText(env.ADMIN_PASSWORD);
  return new Response(null, {
    status: 302,
    headers: {
      location: "/admin",
      "set-cookie": `shift_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
    }
  });
}

async function handleAdminDelete(request, env) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return json({ error: "Invalid id" }, 400);
  await env.DB.prepare("DELETE FROM shift_requests WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/") return staffPage();
      if (url.pathname === "/api/shift") return handleApiShift(request, env);
      if (url.pathname === "/api/week") return handleApiWeek(request, env);
      if (url.pathname === "/api/multi") return handleApiMulti(request, env);

      if (url.pathname === "/api/admin/delete") return handleAdminDelete(request, env);
      if (url.pathname === "/admin") return adminPage(request, env);

      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return json({ error: "サーバーエラーが発生しました", detail: String(err?.message || err) }, 500);
    }
  }
};
