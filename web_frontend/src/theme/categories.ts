/** Nature Communications 配色（#f599a1 #9fd7e9 #95aeda #fcd590 #a577ad #73c79e #5299cc） */
export const CATEGORY_COLORS: Record<string, string> = {
  医疗健康: "#f599a1",
  通讯话费: "#9fd7e9",
  会员订阅: "#95aeda",
  生活缴费: "#fcd590",
  游戏动漫: "#a577ad",
  餐饮食品: "#73c79e",
  交通出行: "#5299cc",
  购物消费: "#f4b69a",
  教育学习: "#b89cc8",
  其他: "#8aa4b5",
};

export const CATEGORY_CHART_COLORS: Record<string, string> = { ...CATEGORY_COLORS };

export const PLATFORM_COLORS: Record<string, string> = {
  支付宝: "#1677FF",
  微信: "#07C160",
  招行: "#E60012",
  中行: "#C8102E",
  中信: "#D7000F",
  招商银行: "#E60012",
  中国银行: "#C8102E",
  中信银行: "#D7000F",
};

/** 流水 Txn.platform（完整名称）→ 解析器 ID，用于与 meta.sources 对照 */
export const PLATFORM_TO_PARSER_ID: Record<string, string> = {
  支付宝: "alipay",
  微信: "wechat",
  招商银行: "cmb",
  中国银行: "boc",
  中信银行: "citic",
};

export const PLATFORM_LABELS: Record<string, string> = {
  alipay: "支付宝",
  wechat: "微信",
  cmb: "招行",
  boc: "中行",
  citic: "中信",
};

const FALLBACK = ["#95aeda", "#9fd7e9", "#8aa4b5"];

/** 9 档金额区间柱状图色序（Nature Communications） */
export const BUCKET_BAR_COLORS = [
  "#9fd7e9",
  "#95aeda",
  "#73c79e",
  "#5299cc",
  "#fcd590",
  "#f4b69a",
  "#f599a1",
  "#a577ad",
  "#b89cc8",
] as const;

export function getBucketBarColor(index: number): string {
  return BUCKET_BAR_COLORS[index % BUCKET_BAR_COLORS.length];
}

export function getCategoryColor(name: string, index = 0): string {
  return CATEGORY_COLORS[name] ?? FALLBACK[index % FALLBACK.length];
}

export function getCategoryChartColor(name: string, index = 0): string {
  return CATEGORY_CHART_COLORS[name] ?? getCategoryColor(name, index);
}

export function categoryColor(name: string): string {
  return getCategoryColor(name);
}

export function sortCategoryNames(names: Iterable<string>): string[] {
  const order = Object.keys(CATEGORY_COLORS);
  return [...new Set(names)].sort(
    (a, b) =>
      (order.indexOf(a) === -1 ? 999 : order.indexOf(a)) -
        (order.indexOf(b) === -1 ? 999 : order.indexOf(b)) || a.localeCompare(b, "zh-CN"),
  );
}

export function categoryBg(name: string, index = 0): string {
  const c = getCategoryColor(name, index);
  return `${c}40`;
}
