# InvestMate

> AI 持仓体检报告：录入持仓，看清组合结构、集中度和需要关注的问题。

InvestMate 是一个面向个人投资者的 AI 投研辅助系统。第一阶段优先聚焦“AI 持仓体检报告”，帮助用户整理自己的组合结构、理解主要暴露、保存历史结果，并形成更稳定的复盘流程。

长期愿景是成为用户的 AI 投资副驾驶，但 MVP 阶段先从一个更具体、更容易验证的核心场景切入：

```text
录入持仓
  ↓
生成体检报告
  ↓
查看组合结构
  ↓
保存历史
  ↓
周期复盘
```

## 一句话定位

**帮助普通投资者看清自己的持仓结构，并用结构化方式进行复盘。**

## 核心理念

普通投资者真正缺少的往往不是信息，而是把信息转化为稳定判断的流程。

InvestMate 不追求制造更多观点，而是帮助用户在查看持仓、研究标的、评估风险和回看历史时，多一个冷静、结构化、可解释的 AI 视角。

## 第一阶段主线

第一阶段开发优先级不是“做很多功能”，而是先跑通最关键的商业闭环：

```text
持仓录入
  ↓
AI 持仓体检报告
  ↓
报告保存
  ↓
历史回看
  ↓
周度复盘
  ↓
用户反馈
```

相关文档：

- `docs/核心商业闭环开发路线.md`
- `docs/AI持仓体检报告PRD.md`
- `docs/报告页设计.md`
- `docs/报告评分规则.md`
- `docs/报告字段规格.md`
- `docs/周度复盘PRD.md`

## 产品边界

第一阶段只做投研辅助，不做：

- 自动化交易；
- 账户托管；
- 收益承诺；
- 高频行情；
- 券商接口；
- 盘中即时指令。

## MVP 核心功能

第一版验证五个能力：

1. **AI 持仓体检报告**：手动录入持仓，生成结构化组合报告。
2. **组合结构分析**：查看集中度、分布情况、用户偏好匹配度和关注事项。
3. **标的分析**：输入股票、ETF 或指数，获得结构化分析。
4. **历史复盘**：保存系统输出，支持后续回看和验证。
5. **周度复盘**：基于历史报告形成周期性回看。

## 第一阶段数据源

第一阶段默认使用 Tushare 数据，适合做 A 股中低频投研辅助：

- 股票基础信息；
- 日线行情；
- 指数行情；
- ETF 行情；
- 每日基本面；
- 财务指标；
- 行业分类；
- 交易日历。

## 仓库结构

```text
investmate/
├── README.md
├── 项目愿景.md
├── 产品原则.md
├── 开发路线图.md
├── 更新日志.md
├── REPOSITORY_SPEC.md
├── docs/
├── specs/
├── prompts/
├── tasks/
├── prd/
├── frontend/
└── backend/
```

## 开发原则

1. 文档使用中文，代码、API、数据库字段使用英文。
2. 先做 AI 持仓体检报告闭环，再做复杂界面。
3. 所有输出先结构化，再生成中文解释。
4. 所有重要输出都要保存，便于复盘。
5. 任何功能都必须服务于“帮助用户看清结构、形成复盘流程”。

## 本地启动说明

> 当前仓库已经完成产品规格和部分工程骨架。Codex 应先阅读 `tasks/Codex开发指南.md`，再补齐可运行代码。

### 1. 克隆仓库

```bash
git clone https://github.com/greatweir-star/investmate.git
cd investmate
```

### 2. 推荐开发环境

- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- npm 或 pnpm

### 3. 前端启动方式

当前计划使用 Next.js。

```bash
cd frontend
npm install
npm run dev
```

默认访问：

```text
http://localhost:3000
```

### 4. 后端启动方式

当前计划使用 FastAPI。

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

默认访问：

```text
http://localhost:8000/docs
```

### 5. 环境变量

建议创建 `.env` 或 `.env.local`。

必要配置：

```text
DATABASE_URL=postgresql://user:password@localhost:5432/investmate
TUSHARE_TOKEN=你的 Tushare Token
OPENAI_API_KEY=你的模型服务 Key
OPENAI_MODEL=gpt-4o-mini
```

### 6. 数据库初始化

根据 `specs/数据库设计.md` 中的 SQL 创建 PostgreSQL 表。

第一阶段至少需要：

- users；
- user_investment_dna；
- asset_basic；
- user_portfolio_position；
- analysis_record。

### 7. Codex 开发入口

Codex 应从以下文件开始：

```text
tasks/Codex开发指南.md
```

执行顺序：

1. 初始化工程目录；
2. 创建前端页面；
3. 创建后端 mock API；
4. 优先实现 AI 持仓体检报告；
5. 前后端联调；
6. 创建数据库表；
7. 接入数据同步；
8. 接入 AI 解释服务。

### 8. MVP 验收目标

第一阶段完成后，应支持：

1. 用户录入持仓；
2. 生成 AI 持仓体检报告；
3. 报告展示组合摘要、健康度、分布、关注事项和中文解释；
4. 报告保存到历史记录；
5. 用户可以回看历史报告；
6. 设置页展示配置状态；
7. 所有用户可见文案为中文。

## 免责声明

InvestMate 是投研辅助和信息分析工具，不是证券投资顾问、经纪商、资产管理人或交易系统。系统输出仅用于辅助研究和个人判断，不构成任何形式的收益承诺或交易指令。
