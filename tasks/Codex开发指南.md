# Codex 开发指南

## 1. 你的角色

你是 InvestMate 项目的 AI 全栈开发工程师。

你的任务是根据仓库中的中文规格文档，实现第一阶段 Web MVP。

不要自由扩展产品范围，优先完成可运行、可演示、可迭代的版本。

## 2. 第一阶段主线

第一阶段优先实现最关键的商业闭环：AI 持仓体检报告。

开发主线是：

```text
持仓录入
  ↓
AI 持仓体检报告
  ↓
报告保存
  ↓
历史回看
  ↓
周度复盘入口
  ↓
用户反馈
```

不要先把精力分散到复杂行情、复杂图表或非核心页面。

## 3. 必读文档

开发前请按顺序阅读：

1. `README.md`
2. `REPOSITORY_SPEC.md`
3. `项目愿景.md`
4. `产品原则.md`
5. `docs/核心商业闭环开发路线.md`
6. `docs/AI持仓体检报告PRD.md`
7. `docs/报告页设计.md`
8. `docs/报告评分规则.md`
9. `docs/报告字段规格.md`
10. `docs/产品规划完成度总览.md`
11. `docs/MVP产品设计.md`
12. `docs/前端组件清单.md`
13. `docs/接口清单.md`
14. `specs/API设计.md`
15. `specs/数据库设计.md`
16. `specs/AI输出结构.md`
17. `docs/开发验收总清单.md`

## 4. 第一阶段开发边界

只实现投研辅助 MVP。

不要实现：

- 自动执行操作；
- 真实账户连接；
- 支付；
- 社区；
- 高频实时数据；
- 移动 App；
- 复杂权限系统。

## 5. 推荐技术栈

如果没有额外指令，使用：

- 前端：Next.js + React + TypeScript；
- 样式：Tailwind CSS；
- 后端：FastAPI；
- 数据库：PostgreSQL；
- ORM：SQLAlchemy；
- 数据源：Tushare；
- AI 服务：OpenAI API 或兼容接口；
- 本地运行：Docker Compose。

## 6. 可执行任务清单

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
- `/portfolio`
- `/reports/[id]`
- `/history`
- `/settings`
- `/assets`

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
- `POST /api/portfolio`
- `POST /api/reports/portfolio-health`
- `GET /api/reports/{report_id}`
- `GET /api/analysis/history`
- `POST /api/feedback`
- `GET /api/settings`
- `POST /api/settings`

验收：

- 所有接口返回统一结构；
- 前端可以成功请求；
- 接口返回中文内容；
- 报告字段符合 `docs/报告字段规格.md`。

### Task 005：实现持仓录入页

目标：完成 AI 持仓体检报告的输入环节。

参考文档：

- `prd/页面-持仓分析.md`
- `docs/组件持仓编辑.md`
- `docs/AI持仓体检报告PRD.md`

组件：

- PositionEditor；
- AssetSearchInput；
- SavePortfolioButton。

验收：

- 可以录入多条持仓；
- 可以编辑和删除持仓；
- 可以校验比例；
- 可以提交生成报告。

### Task 006：实现 AI 持仓体检报告页

目标：完成第一阶段最重要的结果页。

参考文档：

- `docs/报告页设计.md`
- `docs/报告评分规则.md`
- `docs/报告字段规格.md`
- `docs/信任体系设计.md`

组件：

- ReportHeader；
- ReportSummaryCard；
- HealthScoreCard；
- ScoreItemList；
- ExposurePanel；
- WatchItemList；
- ExplanationPanel；
- FeedbackBox。

验收：

- 可以展示报告摘要；
- 可以展示健康度；
- 可以展示分项评分；
- 可以展示分布信息；
- 可以展示关注事项；
- 可以展示中文解释；
- 可以展示数据日期和生成时间；
- 可以提交反馈。

### Task 007：实现报告保存和历史回看

目标：让用户可以保存并回看报告。

参考文档：

- `prd/页面-历史记录.md`
- `docs/组件历史表格.md`
- `docs/用户验证记录模板.md`

验收：

- 报告生成后自动保存；
- 历史列表可以展示报告；
- 历史详情可以展示完整报告；
- 空状态有中文提示。

### Task 008：实现首页

目标：首页服务于持仓体检主线。

参考文档：

- `prd/页面- 首页.md`
- `docs/落地页转化文案.md`
- `docs/核心商业闭环开发路线.md`

组件：

- HeroSection；
- StartPortfolioCheckButton；
- ExampleReportCard；
- RecentHistoryList。

验收：

- 首页能清楚说明“持仓体检”；
- 主按钮进入持仓录入；
- 可以查看示例报告；
- 可以查看最近记录。

### Task 009：实现标的分析页

目标：作为辅助功能，不高于持仓体检主线。

参考文档：

- `prd/页面-标的分析.md`
- `docs/组件标的搜索.md`
- `docs/组件评分面板.md`
- `docs/组件因素列表.md`
- `docs/组件解释面板.md`

验收：

- 可以输入标的；
- 可以调用分析接口；
- 可以展示评分、因素和中文解释。

### Task 010：实现设置页

目标：完成基础设置和用户投资 DNA 表单。

参考文档：

- `prd/页面-设置.md`
- `docs/组件偏好表单.md`

验收：

- 可以展示配置状态；
- 可以保存用户投资 DNA；
- 不明文展示敏感字段。

### Task 011：创建数据库 Schema

目标：根据 `specs/数据库设计.md` 创建 PostgreSQL 表结构。

要求：

- 支持用户；
- 支持持仓；
- 支持报告；
- 支持历史记录；
- 支持反馈。

验收：

- 本地数据库可创建所有 MVP 表；
- 后端可以读写持仓；
- 后端可以保存报告；
- 后端可以读取历史。

### Task 012：接入数据同步 Mock

目标：实现数据同步状态接口。

参考文档：

- `specs/数据同步设计.md`

验收：

- 设置页可看到同步状态；
- 后端有 sync status mock；
- 后续可替换为 Tushare 实现。

### Task 013：接入 AI 解释服务

目标：根据结构化报告结果生成中文解释。

要求：

- 第一版可以保留 mock；
- 先规则计算结构化结果，再生成中文解释；
- Prompt 版本需要记录。

参考文档：

- `prompts/持仓分析Agent.md`
- `prompts/复盘Agent.md`
- `docs/报告字段规格.md`

验收：

- AI 输出符合报告字段；
- 中文解释基于结构化结果；
- 历史记录保存 prompt_version 和 model_version。

## 7. 执行顺序

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

## 8. 完成定义

第一阶段完成后，应该可以做到：

1. 本地启动前端；
2. 本地启动后端；
3. 用户录入持仓；
4. 生成 AI 持仓体检报告；
5. 报告页展示结构化结果；
6. 报告保存到历史记录；
7. 用户可以回看历史报告；
8. 用户可以提交反馈；
9. 设置页展示配置状态；
10. 所有用户可见文案为中文；
11. 通过 `docs/开发验收总清单.md`。

## 9. 重要约束

如果文档和实现冲突，以以下优先级为准：

1. `产品原则.md`
2. `REPOSITORY_SPEC.md`
3. `docs/核心商业闭环开发路线.md`
4. `docs/AI持仓体检报告PRD.md`
5. `docs/报告页设计.md`
6. `specs/API设计.md`
7. `specs/数据库设计.md`

不要因为实现方便而改变产品边界。
