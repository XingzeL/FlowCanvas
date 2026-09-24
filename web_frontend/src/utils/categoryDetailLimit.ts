import { useEffect, useState } from "react";

export type CategoryDetailLimit = 1 | 20 | 50 | 100 | "all";

export const CATEGORY_DETAIL_LIMIT_OPTIONS: {
  value: CategoryDetailLimit;
  label: string;
}[] = [
  { value: 1, label: "Top 1" },
  { value: 20, label: "Top 20" },
  { value: 50, label: "Top 50" },
  { value: 100, label: "Top 100" },
  { value: "all", label: "全部" },
];

const LS_KEY = "flowcanvas_category_detail_limit";
const DEFAULT_LIMIT: CategoryDetailLimit = 20;

export function parseCategoryDetailLimit(raw: string | null): CategoryDetailLimit {
  if (raw === "all") return "all";
  const n = Number(raw);
  if (n === 1 || n === 20 || n === 50 || n === 100) return n;
  return DEFAULT_LIMIT;
}

export function useCategoryDetailLimit(): [
  CategoryDetailLimit,
  (limit: CategoryDetailLimit) => void,
] {
  const [limit, setLimit] = useState<CategoryDetailLimit>(() => {
    try {
      return parseCategoryDetailLimit(localStorage.getItem(LS_KEY));
    } catch {
      return DEFAULT_LIMIT;
    }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, String(limit));
  }, [limit]);

  return [limit, setLimit];
}

export function sliceDetailRows<T>(rows: T[], limit: CategoryDetailLimit): T[] {
  if (limit === "all") return rows;
  return rows.slice(0, limit);
}

export function formatDetailLimitMeta(
  shown: number,
  total: number,
  amountLabel: string,
): string {
  if (shown >= total) {
    return `共 ${total} 笔 · ${amountLabel}`;
  }
  return `Top ${shown} / 共 ${total} 笔 · ${amountLabel}`;
}
