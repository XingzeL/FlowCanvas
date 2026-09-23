import type { FullReport } from "../../types";
import { DayPeriodView, VirtualPeriodList } from "../GranularityViews";
import { PeriodSection } from "../PeriodSection";

export function MonthlyDetails({ report }: { report: FullReport }) {
  const { granularity } = report.meta;

  return (
    <section className="section-block" id="monthly">
      <h2 className="section-title">区间明细</h2>
      <div className="dash-card monthly-card">
        {granularity === "month" && (
          <>
            {report.periods.map((p, i) => (
              <PeriodSection key={p.key} period={p} defaultOpen={i === 0} />
            ))}
          </>
        )}
        {granularity === "week" || granularity === "3day" ? (
          <VirtualPeriodList periods={report.periods} embedded />
        ) : null}
        {granularity === "day" && <DayPeriodView periods={report.periods} embedded />}
      </div>
    </section>
  );
}
