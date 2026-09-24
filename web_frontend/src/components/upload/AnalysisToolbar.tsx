import { RefreshCw, Trash2 } from "lucide-react";
import type { Granularity } from "../../types";

type Props = {
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
  pureSpending: boolean;
  onPureSpendingChange: (v: boolean) => void;
  largeThreshold: number;
  onLargeThresholdChange: (v: number) => void;
  onAnalyze: () => void;
  onClearFiles: () => void;
  loading: boolean;
  hasFile: boolean;
  hasReport: boolean;
  error: string | null;
};

export function AnalysisToolbar({
  granularity,
  onGranularityChange,
  pureSpending,
  onPureSpendingChange,
  largeThreshold,
  onLargeThresholdChange,
  onAnalyze,
  onClearFiles,
  loading,
  hasFile,
  hasReport,
  error,
}: Props) {
  const canClear = hasFile || hasReport;

  return (
    <section className="toolbar-card">
      <div className="toolbar-row">
        <label className="toolbar-field">
          <span>小区间粒度</span>
          <select
            value={granularity}
            onChange={(e) => onGranularityChange(e.target.value as Granularity)}
          >
            <option value="month">月</option>
            <option value="week">周</option>
            <option value="3day">3 天</option>
            <option value="day">日</option>
          </select>
        </label>

        <label className="toolbar-switch">
          <span>纯花销模式</span>
          <button
            type="button"
            role="switch"
            aria-checked={pureSpending}
            className={`switch ${pureSpending ? "on" : ""}`}
            onClick={() => onPureSpendingChange(!pureSpending)}
          >
            <span className="switch-thumb" />
          </button>
        </label>

        <label className="toolbar-field">
          <span>大额阈值</span>
          <input
            type="number"
            min={100}
            step={100}
            value={largeThreshold}
            onChange={(e) => onLargeThresholdChange(Number(e.target.value))}
          />
        </label>

        <button
          type="button"
          className="btn-primary"
          disabled={!hasFile || loading}
          onClick={onAnalyze}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} />
          {loading ? "分析中…" : hasReport ? "重新分析" : "开始分析"}
        </button>

        <button
          type="button"
          className="btn-secondary"
          disabled={!canClear || loading}
          onClick={onClearFiles}
        >
          <Trash2 size={16} />
          一键清空
        </button>
      </div>
      {error && <div className="error-banner">{error}</div>}
    </section>
  );
}
