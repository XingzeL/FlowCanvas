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
  { name: "游戏动漫", amount: 2459.67, pct: 26.9, count: 21 },
  { name: "交通出行", amount: 2347.97, pct: 25.7, count: 6 },
  { name: "购物消费", amount: 1879.73, pct: 20.6, count: 18 },
  { name: "餐饮食品", amount: 1201.15, pct: 13.1, count: 34 },
  { name: "会员订阅", amount: 433.15, pct: 4.7, count: 16 },
  { name: "通讯话费", amount: 472.1, pct: 5.2, count: 3 },
  { name: "生活缴费", amount: 200.0, pct: 2.2, count: 2 },
  { name: "其他", amount: 144.51, pct: 1.6, count: 7 }
];

const DAILY = [
  281.87, 103.52, 449.4, 845.59, 322, 18.52, 177.73, 4.93,
  36, 2547.75, 261.35, 359.05, 126.63, 405.9, 90, 33.93,
  423.13, 0.76, 229.3, 27.47, 20.04, 29, 358, 10,
  293.77, 334.44, 1043.12, 40.34, 258, 6.74
];

type Item = [string, string];

const GAME_TOP: Item[] = [
  ["07-10 清梦代肝", "360.00"],
  ["07-27 GSC POP UP PARADE BEACH …", "330.65"],
  ["07-17 Fingle Toy rurudo原画 原创 拉…", "321.92"],
  ["07-23 APEX 绝区零 仪玄·独步沧溟 Ver. 1/…", "300.00"],
  ["07-05 元宝充值", "290.00"],
  ["07-29 菲林底片×1980", "198.00"],
  ["07-26 鸣潮代肝代打代练带肝3.5全图探索度任务星声声骸…", "135.00"],
  ["07-03 基础包", "99.90"],
  ["07-11 980创世结晶", "98.00"],
  ["07-01 韩谷散货原神韩国pc房正比立牌 Q立牌 甘雨 胡…", "43.90"]
];
const TRAVEL_ALL: Item[] = [
  ["07-10 机票订单", "1,709.00"],
  ["07-27 如家neo酒店南京新街口汉中路店", "596.00"],
  ["07-04 高德打车订单", "18.00"],
  ["07-20 哈啰单车骑行卡自动续费", "17.47"],
  ["07-04 地铁_花梨坎_2026-07-04 10:15:…", "6.00"],
  ["07-17 单车", "1.50"]
];
const SHOPPING_TOP: Item[] = [
  ["07-10 韩国MLB帽子专柜正品NY洋基队四季防晒大透气檐…", "355.00"],
  ["07-14 400万1080双目相机同帧同步三维重建深度检测…", "255.00"],
  ["07-01 康夫F9高速电吹风机家用大风力静音速干不伤发负离…", "209.90"],
  ["07-26 京东-订单编号3571249015740735", "199.44"],
  ["07-25 商户单号11130600726072561577…", "176.10"],
  ["07-12 网上快捷支付", "171.46"],
  ["07-12 网上快捷支付", "165.00"],
  ["07-19 快捷支付 平台商户", "116.30"],
  ["07-04 网上快捷支付", "79.92"],
  ["07-25 银联快捷支付 京东商城业务", "44.40"]
];
const FOOD_TOP: Item[] = [
  ["07-04 /", "301.67"],
  ["07-03 杨文涛", "255.00"],
  ["07-10 /", "116.75"],
  ["07-14 美团收银909700214797577206", "75.47"],
  ["07-03 美团订单-2607031120070000130…", "54.50"],
  ["07-17 网上快捷支付", "39.88"],
  ["07-19 收款方备注:二维码收款", "37.30"],
  ["07-11 美团订单-2607111120070000130…", "32.25"],
  ["07-19 瑾贝十三天金凤活珠子五香/香辣10-40枚", "30.90"],
  ["07-01 顺佳超市（马头庄店）付款28.73元", "28.07"]
];
const SUB_ALL: Item[] = [
  ["07-07 STRIPE", "136.77"],
  ["07-11 iCloud；07.11购买", "68.00"],
  ["07-23 App Store & Apple Music；…", "58.00"],
  ["07-09 高级会员连续包月", "30.00"],
  ["07-11 App Store & Apple Music；…", "27.00"],
  ["07-17 百度网盘超级会员(1个月-自动续费)", "24.72"],
  ["07-14 连续包月(网盘SVIP会员)", "20.00"],
  ["07-03 购买大会员连续包月", "15.00"],
  ["07-07 App Store & Apple Music；…", "15.00"],
  ["07-19 网易云音乐-会员自动续费", "11.00"],
  ["07-20 高档充电连续包月八", "10.00"],
  ["07-06 App Store & Apple Music；…", "8.00"],
  ["07-09 iCloud；07.09购买", "6.00"],
  ["07-10 两轮车先充后付", "1.22"],
  ["07-21 两轮车先充后付", "1.22"],
  ["07-30 两轮车先充后付", "1.22"]
];
const TELECOM_ALL: Item[] = [
  ["07-04 为186****3776交费299.00元", "299.00"],
  ["07-02 为157****8065话费充值", "98.00"],
  ["07-04 为186****3776交费75.10元", "75.10"]
];
const UTILITY_ALL: Item[] = [
  ["07-13 电费自动缴费-根据每期出账后自动缴费", "100.00"],
  ["07-27 电费自动缴费-根据每期出账后自动缴费", "100.00"]
];
const OTHER_ALL: Item[] = [
  ["07-17 无卡支付", "35.11"],
  ["07-04 中国体育彩票新中关店", "30.00"],
  ["07-05 无卡支付", "26.01"],
  ["07-03 成人通票-", "25.00"],
  ["07-16 商品:1084-2026071623075425…", "20.00"],
  ["07-05 深蓝学院全套技术课程合集｜自动驾驶 / ROS …", "5.99"],
  ["07-21 打印费用", "2.40"]
];

const AMOUNT_BUCKETS = [
  { label: "0–30", count: 56, amount: 628.59 },
  { label: "30–50", count: 18, amount: 604.84 },
  { label: "50–100", count: 9, amount: 706.89 },
  { label: "100–200", count: 11, amount: 1614.82 },
  { label: "200–300", count: 5, amount: 1308.9 },
  { label: "300–500", count: 6, amount: 1969.24 },
  { label: "500–800", count: 1, amount: 596.0 },
  { label: "800–1000", count: 0, amount: 0.0 },
  { label: "1000+", count: 1, amount: 1709.0 }
];

const AMOUNT_BUCKETS_MERGED = [
  { label: "0–50", count: 74, amount: 1233.43 },
  { label: "50–200", count: 20, amount: 2321.71 },
  { label: "200–500", count: 11, amount: 3278.14 },
  { label: "500+", count: 2, amount: 2305.0 }
];

const DETAILS: { name: string; meta: string; rows: Item[] }[] = [
  { name: "游戏动漫", meta: "Top 10 / 共 21 笔 · 2,459.67 元", rows: GAME_TOP }
  { name: "交通出行", meta: "Top 6 / 共 6 笔 · 2,347.97 元", rows: TRAVEL_ALL }
  { name: "购物消费", meta: "Top 10 / 共 18 笔 · 1,879.73 元", rows: SHOPPING_TOP }
  { name: "餐饮食品", meta: "Top 10 / 共 34 笔 · 1,201.15 元", rows: FOOD_TOP }
  { name: "会员订阅", meta: "全部 16 笔 · 433.15 元", rows: SUB_ALL }
  { name: "通讯话费", meta: "全部 3 笔 · 472.10 元", rows: TELECOM_ALL }
  { name: "生活缴费", meta: "全部 2 笔 · 200.00 元", rows: UTILITY_ALL }
  { name: "其他", meta: "全部 7 笔 · 144.51 元", rows: OTHER_ALL }
];

const REPORT_META = {
  title: "2026 年 7 月 纯花销占比",
  subtitle: "已剔除转账/房租等 6 笔，共 37,197.50 元",
  txnCount: 107,
  total: 9138.28,
  dailyAvg: 304.61,
  maxTxn: 1709.0,
  top2Pct: 52.6,
  peakNote: "07-10 2,547.75 · 07-27 1,043.12 · 07-04 845.59",
  dateRange: "2026-07-01 ~ 2026-07-30",
  bucketTxnCount: 107,
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
