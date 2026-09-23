import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { analyzeFiles, fetchParsers } from "./api";
import { AmountDistributionChart } from "./components/dashboard/AmountDistributionChart";
import { CategoryLists } from "./components/dashboard/CategoryLists";
import { CategoryOverview } from "./components/dashboard/CategoryOverview";
import { KpiCards } from "./components/dashboard/KpiCards";
import { LargeTxnTable } from "./components/dashboard/LargeTxnTable";
import { MonthlyDetails } from "./components/dashboard/MonthlyDetails";
import { PeriodTrendChart } from "./components/dashboard/PeriodTrendChart";
import { SettingsSection } from "./components/dashboard/SettingsSection";
import { BucketSection } from "./components/BucketSection";
import { AnalysisToolbar } from "./components/upload/AnalysisToolbar";
import { DataSourceCards } from "./components/upload/DataSourceCards";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { DashboardShell } from "./layout/DashboardShell";
import type { FullReport, Granularity, ParserInfo } from "./types";

const PARSER_IDS = ["alipay", "wechat", "cmb", "boc"];
const SECTION_IDS = ["overview", "category", "catlist", "period", "large", "monthly", "settings"];

const LS_GRANULARITY = "flowcanvas_granularity";
const LS_PURE = "flowcanvas_pure_spending";
const LS_THRESHOLD = "flowcanvas_large_threshold";

function loadPref<T>(key: string, fallback: T, parse: (v: string) => T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw != null ? parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [parsers, setParsers] = useState<ParserInfo[]>([]);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [granularity, setGranularity] = useState<Granularity>(() =>
    loadPref(LS_GRANULARITY, "month", (v) => v as Granularity),
  );
  const [pureSpending, setPureSpending] = useState(() =>
    loadPref(LS_PURE, true, (v) => v === "true"),
  );
  const [largeThreshold, setLargeThreshold] = useState(() =>
    loadPref(LS_THRESHOLD, 500, Number),
  );
  const [report, setReport] = useState<FullReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoAnalyzed = useRef(false);

  const { activeId, scrollTo } = useScrollSpy(
    report ? SECTION_IDS : ["settings"],
  );

  useEffect(() => {
    fetchParsers()
      .then(setParsers)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_GRANULARITY, granularity);
  }, [granularity]);

  useEffect(() => {
    localStorage.setItem(LS_PURE, String(pureSpending));
  }, [pureSpending]);

  useEffect(() => {
    localStorage.setItem(LS_THRESHOLD, String(largeThreshold));
  }, [largeThreshold]);

  const parserList = useMemo(
    () =>
      parsers.length
        ? parsers
        : PARSER_IDS.map((id) => ({
            id,
            displayName: id,
            role: "primary",
            filePatterns: [],
          })),
    [parsers],
  );

  const onFileChange = useCallback((id: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
  }, []);

  const onAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeFiles(files, {
        granularity,
        pureSpending,
        largeThreshold,
      });
      setReport(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "分析失败");
    } finally {
      setLoading(false);
    }
  }, [files, granularity, pureSpending, largeThreshold]);

  const hasFile = Object.values(files).some(Boolean);

  useEffect(() => {
    if (hasFile && !autoAnalyzed.current && !report && !loading) {
      autoAnalyzed.current = true;
      onAnalyze();
    }
  }, [hasFile, report, loading, onAnalyze]);

  return (
    <DashboardShell
      activeSection={activeId}
      onNavigate={scrollTo}
      hasReport={!!report}
      dateRange={report?.meta.dateRange}
    >
      <DataSourceCards
        parsers={parserList}
        files={files}
        onFileChange={onFileChange}
        sources={report?.meta.sources}
      />

      <AnalysisToolbar
        granularity={granularity}
        onGranularityChange={setGranularity}
        pureSpending={pureSpending}
        onPureSpendingChange={setPureSpending}
        largeThreshold={largeThreshold}
        onLargeThresholdChange={setLargeThreshold}
        onAnalyze={onAnalyze}
        loading={loading}
        hasFile={hasFile}
        error={error}
      />

      {report && (
        <>
          <KpiCards meta={report.meta} trends={report.meta.trends} />

          <div className="section-block dashboard-grid">
            <div id="period">
              <PeriodTrendChart
                data={report.periodTotals}
                pureSpending={report.meta.pureSpending}
              />
            </div>
            <CategoryOverview categories={report.categories} />
            <AmountDistributionChart buckets={report.amountBuckets} />
            <LargeTxnTable txns={report.largeTxns} />
          </div>

          <CategoryLists
            categories={report.categories}
            details={report.categoryDetails}
          />

          <section className="section-block">
            <BucketSection
              buckets={report.amountBuckets}
              bucketsMerged={report.amountBucketsMerged}
              bucketCategories={report.bucketCategories}
              bucketCategoriesMerged={report.bucketCategoriesMerged}
            />
          </section>

          <MonthlyDetails report={report} />
        </>
      )}

      <SettingsSection
        granularity={granularity}
        pureSpending={pureSpending}
        largeThreshold={largeThreshold}
        classifier={report?.meta.classifier}
      />
    </DashboardShell>
  );
}
