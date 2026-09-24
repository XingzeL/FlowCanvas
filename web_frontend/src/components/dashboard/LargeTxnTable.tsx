import type { LargeTxn } from "../../types";
import { fmt } from "../../utils/format";
import { categoryBg, getCategoryColor, PLATFORM_COLORS } from "../../theme/categories";

function CategoryPill({ name, index }: { name: string; index: number }) {
  const color = getCategoryColor(name, index);
  return (
    <span className="category-pill" style={{ color, background: categoryBg(name, index) }}>
      {name}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const color = PLATFORM_COLORS[platform] ?? "#64748B";
  return (
    <span className="platform-badge">
      <span className="platform-dot" style={{ background: color }} />
      {platform}
    </span>
  );
}

export function LargeTxnTable({
  txns,
  threshold,
  total,
}: {
  txns: LargeTxn[];
  threshold?: number;
  total?: number;
}) {
  if (!txns.length) return null;

  const catIndex = new Map<string, number>();
  const largeTotal = txns.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="dash-card large-txn-section" id="large">
      <h3 className="dash-card-title">
        大额明细{threshold != null ? `（≥ ${threshold} 元）` : ""}
      </h3>
      {(threshold != null || total != null) && (
        <p className="muted large-txn-summary">
          共 {txns.length} 笔，合计 {fmt(largeTotal)}
          {total != null && total > 0
            ? `（占全年 ${((largeTotal / total) * 100).toFixed(1)}%）`
            : ""}
          ，按金额从高到低。
        </p>
      )}
      <table className="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>摘要</th>
            <th>类别</th>
            <th>平台</th>
            <th className="num">金额</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((t, i) => {
            if (!catIndex.has(t.category)) catIndex.set(t.category, catIndex.size);
            return (
              <tr key={i}>
                <td>{t.date}</td>
                <td>{t.label}</td>
                <td>
                  <CategoryPill name={t.category} index={catIndex.get(t.category)!} />
                </td>
                <td><PlatformBadge platform={t.platform} /></td>
                <td className="num amount-cell">{fmt(t.amount)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
