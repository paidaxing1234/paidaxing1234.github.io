const fs = require("fs/promises");
const path = require("path");

const root = __dirname;
const baseUrl = (process.env.SITE_BASE_URL || "https://paidaxing1234.github.io").replace(/\/$/, "");

async function read(file) {
  return fs.readFile(path.join(root, file), "utf8");
}

function extractCanonical(html) {
  const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  return match ? match[1] : "";
}

function scoreTopic(topic) {
  let score = 50;
  const commercial = ["客服", "SaaS", "Agent", "RAG", "OCR", "翻译", "语音", "图片"];
  if (commercial.some((word) => topic.title.includes(word) || topic.keyword.includes(word))) score += 18;
  if (topic.adMatch.includes("平台") || topic.adMatch.includes("软件") || topic.adMatch.includes("工具")) score += 12;
  if (topic.rows.length >= 4) score += 8;
  if (topic.faq.length >= 2) score += 6;
  if (topic.description.length >= 28) score += 4;
  return Math.min(98, score);
}

async function run() {
  const blockers = [];
  const warnings = [];
  const opportunities = [];
  const topics = JSON.parse(await read("topics.json"));
  const manualPages = [
    "index.html",
    "pages/model-pricing.html",
    "pages/video-ai-cost.html",
    "pages/geo-seo-playbook.html",
    "pages/adsense-revenue.html",
    "pages/topic-score.html",
    "pages/chatbot-cost.html",
    "pages/reduce-ai-api-cost.html",
    "pages/topics.html",
    "pages/privacy.html",
    "pages/about.html",
    "pages/contact.html",
    "pages/advertising-disclosure.html",
    "pages/market-opportunity.html",
    "pages/niche-finder.html",
    "pages/growth-roadmap.html",
    "pages/search-console-workbench.html",
    "pages/launch-checklist.html",
    "pages/updates.html",
  ];
  const generatedPages = topics.map((topic) => `pages/generated/${topic.slug}.html`);
  const pages = [...manualPages, ...generatedPages];

  let adSlots = 0;
  let structuredDataPages = 0;
  let placeholderCanonical = 0;
  let offDomainCanonical = 0;
  for (const page of pages) {
    const html = await read(page);
    if (html.includes("AdSense 广告位")) adSlots += 1;
    if (html.includes("application/ld+json")) structuredDataPages += 1;
    const canonical = extractCanonical(html);
    if (!canonical) blockers.push(`${page} missing canonical`);
    if (canonical.includes("https://example.com")) placeholderCanonical += 1;
    if (canonical && !canonical.startsWith(baseUrl)) offDomainCanonical += 1;
    if (!html.includes('name="description"')) blockers.push(`${page} missing meta description`);
    if (!html.includes('name="robots"')) warnings.push(`${page} missing robots meta`);
  }

  const sitemap = await read("sitemap.xml");
  const sitemapUrlCount = (sitemap.match(/<url>/g) || []).length;
  if (sitemapUrlCount !== pages.length) warnings.push(`sitemap URL count ${sitemapUrlCount} does not match page count ${pages.length}`);

  const robots = await read("robots.txt");
  if (!robots.includes("Sitemap:")) blockers.push("robots.txt missing Sitemap");

  const adsTxt = await read("ads.txt");
  if (adsTxt.includes("pub-0000000000000000")) blockers.push("ads.txt still contains placeholder publisher id");
  if (!adsTxt.includes("AdSense publisher ID is not configured yet")) warnings.push("ads.txt should explain that AdSense is not configured yet");

  const contact = await read("pages/contact.html");
  if (contact.includes("hello@example.com")) blockers.push("contact page still uses placeholder email");
  if (!contact.includes("https://github.com/paidaxing1234/paidaxing1234.github.io/issues")) {
    warnings.push("contact page should expose a public feedback channel");
  }
  const market = await read("pages/market-opportunity.html");
  if (!market.includes("商业意图")) warnings.push("market opportunity page should explain topic prioritization");
  const homepage = await read("index.html");
  for (const trustLink of ["privacy.html", "contact.html", "advertising-disclosure.html", "about.html"]) {
    if (!homepage.includes(trustLink)) blockers.push(`homepage missing trust link ${trustLink}`);
  }
  if (!homepage.includes("./pages/launch-checklist.html")) blockers.push("homepage missing launch checklist link");
  if (!homepage.includes("./pages/growth-roadmap.html")) blockers.push("homepage missing growth roadmap link");
  if (!homepage.includes("./pages/niche-finder.html")) blockers.push("homepage missing niche finder link");
  if (!homepage.includes("./pages/search-console-workbench.html")) blockers.push("homepage missing revenue leak radar link");

  const launchChecklist = await read("pages/launch-checklist.html");
  if (!launchChecklist.includes("上线完成度") || !launchChecklist.includes("launchForm")) warnings.push("launch checklist page should expose the onboarding controls");
  const growthRoadmap = await read("pages/growth-roadmap.html");
  if (!growthRoadmap.includes("90 天模型") || !growthRoadmap.includes("growthForm")) warnings.push("growth roadmap page should expose the operating model");
  const nicheFinder = await read("pages/niche-finder.html");
  if (!nicheFinder.includes("机会评分") || !nicheFinder.includes("nicheForm")) warnings.push("niche finder page should expose the opportunity scoring tool");
  const consoleWorkbench = await read("pages/search-console-workbench.html");
  if (
    !consoleWorkbench.includes("收入泄漏指数") ||
    !consoleWorkbench.includes("consoleForm") ||
    !consoleWorkbench.includes("dataset") ||
    !consoleWorkbench.includes("rankedList") ||
    !consoleWorkbench.includes("loadSample") ||
    !consoleWorkbench.includes("clearData")
  ) warnings.push("search console workbench should expose the revenue leak controls");

  if (placeholderCanonical > 0) blockers.push(`${placeholderCanonical} pages still use https://example.com; run SETUP-DOMAIN.ps1 before launch`);
  if (offDomainCanonical > 0) blockers.push(`${offDomainCanonical} pages use a canonical outside ${baseUrl}`);
  if (pages.length < 30) warnings.push(`only ${pages.length} pages; AdSense review is more realistic after 30+ useful pages`);
  if (structuredDataPages < pages.length * 0.6) warnings.push("less than 60% pages have structured data");
  if (adSlots < pages.length * 0.8) warnings.push("less than 80% pages have ad slots");

  const rankedTopics = topics
    .map((topic) => ({
      slug: topic.slug,
      title: topic.title,
      keyword: topic.keyword,
      score: scoreTopic(topic),
      adMatch: topic.adMatch,
      url: `${baseUrl}/pages/generated/${topic.slug}.html`,
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  opportunities.push("先做成本计算、客服、Agent、RAG、OCR、翻译这类商业意图更强的词。");
  opportunities.push("每个高分词补真实价格案例、公式和截图，避免变成低价值自动生成页。");
  opportunities.push("上线后用 Search Console 看展示量，优先扩展有 impression 但 CTR 低的词簇。");

  const audit = {
    ok: blockers.length === 0,
    readyForLaunch: blockers.length === 0 && warnings.length <= 2,
    pageCount: pages.length,
    manualPages: manualPages.length,
    generatedPages: generatedPages.length,
    adSlots,
    structuredDataPages,
    sitemapUrlCount,
    blockers,
    warnings,
    opportunities,
    topTopics: rankedTopics.slice(0, 10),
    checkedAt: new Date().toISOString(),
  };

  await fs.writeFile(path.join(root, "site-audit.json"), JSON.stringify(audit, null, 2), "utf8");

  const lines = [];
  lines.push("# AI Cost Radar 上线审计");
  lines.push("");
  lines.push(`生成时间：${audit.checkedAt}`);
  lines.push(`页面数量：${audit.pageCount}（核心 ${audit.manualPages}，生成 ${audit.generatedPages}）`);
  lines.push(`广告位页面：${audit.adSlots}`);
  lines.push(`结构化数据页面：${audit.structuredDataPages}`);
  lines.push(`Sitemap URL：${audit.sitemapUrlCount}`);
  lines.push("");
  lines.push("## 结论");
  lines.push("");
  lines.push(audit.readyForLaunch ? "- 可以进入真实域名上线前检查。" : "- 还不能直接上线赚钱，先处理阻断项和警告。");
  lines.push("");
  lines.push("## 阻断项");
  lines.push("");
  if (audit.blockers.length) audit.blockers.forEach((item) => lines.push(`- ${item}`));
  else lines.push("- 无");
  lines.push("");
  lines.push("## 警告");
  lines.push("");
  if (audit.warnings.length) audit.warnings.forEach((item) => lines.push(`- ${item}`));
  else lines.push("- 无");
  lines.push("");
  lines.push("## 优先做的词");
  lines.push("");
  audit.topTopics.forEach((topic, index) => {
    lines.push(`${index + 1}. ${topic.title}（${topic.score}/100）：${topic.adMatch}`);
  });
  lines.push("");
  lines.push("## 下一步");
  lines.push("");
  audit.opportunities.forEach((item) => lines.push(`- ${item}`));
  await fs.writeFile(path.join(root, "SITE-AUDIT.md"), lines.join("\n"), "utf8");

  console.log(JSON.stringify(audit, null, 2));
  if (blockers.some((item) => item.includes("missing"))) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
