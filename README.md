# InvestMate

> AI 投资副驾驶：每一次投资判断，都值得一个 AI 第二意见。

InvestMate 是一个面向个人投资者的 AI 投研辅助系统。它帮助用户整理市场数据、理解标的状态、识别持仓风险，并形成更清晰的个人判断。

## 一句话定位

**帮助普通投资者做出更清晰、更克制、更有证据支持的投资判断。**

## 核心理念

普通投资者真正缺少的往往不是信息，而是把信息转化为稳定判断的流程。

InvestMate 不追求制造更多观点，而是帮助用户在研究市场、查看持仓、评估风险和复盘历史时，多一个冷静、结构化、可解释的 AI 视角。

## 产品边界

第一阶段只做投研辅助，不做：

- 自动化交易；
- 账户托管；
- 收益承诺；
- 高频行情；
- 券商接口；
- 盘中即时指令。

## MVP 核心功能

第一版验证四个能力：

1. **市场状态**：整理当前市场环境和主要风险因素。
2. **标的分析**：输入股票、ETF 或指数，获得结构化分析。
3. **持仓分析**：手动录入持仓，识别组合结构问题。
4. **历史复盘**：保存系统输出，支持后续回看和验证。

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
2. 先做核心分析闭环，再做复杂界面。
3. 所有输出先结构化，再生成中文解释。
4. 所有重要输出都要保存，便于复盘。
5. 任何功能都必须服务于“帮助用户形成更好的投资判断”。

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
4. 前后端联调；
5. 创建数据库表；
6. 接入数据同步；
7. 接入 AI 解释服务。

### 8. MVP 验收目标

第一阶段完成后，应支持：

1. 首页展示市场状态；
2. 标的分析页展示结构化分析；
3. 持仓页展示组合分析；
4. 历史页展示分析记录；
5. 设置页展示配置状态；
6. 所有用户可见文案为中文。

## 免责声明

InvestMate 是投研辅助和信息分析工具，不是证券投资顾问、经纪商、资产管理人或交易系统。系统输出仅用于辅助研究和个人判断，不构成任何形式的收益承诺或交易指令。
