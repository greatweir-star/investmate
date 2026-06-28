# 组件规格：MarketStatusCard

## 1. 组件目标

MarketStatusCard 用于在首页展示当前市场状态摘要。

它不负责深度分析，只负责让用户快速理解当前市场环境。

## 2. 使用页面

- 首页 `/`

## 3. 输入 Props

```ts
type MarketStatusCardProps = {
  marketState: string;
  marketScore: number;
  riskLevel: "low" | "medium" | "high" | "unknown";
  summary: string;
  dataDate: string;
  keyFactors: string[];
};
```

## 4. 输出 UI

展示内容：

- 市场状态标签；
- 市场评分；
- 风险等级；
- 一句话摘要；
- 关键因素列表；
- 数据日期。

## 5. 视觉规则

### 风险等级展示

```text
low       低风险
medium    中等风险
high      高风险
unknown   未知
```

### 市场评分展示

评分范围：0 到 100。

前端显示为：

```text
市场评分：68 / 100
```

## 6. 空状态

如果 `marketState` 为空：

显示：

```text
暂无市场状态数据
```

并提示：

```text
请先完成数据同步。
```

## 7. 异常状态

如果 `marketScore` 超出 0 到 100：

前端不崩溃，显示 `--`。

## 8. 交互

MVP 阶段无复杂交互。

后续可以增加“查看详情”按钮，跳转到市场分析详情页。

## 9. 验收标准

1. 能正确渲染市场状态；
2. 能正确渲染风险等级；
3. 能正确处理空状态；
4. 能展示数据日期；
5. 不包含绝对化或刺激性文案。
