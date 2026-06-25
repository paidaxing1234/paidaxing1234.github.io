# AI Cost Radar

AI Cost Radar 是一个 GEO + SEO 广告收益站原型，方向是用“AI 成本计算”类长尾搜索词拿流量，再用 AdSense、联盟广告和模板下载变现。

它不是纯文章站。第一版已经包含：

- AI API 月成本计算器
- AdSense 收益计算器
- AI 模型价格对比页
- AI 视频生成成本页
- GEO + SEO 内容站打法页
- GEO SEO 选题评分器
- 市场机会说明页
- 爆款细分站发现器
- 90 天增长路线图
- 收入泄漏雷达（Search Console / AdSense 复盘工作台）
- 上线准备清单页
- AI chatbot 月成本页
- AI API 省钱清单页
- AI 成本专题库页
- 关于、联系、广告披露和更新日志页面
- 40 个由 `topics.json` 生成的长尾词页面
- 隐私政策页
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- `ads.txt` 待配置说明
- AdSense 上线说明
- `generate-pages.js` 内容页生成器
- `topics.json` 长尾词数据源
- `audit-site.js` 上线前审计脚本

## 为什么选这个方向

用户会持续搜索：

- AI API 一个月多少钱
- AI chatbot 成本怎么算
- AI 视频生成一分钟多少钱
- AdSense 流量能赚多少钱
- GEO 和 SEO 怎么结合

这些词有明确问题，也适合做计算器、表格、FAQ 和答案块。页面能解决问题，才有机会拿搜索流量和广告展示。

## 怎么预览

静态打开即可：

```text
D:\项目，杂七杂八\无敌项目\geo-ad-yield-site\index.html
```

也可以启动本地服务器：

```powershell
python -m http.server 8821
```

然后访问：

```text
http://localhost:8821/
```

## 发布与变现状态

- 当前目标发布地址：`https://paidaxing1234.github.io/`
- 如果以后绑定独立域名，可用 `.\SETUP-DOMAIN.ps1 -Domain https://your-domain.com` 批量替换 canonical、sitemap、robots 和 llms 链接
- 联系页当前使用 GitHub Issues 接收公开反馈
- 继续把高价值主题补到 80 篇以上，每页都要有工具、表格、FAQ 或真实案例
- 申请并通过 Google AdSense
- 按 AdSense 后台给出的 publisher id 更新 `ads.txt`
- 用 Search Console 提交 sitemap
- 持续看收录、展示、点击率、停留时间和广告 RPM

## 扩内容

新增长尾页面时，先在 `topics.json` 里加主题，再运行：

```powershell
node generate-pages.js
node qa.js
```

生成器会写入 `pages/generated/`，并自动更新首页主题入口、`sitemap.xml` 和 `llms.txt`。

## 上线审计

运行：

```powershell
node audit-site.js
```

它会输出：

- `site-audit.json`
- `SITE-AUDIT.md`

审计会明确区分阻断项、警告和优先做的词。当前仍会提醒 AdSense 尚未配置，这是上线后申请审核前的真实状态。

## 当前真实状态

- 已有可预览静态站点
- 已有 59 个页面，其中 19 个手写/核心页面、40 个结构化生成页面
- 已有工具页和广告位占位
- 已有搜索抓取基础文件
- 目标发布到 GitHub Pages 用户站：`https://paidaxing1234.github.io/`
- 没有 AdSense 审核
- 没有真实流量
- 没有真实广告收入

