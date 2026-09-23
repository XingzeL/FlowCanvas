import type { Category } from "../../types";
import { fmt } from "../../utils/format";
import { getCategoryColor } from "../../theme/categories";

export function CategoryOverview({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <div className="dash-card" id="category">
      <h3 className="dash-card-title">分类概览</h3>
      <table className="category-table">
        <thead>
          <tr>
            <th>类别</th>
            <th>金额</th>
            <th className="num">笔数</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, i) => (
            <tr key={c.name}>
              <td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
