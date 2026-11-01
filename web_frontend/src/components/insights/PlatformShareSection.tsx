import { PLATFORM_COLORS, PLATFORM_LABELS, PLATFORM_TO_PARSER_ID } from "../../theme/categories";
import type { ReportMeta } from "../../types";
import { fmt } from "../../utils/format";
import { DonutChart } from "../charts/DonutChart";

export type PlatformShare = {
  platform: string;
  amount: number;
  count: number;
  pct: number;
};

const PLATFORM_SOURCE_IDS = PLATFORM_TO_PARSER_ID;

type Props = {
  platformShare: PlatformShare[];
  sources?: ReportMeta["sources"];
};

export function PlatformShareSection({ platformShare, sources }: Props) {
  if (!platformShare.length) return null;

  const total = platformShare.reduce((sum, row) => sum + row.amount, 0);
  const donutData = platformShare.map((row) => ({
    name: row.platform,
    value: row.amount,
    color: PLATFORM_COLORS[row.platform] ?? "#64748B",
  }));

  const missingSources = sources
    ? Object.entries(sources)
        .filter(([, src]) => src.skipped || src.parsed === 0 || src.error)
        .map(([id]) => PLATFORM_LABELS[id] ?? id)
    : [];

  return (
    <div className="dash-card" id="platform">
      <h3 className="dash-card-title">平台占比</h3>
      {missingSources.length > 0 && (
        <p className="insights-hint">
          未上传或未解析：{missingSources.join("、")}
        </p>
      )}
      <div className="grid-2 platform-share-layout">
        <DonutChart
          data={donutData}
          centerLabel="纯花销总额"
          centerValue={fmt(total)}
        />
        <table className="category-table platform-share-table">
          <thead>
            <tr>
              <th>平台</th>
              <th>金额</th>
              <th className="num">笔数</th>
            </tr>
          </thead>
          <tbody>
            {platformShare.map((row) => {
              const color = PLATFORM_COLORS[row.platform] ?? "#64748B";
              const sourceId = PLATFORM_SOURCE_IDS[row.platform];
              const source = sourceId ? sources?.[sourceId] : undefined;
              const missing = source
                ? source.skipped || source.parsed === 0
                : false;
              return (
                <tr key={row.platform}>
                  <td>
                    <span className="cat-dot" style={{ background: color }} />
                    {row.platform}
                    {missing && <span className="platform-missing-tag">未上传</span>}
                  </td>
                  <td>
                    <div className="cat-amount-row">
                      <span className="cat-amount">{fmt(row.amount)}</span>
                      <span className="cat-pct">{row.pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${row.pct}%`, background: color }}
                      />
                    </div>
                  </td>
                  <td className="num">{row.count}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
