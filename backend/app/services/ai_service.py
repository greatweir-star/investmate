def explain_asset(result: dict) -> str:
    key_text = "；".join(result.get("key_factors", [])) or "当前可用信息有限"
    risk_text = "；".join(result.get("risk_factors", [])) or "暂未识别到突出的单项风险"
    return (
        f"{result['asset_name']}的结构化结果显示：{key_text}。"
        f"需要关注的是：{risk_text}。"
        "这不是交易建议，更适合作为继续研究和复盘的参考。"
    )


def explain_portfolio(result: dict) -> str:
    key_text = "；".join(result.get("key_factors", [])) or "组合已具备基础分散"
    risk_text = "；".join(result.get("risk_factors", [])) or "暂未识别到明显单点风险"
    return (
        f"这份持仓体检主要看到：{key_text}。"
        f"下一步需要重点回看：{risk_text}。"
        "系统只提供结构化第二意见，最终是否调整仍应结合你的投资期限和风险承受能力。"
    )
