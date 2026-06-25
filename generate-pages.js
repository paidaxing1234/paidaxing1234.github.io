const fs = require("fs/promises");
const path = require("path");

const root = __dirname;
const generatedDir = path.join(root, "pages", "generated");
const baseUrl = (process.env.SITE_BASE_URL || "https://paidaxing1234.github.io").replace(/\/$/, "");

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pageHtml(topic) {
  const rows = topic.rows
    .map(
      (row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td></tr>`
    )
    .join("\n");
  const faqJson = topic.faq.map(([question, answer]) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  }));
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(topic.title)} - AI Cost Radar</title>
    <meta name="description" content="${escapeHtml(topic.description)}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${baseUrl}/pages/generated/${escapeHtml(topic.slug)}.html" />
    <link rel="stylesheet" href="../../styles.css" />
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqJson,
    })}</script>
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="../../index.html"><span>AI</span><strong>Cost Radar</strong></a>
      <nav><a href="../../index.html#calculator">成本计算</a><a href="../adsense-revenue.html">广告收益</a><a href="../geo-seo-playbook.html">GEO/SEO</a></nav>
    </header>
    <main>
      <section class="page-hero">
        <p class="eyebrow">${escapeHtml(topic.eyebrow)}</p>
        <h1>${escapeHtml(topic.title)}</h1>
        <p>${escapeHtml(topic.answer)}</p>
      </section>
      <section class="ad-slot"><span>AdSense 广告位</span><strong>${escapeHtml(topic.keyword)} 顶部广告</strong></section>
      <section class="data-table">
        <table>
          <thead><tr><th>成本项</th><th>为什么重要</th><th>怎么控制</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
      <section class="page-grid">
        <article class="page-card"><span>快速答案</span><h3>${escapeHtml(topic.faq[0][0])}</h3><p>${escapeHtml(topic.faq[0][1])}</p></article>
        <article class="page-card"><span>广告匹配</span><h3>这页适合什么广告？</h3><p>${escapeHtml(topic.adMatch)}</p></article>
      </section>
      <section class="insight-band">
        <article>
          <span>预算公式</span>
          <h2>先算用量，再选工具</h2>
          <p>${escapeHtml(topic.keyword)} 的预算可以先拆成固定订阅、使用量、人工复核和上线后的返工成本。搜索用户通常不是想看泛泛介绍，而是想知道自己这个月会花多少钱、哪里最容易超支。</p>
        </article>
        <article>
          <span>变现位置</span>
          <h2>广告要贴近决策点</h2>
          <p>这一类页面适合放工具对比、SaaS 试用、云服务、模板下载和课程广告。广告位应该靠近表格、计算结果和 FAQ，而不是挡住主要答案。</p>
        </article>
      </section>
      <section class="ad-slot"><span>AdSense 广告位</span><strong>${escapeHtml(topic.keyword)} 内容中段广告</strong></section>
    </main>
    <footer><p>本页围绕“${escapeHtml(topic.keyword)}”提供估算和清单，实际成本以各平台实时价格、用量和政策为准。</p></footer>
  </body>
</html>
`;
}

function libraryHtml(topics) {
  const cards = topics
    .map(
      (topic) => `        <a class="library-card" href="./generated/${escapeHtml(topic.slug)}.html">
          <span>${escapeHtml(topic.eyebrow)}</span>
          <strong>${escapeHtml(topic.title)}</strong>
          <p>${escapeHtml(topic.description)}</p>
          <small>广告匹配：${escapeHtml(topic.adMatch)}</small>
        </a>`
    )
    .join("\n");
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI 成本专题库 - AI Cost Radar</title>
    <meta name="description" content="AI Cost Radar 的 AI 成本专题库，覆盖写作、图片、语音、翻译、OCR、Agent、RAG、客服和 SaaS 定价等长尾搜索主题。" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${baseUrl}/pages/topics.html" />
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="../index.html"><span>AI</span><strong>Cost Radar</strong></a>
      <nav><a href="../index.html#calculator">成本计算</a><a href="./adsense-revenue.html">广告收益</a><a href="./geo-seo-playbook.html">GEO/SEO</a></nav>
    </header>
    <main>
      <section class="page-hero">
        <p class="eyebrow">专题库</p>
        <h1>所有 AI 成本长尾词入口</h1>
        <p>这些页面用于承接搜索流量和 AI 摘要引用。每个页面都有答案块、表格、FAQ 和广告位，后续可以继续从 topics.json 扩展。</p>
      </section>
      <section class="ad-slot"><span>AdSense 广告位</span><strong>专题库顶部广告</strong></section>
      <section class="library-grid">
${cards}
      </section>
    </main>
    <footer><p>专题库页面由 topics.json 生成。正式上线后应根据 Search Console 数据调整优先级。</p></footer>
  </body>
</html>
`;
}

async function replaceBlock(file, start, end, content) {
  const text = await fs.readFile(file, "utf8");
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
  const next = text.replace(pattern, `${start}\n${content}\n${end}`);
  await fs.writeFile(file, next, "utf8");
}

async function run() {
  const topics = JSON.parse(await fs.readFile(path.join(root, "topics.json"), "utf8"));
  await fs.mkdir(generatedDir, { recursive: true });
  for (const topic of topics) {
    await fs.writeFile(path.join(generatedDir, `${topic.slug}.html`), pageHtml(topic), "utf8");
  }
  await fs.writeFile(path.join(root, "pages", "topics.html"), libraryHtml(topics), "utf8");

  const topicLinks = topics
    .map((topic) => `          <a href="./pages/generated/${topic.slug}.html">${escapeHtml(topic.title)}</a>`)
    .join("\n");
  await replaceBlock(
    path.join(root, "index.html"),
    "<!-- GENERATED_TOPIC_LINKS_START -->",
    "<!-- GENERATED_TOPIC_LINKS_END -->",
    topicLinks
  );

  const sitemapUrls = topics
    .map(
      (topic) => `  <url>
    <loc>${baseUrl}/pages/generated/${topic.slug}.html</loc>
    <priority>0.6</priority>
  </url>`
    )
    .join("\n");
  await replaceBlock(
    path.join(root, "sitemap.xml"),
    "<!-- GENERATED_URLS_START -->",
    "<!-- GENERATED_URLS_END -->",
    sitemapUrls
  );

  const llmsLines = topics
    .map((topic) => `- ${baseUrl}/pages/generated/${topic.slug}.html - ${topic.title}`)
    .join("\n");
  await replaceBlock(
    path.join(root, "llms.txt"),
    "<!-- GENERATED_LLM_LINKS_START -->",
    "<!-- GENERATED_LLM_LINKS_END -->",
    llmsLines
  );

  console.log(JSON.stringify({ generated: topics.length, library: path.join(root, "pages", "topics.html"), dir: generatedDir }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
