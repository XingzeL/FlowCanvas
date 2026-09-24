import { HeatmapCalendar, type SpendingDay } from "../charts/HeatmapCalendar";
import { fmt } from "../../utils/format";

export type SpendingCalendar = {
  days: SpendingDay[];
  maxAmount: number;
};

type Props = {
  spendingCalendar: SpendingCalendar;
};

export function SpendingCalendarSection({ spendingCalendar }: Props) {
  const { days, maxAmount } = spendingCalendar;
  if (!days.length) return null;

  const totalAmount = days.reduce((sum, d) => sum + d.amount, 0);
  const totalCount = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="dash-card" id="calendar">
      <h3 className="dash-card-title">消费日历</h3>
      <p className="muted" style={{ margin: "0 0 12px" }}>
        {days.length} 天有消费 · 共 {totalCount} 笔 · {fmt(totalAmount)}
        {maxAmount > 0 ? ` · 单日最高 ${fmt(maxAmount)}` : ""}
      </p>
      <HeatmapCalendar days={days} maxAmount={maxAmount} />
    </div>
  );
}
