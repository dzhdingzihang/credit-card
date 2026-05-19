const STORAGE_KEY = "khs_elite_profile";

const cards = [
  {
    id: "cmb-classic",
    bank: "招商银行",
    city: "杭州",
    name: "经典白大厂内推版",
    level: "P7+ 优先",
    value: 3800,
    verified: true,
    tags: ["机场贵宾", "高端酒店", "体检绿通"],
    desc: "适合高频差旅与高净值消费，支持资产达标免年费咨询。",
  },
  {
    id: "ccb-mountain",
    bank: "建设银行",
    city: "杭州",
    name: "大山白园区专项",
    level: "P7/L8 可约",
    value: 3200,
    verified: true,
    tags: ["医疗绿通", "接送机", "积分加速"],
    desc: "西溪、滨江园区经理上门面签，批核链路更短。",
  },
  {
    id: "cib-tech",
    bank: "兴业银行",
    city: "上海",
    name: "新锐精英白金卡",
    level: "P5-P6 友好",
    value: 2100,
    verified: true,
    tags: ["新客礼包", "消费返现", "里程兑换"],
    desc: "大厂社保与公积金辅助授信，适合新入职精英快速提额。",
  },
  {
    id: "icbc-xixi",
    bank: "工商银行",
    city: "北京",
    name: "数字精英专属金卡",
    level: "白名单园区",
    value: 1800,
    verified: true,
    tags: ["园区礼遇", "餐饮满减", "账单分期"],
    desc: "覆盖重点互联网园区，权益偏日常消费与活动聚合。",
  },
];

const wealthProducts = [
  {
    id: "cd-300",
    type: "大额存单",
    name: "杭州银行高净值 3 年期",
    rate: "3.45%",
    amount: "20万起",
    monthly: "存 50 万预计月息约 1437 元",
    risk: "存款保险保障范围内",
  },
  {
    id: "flex-90",
    type: "灵活理财",
    name: "宁波银行精英 90 天",
    rate: "2.88%",
    amount: "5万起",
    monthly: "存 30 万预计月息约 720 元",
    risk: "中低风险，适合备用金",
  },
  {
    id: "fund-pro",
    type: "专家定投",
    name: "科技成长稳健组合",
    rate: "目标 6%+",
    amount: "1000元起",
    monthly: "适合奖金与月度结余分批配置",
    risk: "净值波动，经理一对一说明",
  },
];

const loans = [
  {
    id: "talent-loan",
    name: "杭州人才专项贷",
    label: "大厂内推版",
    rate: "2.58%",
    limit: "100万",
    bank: "宁波银行",
    requirements: ["A-E 类人才优先", "杭州社保 6 个月+", "P6/L7 及以上更优"],
  },
  {
    id: "fund-loan",
    name: "公积金极速周转",
    label: "公积金极速版",
    rate: "2.88%",
    limit: "80万",
    bank: "杭州银行",
    requirements: ["连续缴纳 12 个月", "月缴存 1800 元+", "支持滨江/西溪园区"],
  },
  {
    id: "consumption",
    name: "精英消费备用金",
    label: "白名单邀请",
    rate: "3.12%",
    limit: "50万",
    bank: "工商银行",
    requirements: ["大厂在职证明", "征信近 6 个月良好", "最快当日预审"],
  },
];

const activities = [
  {
    type: "办卡奖励",
    name: "兴业大厂绑定福利",
    value: "¥500",
    action: "点击领取",
    date: "5月专场",
  },
  {
    type: "消费返现",
    name: "滨江园区午餐返现",
    value: "¥120",
    action: "自动生效",
    date: "每周三",
  },
  {
    type: "周边特惠",
    name: "西溪银泰停车权益",
    value: "¥300",
    action: "到店出示",
    date: "长期有效",
  },
  {
    type: "理财礼遇",
    name: "大额存单加息券",
    value: "¥800",
    action: "点击领取",
    date: "限 200 份",
  },
];

const companies = ["阿里巴巴", "蚂蚁集团", "字节跳动", "网易", "华为", "腾讯", "小红书", "其他大厂"];
const campuses = ["阿里西溪园区", "蚂蚁 Z 空间", "滨江园区", "未来科技城", "上海张江", "北京望京", "其他园区"];
const partnerBanks = ["招商银行", "建设银行", "兴业银行", "工商银行", "农业银行", "杭州银行", "宁波银行", "其他银行"];
const filters = {
  city: ["全部", "杭州", "上海", "北京"],
  bank: ["全部", "招商银行", "建设银行", "兴业银行", "工商银行"],
  activity: ["全部", "办卡奖励", "消费返现", "周边特惠", "理财礼遇"],
};

const root = document.querySelector("#appRoot");
const nav = document.querySelector("#appNav");
const dockItems = document.querySelectorAll(".dock-item");
let route = "index";
let cardFilter = { city: "全部", bank: "全部" };
let activityFilter = "全部";

function profile() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function saveProfile(form) {
  const phone = form.phone.value.trim();
  const maskedPhone = phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
  const payload = {
    name: form.name.value.trim().slice(0, 1) ? `${form.name.value.trim().slice(0, 1)}先生/女士` : "已认证用户",
    phone: maskedPhone,
    company: form.company.value,
    level: form.level.value.trim().toUpperCase(),
    campus: form.campus.value,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

function yuan(value) {
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(value);
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("提交服务暂不可用");
  return response.json();
}

function consumerPayloadFromProfile(saved, productName) {
  return {
    productName,
    name: saved?.name || "",
    phone: saved?.phone || "",
    company: saved?.company || "",
    level: saved?.level || "",
    campus: saved?.campus || "",
    note: "使用本机已认证信息一键申办",
  };
}

async function submitConsumerLead(payload) {
  try {
    await postJson("/api/kahuasuan/leads/", payload);
    return true;
  } catch {
    const localLeads = JSON.parse(localStorage.getItem("khs_pending_leads") || "[]");
    localLeads.unshift({ ...payload, createdAt: new Date().toISOString(), pending: true });
    localStorage.setItem("khs_pending_leads", JSON.stringify(localLeads.slice(0, 20)));
    return false;
  }
}

function go(nextRoute, params = {}) {
  route = nextRoute;
  render(params);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function applyFor(productName) {
  const saved = profile();
  if (saved) {
    submitConsumerLead(consumerPayloadFromProfile(saved, productName));
    go("success", { productName, saved });
  } else {
    go("apply", { productName });
  }
}

function routeButton(routeName, label, extra = "") {
  return `<button class="primary-button ${extra}" type="button" data-route="${routeName}">${label}</button>`;
}

function hero() {
  return `
    <section class="hero-section">
      <div class="hero-visual" aria-hidden="true">
        <div class="glass-card card-a">
          <span>Elite Credit</span>
          <strong>¥300,000</strong>
        </div>
        <div class="glass-card card-b">
          <span>Yield Desk</span>
          <strong>3.45%</strong>
        </div>
      </div>
      <div class="hero-content">
        <p>大厂精英专属通道</p>
        <h1>卡划算</h1>
        <strong>金融头等舱 · 极速内推申办</strong>
        <div class="hero-actions">
          ${routeButton("apply", "立即认证")}
          <button class="ghost-button" type="button" data-route="cards">查看榜单</button>
        </div>
      </div>
    </section>
  `;
}

function quickActions() {
  const items = [
    ["cards", "▣", "办卡"],
    ["loan", "¥", "贷款"],
    ["wealth", "%", "理财"],
    ["activities", "✦", "活动"],
    ["manager", "＋", "经理"],
  ];
  return `
    <section class="quick-grid" aria-label="核心入口">
      ${items.map(([to, icon, label]) => `
        <button class="quick-item" type="button" data-route="${to}">
          <span aria-hidden="true">${icon}</span>
          ${label}
        </button>
      `).join("")}
    </section>
  `;
}

function banners() {
  return `
    <section class="banner-rail">
      <article class="promo-banner blue">
        <span>兴业银行</span>
        <h2>大厂绑定福利</h2>
        <p>新客礼包 + 高倍积分，杭州园区经理快速响应。</p>
        <button type="button" data-apply="兴业大厂绑定福利">预约申办</button>
      </article>
      <article class="promo-banner green">
        <span>农业银行</span>
        <h2>精英白金专场</h2>
        <p>P7+/L8+ 优先评估，高端权益人工核实。</p>
        <button type="button" data-apply="农行精英白金专场">获取名额</button>
      </article>
      <article class="promo-banner dark">
        <span>银行经理合作</span>
        <h2>报名上架活动</h2>
        <p>提交分行、产品和服务园区，我会联系你配置活动。</p>
        <button type="button" data-route="manager">经理报名</button>
      </article>
    </section>
  `;
}

function partnerCta() {
  return `
    <section class="partner-cta">
      <div>
        <span>Bank Partner</span>
        <h2>银行经理报名入口</h2>
        <p>有大厂专属卡、低息贷、园区福利或理财活动，可以报名让我联系你上架。</p>
      </div>
      <button class="primary-button" type="button" data-route="manager">提交活动</button>
    </section>
  `;
}

function productList() {
  const featured = cards.slice(0, 2);
  return `
    <section class="section-block">
      <div class="section-title">
        <p>Privilege Feed</p>
        <h2>今日值得办</h2>
      </div>
      <div class="compact-list">
        ${featured.map(cardTemplate).join("")}
      </div>
    </section>
  `;
}

function cardTemplate(item) {
  return `
    <article class="product-card">
      <div class="card-topline">
        <span class="bank-badge">${item.bank}</span>
        ${item.verified ? '<span class="verified">人工已核实</span>' : ""}
      </div>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="metric-row">
        <div>
          <span>年获益预估</span>
          <strong>${yuan(item.value)}</strong>
        </div>
        <div>
          <span>准入提示</span>
          <strong>${item.level}</strong>
        </div>
      </div>
      <div class="tag-row">
        ${item.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
      <button class="primary-button full" type="button" data-apply="${item.name}">极速申办</button>
    </article>
  `;
}

function renderIndex() {
  root.innerHTML = hero() + quickActions() + banners() + partnerCta() + productList();
}

function filterTabs(kind, active) {
  return `
    <div class="filter-row" data-filter-kind="${kind}">
      ${filters[kind].map((item) => `
        <button class="${item === active ? "active" : ""}" type="button" data-filter="${item}">${item}</button>
      `).join("")}
    </div>
  `;
}

function renderCards() {
  const visible = cards.filter((item) => {
    const cityOk = cardFilter.city === "全部" || item.city === cardFilter.city;
    const bankOk = cardFilter.bank === "全部" || item.bank === cardFilter.bank;
    return cityOk && bankOk;
  });

  root.innerHTML = `
    <section class="page-head">
      <p>2026 大厂精英必办榜单</p>
      <h1>信用卡探索</h1>
      <span>城市和银行双维筛选，优先展示人工核实权益。</span>
    </section>
    ${filterTabs("city", cardFilter.city)}
    ${filterTabs("bank", cardFilter.bank)}
    <section class="card-stack">${visible.map(cardTemplate).join("") || emptyState("暂未匹配到卡片")}</section>
  `;
}

function renderWealth() {
  root.innerHTML = `
    <section class="page-head">
      <p>High Net Worth Desk</p>
      <h1>理财探索</h1>
      <span>大额存单、灵活理财和专家定投集中比较。</span>
    </section>
    <section class="card-stack">
      ${wealthProducts.map((item) => `
        <article class="wealth-card">
          <div>
            <span class="bank-badge">${item.type}</span>
            <h3>${item.name}</h3>
            <p>${item.risk}</p>
          </div>
          <strong class="yield-rate">${item.rate}</strong>
          <div class="metric-row">
            <div>
              <span>起投金额</span>
              <strong>${item.amount}</strong>
            </div>
            <div>
              <span>收益估算</span>
              <strong>${item.monthly}</strong>
            </div>
          </div>
          <button class="primary-button full" type="button" data-apply="${item.name}">预约经理</button>
        </article>
      `).join("")}
    </section>
  `;
}

function renderLoan() {
  root.innerHTML = `
    <section class="page-head">
      <p>Fast Credit Lane</p>
      <h1>贷款超市</h1>
      <span>面向大厂员工的专项低息信贷方案。</span>
    </section>
    <section class="card-stack">
      ${loans.map((item) => `
        <article class="loan-card">
          <div class="card-topline">
            <span class="bank-badge">${item.bank}</span>
            <span class="verified">${item.label}</span>
          </div>
          <h3>${item.name}</h3>
          <div class="loan-metrics">
            <div>
              <span>最低年化</span>
              <strong>${item.rate}</strong>
            </div>
            <div>
              <span>最高额度</span>
              <strong>${item.limit}</strong>
            </div>
          </div>
          <ul class="require-list">
            ${item.requirements.map((rule) => `<li>${rule}</li>`).join("")}
          </ul>
          <button class="primary-button full" type="button" data-apply="${item.name}">极速匹配</button>
        </article>
      `).join("")}
    </section>
  `;
}

function renderActivities() {
  const visible = activities.filter((item) => activityFilter === "全部" || item.type === activityFilter);
  root.innerHTML = `
    <section class="page-head">
      <p>Hangzhou Elite Benefits</p>
      <h1>每月活动</h1>
      <span>办卡奖励、返现和园区周边福利统一领取。</span>
    </section>
    ${filterTabs("activity", activityFilter)}
    <section class="activity-list">
      ${visible.map((item) => `
        <article class="activity-item">
          <div>
            <span class="bank-badge">${item.type}</span>
            <h3>${item.name}</h3>
            <p>${item.date} · ${item.action}</p>
          </div>
          <strong>${item.value}</strong>
          <button class="icon-button small" type="button" data-apply="${item.name}" aria-label="领取${item.name}">›</button>
        </article>
      `).join("")}
    </section>
  `;
}

function renderApply(params = {}) {
  const saved = profile();
  root.innerHTML = `
    <section class="page-head">
      <p>Elite Verification</p>
      <h1>特惠申办</h1>
      <span>${params.productName ? `正在申办：${params.productName}` : "完成身份识别后，可免填写申办其他产品。"}</span>
    </section>
    ${saved ? `
      <section class="identity-card">
        <span>已认证</span>
        <h2>${saved.company} · ${saved.level}</h2>
        <p>${saved.campus} · ${saved.phone}</p>
        <button class="primary-button full" type="button" data-success="${params.productName || "专属金融特权"}">使用认证信息申办</button>
      </section>
    ` : ""}
    <form class="apply-form" id="applyForm">
      <label>真实姓名<input name="name" required autocomplete="name" placeholder="用于经理回访核验" /></label>
      <label>联系电话<input name="phone" required inputmode="tel" pattern="1[3-9][0-9]{9}" placeholder="11 位手机号" /></label>
      <label>所属大厂<select name="company" required>${companies.map((item) => `<option>${item}</option>`).join("")}</select></label>
      <label>职级等级<input name="level" required placeholder="如 P7 / L8 / 3-1" /></label>
      <label>工作园区<select name="campus" required>${campuses.map((item) => `<option>${item}</option>`).join("")}</select></label>
      <input type="hidden" name="productName" value="${params.productName || "专属金融特权"}" />
      <button class="primary-button full" type="submit">提交认证并申办</button>
      <p class="form-note">仅保存脱敏展示信息，用于本机免填写体验；正式申办以银行官方通道为准。</p>
    </form>
  `;
}

function renderManager() {
  root.innerHTML = `
    <section class="page-head">
      <p>Bank Partner</p>
      <h1>银行经理报名</h1>
      <span>提交后我会联系你，核实产品与活动，再配置到卡划算前台。</span>
    </section>
    <section class="identity-card partner-card">
      <span>适合报名</span>
      <h2>信用卡、贷款、理财、园区活动</h2>
      <p>请填写真实分行与联系方式，活动需官方通道、可核实、可服务杭州大厂园区。</p>
    </section>
    <form class="apply-form" id="managerForm">
      <label>经理姓名<input name="managerName" required autocomplete="name" placeholder="用于我回访沟通" /></label>
      <label>联系电话<input name="phone" required inputmode="tel" pattern="1[3-9][0-9]{9}" placeholder="11 位手机号" /></label>
      <label>所属银行<select name="bank" required>${partnerBanks.map((item) => `<option>${item}</option>`).join("")}</select></label>
      <label>分行/支行<input name="branch" required placeholder="如 杭州滨江支行" /></label>
      <label>服务城市<input name="city" required value="杭州" /></label>
      <label>可上架产品<input name="products" required placeholder="如 精英白金卡 / 人才贷 / 大额存单" /></label>
      <label>服务园区<input name="serviceArea" required placeholder="如 西溪、滨江、Z 空间，可上门面签" /></label>
      <label>活动方案<textarea name="activityPlan" required placeholder="写清奖励、利率、权益、有效期和准入条件"></textarea></label>
      <button class="primary-button full" type="submit">提交报名</button>
      <p class="form-note">报名数据只进入后台，不会直接展示到前台；活动上架前需要人工核实。</p>
    </form>
  `;
}

function renderManagerSuccess(params = {}) {
  root.innerHTML = `
    <section class="success-panel">
      <div class="success-check">✓</div>
      <p>报名成功</p>
      <h1>${params.bank || "银行经理"}活动已提交</h1>
      <span>我会按联系方式回访，核实产品、活动权益和服务范围后再上架。</span>
      <div class="success-actions">
        ${routeButton("index", "返回首页")}
        <button class="ghost-button" type="button" data-route="manager">继续提交</button>
      </div>
    </section>
  `;
}

function renderSuccess(params = {}) {
  const saved = params.saved || profile();
  root.innerHTML = `
    <section class="success-panel">
      <div class="success-check">✓</div>
      <p>提交成功</p>
      <h1>${params.productName || "专属金融特权"}</h1>
      <span>理财经理将在 2 个工作日内电话联系，优先匹配 ${saved?.company || "大厂"} ${saved?.campus || "园区"} 官方通道。</span>
      <div class="success-actions">
        ${routeButton("index", "返回首页")}
        <button class="ghost-button" type="button" data-route="cards">查看其它特权</button>
      </div>
    </section>
  `;
}

function renderProfile() {
  const saved = profile();
  root.innerHTML = `
    <section class="page-head">
      <p>Personal Center</p>
      <h1>我的特权</h1>
      <span>认证状态、申办记录和活动参与集中管理。</span>
    </section>
    <section class="identity-card">
      <span>${saved ? "精英认证已完成" : "尚未认证"}</span>
      <h2>${saved ? `${saved.company} · ${saved.level}` : "完成认证解锁极速申办"}</h2>
      <p>${saved ? `${saved.campus} · ${saved.phone}` : "大厂、职级、园区信息将用于特权匹配。"}</p>
      <button class="primary-button full" type="button" data-route="apply">${saved ? "更新认证" : "立即认证"}</button>
    </section>
    <section class="timeline">
      <h2>申办追踪</h2>
      <div><strong>身份核实</strong><span>${saved ? "已完成" : "待提交"}</span></div>
      <div><strong>经理分发</strong><span>${saved ? "2 个工作日内" : "认证后开启"}</span></div>
      <div><strong>官方申办</strong><span>银行经理直连</span></div>
    </section>
  `;
}

function emptyState(text) {
  return `<div class="empty-state">${text}</div>`;
}

function syncDock() {
  dockItems.forEach((item) => {
    const active = item.dataset.route === route || (route === "wealth" && item.dataset.route === "index");
    item.classList.toggle("active", active);
  });
}

function render(params = {}) {
  const pages = {
    index: renderIndex,
    cards: renderCards,
    wealth: renderWealth,
    loan: renderLoan,
    activities: renderActivities,
    apply: renderApply,
    manager: renderManager,
    managerSuccess: renderManagerSuccess,
    success: renderSuccess,
    profile: renderProfile,
  };
  (pages[route] || renderIndex)(params);
  syncDock();
}

document.addEventListener("click", (event) => {
  const routeTarget = event.target.closest("[data-route]");
  const applyTarget = event.target.closest("[data-apply]");
  const successTarget = event.target.closest("[data-success]");
  const filterTarget = event.target.closest("[data-filter]");

  if (routeTarget) {
    go(routeTarget.dataset.route);
    return;
  }

  if (applyTarget) {
    applyFor(applyTarget.dataset.apply);
    return;
  }

  if (successTarget) {
    go("success", { productName: successTarget.dataset.success, saved: profile() });
    return;
  }

  if (filterTarget) {
    const kind = filterTarget.closest("[data-filter-kind]").dataset.filterKind;
    if (kind === "city" || kind === "bank") {
      cardFilter[kind] = filterTarget.dataset.filter;
      renderCards();
    }
    if (kind === "activity") {
      activityFilter = filterTarget.dataset.filter;
      renderActivities();
    }
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "applyForm" && event.target.id !== "managerForm") return;
  event.preventDefault();

  if (event.target.id === "applyForm") {
    const saved = saveProfile(event.target);
    submitConsumerLead({
      productName: event.target.productName.value,
      name: event.target.name.value.trim(),
      phone: event.target.phone.value.trim(),
      company: event.target.company.value,
      level: event.target.level.value.trim().toUpperCase(),
      campus: event.target.campus.value,
      note: "用户提交精英认证表单",
    });
    go("success", { productName: event.target.productName.value, saved });
    return;
  }

  const form = event.target;
  postJson("/api/kahuasuan/managers/", {
    managerName: form.managerName.value.trim(),
    phone: form.phone.value.trim(),
    bank: form.bank.value,
    branch: form.branch.value.trim(),
    city: form.city.value.trim(),
    products: form.products.value.trim(),
    serviceArea: form.serviceArea.value.trim(),
    activityPlan: form.activityPlan.value.trim(),
  }).finally(() => {
    go("managerSuccess", { bank: form.bank.value });
  });
});

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 12);
});

render();
