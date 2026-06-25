# AdSense 上线说明

这个站预留了广告位，但没有写真实 `ca-pub-...`，避免把测试代码伪装成已接广告。

上线步骤：

1. 当前可以先用 `https://paidaxing1234.github.io/` 发布。后续如果绑定真实独立域名，再改掉所有 canonical、sitemap 和 robots 地址。
   可以运行：

   ```powershell
   .\SETUP-DOMAIN.ps1 -Domain https://your-domain.com
   ```

2. 继续补有工具、表格、FAQ 或案例的原创页面，不要只批量生成文章。当前已有 59 个页面，其中 40 个来自 `topics.json`，继续扩展时优先加有明确搜索意图和广告匹配的主题。
   可以先看 `pages/niche-finder.html`、`pages/growth-roadmap.html`、`pages/search-console-workbench.html` 和 `pages/launch-checklist.html`，把细分机会、90 天增长节奏、收入泄漏复盘、真实域名、邮箱、ads.txt、Search Console 和 AdSense 审核逐项补齐。
3. 添加隐私政策、联系方式和站点说明。
4. 申请 Google AdSense。
5. 审核通过后，把响应式广告代码放到 `.ad-slot` 对应位置。
6. 按 AdSense 后台要求更新 `ads.txt`，不要写假的 publisher id。
7. 用 Search Console 提交 sitemap。
8. 每周看页面收录、展示、点击率、停留时间和广告 RPM。

上线前先运行：

```powershell
node audit-site.js
```

如果报告里还有 `blockers`，不要申请 AdSense 或对外宣称已经能赚钱。

适合的广告主题：

- AI API 平台
- 云服务器
- 开发者工具
- 成本管理工具
- AI 课程或模板

当前真实状态：

- 已有静态页面和广告位占位。
- 目标发布到 GitHub Pages 用户站。
- 没有 AdSense 审核。
- 没有真实流量。
- 没有真实广告收入。

