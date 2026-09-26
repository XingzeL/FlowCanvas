import type { Category } from "../../types";
import { fmt, fmtPct } from "../../utils/format";
import { getCategoryColor } from "../../theme/categories";

function deltaTone(value: number): string {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "muted";
}

export function CategoryOverview({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <div className="dash-card" id="category">
      <h3 className="dash-card-title">分类概览</h3>
      <div className="category-table-scroll">
        <table className="category-table category-table--stats">
          <thead>
            <tr>
              <th>类别</th>
              <th>金额</th>
              <th className="num">笔数</th>
              <th className="num">占笔数</th>
              <th className="num">日均</th>
              <th className="num">笔均</th>
              <th className="num">单笔最大</th>
              <th className="num">相对笔均</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c.name}>
                <td className="category-name-cell">
                  <span className="cat-dot" style={{ background: getCategoryColor(c.name, i) }} />
                  {c.name}
                </td>
                <td>
                  <div className="cat-amount-row">
                    <span className="cat-amount">{fmt(c.amount)}</span>
                    <span className="cat-pct">{c.pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${c.pct}%`,
                        background: getCategoryColor(c.name, i),
                      }}
                    />
                  </div>
                </td>
                <td className="num">{c.count}</td>
                <td className="num">{c.countPct}%</td>
                <td className="num">{fmt(c.dailyAvg)}</td>
                <td className="num">{fmt(c.txnAvg)}</td>
                <td className="num">{fmt(c.maxTxn)}</td>
                <td className={`num category-delta category-delta--${deltaTone(c.txnAvgDeltaPct)}`}>
                  {fmtPct(c.txnAvgDeltaPct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
