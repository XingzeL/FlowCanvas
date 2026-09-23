import { useRef } from "react";
import type { ParserInfo, ReportMeta } from "../../types";
import { fmtFileSize } from "../../utils/format";
import { PLATFORM_COLORS } from "../../theme/categories";

const PLATFORM_LABELS: Record<string, string> = {
  alipay: "支付宝",
  wechat: "微信",
  cmb: "招行",
  boc: "中行",
};

type Props = {
  parsers: ParserInfo[];
  files: Record<string, File | null>;
  onFileChange: (id: string, file: File | null) => void;
  sources?: ReportMeta["sources"];
};

export function DataSourceCards({
  parsers,
  files,
  onFileChange,
  sources,
}: Props) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const statusFor = (id: string) => {
    const file = files[id];
    const src = sources?.[id];
    if (src?.error) return { text: src.error, kind: "err" as const };
    if (file) return { text: "已上传", kind: "ok" as const };
    if (src?.skipped) return { text: "未上传", kind: "muted" as const };
    return { text: "未上传", kind: "muted" as const };
  };

  return (
    <section className="section-block" id="upload">
      <h2 className="section-title">数据源</h2>
      <div className="source-cards">
        {parsers.map((p) => {
          const file = files[p.id];
          const label = PLATFORM_LABELS[p.id] ?? p.displayName;
          const color = PLATFORM_COLORS[label] ?? "#64748B";
          const status = statusFor(p.id);
          return (
            <button
              key={p.id}
              type="button"
              className="source-card"
              onClick={() => inputRefs.current[p.id]?.click()}
            >
              <div className="source-card-icon" style={{ background: `${color}14`, color }}>
                <span className="source-dot" style={{ background: color }} />
                {label.slice(0, 1)}
              </div>
              <div className="source-card-body">
                <div className="source-card-name">{label}</div>
                {file ? (
                  <>
                    <div className="source-card-file">{file.name}</div>
                    <div className="source-card-size">{fmtFileSize(file.size)}</div>
                  </>
                ) : (
                  <div className="source-card-hint">
                    {p.filePatterns.join(" / ") || "点击选择文件"}
                  </div>
                )}
              </div>
              <span className={`source-status source-status--${status.kind}`}>
                {status.text}
              </span>
              <input
                ref={(el) => { inputRefs.current[p.id] = el; }}
                type="file"
                hidden
                onChange={(e) => onFileChange(p.id, e.target.files?.[0] ?? null)}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
