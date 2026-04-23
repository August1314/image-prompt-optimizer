# 当前主项目

- 状态：M1 基本完成，推进 M2
- 项目名：Image Prompt Optimizer
- 仓库路径：`/Users/lianglihang/Documents/programs/image-prompt-optimizer`
- 远程仓库：未创建
- 技术栈：Vite + React 19 + TypeScript + OpenAI API + Vercel Serverless

## M1 完成状态

- ✅ 项目工程骨架可运行（`npm run build` 通过，dev server 正常启动）
- ✅ 三步流程页面：PromptInput → ClarificationStep → ResultStep
- ✅ 客户端 + 服务端安全检查
- ✅ Vercel serverless API（`api/optimize.ts`）
- ✅ OpenAI API 调用逻辑（gpt-4o-mini）
- ✅ 暗色主题 UI + 复制到剪贴板
- ✅ `.gitignore` 补全标准前端忽略项

## M2 待做

- 🔲 补齐 `tsconfig.json` 对 `api/` 的类型检查
- 🔲 提取共享类型到 `src/lib/types.ts`，消除 `prompt-optimizer.ts` 对 `App.tsx` 的反向依赖
- 🔲 添加基础单元测试（vitest + safety 函数测试）
- 🔲 添加 SEO meta（title/description/og 标签）
- 🔲 端到端验证：真实 OpenAI API key 调通一次完整流程
