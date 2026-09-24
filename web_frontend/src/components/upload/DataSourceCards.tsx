import { useRef, useState } from "react";
import type { ParserInfo, ReportMeta } from "../../types";
import { PLATFORM_COLORS, PLATFORM_LABELS } from "../../theme/categories";
import { fmtFileSize } from "../../utils/format";

const BANK_IDS = ["cmb", "boc"] as const;
type BankId = (typeof BANK_IDS)[number];

type Props = {
  parsers: ParserInfo[];
  files: Record<string, File | null>;
  onFileChange: (id: string, file: File | null) => void;
  sources?: ReportMeta["sources"];
};

function statusFor(
  id: string,
  file: File | null | undefined,
  sources?: ReportMeta["sources"],
) {
  const src = sources?.[id];
  if (src?.error) return { text: src.error, kind: "err" as const };
  if (file) return { text: "已上传", kind: "ok" as const };
  if (src?.skipped) return { text: "未上传", kind: "muted" as const };
  return { text: "未上传", kind: "muted" as const };
}

type SimpleCardProps = {
  label: string;
  file: File | null | undefined;
  hint: string;
  status: ReturnType<typeof statusFor>;
  onPick: () => void;
  onFile: (file: File | null) => void;
  inputRef: (el: HTMLInputElement | null) => void;
};

function SimpleSourceCard({
  label,
  file,
  hint,
  status,
  onPick,
  onFile,
  inputRef,
}: SimpleCardProps) {
  const color = PLATFORM_COLORS[label] ?? "#64748B";
  return (
    <button type="button" className="source-card" onClick={onPick}>
      <div
        className="source-card-icon"
        style={{ background: `${color}14`, color }}
      >
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
          <div className="source-card-hint">{hint}</div>
        )}
      </div>
      <span className={`source-status source-status--${status.kind}`}>
        {status.text}
      </span>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
    </button>
  );
}

type BankCardProps = {
  parsers: ParserInfo[];
  files: Record<string, File | null>;
  onFileChange: (id: string, file: File | null) => void;
};

function BankSourceCard({ parsers, files, onFileChange }: BankCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bankParsers = parsers.filter((p) =>
    (BANK_IDS as readonly string[]).includes(p.id),
  );
  const [selectedBank, setSelectedBank] = useState<BankId>(
    (bankParsers[0]?.id as BankId) ?? "cmb",
  );

  const selectedParser =
    bankParsers.find((p) => p.id === selectedBank) ?? bankParsers[0];
  const selectedFile = files[selectedBank];
  const uploaded = BANK_IDS.filter((id) => files[id]).map((id) => ({
    id,
    label: PLATFORM_LABELS[id] ?? id,
    file: files[id]!,
  }));

  const bankStatus =
    uploaded.length === 0
      ? { text: "未上传", kind: "muted" as const }
      : { text: `已上传 ${uploaded.length} 家`, kind: "ok" as const };

  const hint =
    selectedParser?.filePatterns.join(" / ") || "点击选择 PDF 流水";

  return (
    <div className="source-card source-card--bank">
      <div className="source-card-bank-head">
        <div
          className="source-card-icon"
          style={{ background: "#64748B14", color: "#64748B" }}
        >
          <span className="source-dot" style={{ background: "#64748B" }} />
          银
        </div>
        <div className="source-card-body">
          <div className="source-card-name">银行</div>
          <label className="bank-select-field">
            <span className="bank-select-label">选择银行</span>
            <select
              className="bank-select"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value as BankId)}
              onClick={(e) => e.stopPropagation()}
            >
              {bankParsers.map((p) => (
                <option key={p.id} value={p.id}>
                  {PLATFORM_LABELS[p.id] ?? p.displayName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <span className={`source-status source-status--${bankStatus.kind}`}>
          {bankStatus.text}
        </span>
      </div>

      <button
        type="button"
        className="bank-upload-zone"
        onClick={() => inputRef.current?.click()}
      >
        {selectedFile ? (
          <>
            <div className="source-card-file">
              {PLATFORM_LABELS[selectedBank]} · {selectedFile.name}
            </div>
            <div className="source-card-size">{fmtFileSize(selectedFile.size)}</div>
          </>
        ) : (
          <div className="source-card-hint">上传 {PLATFORM_LABELS[selectedBank]} 流水 · {hint}</div>
        )}
      </button>

      {uploaded.length > 0 && (
        <ul className="bank-uploaded-list" aria-label="已上传的银行">
          {uploaded.map(({ id, label, file }) => (
            <li key={id} className="bank-uploaded-item">
              <span
                className="bank-uploaded-dot"
                style={{
                  background: PLATFORM_COLORS[label] ?? "#64748B",
                }}
              />
              <span className="bank-uploaded-label">{label}</span>
              <span className="bank-uploaded-file" title={file.name}>
                {file.name}
              </span>
              <button
                type="button"
                className="bank-uploaded-switch"
                onClick={() => setSelectedBank(id)}
              >
                {selectedBank === id ? "当前" : "切换"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) =>
          onFileChange(selectedBank, e.target.files?.[0] ?? null)
        }
      />
    </div>
  );
}

export function DataSourceCards({
  parsers,
  files,
  onFileChange,
  sources,
}: Props) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const alipay = parsers.find((p) => p.id === "alipay");
  const wechat = parsers.find((p) => p.id === "wechat");
  const primaryCards = [
    wechat && { parser: wechat, label: "微信" },
    alipay && { parser: alipay, label: "支付宝" },
  ].filter(Boolean) as { parser: ParserInfo; label: string }[];

  return (
    <section className="section-block" id="upload">
      <h2 className="section-title">数据源</h2>
      <div className="source-cards source-cards--three">
        {primaryCards.map(({ parser, label }) => (
          <SimpleSourceCard
            key={parser.id}
            label={label}
            file={files[parser.id]}
            hint={parser.filePatterns.join(" / ") || "点击选择文件"}
            status={statusFor(parser.id, files[parser.id], sources)}
            onPick={() => inputRefs.current[parser.id]?.click()}
            onFile={(file) => onFileChange(parser.id, file)}
            inputRef={(el) => {
              inputRefs.current[parser.id] = el;
            }}
          />
        ))}

        <BankSourceCard
          parsers={parsers}
          files={files}
          onFileChange={onFileChange}
        />
      </div>
    </section>
  );
}
