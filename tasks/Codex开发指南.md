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
5. `docs/MVP产品设计.md`
6. `docs/信息架构.md`
7. `docs/页面设计.md`
8. `docs/用户流程.md`
9. `docs/决策引擎.md`
10. `specs/API设计.md`
11. `specs/数据库设计.md`
12. `specs/AI输出结构.md`
13. `specs/前端架构.md`
14. `specs/后端架构.md`
15. `specs/数据同步设计.md`

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

## 5. 第一批代码任务

### 5.1 初始化工程

创建：

```text
frontend/
backend/
scripts/
infra/
```

并保证可以本地启动。

### 5.2 后端 MVP

实现：

- `GET /health`
- `GET /api/market/status`
- `GET /api/assets/search`
- `POST /api/analysis/asset`
- `POST /api/portfolio`
- `POST /api/analysis/portfolio`
- `GET /api/analysis/history`
- `GET /api/settings`
- `POST /api/settings`

第一版可以使用 mock 数据，但接口结构必须符合文档。

### 5.3 前端 MVP

实现页面：

- `/` 首页；
- `/assets` 标的分析；
- `/portfolio` 持仓分析；
- `/history` 历史记录；
- `/settings` 设置。

### 5.4 数据库 MVP

根据 `specs/数据库设计.md` 创建表结构。

第一批表：

- users；
- user_investment_dna；
- asset_basic；
- asset_daily_price；
- asset_daily_basic；
- index_daily_price；
- user_portfolio_position；
- analysis_record。

### 5.5 AI 输出 MVP

根据 `specs/AI输出结构.md` 生成结构化结果。

第一版可以先 mock AI 解释，但必须保留结构。

## 6. 验收标准

完成后应满足：

1. 本地可以启动前端；
2. 本地可以启动后端；
3. 首页可以请求市场状态接口；
4. 标的分析页可以提交标的并展示结果；
5. 持仓页可以录入持仓并展示结果；
6. 历史页可以展示分析记录；
7. 设置页可以展示配置项；
8. 所有用户可见文案使用中文。

## 7. 开发原则

1. 先实现 mock 闭环，再接真实数据。
2. 先保证接口稳定，再优化 UI。
3. 先结构化输出，再自然语言解释。
4. 不擅自扩大功能范围。
5. 对不确定问题，在 TODO 中记录。

## 8. 建议执行顺序

1. 创建后端 FastAPI 项目；
2. 创建 mock API；
3. 创建前端页面；
4. 前后端联调；
5. 加入数据库；
6. 接入 Tushare；
7. 接入 AI 服务；
8. 完成历史记录。
