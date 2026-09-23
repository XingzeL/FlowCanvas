import { Settings } from "lucide-react";

type Props = {
  dateRange?: string;
  onSettingsClick?: () => void;
};

export function TopHeader({ dateRange, onSettingsClick }: Props) {
  return (
    <header className="top-header">
      <div>
        <h1 className="top-header-title">支出分析</h1>
        <p className="top-header-sub">四源流水 · 本机分析</p>
      </div>
      <div className="top-header-actions">
        <span className="badge-local">仅在本机处理</span>
        {dateRange ? (
          <span className="date-pill">{dateRange}</span>
        ) : (
          <span className="date-pill muted-pill">上传文件后分析</span>
        )}
        <button
          type="button"
          className="icon-btn"
          aria-label="设置"
          onClick={onSettingsClick}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
