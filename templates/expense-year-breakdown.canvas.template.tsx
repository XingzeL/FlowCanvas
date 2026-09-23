import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  PieChart,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

// @generated-data-start
type Item = [string, string];
type Category = { name: string; amount: number; pct: number; count: number };
type Bucket = { label: string; count: number; amount: number };
type Detail = { name: string; meta: string; rows: Item[] };
type MonthPayload = {
  key: string;
  title: string;
  subtitle: string;
  txnCount: number;
  total: number;
  dailyAvg: number;
  maxTxn: number;
  top2Pct: number;
  peakNote: string;
  dateRange: string;
  categories: Category[];
  daily: number[];
  amountBuckets: Bucket[];
  amountBucketsMerged: Bucket[];
  details: Detail[];
};

const YEAR_META = {
  title: "全年纯花销汇总",
  subtitle: "",
  dateRange: "",
  txnCount: 0,
  total: 0,
  monthlyAvg: 0,
  maxMonthTotal: 0,
  maxMonthLabel: "",
  top2Pct: 0,
  top2Label: "",
  monthCount: 0,
  largeTxnCount: 0,
  largeTxnTotal: 0,
};

const MONTHLY_TOTALS: { label: string; total: number; count: number }[] = [];
const YEAR_CATEGORIES: Category[] = [];
const YEAR_AMOUNT_BUCKETS: Bucket[] = [];
const YEAR_AMOUNT_BUCKETS_MERGED: Bucket[] = [];
const YEAR_BUCKET_CATEGORIES: {
  label: string;
  count: number;
  amount: number;
  categories: Category[];
}[] = [];
const YEAR_BUCKET_CATEGORIES_MERGED: {
  label: string;
  count: number;
  amount: number;
  categories: Category[];
}[] = [];
const LARGE_TXNS: {
  date: string;
  amount: number;
  category: string;
  platform: string;
  label: string;
}[] = [];
const MONTHS: MonthPayload[] = [];
// @generated-data-end

const fmt = (n: number) =>
  n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

type BucketCategoryBlock = {
  label: string;
  count: number;
  amount: number;
  categories: Category[];
};

function BucketCategoryPies({
  title,
  blocks,
}: {
  title: string;
  blocks: BucketCategoryBlock[];
}) {
  if (blocks.length === 0) return null;
  return (
    <Stack gap={16}>
      <H3>{title}</H3>
      <Text tone="secondary" size="small">
        各金额区间内的类别金额占比（饼图按金额，表含笔数）。
      </Text>
      <Grid columns={2} gap={20} align="start">
        {blocks.map((b) => (
          <Stack key={b.label} gap={10}>
            <Text weight="semibold">
              {b.label} 元 · {b.count} 笔 · {fmt(b.amount)} 元
            </Text>
            <Grid columns="minmax(0, 1fr) minmax(0, 1.2fr)" gap={12} align="start">
              <PieChart
                donut
                size={180}
                data={b.categories.map((c) => ({
                  label: c.name,
                  value: c.amount,
                }))}
              />
              <Table
                headers={["类别", "金额", "占比", "笔数"]}
                columnAlign={["left", "right", "right", "right"]}
                striped
                rows={b.categories.map((c) => [
                  c.name,
                  fmt(c.amount),
                  `${c.pct}%`,
                  String(c.count),
                ])}
              />
            </Grid>
          </Stack>
        ))}
      </Grid>
    </Stack>
  );
}

function MonthSection({ m, defaultOpen }: { m: MonthPayload; defaultOpen: boolean }) {
  const topCats = m.categories
    .slice(0, 2)
    .map((c) => c.name)
    .join("+");

  return (
    <Card collapsible defaultOpen={defaultOpen}>
      <CardHeader
        trailing={
          <Text tone="secondary" size="small">
            ¥{fmt(m.total)} · {m.txnCount} 笔
          </Text>
        }
      >
        {m.title}
      </CardHeader>
      <CardBody>
        <Stack gap={20}>
          <Text tone="secondary" size="small">
            {m.subtitle}
          </Text>

          <Grid columns={4} gap={16}>
            <Stat value={`¥${fmt(m.total)}`} label={`花销总额（${m.txnCount} 笔）`} />
            <Stat value={`¥${fmt(m.dailyAvg)}`} label="日均花销" />
            <Stat value={`¥${fmt(m.maxTxn)}`} label="最大单笔" tone="warning" />
            <Stat
              value={`${m.top2Pct}%`}
              label={`前两类合计占比（${topCats}）`}
              tone="info"
            />
          </Grid>

          <H3>分类占比（金额 元 · 占比 · 笔数）</H3>
          <Grid columns="minmax(0, 2fr) minmax(0, 3fr)" gap={20} align="start">
            <PieChart
              donut
              size={220}
              data={m.categories.map((c) => ({ label: c.name, value: c.amount }))}
            />
            <Table
              headers={["类别", "金额 (元)", "占比", "笔数"]}
              columnAlign={["left", "right", "right", "right"]}
              striped
              rows={m.categories.map((c) => [
                c.name,
                fmt(c.amount),
                `${c.pct}%`,
                String(c.count),
              ])}
            />
          </Grid>
          <Text tone="tertiary" size="small">
            {m.dateRange} · 分类为关键词规则自动归集
          </Text>

          <H3>分类金额对比（元）</H3>
          <BarChart
            horizontal
            height={260}
            categories={m.categories.map((c) => c.name)}
            series={[
              { name: "花销金额 (元)", data: m.categories.map((c) => c.amount) },
            ]}
            valueSuffix=" 元"
          />

          <H3>每日花销趋势（元/日）</H3>
          <BarChart
            height={200}
            categories={m.daily.map((_, i) => `${i + 1}日`)}
            series={[{ name: "每日花销 (元)", data: m.daily }]}
            valueSuffix=" 元"
          />
          <Text tone="tertiary" size="small">
            峰值：{m.peakNote}
          </Text>

          <Divider />

          <H3>单笔金额区间分布（合并前 · 9 档）</H3>
          <Text tone="secondary" size="small">
            区间左闭右开，单位：元。共 {m.txnCount} 笔，合计 {fmt(m.total)} 元。
          </Text>
          <Grid columns={2} gap={20} align="start">
            <Stack gap={8}>
              <Text weight="semibold">笔数（笔）</Text>
              <BarChart
                height={240}
                categories={m.amountBuckets.map((b) => b.label)}
                series={[
                  { name: "笔数", data: m.amountBuckets.map((b) => b.count) },
                ]}
                valueSuffix=" 笔"
              />
            </Stack>
            <Stack gap={8}>
              <Text weight="semibold">金额合计（元）</Text>
              <BarChart
                height={240}
                categories={m.amountBuckets.map((b) => b.label)}
                series={[
                  { name: "金额", data: m.amountBuckets.map((b) => b.amount) },
                ]}
                valueSuffix=" 元"
              />
            </Stack>
          </Grid>
          <Table
            headers={["区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
            columnAlign={["left", "right", "right", "right", "right"]}
            striped
            rows={m.amountBuckets.map((b) => [
              b.label,
              String(b.count),
              fmt(b.amount),
              m.total > 0 ? `${((b.amount / m.total) * 100).toFixed(1)}%` : "—",
              m.txnCount > 0
                ? `${((b.count / m.txnCount) * 100).toFixed(1)}%`
                : "—",
            ])}
          />

          <H3>单笔金额区间分布（合并后 · 4 档）</H3>
          <Text tone="secondary" size="small">
            0–50（小额）· 50–200（中小额）· 200–500（中大额）· 500+（大额）
          </Text>
          <Grid columns={2} gap={20} align="start">
            <Stack gap={8}>
              <Text weight="semibold">笔数（笔）</Text>
              <BarChart
                height={200}
                categories={m.amountBucketsMerged.map((b) => b.label)}
                series={[
                  {
                    name: "笔数",
                    data: m.amountBucketsMerged.map((b) => b.count),
                  },
                ]}
                valueSuffix=" 笔"
              />
            </Stack>
            <Stack gap={8}>
              <Text weight="semibold">金额合计（元）</Text>
              <BarChart
                height={200}
                categories={m.amountBucketsMerged.map((b) => b.label)}
                series={[
                  {
                    name: "金额",
                    data: m.amountBucketsMerged.map((b) => b.amount),
                  },
                ]}
                valueSuffix=" 元"
              />
            </Stack>
          </Grid>
          <Table
            headers={["合并区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
            columnAlign={["left", "right", "right", "right", "right"]}
            striped
            rows={m.amountBucketsMerged.map((b) => [
              b.label,
              String(b.count),
              fmt(b.amount),
              m.total > 0 ? `${((b.amount / m.total) * 100).toFixed(1)}%` : "—",
              m.txnCount > 0
                ? `${((b.count / m.txnCount) * 100).toFixed(1)}%`
                : "—",
            ])}
          />

          <H3>各类别消费明细</H3>
          <Grid columns={2} gap={16} align="start">
            {m.details.map((cat) => (
              <Card key={`${m.key}-${cat.name}`}>
                <CardHeader
                  trailing={
                    <Text tone="secondary" size="small">
                      {cat.meta}
                    </Text>
                  }
                >
                  {cat.name}
                </CardHeader>
                <CardBody style={{ padding: 0 }}>
                  <Table
                    framed={false}
                    headers={["项目", "金额 (元)"]}
                    columnAlign={["left", "right"]}
                    rows={cat.rows}
                  />
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Stack>
      </CardBody>
    </Card>
  );
}

export default function ExpenseYearBreakdown() {
  const total = YEAR_META.total;
  const txnCount = YEAR_META.txnCount;

  return (
    <Stack gap={24} style={{ padding: 20 }}>
      <Stack gap={4}>
        <H1>{YEAR_META.title}</H1>
        <Text tone="secondary" size="small">
          {YEAR_META.subtitle}
        </Text>
      </Stack>

      <Grid columns={4} gap={16}>
        <Stat
          value={`¥${fmt(total)}`}
          label={`全年花销（${txnCount} 笔 · ${YEAR_META.monthCount} 个月）`}
        />
        <Stat value={`¥${fmt(YEAR_META.monthlyAvg)}`} label="月均花销" />
        <Stat
          value={`¥${fmt(YEAR_META.maxMonthTotal)}`}
          label={`最高月（${YEAR_META.maxMonthLabel}）`}
          tone="warning"
        />
        <Stat
          value={`${YEAR_META.top2Pct}%`}
          label={`前两类合计（${YEAR_META.top2Label}）`}
          tone="info"
        />
      </Grid>

      <Divider />

      <H2>月度花销趋势（元）</H2>
      <BarChart
        height={240}
        categories={MONTHLY_TOTALS.map((m) => m.label)}
        series={[{ name: "月花销 (元)", data: MONTHLY_TOTALS.map((m) => m.total) }]}
        valueSuffix=" 元"
      />
      <Table
        headers={["月份", "金额 (元)", "笔数", "占全年"]}
        columnAlign={["left", "right", "right", "right"]}
        striped
        rows={MONTHLY_TOTALS.map((m) => [
          m.label,
          fmt(m.total),
          String(m.count),
          total > 0 ? `${((m.total / total) * 100).toFixed(1)}%` : "—",
        ])}
      />

      <H2>全年分类占比</H2>
      <Grid columns="minmax(0, 2fr) minmax(0, 3fr)" gap={20} align="start">
        <PieChart
          donut
          size={240}
          data={YEAR_CATEGORIES.map((c) => ({ label: c.name, value: c.amount }))}
        />
        <Table
          headers={["类别", "金额 (元)", "占比", "笔数"]}
          columnAlign={["left", "right", "right", "right"]}
          striped
          rows={YEAR_CATEGORIES.map((c) => [
            c.name,
            fmt(c.amount),
            `${c.pct}%`,
            String(c.count),
          ])}
        />
      </Grid>
      <BarChart
        horizontal
        height={280}
        categories={YEAR_CATEGORIES.map((c) => c.name)}
        series={[
          { name: "花销金额 (元)", data: YEAR_CATEGORIES.map((c) => c.amount) },
        ]}
        valueSuffix=" 元"
      />
      <Text tone="tertiary" size="small">
        数据来源：支付宝 / 微信 / 招商银行 / 中国银行 · {YEAR_META.dateRange} ·
        分类为关键词规则自动归集
      </Text>

      <Divider />

      <H2>全年单笔金额区间分布（合并前 · 9 档）</H2>
      <Text tone="secondary" size="small">
        区间左闭右开，单位：元。共 {txnCount} 笔，合计 {fmt(total)} 元。
      </Text>
      <Grid columns={2} gap={20} align="start">
        <Stack gap={8}>
          <Text weight="semibold">笔数（笔）</Text>
          <BarChart
            height={260}
            categories={YEAR_AMOUNT_BUCKETS.map((b) => b.label)}
            series={[
              { name: "笔数", data: YEAR_AMOUNT_BUCKETS.map((b) => b.count) },
            ]}
            valueSuffix=" 笔"
          />
        </Stack>
        <Stack gap={8}>
          <Text weight="semibold">金额合计（元）</Text>
          <BarChart
            height={260}
            categories={YEAR_AMOUNT_BUCKETS.map((b) => b.label)}
            series={[
              { name: "金额", data: YEAR_AMOUNT_BUCKETS.map((b) => b.amount) },
            ]}
            valueSuffix=" 元"
          />
        </Stack>
      </Grid>
      <Table
        headers={["区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
        columnAlign={["left", "right", "right", "right", "right"]}
        striped
        rows={YEAR_AMOUNT_BUCKETS.map((b) => [
          b.label,
          String(b.count),
          fmt(b.amount),
          total > 0 ? `${((b.amount / total) * 100).toFixed(1)}%` : "—",
          txnCount > 0 ? `${((b.count / txnCount) * 100).toFixed(1)}%` : "—",
        ])}
      />
      <BucketCategoryPies
        title="9 档区间 · 类别构成"
        blocks={YEAR_BUCKET_CATEGORIES}
      />

      <H2>全年单笔金额区间分布（合并后 · 4 档）</H2>
      <Text tone="secondary" size="small">
        0–50（小额）· 50–200（中小额）· 200–500（中大额）· 500+（大额）
      </Text>
      <Grid columns={2} gap={20} align="start">
        <Stack gap={8}>
          <Text weight="semibold">笔数（笔）</Text>
          <BarChart
            height={220}
            categories={YEAR_AMOUNT_BUCKETS_MERGED.map((b) => b.label)}
            series={[
              {
                name: "笔数",
                data: YEAR_AMOUNT_BUCKETS_MERGED.map((b) => b.count),
              },
            ]}
            valueSuffix=" 笔"
          />
        </Stack>
        <Stack gap={8}>
          <Text weight="semibold">金额合计（元）</Text>
          <BarChart
            height={220}
            categories={YEAR_AMOUNT_BUCKETS_MERGED.map((b) => b.label)}
            series={[
              {
                name: "金额",
                data: YEAR_AMOUNT_BUCKETS_MERGED.map((b) => b.amount),
              },
            ]}
            valueSuffix=" 元"
          />
        </Stack>
      </Grid>
      <Table
        headers={["合并区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
        columnAlign={["left", "right", "right", "right", "right"]}
        striped
        rows={YEAR_AMOUNT_BUCKETS_MERGED.map((b) => [
          b.label,
          String(b.count),
          fmt(b.amount),
          total > 0 ? `${((b.amount / total) * 100).toFixed(1)}%` : "—",
          txnCount > 0 ? `${((b.count / txnCount) * 100).toFixed(1)}%` : "—",
        ])}
      />
      <BucketCategoryPies
        title="4 档区间 · 类别构成"
        blocks={YEAR_BUCKET_CATEGORIES_MERGED}
      />

      <H2>全年大额交易明细（≥ 500 元）</H2>
      <Text tone="secondary" size="small">
        共 {YEAR_META.largeTxnCount} 笔，合计 {fmt(YEAR_META.largeTxnTotal)} 元
        {total > 0
          ? `（占全年 ${(
              (YEAR_META.largeTxnTotal / total) *
              100
            ).toFixed(1)}%）`
          : ""}
        ，按金额从高到低。
      </Text>
      <Table
        headers={["日期", "金额 (元)", "类别", "平台", "项目"]}
        columnAlign={["left", "right", "left", "left", "left"]}
        striped
        rows={LARGE_TXNS.map((t) => [
          t.date,
          fmt(t.amount),
          t.category,
          t.platform,
          t.label,
        ])}
      />

      <Divider />

      <H2>分月明细（与单月模板同结构）</H2>
      <Text tone="secondary" size="small">
        默认折叠；点击月份卡片展开查看分类、日趋势、金额区间与明细。
      </Text>
      <Stack gap={16}>
        {MONTHS.map((m, i) => (
          <MonthSection key={m.key} m={m} defaultOpen={i === MONTHS.length - 1} />
        ))}
      </Stack>

      <Callout tone="info" title="口径备注">
        分类由 expense_config.json 关键词规则自动归集；跨平台去重以支付宝/微信支出为主，银行镜像与还款类已剔除。可编辑配置后重新运行
        build_expense_report.py --all。
      </Callout>
    </Stack>
  );
}
