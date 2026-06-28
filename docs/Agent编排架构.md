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
5. 复盘 Agent。

## 3. 数据整理 Agent

### 职责

把用户输入的持仓补充成可分析对象。

### 输入

- positions；
- asset_basic；
- data_date。

### 输出

- enriched_positions；
- missing_fields；
- data_quality_notes。

### 边界

不生成解释，不判断好坏，只整理数据。

## 4. 持仓分析 Agent

### 职责

基于 enriched_positions 生成结构化分析结果。

### 输入

- enriched_positions；
- user_investment_dna；
- report_rules。

### 输出

- health_score；
- score_items；
- exposure_items；
- watch_items；
- assumptions。

### 边界

优先使用规则和计算结果，不直接输出最终结论。

## 5. 报告解释 Agent

### 职责

把结构化结果转化为用户可理解的中文解释。

### 输入

- structured_report；
- user_investment_dna；
- explanation_style；
- output_constraints。

### 输出

- short_summary；
- detailed_explanation；
- next_review_focus；
- data_notes。

### 边界

解释必须基于 structured_report，不添加无依据内容。

## 6. 边界检查 Agent

### 职责

检查报告解释是否符合产品边界。

### 输入

- report_explanation；
- product_principles；
- forbidden_patterns。

### 输出

- passed；
- issues；
- revised_text。

### 边界

只做检查和修订，不改变结构化事实。

## 7. 复盘 Agent

### 职责

比较历史报告，生成复盘摘要。

### 输入

- current_report；
- previous_report；
- user_feedback；
- data_date。

### 输出

- changes；
- continued_watch_items；
- resolved_items；
- next_review_focus。

### 边界

只做变化说明和复盘线索，不替用户做最终判断。

## 8. 编排流程

```text
用户输入持仓
  ↓
数据整理 Agent
  ↓
持仓分析 Agent
  ↓
报告解释 Agent
  ↓
边界检查 Agent
  ↓
保存报告
  ↓
复盘 Agent
```

## 9. 后端实现建议

建议在后端创建 agent_orchestrator 服务。

核心方法：

- build_enriched_positions；
- generate_structured_report；
- generate_explanation；
- run_boundary_check；
- save_report；
- generate_review_report。

## 10. MVP 实现

MVP 可以先用规则函数模拟 Agent。

接口和数据结构先稳定，后续再替换为真实模型调用。

## 11. 验收标准

- 每个 Agent 有明确输入输出；
- 报告生成链路可跑通；
- 解释基于结构化结果；
- 边界检查可执行；
- 历史报告可进入复盘链路。
