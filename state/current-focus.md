# 当前主项目

- 状态：M1 完成，推进 M2 中
- 项目名：Image Prompt Optimizer
- 仓库路径：`/Users/lianglihang/Documents/programs/image-prompt-optimizer`
- 远程仓库：未创建
- 技术栈：Vite + React 19 + TypeScript + OpenAI API (gpt-4o-mini) + Vercel Serverless
- 最新 commit：`2fd006d feat: M1 milestone complete — skeleton is runnable`

## M1 完成状态（✅）

- ✅ 项目工程骨架可运行（`npm run build` 通过，dev server 正常启动）
- ✅ 三步流程页面：PromptInput → ClarificationStep → ResultStep
- ✅ 客户端 + 服务端安全检查（safety.ts + safety.server.ts）
- ✅ Vercel serverless API（`api/optimize.ts`）
- ✅ OpenAI API 调用逻辑（gpt-4o-mini）
- ✅ 暗色主题 UI + 复制到剪贴板
- ✅ `.gitignore` 补全标准前端忽略项
- ✅ SEO meta 标签（og:title, description, twitter:card）
- ✅ vitest 测试框架 + 9 个 safety 函数测试
- ✅ 共享类型提取到 `src/lib/types.ts`
- ✅ `tsconfig.json` 包含 `api/` 类型检查
- ✅ `state/` 目录（current-focus, leader-directive, milestone-board）

## M2 进行中

- 🔲 真实 OpenAI API key 端到端验证（需人工提供）
- 🔲 `ClarificationStep.tsx` / `ResultStep.tsx` 改从 `src/lib/types` 直接导入
- 🔲 prompt-optimizer mock 测试
- 🔲 GitHub 远程仓库创建（需人工确认）
- 🔲 Vercel 首次部署验证
- 🔲 CI 配置（GitHub Actions: lint + test + build）

## 本轮已完成

1. 确认已有骨架代码可构建可运行
2. 消除类型反向依赖（`types.ts` 提取）
3. vitest + jsdom 安装，9 个 safety 测试全部通过
4. `tsconfig.json` 扩展到 `api/`
5. SEO meta 标签
6. `.gitignore` 补全
7. `state/` 目录创建
