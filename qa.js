const fs = require("fs/promises");
const path = require("path");

const root = __dirname;
const pages = [
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

async function read(file) {
  return fs.readFile(path.join(root, file), "utf8");
}

async function run() {
  const issues = [];
  const topics = JSON.parse(await read("topics.json"));
  const generatedPages = topics.map((topic) => `pages/generated/${topic.slug}.html`);
  for (const page of [...pages, ...generatedPages]) {
    const html = await read(page);
    if (!html.includes("<title>")) issues.push(`${page} missing title`);
    if (!html.includes('name="description"')) issues.push(`${page} missing meta description`);
    if (!html.includes('rel="canonical"')) issues.push(`${page} missing canonical`);
    if (!html.includes("../styles.css") && !html.includes("./styles.css")) issues.push(`${page} missing stylesheet`);
  }

  const index = await read("index.html");
  if (!index.includes("AI API 月成本计算器")) issues.push("homepage missing API cost calculator");
  if (!index.includes("application/ld+json")) issues.push("homepage missing structured data");
  if (!index.includes("AdSense 广告位")) issues.push("homepage missing ad slot");
  if (!index.includes("广告收益")) issues.push("homepage missing ad revenue navigation");
  if (!index.includes("./pages/adsense-revenue.html")) issues.push("homepage missing AdSense revenue page link");
  if (!index.includes("./pages/topic-score.html")) issues.push("homepage missing topic score page link");
  if (!index.includes("./pages/market-opportunity.html")) issues.push("homepage missing market opportunity page link");
  if (!index.includes("./pages/niche-finder.html")) issues.push("homepage missing niche finder page link");
  if (!index.includes("./pages/growth-roadmap.html")) issues.push("homepage missing growth roadmap page link");
  if (!index.includes("./pages/search-console-workbench.html")) issues.push("homepage missing search console workbench page link");
  if (!index.includes("./pages/launch-checklist.html")) issues.push("homepage missing launch checklist page link");
  if (!index.includes("./pages/topics.html")) issues.push("homepage missing topic library link");
  if (!index.includes("./pages/privacy.html")) issues.push("homepage missing privacy link");
  if (!index.includes("./pages/contact.html")) issues.push("homepage missing contact link");
  if (!index.includes("./pages/advertising-disclosure.html")) issues.push("homepage missing disclosure link");
  if (!index.includes("./pages/generated/ai-agent-cost.html")) issues.push("homepage missing generated topic links");

  const adsense = await read("pages/adsense-revenue.html");
  if (!adsense.includes("AdSense 月收益计算器") || !adsense.includes("adsenseForm")) {
    issues.push("adsense revenue calculator missing");
  }

  const topicScore = await read("pages/topic-score.html");
  if (!topicScore.includes("GEO SEO 选题评分器") || !topicScore.includes("topicScoreForm")) {
    issues.push("topic score tool missing");
  }

  const launchChecklist = await read("pages/launch-checklist.html");
  if (!launchChecklist.includes("上线完成度") || !launchChecklist.includes("launchForm")) {
    issues.push("launch checklist missing");
  }

  const growthRoadmap = await read("pages/growth-roadmap.html");
  if (!growthRoadmap.includes("90 天模型") || !growthRoadmap.includes("growthForm")) {
    issues.push("growth roadmap tool missing");
  }

  const nicheFinder = await read("pages/niche-finder.html");
  if (!nicheFinder.includes("机会评分") || !nicheFinder.includes("nicheForm")) {
    issues.push("niche finder tool missing");
  }

  const consoleWorkbench = await read("pages/search-console-workbench.html");
  if (
    !consoleWorkbench.includes("收入泄漏指数") ||
    !consoleWorkbench.includes("consoleForm") ||
    !consoleWorkbench.includes("dataset") ||
    !consoleWorkbench.includes("rankedList") ||
    !consoleWorkbench.includes("loadSample") ||
    !consoleWorkbench.includes("clearData")
  ) {
    issues.push("search console workbench missing");
  }

  const css = await read("styles.css");
  if (!css.includes(".ad-slot") || !css.includes(".result-card")) issues.push("critical CSS classes missing");

  const app = await read("app.js");
  if (!app.includes("renderCost") || !app.includes("inputTokens")) issues.push("API cost calculator script missing");

  const robots = await read("robots.txt");
  if (!robots.includes("Sitemap:")) issues.push("robots missing sitemap");

  const adsTxt = await read("ads.txt");
  if (!adsTxt.includes("AdSense publisher ID is not configured yet")) issues.push("ads.txt should clearly state AdSense is not configured yet");
  if (adsTxt.includes("pub-0000000000000000")) issues.push("ads.txt must not ship a fake publisher id");

  const sitemap = await read("sitemap.xml");
  for (const required of ["model-pricing.html", "video-ai-cost.html", "geo-seo-playbook.html", "adsense-revenue.html", "topic-score.html", "market-opportunity.html", "niche-finder.html", "growth-roadmap.html", "search-console-workbench.html", "launch-checklist.html", "chatbot-cost.html", "reduce-ai-api-cost.html", "topics.html", "privacy.html", "about.html", "contact.html", "advertising-disclosure.html", "updates.html"]) {
    if (!sitemap.includes(required)) issues.push(`sitemap missing ${required}`);
  }
  for (const page of generatedPages) {
    const name = path.basename(page);
    if (!sitemap.includes(name)) issues.push(`sitemap missing generated ${name}`);
  }

  const llms = await read("llms.txt");
  if (!llms.includes("AdSense monthly revenue calculator")) issues.push("llms.txt missing AdSense calculator");
  if (!llms.includes("GEO SEO topic scoring tool")) issues.push("llms.txt missing topic score tool");
  if (!llms.includes("Market opportunity and topic priorities")) issues.push("llms.txt missing market opportunity page");
  if (!llms.includes("GEO SEO niche opportunity finder")) issues.push("llms.txt missing niche finder page");
  if (!llms.includes("GEO SEO 90-day growth roadmap")) issues.push("llms.txt missing growth roadmap page");
  if (!llms.includes("收入泄漏雷达")) issues.push("llms.txt missing revenue leak radar page");
  if (!llms.includes("上线准备清单")) issues.push("llms.txt missing launch checklist page");
  if (!llms.includes("AI cost topic library")) issues.push("llms.txt missing topic library");
  if (!llms.includes("Advertising and affiliate disclosure")) issues.push("llms.txt missing disclosure page");
  if (!llms.includes("AI Agent 运行成本怎么算")) issues.push("llms.txt missing generated topics");
  for (const topic of topics) {
    if (!llms.includes(topic.title)) issues.push(`llms.txt missing topic ${topic.slug}`);
  }

  const readme = await read("README.md");
  if (!readme.includes("当前真实状态") || !readme.includes("没有真实广告收入")) issues.push("README must state real monetization status");
  if (!readme.includes(`${topics.length} 个由 \`topics.json\``)) issues.push("README generated topic count is stale");
  if (!readme.includes("爆款细分站发现器")) issues.push("README missing niche finder page");
  if (!readme.includes("90 天增长路线图")) issues.push("README missing growth roadmap page");
  if (!readme.includes("收入泄漏雷达")) issues.push("README missing revenue leak radar page");
  if (!readme.includes("上线准备清单页")) issues.push("README missing launch checklist page");

  const contact = await read("pages/contact.html");
  if (contact.includes("hello@example.com")) issues.push("contact page must not ship placeholder email");
  if (!contact.includes("https://github.com/paidaxing1234/paidaxing1234.github.io/issues")) {
    issues.push("contact page must expose the GitHub Issues feedback channel");
  }
  const disclosure = await read("pages/advertising-disclosure.html");
  if (!disclosure.includes("不会把广告伪装成独立评测结论")) issues.push("ad disclosure must state ad/editorial separation");

  const setupDomain = await read("SETUP-DOMAIN.ps1");
  if (!setupDomain.includes("https://example.com") || !setupDomain.includes("Domain must be an https URL")) {
    issues.push("domain setup script missing safety checks");
  }

  const output = {
    ok: issues.length === 0,
    issues,
    pages: pages.length + generatedPages.length,
    checkedAt: new Date().toISOString(),
  };
  await fs.writeFile(path.join(root, "qa-result.json"), JSON.stringify(output, null, 2), "utf8");
  console.log(JSON.stringify(output, null, 2));
  if (issues.length) process.exit(1);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
