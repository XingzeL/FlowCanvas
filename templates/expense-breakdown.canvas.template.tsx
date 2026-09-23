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
  PieChart,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

// @generated-data-start
const CATEGORIES = [
  { name: "其他", amount: 0, pct: 0, count: 0 },
];

const DAILY = [0];

type Item = [string, string];

const OTHER_ALL: Item[] = [];

const AMOUNT_BUCKETS = [
  { label: "0–30", count: 0, amount: 0 },
];

const AMOUNT_BUCKETS_MERGED = [
  { label: "0–50", count: 0, amount: 0 },
];

const DETAILS: { name: string; meta: string; rows: Item[] }[] = [];

const REPORT_META = {
  title: "开销占比",
  subtitle: "由 build_expense_report.py 生成",
  txnCount: 0,
  total: 0,
  dailyAvg: 0,
  maxTxn: 0,
  top2Pct: 0,
  peakNote: "—",
  dateRange: "",
  bucketTxnCount: 0,
};
// @generated-data-end

const fmt = (n: number) =>
  n.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ExpenseBreakdown() {
  const total = REPORT_META.total || CATEGORIES.reduce((s, c) => s + c.amount, 0);
  const txnCount = REPORT_META.txnCount;
  const topCats = CATEGORIES.slice(0, 2).map((c) => c.name).join("+");

  return (
    <Stack gap={20} style={{ padding: 20 }}>
      <Stack gap={4}>
        <H1>{REPORT_META.title}</H1>
        <Text tone="secondary" size="small">
          {REPORT_META.subtitle}
        </Text>
      </Stack>

      <Grid columns={4} gap={16}>
        <Stat value={`¥${fmt(total)}`} label={`花销总额（${txnCount} 笔）`} />
        <Stat value={`¥${fmt(REPORT_META.dailyAvg)}`} label="日均花销" />
        <Stat
          value={`¥${fmt(REPORT_META.maxTxn)}`}
          label="最大单笔"
          tone="warning"
        />
        <Stat
          value={`${REPORT_META.top2Pct}%`}
          label={`前两类合计占比（${topCats}）`}
          tone="info"
        />
      </Grid>

      <Divider />

      <H2>分类占比（金额 元 · 占比 · 笔数）</H2>
      <Grid columns="minmax(0, 2fr) minmax(0, 3fr)" gap={20} align="start">
        <PieChart
          donut
          size={240}
          data={CATEGORIES.map((c) => ({ label: c.name, value: c.amount }))}
        />
        <Table
          headers={["类别", "金额 (元)", "占比", "笔数"]}
          columnAlign={["left", "right", "right", "right"]}
          striped
          rows={CATEGORIES.map((c) => [
            c.name,
            fmt(c.amount),
            `${c.pct}%`,
            String(c.count),
          ])}
        />
      </Grid>
      <Text tone="tertiary" size="small">
        数据来源：支付宝 / 微信 / 招商银行 / 中国银行四份流水 · {REPORT_META.dateRange} · 分类为关键词规则自动归集
      </Text>

      <H2>分类金额对比（元）</H2>
      <BarChart
        horizontal
        height={280}
        categories={CATEGORIES.map((c) => c.name)}
        series={[{ name: "花销金额 (元)", data: CATEGORIES.map((c) => c.amount) }]}
        valueSuffix=" 元"
      />

      <H2>每日花销趋势（元/日）</H2>
      <BarChart
        height={220}
        categories={DAILY.map((_, i) => `${i + 1}日`)}
        series={[{ name: "每日花销 (元)", data: DAILY }]}
        valueSuffix=" 元"
      />
      <Text tone="tertiary" size="small">
        峰值：{REPORT_META.peakNote}
      </Text>

      <Divider />

      <H2>单笔金额区间分布（合并前 · 9 档）</H2>
      <Text tone="secondary" size="small">
        区间左闭右开，单位：元。共 {txnCount} 笔，合计 {fmt(total)} 元。
      </Text>
      <Grid columns={2} gap={20} align="start">
        <Stack gap={8}>
          <Text weight="semibold">笔数（笔）</Text>
          <BarChart
            height={260}
            categories={AMOUNT_BUCKETS.map((b) => b.label)}
            series={[{ name: "笔数", data: AMOUNT_BUCKETS.map((b) => b.count) }]}
            valueSuffix=" 笔"
          />
        </Stack>
        <Stack gap={8}>
          <Text weight="semibold">金额合计（元）</Text>
          <BarChart
            height={260}
            categories={AMOUNT_BUCKETS.map((b) => b.label)}
            series={[{ name: "金额", data: AMOUNT_BUCKETS.map((b) => b.amount) }]}
            valueSuffix=" 元"
          />
        </Stack>
      </Grid>
      <Table
        headers={["区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
        columnAlign={["left", "right", "right", "right", "right"]}
        striped
        rows={AMOUNT_BUCKETS.map((b) => [
          b.label,
          String(b.count),
          fmt(b.amount),
          total > 0 ? `${((b.amount / total) * 100).toFixed(1)}%` : "—",
          txnCount > 0 ? `${((b.count / txnCount) * 100).toFixed(1)}%` : "—",
        ])}
      />

      <H2>单笔金额区间分布（合并后 · 4 档）</H2>
      <Text tone="secondary" size="small">
        0–50（小额）· 50–200（中小额）· 200–500（中大额）· 500+（大额）
      </Text>
      <Grid columns={2} gap={20} align="start">
        <Stack gap={8}>
          <Text weight="semibold">笔数（笔）</Text>
          <BarChart
            height={220}
            categories={AMOUNT_BUCKETS_MERGED.map((b) => b.label)}
            series={[{ name: "笔数", data: AMOUNT_BUCKETS_MERGED.map((b) => b.count) }]}
            valueSuffix=" 笔"
          />
        </Stack>
        <Stack gap={8}>
          <Text weight="semibold">金额合计（元）</Text>
          <BarChart
            height={220}
            categories={AMOUNT_BUCKETS_MERGED.map((b) => b.label)}
            series={[{ name: "金额", data: AMOUNT_BUCKETS_MERGED.map((b) => b.amount) }]}
            valueSuffix=" 元"
          />
        </Stack>
      </Grid>
      <Table
        headers={["合并区间 (元)", "笔数", "金额 (元)", "占总额", "笔数占比"]}
        columnAlign={["left", "right", "right", "right", "right"]}
        striped
        rows={AMOUNT_BUCKETS_MERGED.map((b) => [
          b.label,
          String(b.count),
          fmt(b.amount),
          total > 0 ? `${((b.amount / total) * 100).toFixed(1)}%` : "—",
          txnCount > 0 ? `${((b.count / txnCount) * 100).toFixed(1)}%` : "—",
        ])}
      />

      <H2>各类别消费明细</H2>
      <Grid columns={2} gap={16} align="start">
        {DETAILS.map((cat) => (
          <Card key={cat.name}>
            <CardHeader
              trailing={<Text tone="secondary" size="small">{cat.meta}</Text>}
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

      <Callout tone="info" title="口径备注">
        分类由 expense_config.json 关键词规则自动归集；跨平台去重以支付宝/微信支出为主，银行镜像与还款类已剔除。可编辑配置后重新运行 build_expense_report.py。
      </Callout>
    </Stack>
  );
}
