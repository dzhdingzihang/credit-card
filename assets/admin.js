const loginForm = document.querySelector("#adminLogin");
const statusEl = document.querySelector("#adminStatus");
const statsEl = document.querySelector("#adminStats");
const consumerTable = document.querySelector("#consumerTable");
const managerTable = document.querySelector("#managerTable");

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function time(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function renderStats(stats) {
  statsEl.hidden = false;
  statsEl.innerHTML = `
    <article><span>总报名</span><strong>${stats.totalCount}</strong></article>
    <article><span>C 端线索</span><strong>${stats.consumerCount}</strong></article>
    <article><span>B 端经理</span><strong>${stats.managerCount}</strong></article>
  `;
}

function renderTable(target, title, rows, columns) {
  target.hidden = false;
  target.innerHTML = `
    <div class="admin-table-head">
      <h2>${title}</h2>
      <span>${rows.length} 条</span>
    </div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>${columns.map((col) => `<th>${col.label}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((row) => `
            <tr>${columns.map((col) => `<td>${esc(col.render ? col.render(row) : row[col.key])}</td>`).join("")}</tr>
          `).join("") : `<tr><td colspan="${columns.length}">暂无数据</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

async function loadAdmin(token) {
  statusEl.textContent = "正在读取后台数据...";
  const response = await fetch(`/api/kahuasuan/admin?token=${encodeURIComponent(token)}`, { cache: "no-store" });
  if (!response.ok) throw new Error("口令错误或后台不可访问");
  return response.json();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = loginForm.token.value.trim();

  try {
    const data = await loadAdmin(token);
    sessionStorage.setItem("khs_admin_token", token);
    statusEl.textContent = "已进入后台，数据来自本地 JSON 存储。";
    renderStats(data.stats);
    renderTable(consumerTable, "C 端申办线索", data.consumerLeads, [
      { label: "时间", render: (row) => time(row.createdAt) },
      { label: "产品", key: "productName" },
      { label: "姓名", key: "name" },
      { label: "电话", key: "phone" },
      { label: "公司", key: "company" },
      { label: "职级", key: "level" },
      { label: "园区", key: "campus" },
      { label: "备注", key: "note" },
    ]);
    renderTable(managerTable, "B 端银行经理报名", data.managerSignups, [
      { label: "时间", render: (row) => time(row.createdAt) },
      { label: "经理", key: "managerName" },
      { label: "电话", key: "phone" },
      { label: "银行", key: "bank" },
      { label: "分支行", key: "branch" },
      { label: "城市", key: "city" },
      { label: "产品", key: "products" },
      { label: "园区", key: "serviceArea" },
      { label: "活动方案", key: "activityPlan" },
    ]);
  } catch (error) {
    statusEl.textContent = error.message;
    statsEl.hidden = true;
    consumerTable.hidden = true;
    managerTable.hidden = true;
  }
});

const savedToken = sessionStorage.getItem("khs_admin_token");
if (savedToken) {
  loginForm.token.value = savedToken;
  loginForm.requestSubmit();
}
