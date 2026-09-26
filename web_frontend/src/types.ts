export type SummaryStats = {
  dailyAvg: number;
  txnAvg: number;
  medianTxn: number;
  p90Txn: number;
};

export type Category = {
  name: string;
  amount: number;
  pct: number;
  count: number;
  dailyAvg: number;
  txnAvg: number;
  countPct: number;
  maxTxn: number;
  txnAvgDeltaPct: number;
};
export type Bucket = { label: string; count: number; amount: number };
export type Detail = { name: string; meta: string; rows: [string, string][] };
export type PeriodPayload = {
  key: string;
  title: string;
  subtitle: string;
  txnCount: number;
  total: number;
  grossTotal?: number;
  countAll?: number;
  purePct?: number | null;
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
export type LargeTxn = {
  date: string;
  amount: number;
  category: string;
  platform: string;
  label: string;
};
export type BucketCategory = {
  label: string;
  count: number;
  amount: number;
  categories: Category[];
};
export type ReportTrends = {
  totalPct: number | null;
  countPct: number | null;
  label: string | null;
};
export type ReportMeta = {
  dateStart: string;
  dateEnd: string;
  title: string;
  subtitle: string;
  dateRange: string;
  txnCount: number;
  total: number;
  summary?: SummaryStats;
  periodAvg: number;
  maxPeriodTotal: number;
  maxPeriodLabel: string;
  top2Pct: number;
  top2Label: string;
  periodCount: number;
  largeTxnCount: number;
  largeTxnTotal: number;
  largeThreshold: number;
  granularity: string;
  pureSpending: boolean;
  trends: ReportTrends;
  sources: Record<string, { parsed: number; skipped: boolean; error?: string }>;
  classifier?: { mode: string; learned_added: number };
};
export type PeriodTotal = {
  key: string;
  label: string;
  total: number;
  count: number;
  totalPure: number;
  countPure: number;
  totalAll: number;
  countAll: number;
  purePct: number | null;
};
export type PlatformShare = {
  platform: string;
  amount: number;
  count: number;
  pct: number;
};
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
export type CategoryTrendSeries = { name: string; amounts: number[] };
export type CategoryTrend = { keys: string[]; series: CategoryTrendSeries[] };
export type SpendingDay = { date: string; amount: number; count: number };
export type SpendingCalendar = { days: SpendingDay[]; maxAmount: number };
export type RecurringItem = {
  label: string;
  category: string;
  amount: number;
  cadence: "monthly" | "quarterly";
  annualEst: number;
  confidence: "high" | "medium";
  lastDate: string;
  kind?: "subscription" | "investment";
};
export type FullReport = {
  meta: ReportMeta;
  periodTotals: PeriodTotal[];
  categories: Category[];
  categoryDetails: Detail[];
  amountBuckets: Bucket[];
  amountBucketsMerged: Bucket[];
  bucketCategories: BucketCategory[];
  bucketCategoriesMerged: BucketCategory[];
  largeTxns: LargeTxn[];
  periods: PeriodPayload[];
  platformShare?: PlatformShare[];
  excludedDetail?: ExcludedDetail | null;
  categoryTrend?: CategoryTrend;
  spendingCalendar?: SpendingCalendar;
  recurring?: RecurringItem[];
};
export type ParserInfo = {
  id: string;
  displayName: string;
  role: string;
  filePatterns: string[];
};
export type Granularity = "month" | "week" | "3day" | "day";
