import type { FullReport, Granularity, ParserInfo } from "./types";

export async function fetchParsers(): Promise<ParserInfo[]> {
  const r = await fetch("/api/parsers");
  if (!r.ok) throw new Error("无法获取解析器列表");
  return r.json();
}

export async function analyzeFiles(
  files: Record<string, File | null>,
  opts: {
    granularity: Granularity;
    pureSpending: boolean;
    largeThreshold: number;
  },
): Promise<FullReport> {
  const form = new FormData();
  form.append("granularity", opts.granularity);
  form.append("pure_spending", String(opts.pureSpending));
  form.append("large_threshold", String(opts.largeThreshold));
  for (const [id, file] of Object.entries(files)) {
    if (file) form.append(id, file);
  }
  const r = await fetch("/api/analyze", { method: "POST", body: form });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: r.statusText }));
    throw new Error(err.detail || "分析失败");
  }
  return r.json();
}

export async function fetchLearnedKeywordCount(): Promise<number> {
  const r = await fetch("/api/config/learned-keywords");
  if (!r.ok) throw new Error("无法读取已学关键词");
  const data = (await r.json()) as { count: number };
  return data.count;
}

export async function clearLearnedKeywords(): Promise<number> {
  const r = await fetch("/api/config/clear-learned-keywords", { method: "POST" });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: r.statusText }));
    throw new Error(err.detail || "清除失败");
  }
  const data = (await r.json()) as { removed: number };
  return data.removed;
}
