import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
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
    <div className="card bucket-section">
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

function BucketCategoryCard({ block }: { block: BucketCategory }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const categories = useMemo(
    () => sortCategoryNames(block.categories.map((c) => c.name))
      .map((name) => block.categories.find((c) => c.name === name)!)
      .filter(Boolean),
    [block.categories],
  );

  if (!categories.length) return null;

  return (
    <div className="bucket-pie-card">
      <p className="bucket-pie-title">
        <strong>{block.label} 元</strong>
        <span className="muted">
          {" "}
          · {block.count} 笔 · {fmt(block.amount)} 元
        </span>
      </p>
      <div className="bucket-pie-body">
        <div className="bucket-pie-visual">
          <div className="donut-chart-wrap bucket-donut-wrap">
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius="54%"
                  outerRadius="88%"
                  paddingAngle={2}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  activeIndex={activeIndex}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                {categories.map((cat) => (
                  <Cell key={cat.name} fill={getCategoryChartColor(cat.name)} />
                ))}
              </Pie>
            </PieChart>
            </ResponsiveContainer>
            <div className="donut-chart-center" aria-hidden="true">
              <div className="donut-chart-center-label">合计</div>
              <div className="donut-chart-center-value">{fmt(block.amount)}</div>
              <div className="donut-chart-center-sub">{block.count} 笔</div>
            </div>
          </div>
          <ul className="bucket-pie-legend" aria-label="类别占比">
            {categories.map((cat, i) => (
              <li
                key={cat.name}
                className={
                  activeIndex === i ? "bucket-pie-legend-item active" : "bucket-pie-legend-item"
                }
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <span
                  className="bucket-pie-legend-dot"
                  style={{ background: getCategoryChartColor(cat.name) }}
                />
                <span className="bucket-pie-legend-name">{cat.name}</span>
                <span className="bucket-pie-legend-pct">{cat.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
        <table className="category-table bucket-category-table">
          <thead>
            <tr>
              <th>类别</th>
              <th className="num">金额</th>
              <th className="num">占比</th>
              <th className="num">笔数</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr
                key={cat.name}
                className={activeIndex === i ? "bucket-cat-row-active" : undefined}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <td>
                  <span
                    className="cat-dot"
                    style={{ background: getCategoryChartColor(cat.name) }}
                  />
                  {cat.name}
                </td>
                <td className="num">{fmt(cat.amount)}</td>
                <td className="num">{cat.pct}%</td>
                <td className="num">{cat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BucketCategoryPies({
  title,
  blocks,
}: {
  title: string;
  blocks: BucketCategory[];
}) {
  if (!blocks.length) return null;

  return (
    <div className="bucket-pies-section">
      <h3>{title}</h3>
      <p className="muted bucket-pies-hint">
        各金额区间内的类别金额占比（饼图按金额，表含笔数）。
      </p>
      <div className="bucket-pies-grid">
        {blocks.map((b) => (
          <BucketCategoryCard key={b.label} block={b} />
        ))}
      </div>
    </div>
  );
}
