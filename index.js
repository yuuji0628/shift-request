
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
      <p>名前・日付・希望時間・休み・備考を入力して送信してください。</p>
    </section>

    <section class="card">
      <form id="shiftForm">
        <label for="name">名前</label>
        <input id="name" name="name" autocomplete="name" placeholder="例：山田 太郎" required>

        <label for="date">日付</label>
        <input id="date" name="date" type="date" required>

        <label>希望</label>
        <div class="choice">
          <button type="button" id="availableBtn" class="available active">出勤できます</button>
          <button type="button" id="offBtn" class="off">休み希望</button>
        </div>
        <input type="hidden" id="status" name="status" value="available">

        <div id="timeArea">
          <label>希望時間</label>
          <div class="row">
            <div>
              <input id="startTime" type="time" aria-label="開始時間">
            </div>
            <div>
              <input id="endTime" type="time" aria-label="終了時間">
            </div>
          </div>
          <p class="small" style="margin-top:-8px">時間が決まっていない場合は空欄でも送信できます。</p>
        </div>

        <label for="note">備考</label>
        <textarea id="note" placeholder="例：学校行事のため17時まで／時間は相談可能 など"></textarea>

        <button class="primary" type="submit">この内容で送信する</button>
        <div id="message" class="msg"></div>
      </form>
    </section>

    <p class="small" style="text-align:center">送信後に内容を変更したい場合は、同じ名前・同じ日付で再送信してください。最新内容に更新されます。</p>
  </div>

<script>
const availableBtn = document.getElementById('availableBtn');
const offBtn = document.getElementById('offBtn');
const statusInput = document.getElementById('status');
const timeArea = document.getElementById('timeArea');
const message = document.getElementById('message');

function setStatus(status){
  statusInput.value = status;
  availableBtn.classList.toggle('active', status === 'available');
  offBtn.classList.toggle('active', status === 'off');
  timeArea.style.display = status === 'available' ? 'block' : 'none';
}
availableBtn.addEventListener('click', ()=>setStatus('available'));
offBtn.addEventListener('click', ()=>setStatus('off'));

document.getElementById('shiftForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  message.className='msg';
  message.textContent='';
  const payload = {
    name: document.getElementById('name').value.trim(),
    date: document.getElementById('date').value,
    status: statusInput.value,
    start_time: statusInput.value === 'available' ? document.getElementById('startTime').value : '',
    end_time: statusInput.value === 'available' ? document.getElementById('endTime').value : '',
    note: document.getElementById('note').value.trim()
  };
  try{
    const res = await fetch('/api/shift', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(payload)
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || '送信に失敗しました');
    message.className='msg ok';
    message.textContent='送信しました。ありがとうございます！';
    document.getElementById('date').value='';
    document.getElementById('startTime').value='';
    document.getElementById('endTime').value='';
    document.getElementById('note').value='';
    setStatus('available');
  }catch(err){
    message.className='msg err';
    message.textContent=err.message || '送信に失敗しました';
  }
});
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

      if (url.pathname === "/api/admin/delete") return handleAdminDelete(request, env);
      if (url.pathname === "/admin") return adminPage(request, env);

      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return json({ error: "サーバーエラーが発生しました", detail: String(err?.message || err) }, 500);
    }
  }
};
