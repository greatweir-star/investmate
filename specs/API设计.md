# API 设计

## 1. 目标

本文档定义 InvestMate MVP 阶段的后端 API。

API 第一阶段服务于五类能力：

1. 市场状态展示；
2. 标的搜索与分析；
3. 用户持仓保存与分析；
4. 历史记录查询；
5. 基础设置读取与保存。

所有接口必须返回结构化 JSON，不能只返回自然语言。

## 2. 通用响应格式

### 成功响应

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "request_id": "req_demo",
    "generated_at": "2026-06-28T16:00:00+08:00",
    "data_date": "2026-06-28",
    "version": "v0.1"
  }
}
```

### 失败响应

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "DATA_NOT_FOUND",
    "message": "暂无可用数据"
  },
  "meta": {
    "request_id": "req_demo",
    "version": "v0.1"
  }
}
```

## 3. 健康检查

### GET /health

用途：确认后端服务是否正常。

响应：

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "investmate-api",
    "version": "v0.1"
  },
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

## 4. 市场状态

### GET /api/market/status

用途：返回首页市场状态卡片所需数据。

请求参数：

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| date | string | 否 | 指定数据日期，MVP 可不实现 |

响应：

```json
{
  "success": true,
  "data": {
    "market_state": "震荡",
    "market_score": 60,
    "risk_level": "medium",
    "summary": "当前市场环境偏震荡，适合保持观察和结构化研究。",
    "key_factors": [
      "主要指数处于区间波动",
      "成交额没有明显放大"
    ],
    "risk_factors": [
      "部分方向波动较大"
    ],
    "data_date": "2026-06-28"
  },
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

## 5. 标的搜索

### GET /api/assets/search

用途：根据代码或名称搜索股票、ETF 或指数。

请求示例：

```text
GET /api/assets/search?keyword=510300
```

响应：

```json
{
  "success": true,
  "data": [
    {
      "asset_code": "510300.SH",
      "asset_name": "沪深300ETF",
      "asset_type": "etf",
      "market": "SH",
      "industry": "宽基ETF"
    }
  ],
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

空结果：

```json
{
  "success": true,
  "data": [],
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

## 6. 标的分析

### POST /api/analysis/asset

用途：对单个标的生成结构化分析结果。

请求：

```json
{
  "asset_code": "510300.SH",
  "question": "我想了解这个 ETF 当前有哪些值得关注的因素",
  "user_id": "demo_user"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "analysis_id": "ana_asset_demo",
    "analysis_type": "asset_review",
    "asset_code": "510300.SH",
    "asset_name": "沪深300ETF",
    "asset_type": "etf",
    "scores": {
      "trend": 70,
      "valuation": 60,
      "liquidity": 85,
      "risk": 45,
      "fit_to_user": 68
    },
    "risk_level": "medium",
    "confidence": 0.74,
    "summary": "该标的适合作为后续研究对象，但需要结合用户组合比例评估。",
    "key_factors": [
      "流动性较好",
      "宽基属性较强"
    ],
    "risk_factors": [
      "仍会受到整体市场波动影响"
    ],
    "explanation": "该 ETF 具备宽基和流动性特点，但是否适合加入组合，需要结合用户当前资产比例和风险偏好。",
    "data_date": "2026-06-28"
  },
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

## 7. 保存持仓

### POST /api/portfolio

用途：保存用户手动录入的持仓结构。

请求：

```json
{
  "user_id": "demo_user",
  "positions": [
    {
      "asset_code": "510300.SH",
      "asset_name": "沪深300ETF",
      "weight": 0.3,
      "cost_price": 3.5,
      "note": "宽基配置"
    }
  ]
}
```

响应：

```json
{
  "success": true,
  "data": {
    "portfolio_id": "portfolio_demo",
    "user_id": "demo_user",
    "position_count": 1,
    "total_weight": 0.3,
    "updated_at": "2026-06-28T16:00:00+08:00"
  },
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

## 8. 持仓分析

### POST /api/analysis/portfolio

用途：根据用户持仓生成组合结构分析。

请求：

```json
{
  "user_id": "demo_user"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "analysis_id": "ana_portfolio_demo",
    "analysis_type": "portfolio_review",
    "risk_level": "medium",
    "confidence": 0.72,
    "concentration_risk": "medium",
    "industry_exposure": [
      {
        "industry": "宽基ETF",
        "weight": 0.3
      }
    ],
    "style_exposure": [
      {
        "style": "权益类",
        "weight": 0.3
      }
    ],
    "fit_to_user": 66,
    "summary": "当前组合需要关注权益类资产比例和单一方向集中度。",
    "key_factors": [
      "组合中包含宽基资产"
    ],
    "risk_factors": [
      "当权益类资产占比较高时，组合波动可能增加"
    ],
    "explanation": "从当前录入持仓看，组合具备一定分散基础，但仍需要结合用户投资周期和风险偏好进一步评估。"
  },
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

## 9. 历史记录

### GET /api/analysis/history

用途：获取历史分析记录列表。

请求示例：

```text
GET /api/analysis/history?user_id=demo_user&limit=20
```

响应：

```json
{
  "success": true,
  "data": [
    {
      "analysis_id": "ana_asset_demo",
      "analysis_type": "asset_review",
      "target_name": "沪深300ETF",
      "summary": "该标的适合作为后续研究对象。",
      "risk_level": "medium",
      "confidence": 0.74,
      "data_date": "2026-06-28",
      "created_at": "2026-06-28T16:00:00+08:00"
    }
  ],
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

### GET /api/analysis/{analysis_id}

用途：获取单条分析详情。

响应中的 data 应返回 `analysis_record` 的完整结构化结果。

## 10. 设置

### GET /api/settings

用途：获取当前系统设置状态。

响应：

```json
{
  "success": true,
  "data": {
    "data_source": {
      "tushare_configured": false,
      "latest_data_date": null
    },
    "ai_service": {
      "provider": "openai_compatible",
      "model_name": "gpt-4o-mini",
      "api_key_configured": false
    },
    "investment_dna": {
      "risk_level": "balanced",
      "investment_horizon": "1-3y",
      "max_drawdown_tolerance": 0.15,
      "asset_preferences": ["a_share", "etf"],
      "experience_level": "intermediate"
    }
  },
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

### POST /api/settings

用途：保存基础设置和用户投资 DNA。

请求：

```json
{
  "investment_dna": {
    "risk_level": "balanced",
    "investment_horizon": "1-3y",
    "max_drawdown_tolerance": 0.15,
    "asset_preferences": ["a_share", "etf"],
    "experience_level": "intermediate"
  }
}
```

响应：

```json
{
  "success": true,
  "data": {
    "saved": true,
    "updated_at": "2026-06-28T16:00:00+08:00"
  },
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

## 11. 数据同步

### POST /api/admin/sync

用途：触发数据同步。MVP 可以先返回 mock 结果。

请求：

```json
{
  "scope": ["asset_basic", "daily_price", "index_daily"],
  "trade_date": "2026-06-28"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "sync_id": "sync_demo",
    "status": "queued",
    "scope": ["asset_basic", "daily_price", "index_daily"]
  },
  "error": null,
  "meta": {
    "version": "v0.1"
  }
}
```

## 12. 通用错误码

| code | 说明 |
|---|---|
| DATA_NOT_FOUND | 数据不存在 |
| INVALID_INPUT | 输入不合法 |
| ASSET_NOT_FOUND | 未找到标的 |
| DATA_NOT_READY | 数据尚未同步 |
| AI_SERVICE_ERROR | AI 服务异常 |
| INTERNAL_ERROR | 服务内部错误 |

## 13. MVP 验收标准

1. 所有接口返回统一结构；
2. 所有用户可见 message 使用中文；
3. 所有分析结果包含结构化字段；
4. 历史记录可以保存和查询；
5. mock 数据链路可以完整跑通。
