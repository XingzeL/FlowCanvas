import { useState } from "react";
import { fmt } from "../../utils/format";

export type ExcludedItem = {
  date: string;
  platform: string;
  description: string;
  amount: number;
};

export type ExcludedGroup = {
  reason: string;
  label: string;
  count: number;
  amount: number;
  items: ExcludedItem[];
};

export type ExcludedDetail = {
  summary: { count: number; amount: number };
  groups: ExcludedGroup[];
};

type Props = {
  excludedDetail?: ExcludedDetail | null;
};

export function ExcludedDetailSection({ excludedDetail }: Props) {
  const [openReasons, setOpenReasons] = useState<Record<string, boolean>>({});

  if (!excludedDetail || excludedDetail.summary.count === 0) {
    return null;
  }

  const toggleGroup = (reason: string) => {
    setOpenReasons((prev) => ({ ...prev, [reason]: !prev[reason] }));
  };

  return (
    <div className="dash-card" id="excluded">
      <h3 className="dash-card-title">剔除项明细</h3>
      <p className="insights-summary">
        已剔除 {excludedDetail.summary.count} 笔，共 {fmt(excludedDetail.summary.amount)}
      </p>
      <div className="excluded-groups">
        {excludedDetail.groups.map((group) => {
          const open = openReasons[group.reason] ?? false;
          return (
            <div key={group.reason} className="excluded-group">
              <button
                type="button"
                className="excluded-group-header"
                onClick={() => toggleGroup(group.reason)}
                aria-expanded={open}
              >
                <span className="excluded-group-title">
                  {group.label}
                  <span className="excluded-group-meta">
                    {group.count} 笔 · {fmt(group.amount)}
                  </span>
                </span>
                <span className="excluded-group-toggle">{open ? "收起" : "展开"}</span>
              </button>
              {open && (
                <table className="category-table excluded-items-table">
                  <thead>
                    <tr>
                      <th>日期</th>
                      <th>平台</th>
                      <th>摘要</th>
                      <th className="num">金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item, index) => (
                      <tr key={`${item.date}-${item.amount}-${index}`}>
                        <td>{item.date}</td>
                        <td>{item.platform}</td>
                        <td>{item.description}</td>
                        <td className="num">{fmt(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
