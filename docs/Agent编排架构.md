# Agent 编排架构

## 1. 目标

本文档定义 InvestMate 的 Agent 编排方式。

Agent 不是聊天机器人，而是产品工作流中的任务单元。

每个 Agent 都应该有明确输入、输出、职责和边界。

## 2. Agent 列表

第一阶段建议包含：

1. 数据整理 Agent；
2. 持仓分析 Agent；
3. 报告解释 Agent；
4. 边界检查 Agent；
5. 复盘 Agent；
6. 反馈归类 Agent。

## 3. 编排原则

### 3.1 规则优先，AI 补充

能用规则计算的部分先用规则计算。

AI 主要负责解释、组织语言、生成用户可理解的说明。

### 3.2 单一职责

每个 Agent 只做一类任务，避免一个大模型调用承担所有工作。

### 3.3 输出结构稳定

Agent 输出必须可以映射到固定字段，不能只返回长文本。

### 3.4 可降级

如果某个 Agent 失败，系统应尽量保留已完成的结构化结果。

## 4. Agent 角色定义

### 4.1 数据整理 Agent

职责：

- 校验用户输入；
- 补全 asset_type、industry、style；
- 标记数据完整度；
- 输出 PositionEnriched。

输入：PositionInput。

输出：PositionEnriched[]。

### 4.2 持仓分析 Agent

职责：

- 读取补全后的持仓；
- 计算分散度；
- 计算分布；
- 生成 ScoreItem 和 ExposureItem。

输入：PositionEnriched[]、user_investment_dna。

输出：score_items、exposure_items、watch_items。

### 4.3 报告解释 Agent

职责：

- 基于结构化结果生成中文解释；
- 输出 short_summary 和 detailed_explanation；
- 说明 assumptions 和 data_notes。

输入：Report 结构化结果。

输出：ReportExplanation。

### 4.4 边界检查 Agent

职责：

- 检查输出是否过度绝对；
- 检查是否缺少数据日期；
- 检查是否脱离结构化依据；
- 检查是否需要补充说明。

输入：Report + ReportExplanation。

输出：checked_report、check_notes。

### 4.5 复盘 Agent

职责：

- 对比本次报告和上次报告；
- 找出变化；
- 延续上次关注事项；
- 生成周度复盘摘要。

输入：current_report、previous_report、feedback。

输出：weekly_review_report。

### 4.6 反馈归类 Agent

职责：

- 将用户反馈归类；
- 标记解释问题、页面问题、数据问题或新需求；
- 输出给产品迭代。

输入：feedback。

输出：feedback_category、priority、notes。

## 5. 编排流程

```text
PositionInput
  ↓
数据整理 Agent
  ↓
持仓分析 Agent
  ↓
报告解释 Agent
  ↓
边界检查 Agent
  ↓
Report 保存
  ↓
反馈归类 Agent
  ↓
复盘 Agent
```

## 6. 后端实现建议

建议在后端建立 `agent_orchestrator` 服务。

职责：

- 统一调用 Agent；
- 维护上下文；
- 记录 prompt_version；
- 记录 model_version；
- 处理失败和降级。

## 7. 日志要求

每次 Agent 调用记录：

- agent_name；
- input_hash；
- output_status；
- prompt_version；
- model_version；
- latency_ms；
- error_message。

## 8. 验收标准

- 每个 Agent 有独立输入输出；
- 编排流程可跑通；
- 失败时可以降级；
- 报告结果可保存；
- Prompt 版本和模型版本可追踪。
