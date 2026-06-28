# Codex 开发指南

## 1. 你的角色

你是 InvestMate 项目的 AI 全栈开发工程师。

你的任务是根据仓库中的中文规格文档，实现第一阶段 Web MVP。

不要自由扩展产品范围，优先完成可运行、可演示、可迭代的版本。

## 2. 必读文档

开发前请按顺序阅读：

1. `README.md`
2. `REPOSITORY_SPEC.md`
3. `项目愿景.md`
4. `产品原则.md`
5. `docs/产品规划完成度总览.md`
6. `docs/MVP产品设计.md`
7. `docs/信息架构.md`
8. `docs/页面设计.md`
9. `docs/用户流程.md`
10. `docs/前端组件清单.md`
11. `docs/接口清单.md`
12. `specs/API设计.md`
13. `specs/数据库设计.md`
14. `specs/AI输出结构.md`
15. `specs/前端架构.md`
16. `specs/后端架构.md`
17. `specs/数据同步设计.md`
18. `docs/开发验收总清单.md`

## 3. 第一阶段开发边界

只实现投研辅助 MVP。

不要实现：

- 自动执行操作；
- 真实账户连接；
- 支付；
- 社区；
- 高频实时数据；
- 移动 App；
- 复杂权限系统。

## 4. 推荐技术栈

如果没有额外指令，使用：

- 前端：Next.js + React + TypeScript；
- 样式：Tailwind CSS；
- 后端：FastAPI；
- 数据库：PostgreSQL；
- ORM：SQLAlchemy；
- 数据源：Tushare；
- AI 服务：OpenAI API 或兼容接口；
- 本地运行：Docker Compose。

## 5. 可执行任务清单

### Task 001：整理仓库结构

目标：建立标准工程目录。

需要创建：

```text
frontend/
backend/
scripts/
infra/
```

验收：

- 根目录结构清晰；
- 不删除已有中文文档；
- README 中的结构说明与实际目录一致。

### Task 002：初始化前端项目

目标：创建 Next.js 前端。

要求：

- 使用 TypeScript；
- 使用 App Router；
- 使用中文 UI；
- 创建基础布局；
- 创建导航栏。

页面：

- `/`
- `/assets`
- `/portfolio`
- `/history`
- `/settings`

验收：

- `npm run dev` 可以启动；
- 所有页面可访问；
- 页面无英文占位文案。

### Task 003：初始化后端项目

目标：创建 FastAPI 服务。

需要实现：

- `GET /health`
- CORS 配置；
- 统一响应结构；
- 基础错误处理。

验收：

- `uvicorn app.main:app --reload` 可以启动；
- `/health` 返回成功结果；
- `/docs` 可以打开。

### Task 004：实现 Mock API

目标：先跑通前后端链路。

需要实现：

- `GET /api/market/status`
- `GET /api/assets/search`
- `POST /api/analysis/asset`
- `POST /api/portfolio`
- `POST /api/analysis/portfolio`
- `GET /api/analysis/history`
- `GET /api/settings`
- `POST /api/settings`

验收：

- 所有接口返回 `specs/API设计.md` 和 `docs/接口清单.md` 中定义的结构；
- 前端可以成功请求；
- 接口返回中文内容。

### Task 005：实现首页

目标：完成首页 MVP。

参考文档：

- `prd/页面- 首页.md`
- `prd/组件-MarketStatusCard.md`
- `docs/前端组件清单.md`

组件：

- MarketStatusCard；
- QuickAnalyzeBox；
- RecentHistoryList；
- 因素列表。

验收：

- 首页可展示市场状态；
- 快速输入可以跳转标的分析页；
- 空状态有中文提示。

### Task 006：实现标的分析页

目标：完成标的分析 MVP。

参考文档：

- `prd/页面-标的分析.md`
- `docs/组件标的搜索.md`
- `docs/组件评分面板.md`
- `docs/组件因素列表.md`
- `docs/组件解释面板.md`

组件：

- AssetSearchInput；
- AssetScorePanel；
- FactorList；
- ExplanationPanel。

验收：

- 可以输入标的；
- 可以调用分析接口；
- 可以展示评分、关键因素、关注因素、中文解释。

### Task 007：实现持仓分析页

目标：完成持仓录入和组合结构分析。

参考文档：

- `prd/页面-持仓分析.md`
- `docs/组件持仓编辑.md`
- `docs/组件组合概览.md`

组件：

- PositionEditor；
- PortfolioPanel；
- FactorList；
- ExplanationPanel。

验收：

- 可以录入多条持仓；
- 可以保存持仓；
- 可以调用持仓分析接口；
- 可以展示组合摘要。

### Task 008：实现历史记录页

目标：完成历史列表和详情展示。

参考文档：

- `prd/页面-历史记录.md`
- `docs/组件历史表格.md`

验收：

- 可以展示历史记录；
- 可以查看详情；
- 空状态有中文提示。

### Task 009：实现设置页

目标：完成基础设置和用户投资 DNA 表单。

参考文档：

- `prd/页面-设置.md`
- `docs/组件偏好表单.md`

验收：

- 可以展示配置状态；
- 可以保存用户投资 DNA；
- 不明文展示敏感字段。

### Task 010：创建数据库 Schema

目标：根据 `specs/数据库设计.md` 创建 PostgreSQL 表结构。

要求：

- 使用 SQLAlchemy migration 或 SQL 脚本均可；
- 保留 demo 用户；
- 支持 analysis_record 写入。

验收：

- 本地数据库可创建所有 MVP 表；
- 后端可以读写 analysis_record；
- 后端可以读写 user_portfolio_position。

### Task 011：接入数据同步 Mock

目标：实现数据同步状态接口。

参考文档：

- `specs/数据同步设计.md`

验收：

- 设置页可看到同步状态；
- 后端有 sync status mock；
- 后续可替换为 Tushare 实现。

### Task 012：接入真实 Tushare

目标：将 mock 数据源逐步替换为 Tushare。

优先级：

1. asset_basic；
2. index_daily_price；
3. asset_daily_price；
4. asset_daily_basic。

验收：

- 可以配置 Tushare Token；
- 可以同步基础标的；
- 可以同步至少一个交易日的数据；
- 同步日志可查询。

### Task 013：接入 AI 解释服务

目标：根据结构化分析结果生成中文解释。

要求：

- 第一版可以保留 mock；
- 接口结构必须预留真实模型调用；
- Prompt 版本需要记录。

参考文档：

- `prompts/市场分析Agent.md`
- `prompts/决策Agent.md`
- `prompts/持仓分析Agent.md`
- `prompts/复盘Agent.md`

验收：

- AI 输出符合 `specs/AI输出结构.md`；
- 中文解释基于结构化结果；
- 历史记录保存 prompt_version 和 model_version。

## 6. 执行顺序

严格按照以下顺序开发：

```text
Task 001
  ↓
Task 002 + Task 003
  ↓
Task 004
  ↓
Task 005
  ↓
Task 006
  ↓
Task 007
  ↓
Task 008
  ↓
Task 009
  ↓
Task 010
  ↓
Task 011
  ↓
Task 012
  ↓
Task 013
```

## 7. 完成定义

第一阶段完成后，应该可以做到：

1. 本地启动前端；
2. 本地启动后端；
3. 首页展示市场状态；
4. 标的分析页展示 mock 分析；
5. 持仓页展示 mock 组合分析；
6. 历史页展示历史记录；
7. 设置页展示配置状态；
8. 数据库可以保存分析记录；
9. 所有用户可见文案为中文；
10. 通过 `docs/开发验收总清单.md`。

## 8. 重要约束

如果文档和实现冲突，以以下优先级为准：

1. `产品原则.md`
2. `REPOSITORY_SPEC.md`
3. `docs/产品规划完成度总览.md`
4. `docs/MVP产品设计.md`
5. `specs/API设计.md`
6. `specs/数据库设计.md`

不要因为实现方便而改变产品边界。
