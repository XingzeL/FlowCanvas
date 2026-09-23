import { useState } from "react";
import type { Category, Detail } from "../../types";
import { fmt } from "../../utils/format";
import { getCategoryColor } from "../../theme/categories";

type Props = {
  categories: Category[];
  details: Detail[];
};

export function CategoryLists({ categories, details }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    details.forEach((d, i) => {
      init[d.name] = i === 0;
    });
    return init;
  });

  if (!details.length) return null;

  const catMap = Object.fromEntries(categories.map((c) => [c.name, c]));

  const toggle = (name: string) => {
    setOpen((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <section className="section-block" id="catlist">
      <h2 className="section-title">分类明细</h2>
      <div className="dash-card category-lists-card">
        {details.map((detail, index) => {
          const cat = catMap[detail.name];
          const isOpen = open[detail.name];
          const color = getCategoryColor(detail.name, index);

          return (
            <div key={detail.name} className="category-list-block">
              <button
                type="button"
                className="category-list-header"
                aria-expanded={isOpen}
                onClick={() => toggle(detail.name)}
              >
                <div className="category-list-header-main">
                  <span className="cat-dot" style={{ background: color }} />
                  <div>
                    <strong>{detail.name}</strong>
                    {cat && (
                      <div className="muted">
                        {cat.count} 笔 · {cat.pct}%
                      </div>
                    )}
                  </div>
                </div>
                <div className="category-list-header-right">
                  {cat && <strong className="category-list-amount">{fmt(cat.amount)}</strong>}
                  <span className="period-chevron muted">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>
              {isOpen && (
                <div className="category-list-body">
                  <p className="muted">{detail.meta}</p>
                  <table className="data">
                    <thead>
                      <tr>
                        <th>摘要</th>
                        <th className="num">金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.rows.map((row, i) => (
                        <tr key={i}>
                          <td>{row[0]}</td>
                          <td className="num">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
