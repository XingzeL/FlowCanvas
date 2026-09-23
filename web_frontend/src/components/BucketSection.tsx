import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Bucket, BucketCategory } from "../types";
import { getCategoryChartColor, sortCategoryNames } from "../theme/categories";
import { fmt } from "../utils/format";

export function BucketSection({
  buckets,
  bucketsMerged,
  bucketCategories,
  bucketCategoriesMerged,
}: {
  buckets: Bucket[];
  bucketsMerged: Bucket[];
  bucketCategories: BucketCategory[];
  bucketCategoriesMerged: BucketCategory[];
}) {
  return (
    <div className="card">
      <h2>金额区间分布</h2>
      <div className="grid-2">
        <BucketTable title="9 档细分" buckets={buckets} />
        <BucketTable title="4 档合并" buckets={bucketsMerged} />
      </div>
      <BucketCategoryPies title="9 档 × 类别" blocks={bucketCategories} />
      <BucketCategoryPies title="4 档 × 类别" blocks={bucketCategoriesMerged} />
    </div>
  );
}

function BucketTable({ title, buckets }: { title: string; buckets: Bucket[] }) {
  return (
    <div>
      <h3>{title}</h3>
      <table className="data">
        <thead>
          <tr>
            <th>区间</th>
            <th className="num">笔数</th>
            <th className="num">金额</th>
          </tr>
        </thead>
        <tbody>
          {buckets.map((b) => (
            <tr key={b.label}>
              <td>{b.label}</td>
              <td className="num">{b.count}</td>
              <td className="num">{fmt(b.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoryLegend({ names }: { names: string[] }) {
  if (!names.length) return null;
  return (
    <div className="pie-legend" aria-label="类别图例">
      {names.map((name) => (
        <span key={name} className="pie-legend-item">
          <span
            className="pie-legend-dot"
            style={{ background: getCategoryChartColor(name) }}
          />
          {name}
        </span>
      ))}
    </div>
  );
}

function BucketCategoryPies({ title, blocks }: { title: string; blocks: BucketCategory[] }) {
  const legendNames = useMemo(
    () => sortCategoryNames(blocks.flatMap((b) => b.categories.map((c) => c.name))),
    [blocks],
  );

  if (!blocks.length) return null;

  return (
    <div className="bucket-pies-section">
      <h3>{title}</h3>
      <CategoryLegend names={legendNames} />
      <div className="bucket-pies-grid">
        {blocks.map((b) => (
          <div key={b.label} className="bucket-pie-card">
            <p className="muted bucket-pie-title">
              {b.label} · {b.count} 笔 · {fmt(b.amount)}
            </p>
            <ResponsiveContainer width="100%" height={188}>
              <PieChart>
                <Pie
                  data={b.categories}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius={46}
                  outerRadius={72}
                  paddingAngle={2}
                  stroke="#F5F7FA"
                  strokeWidth={2}
                >
                  {b.categories.map((cat) => (
                    <Cell key={cat.name} fill={getCategoryChartColor(cat.name)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number, name: string) => [fmt(v), name]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow)",
                    background: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <CategoryLegend names={sortCategoryNames(b.categories.map((c) => c.name))} />
          </div>
        ))}
      </div>
    </div>
  );
}
