"use client";

import { useEffect, useState } from "react";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { FooterNotice } from "@/components/layout/FooterNotice";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { api } from "@/lib/api";
import type { AppSettings, InvestmentDNA, SyncStatus } from "@/lib/types";

const fallbackDna: InvestmentDNA = {
  risk_level: "balanced",
  investment_horizon: "1-3y",
  max_drawdown_tolerance: 0.15,
  asset_preferences: ["a_share", "etf"],
  trading_frequency: "medium",
  experience_level: "intermediate",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [dna, setDna] = useState<InvestmentDNA>(fallbackDna);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api.getSettings(), api.getSyncStatus()])
      .then(([appSettings, sync]) => {
        if (!active) return;
        setSettings(appSettings);
        setDna(appSettings.investment_dna);
        setSyncStatus(sync);
      })
      .catch((err: Error) => {
        if (active) setMessage(err.message || "设置暂时无法加载，请稍后重试。");
      });
    return () => {
      active = false;
    };
  }, []);

  async function saveSettings() {
    setMessage("");
    try {
      await api.saveSettings(dna);
      setMessage("设置已保存。后续分析会参考新的投资偏好。");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "保存失败，请稍后重试。");
    }
  }

  async function triggerSync() {
    setMessage("");
    try {
      await api.triggerSync(["asset_basic", "market_status"]);
      setSyncStatus(await api.getSyncStatus());
      setMessage("mock 数据同步已完成。");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "同步暂时无法完成，请稍后重试。");
    }
  }

  return (
    <div className="page-shell">
      <PageHeader
        title="设置"
        description="查看数据源、AI 服务和投资 DNA。敏感字段只展示配置状态，不展示明文。"
        question="页面回答：系统使用哪些数据、哪些模型，以及如何根据我的投资偏好工作？"
      />

      {message ? <div className="mb-5 rounded-md bg-pineSoft px-4 py-3 text-sm text-pine">{message}</div> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Panel title="数据源状态">
          <StatusRow label="Tushare Token" value={settings?.data_source.tushare_configured ? "已配置" : "未配置"} />
          <StatusRow label="最新数据日期" value={settings?.data_source.latest_data_date || syncStatus?.latest_data_date || "--"} />
          <StatusRow label="同步状态" value={syncStatus?.status === "success" ? "已同步" : "mock 可用"} />
          <button type="button" onClick={triggerSync} className="mt-4 h-10 rounded-md border border-pine px-4 text-sm font-bold text-pine">
            触发 mock 同步
          </button>
        </Panel>
        <Panel title="AI 服务状态">
          <StatusRow label="模型服务" value="兼容 OpenAI" />
          <StatusRow label="模型名称" value={settings?.ai_service.model_name || "gpt-4o-mini"} />
          <StatusRow label="API Key" value={settings?.ai_service.api_key_configured ? "已配置" : "未配置"} />
          <p className="mt-4 text-sm leading-6 text-slate-600">第一版保留 mock 解释服务，后续可替换为真实模型调用。</p>
        </Panel>
      </div>

      <div className="mt-5">
        <SettingsForm value={dna} onChange={setDna} />
      </div>

      <div className="mt-5 flex justify-end">
        <button type="button" onClick={saveSettings} className="h-11 rounded-md bg-pine px-5 text-sm font-bold text-white">
          保存设置
        </button>
      </div>

      <FooterNotice />
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}
