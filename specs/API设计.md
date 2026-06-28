# API 设计

## 1. API 设计目标

InvestMate 的 API 第一阶段服务于 Web MVP，主要支持数据查询、标的分析、持仓分析、用户画像和历史记录。

API 需要保证：

- 返回结构化 JSON；
- 错误信息清晰；
- 保留数据日期；
- 支持后续复盘；
- 不把 AI 自然语言作为唯一结果。

## 2. 通用响应格式

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "request_id": "req_xxx",
    "generated_at": "2026-06-28T16:00:00+08:00",
    "data_date": "2026-06-28",
    "version": "v0.1"
  }
}
```

错误响应：

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "DATA_NOT_FOUND",
    "message": "未找到该标的数据"
  },
  "meta": {
    "request_id": "req_xxx"
  }
}
```

## 3. 用户画像 API

### 3.1 获取用户投资 DNA

```http
GET /api/user/investment-dna
```

返回：

```json
{
  "risk_level": "balanced",
  "investment_horizon": "1-3y",
  "max_drawdown_tolerance": 0.15,
  "asset_preferences": ["a_share", "etf"],
  "experience_level": "intermediate"
}
```

### 3.2 更新用户投资 DNA

```http
POST /api/user/investment-dna
```

请求：

```json
{
  "risk_level": "balanced",
  "investment_horizon": "1-3y",
  "max_drawdown_tolerance": 0.15,
  "asset_preferences": ["a_share", "etf"],
  "trading_frequency": "monthly",
  "experience_level": "intermediate"
}
```

## 4. 市场状态 API

### 4.1 获取市场状态

```http
GET /api/market/status
```

返回：

```json
{
  "market_state": "震荡偏强",
  "market_score": 68,
  "risk_level": "medium",
  "key_factors": [
    "主要指数位于中期均线附近",
    "成交额较近期均值略有放大"
  ],
  "risk_factors": [
    "部分高波动方向短期涨幅较大"
  ],
  "summary": "当前市场处于震荡偏强状态，但仍需关注波动风险。"
}
```

## 5. 标的分析 API

### 5.1 查询标的

```http
GET /api/assets/search?keyword=510300
```

返回：

```json
[
  {
    "asset_code": "510300.SH",
    "asset_name": "沪深300ETF",
    "asset_type": "etf",
    "market": "SH"
  }
]
```

### 5.2 标的分析

```http
POST /api/analysis/asset
```

请求：

```json
{
  "asset_code": "510300.SH",
  "question": "我想了解这个 ETF 当前是否值得关注",
  "user_id": "demo_user"
}
```

返回：

```json
{
  "analysis_id": "ana_xxx",
  "asset_code": "510300.SH",
  "asset_name": "沪深300ETF",
  "scores": {
    "trend": 72,
    "valuation": 60,
    "liquidity": 85,
    "risk": 40,
    "fit_to_user": 68
  },
  "risk_level": "medium",
  "confidence": 0.74,
  "key_factors": [
    "流动性较好",
    "宽基属性较强"
  ],
  "risk_factors": [
    "仍会受到整体市场波动影响"
  ],
  "summary": "该标的适合进一步研究，但需要结合用户整体持仓比例判断。"
}
```

## 6. 持仓 API

### 6.1 创建或更新持仓

```http
POST /api/portfolio
```

请求：

```json
{
  "user_id": "demo_user",
  "positions": [
    {
      "asset_code": "510300.SH",
      "weight": 0.3,
      "cost_price": 3.5
    }
  ]
}
```

### 6.2 持仓分析

```http
POST /api/analysis/portfolio
```

请求：

```json
{
  "user_id": "demo_user"
}
```

返回：

```json
{
  "analysis_id": "ana_portfolio_xxx",
  "concentration_risk": "medium",
  "industry_exposure": [
    {
      "industry": "宽基ETF",
      "weight": 0.3
    }
  ],
  "risk_factors": [
    "权益类资产占比较高时，组合波动可能增加"
  ],
  "summary": "当前组合需要重点关注权益类资产比例和单一方向集中度。"
}
```

## 7. 历史记录 API

### 7.1 获取历史分析列表

```http
GET /api/analysis/history?user_id=demo_user
```

### 7.2 获取分析详情

```http
GET /api/analysis/{analysis_id}
```

## 8. 数据同步 API

### 8.1 手动触发数据同步

```http
POST /api/admin/sync/tushare
```

请求：

```json
{
  "date": "2026-06-28",
  "scope": ["daily", "index", "daily_basic"]
}
```

## 9. MVP API 优先级

优先开发：

1. `/api/assets/search`
2. `/api/analysis/asset`
3. `/api/portfolio`
4. `/api/analysis/portfolio`
5. `/api/analysis/history`
6. `/api/market/status`

可以后置：

- 用户登录；
- 支付；
- 权限；
- 多租户；
- 自动邮件；
- 第三方平台发布。
