import type { FullReport } from "../../types";
import type { CategoryDetailLimit } from "../../utils/categoryDetailLimit";
import { DayPeriodView, VirtualPeriodList } from "../GranularityViews";
import { CategoryDetailLimitSelect } from "./CategoryDetailLimitSelect";
import { PeriodSection } from "../PeriodSection";

type Props = {
  report: FullReport;
  detailLimit: CategoryDetailLimit;
  onDetailLimitChange: (limit: CategoryDetailLimit) => void;
};

export function MonthlyDetails({ report, detailLimit, onDetailLimitChange }: Props) {
  const { granularity } = report.meta;

  return (
    <section className="section-block" id="monthly">
      <div className="section-header-row">
        <h2 className="section-title">区间明细</h2>
        <CategoryDetailLimitSelect value={detailLimit} onChange={onDetailLimitChange} />
      </div>
      <div className="dash-card monthly-card">
        {granularity === "month" && (
          <>
            {report.periods.map((p, i) => (
              <PeriodSection
                key={p.key}
                period={p}
                defaultOpen={i === 0}
                detailLimit={detailLimit}
              />
            ))}
          </>
        )}
        {granularity === "week" || granularity === "3day" ? (
          <VirtualPeriodList
            periods={report.periods}
            embedded
            detailLimit={detailLimit}
          />
        ) : null}
        {granularity === "day" && (
          <DayPeriodView periods={report.periods} embedded detailLimit={detailLimit} />
        )}
      </div>
    </section>
  );
}
