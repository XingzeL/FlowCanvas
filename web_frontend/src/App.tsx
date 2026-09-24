import { useCallback, useEffect, useMemo, useState } from "react";
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
import { CategoryStackSection } from "./components/insights/CategoryStackSection";
import { ExcludedDetailSection } from "./components/insights/ExcludedDetailSection";
import { PeriodCompareSection } from "./components/insights/PeriodCompareSection";
import { PlatformShareSection } from "./components/insights/PlatformShareSection";
import { RecurringSection } from "./components/insights/RecurringSection";
import { SpendingCalendarSection } from "./components/insights/SpendingCalendarSection";
import { AnalysisToolbar } from "./components/upload/AnalysisToolbar";
import { DataSourceCards } from "./components/upload/DataSourceCards";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { DashboardShell } from "./layout/DashboardShell";
import type { FullReport, Granularity, ParserInfo } from "./types";
import { useCategoryDetailLimit } from "./utils/categoryDetailLimit";

const PARSER_IDS = ["alipay", "wechat", "cmb", "boc"];
const SECTION_IDS = [
  "overview",
  "large",
  "catlist",
  "monthly",
  "period",
  "category",
  "platform",
  "excluded",
  "catTrend",
  "calendar",
  "recurring",
  "compare",
  "settings",
];

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
  const [detailLimit, setDetailLimit] = useCategoryDetailLimit();
  const [report, setReport] = useState<FullReport | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onClearFiles = useCallback(() => {
    setFiles({});
    setReport(null);
    setError(null);
    setFileInputKey((k) => k + 1);
  }, []);

  const hasFile = Object.values(files).some(Boolean);

  return (
    <DashboardShell
      activeSection={activeId}
      onNavigate={scrollTo}
      hasReport={!!report}
      dateRange={report?.meta.dateRange}
    >
      <DataSourceCards
        key={fileInputKey}
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
        onClearFiles={onClearFiles}
        loading={loading}
        hasFile={hasFile}
        hasReport={!!report}
        error={error}
      />

      {report && (
        <>
          <KpiCards meta={report.meta} trends={report.meta.trends} />

          <section className="section-block detail-block">
            <LargeTxnTable
              txns={report.largeTxns}
              threshold={report.meta.largeThreshold}
              total={report.meta.total}
            />
            <CategoryLists
              categories={report.categories}
              details={report.categoryDetails}
              detailLimit={detailLimit}
              onDetailLimitChange={setDetailLimit}
            />
            <MonthlyDetails
              report={report}
              detailLimit={detailLimit}
              onDetailLimitChange={setDetailLimit}
            />
          </section>

          <div className="section-block dashboard-grid">
            <div id="period">
              <PeriodTrendChart
                data={report.periodTotals}
                pureSpending={report.meta.pureSpending}
              />
            </div>
            <CategoryOverview categories={report.categories} />
          </div>

          <section className="section-block amount-bucket-block">
            <AmountDistributionChart
              buckets={report.amountBuckets}
              txnCount={report.meta.txnCount}
              total={report.meta.total}
            />
            <BucketSection
              buckets={report.amountBuckets}
              bucketsMerged={report.amountBucketsMerged}
              bucketCategories={report.bucketCategories}
              bucketCategoriesMerged={report.bucketCategoriesMerged}
            />
          </section>

          <section className="section-block insights-block">
            {!!report.platformShare?.length && (
              <PlatformShareSection
                platformShare={report.platformShare}
                sources={report.meta.sources}
              />
            )}
            {report.meta.pureSpending && (
              <ExcludedDetailSection excludedDetail={report.excludedDetail} />
            )}
            {!!report.categoryTrend?.keys.length &&
              !!report.categoryTrend.series.length && (
                <CategoryStackSection categoryTrend={report.categoryTrend} />
              )}
            {!!report.spendingCalendar?.days.length && (
              <SpendingCalendarSection
                spendingCalendar={report.spendingCalendar}
              />
            )}
            {!!report.recurring?.length && (
              <RecurringSection items={report.recurring} />
            )}
            {report.periods.length >= 2 && (
              <PeriodCompareSection periods={report.periods} />
            )}
          </section>
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
