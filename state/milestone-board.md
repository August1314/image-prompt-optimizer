# 里程碑看板

## 状态总览

| 里程碑 | 描述 | 状态 |
|--------|------|------|
| M1 | 工程骨架可运行 | ✅ 基本完成 |
| M2 | 核心闭环首版可用 | 🔲 进行中 |
| M3 | 基础质量闭环 | 🔲 未开始 |
| M4 | 市场验证就绪 | 🔲 未开始 |

---

## M1: 工程骨架可运行

**目标**：骨架项目可构建、可运行、可部署基础代码到 Vercel。

### 完成标准
- [x] `npm install` 成功，无缺失依赖
- [x] `npm run build` 通过，TypeScript 编译无错误
- [x] `npm run dev` 启动 Vite dev server，页面可访问
- [x] 三步流程页面渲染（Input → Clarification → Result）
- [x] 客户端安全检查运行
- [x] Vercel serverless API 路由配置正确
- [x] `.gitignore` 包含标准忽略项

### 当前事实
- 仓库已初始化，有一个 commit `13ea78b scaffold: initial MVP project structure`
- `node_modules/` 已安装
- `npm run build` 输出：`dist/assets/index-*.js` 约 202KB gzip 63KB
- dev server 在 `localhost:3000` 正常运行
- 当前 git status 仅 `.gitignore` 和 `node_modules/.package-lock.json` 有变更

### 阻塞
- 无

---

## M2: 核心闭环首版可用

**目标**：用户输入图像想法，经过澄清，获得可用提示词输出，全程无报错。

### 完成标准
- [x] 三步流程完整串联（App.tsx 状态机）
- [x] OpenAI API 调用（`api/optimize.ts`）
- [x] Clarification 问题生成 + 用户填写 + 二次优化
- [x] 客户端 + 服务端安全检查
- [x] 复制到剪贴板
- [x] 暗色主题 UI
- [ ] 真实 API key 端到端验证（需人工提供 key）
- [ ] `tsconfig.json` 包含 `api/` 类型检查
- [ ] 共享类型提取到 `src/lib/types.ts`
- [ ] SEO meta 标签（title/description/og）

### 当前事实
- 代码逻辑完整，但尚未用真实 OpenAI key 验证
- `api/optimize.ts` 不在 `tsconfig.json` 的 `include` 中
- `prompt-optimizer.ts` 从 `../App` 导入类型（反向依赖）

### 阻塞
- 真实 OpenAI API key 未提供（人工阻塞）

---

## M3: 基础质量闭环

**目标**：代码质量达到可开源水平，有基本测试覆盖。

### 完成标准
- [ ] 提取共享类型到 `src/lib/types.ts`，消除反向依赖
- [ ] vitest 安装 + 配置
- [ ] `safety.ts` 和 `safety.server.ts` 单元测试
- [ ] `prompt-optimizer.ts` mock 测试
- [ ] `App.tsx` 基本渲染测试
- [ ] CI 配置（GitHub Actions：lint + test + build）

---

## M4: 市场验证就绪

**目标**：部署到 Vercel，具备最简付费验证能力。

### 完成标准
- [ ] Vercel 账号连接 + 首次部署
- [ ] Vercel 环境变量配置（`OPENAI_API_KEY`）
- [ ] 域名绑定（如需）
- [ ] Stripe Checkout 集成（需人工确认卖家主体和地区）
- [ ] 基础错误监控（如需）
