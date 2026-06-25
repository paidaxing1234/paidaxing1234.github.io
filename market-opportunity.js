const form = document.querySelector("#plannerForm");
const output = document.querySelector("#plannerOutput");
const copyButton = document.querySelector("#copyPlan");
const randomButton = document.querySelector("#randomSeed");

let topicCache = null;
let renderTicket = 0;

const seedPresets = [
  "邮件",
  "合同",
  "发票",
  "客服",
  "销售",
  "线索评分",
  "本地化",
  "市场调研",
  "竞品监控",
  "广告素材",
  "价格监控",
  "流失预测",
];

const marketPillars = {
  b2b: ["客服", "合同", "发票", "销售", "线索", "客户成功", "流失", "调研", "竞品"],
  ecommerce: ["商品", "广告素材", "价格监控", "本地化", "评论", "SKU", "内容", "视频"],
  creator: ["写作", "配音", "剪辑", "播客", "课程", "社媒", "图片", "视频"],
  operations: ["发票", "合同", "财务", "数据", "审计", "知识库", "邮件", "呼叫"],
};

const monetizationFit = {
  adsense: ["成本", "价格", "预算", "对比", "工具", "软件", "平台", "教程"],
  affiliate: ["模板", "课程", "工具", "平台", "软件", "服务"],
  leads: ["服务", "咨询", "审计", "实施", "代理", "公司", "平台"],
};

const formatTemplates = {
  calculator: ["{seed}成本怎么算", "{seed}一个月多少钱", "{seed}预算怎么做", "{seed}怎么省钱"],
  comparison: ["{seed}工具对比", "{seed}和什么工具更好", "{seed}选型清单", "{seed}平台怎么选"],
  guide: ["{seed}入门指南", "{seed}实战清单", "{seed}最佳实践", "{seed}避坑指南"],
  faq: ["{seed}常见问题", "{seed}适合谁", "{seed}值不值得做", "{seed}怎么落地"],
};

function money(value) {
  return `$${Number(value || 0).toFixed(0)}`;
}

function uniq(list) {
  return [...new Set(list.filter(Boolean))];
}

function buildPhrases(seed, market, format) {
  const templates = formatTemplates[format] || formatTemplates.calculator;
  const marketPicks = marketPillars[market] || [];
  const marketTemplate = marketPicks.slice(0, 3).map((word) => `${word}${seed}成本怎么算`);
  return uniq([
    ...templates.map((item) => item.replaceAll("{seed}", seed)),
    ...marketTemplate,
  ]);
}

function scoreTopic(topic, seed, market, monetization, format) {
  let score = 42;
  const blob = `${topic.title} ${topic.keyword} ${topic.description} ${topic.adMatch}`;
  const seedTerms = uniq(seed.split(/\s+/).map((x) => x.trim()).filter(Boolean));
  if (!seedTerms.length) seedTerms.push(seed);

  for (const term of seedTerms) {
    if (term && blob.includes(term)) score += 22;
  }

  if (blob.includes("成本") || blob.includes("价格") || blob.includes("预算")) score += 12;
  if (blob.includes("工具") || blob.includes("软件") || blob.includes("平台")) score += 6;

  const marketWords = marketPillars[market] || [];
  if (marketWords.some((term) => blob.includes(term))) score += 10;

  const fitWords = monetizationFit[monetization] || [];
  if (fitWords.some((term) => blob.includes(term))) score += 12;

  if (format === "calculator" && blob.includes("成本")) score += 8;
  if (format === "comparison" && blob.includes("对比")) score += 8;
  if (format === "guide" && blob.includes("指南")) score += 6;
  if (format === "faq" && topic.faq.length >= 2) score += 4;

  if (topic.rows.length >= 4) score += 6;
  if (topic.faq.length >= 2) score += 4;
  if (topic.description.length >= 30) score += 4;

  return Math.max(0, Math.min(100, score));
}

function buildNewIdeas(seed, market, monetization, format, existingTitles) {
  const phrases = buildPhrases(seed, market, format);
  const fitWords = monetizationFit[monetization] || [];
  const gapIdeas = phrases
    .concat(fitWords.slice(0, 2).map((word) => `${word}${seed}怎么选`))
    .filter((item) => !existingTitles.includes(item));
  return uniq(gapIdeas).slice(0, 5);
}

function renderRow(label, value) {
  return `<div class="planner-row"><span>${label}</span><b>${value}</b></div>`;
}

async function loadTopics() {
  if (topicCache) return topicCache;
  const response = await fetch("../topics.json", { cache: "no-store" });
  topicCache = await response.json();
  return topicCache;
}

async function render() {
  const ticket = ++renderTicket;
  const seed = String(new FormData(form).get("seed") || "").trim();
  const market = String(new FormData(form).get("market") || "b2b");
  const monetization = String(new FormData(form).get("monetization") || "adsense");
  const format = String(new FormData(form).get("format") || "calculator");

  const topics = await loadTopics();
  if (ticket !== renderTicket) return;

  const ranked = topics
    .map((topic) => ({
      ...topic,
      score: scoreTopic(topic, seed, market, monetization, format),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const top = ranked.slice(0, 8);
  const existingTitles = topics.map((topic) => topic.title);
  const ideas = buildNewIdeas(seed, market, monetization, format, existingTitles);
  const topScore = top[0]?.score || 0;
  const revenueHint =
    monetization === "adsense" ? "AdSense + 联盟 + 模板" :
    monetization === "affiliate" ? "联盟链接 + 模板下载" :
    "咨询线索 + 审计服务";

  output.innerHTML = `
    <span>优先级评分</span>
    <strong>${topScore}</strong>
    <p>${topScore >= 80 ? "优先做。这个主题非常适合做成工具页或市场机会页。" : topScore >= 60 ? "可以做，但要补真实案例、表格或更新记录。" : "暂缓。先找更明确、更有商业意图的词。"}</p>
    <div class="planner-metric">
      ${renderRow("变现方式", revenueHint)}
      ${renderRow("建议节奏", topScore >= 80 ? "本周就做" : topScore >= 60 ? "两周内做" : "先观察")}
      ${renderRow("适合页面", format === "calculator" ? "计算器 + FAQ" : format === "comparison" ? "对比 + 表格" : format === "guide" ? "指南 + 步骤" : "FAQ + 清单")}
    </div>
    <div class="planner-section">
      <span>最值得扩的现有页</span>
      <div class="planner-list">
        ${top.map((topic) => `
          <article>
            <strong>${topic.title}</strong>
            <p>${topic.adMatch}</p>
            <small>${topic.score}/100 · ${topic.keyword}</small>
          </article>
        `).join("")}
      </div>
    </div>
    <div class="planner-section">
      <span>下一批可新增页</span>
      <div class="planner-list">
        ${ideas.map((idea) => `
          <article>
            <strong>${idea}</strong>
            <p>${market === "b2b" ? "更适合放 SaaS、服务和工具广告。" : "更适合放工具、模板或内容变现广告。"}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;

  copyButton.disabled = false;
  copyButton.onclick = async () => {
    const text = [
      `种子词：${seed}`,
      `市场：${market}`,
      `变现：${revenueHint}`,
      `推荐现有页：`,
      ...top.map((topic) => `- ${topic.title} (${topic.score}/100)`),
      `新增建议：`,
      ...ideas.map((idea) => `- ${idea}`),
    ].join("\n");
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "已复制";
    setTimeout(() => (copyButton.textContent = "复制计划"), 1200);
  };
}

randomButton?.addEventListener("click", () => {
  const seedInput = form.querySelector('input[name="seed"]');
  seedInput.value = seedPresets[Math.floor(Math.random() * seedPresets.length)];
  render();
});

form?.addEventListener("input", render);
render();
