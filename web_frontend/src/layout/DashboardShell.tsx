import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

type Props = {
  children: ReactNode;
  activeSection: string;
  onNavigate: (id: string) => void;
  hasReport: boolean;
  dateRange?: string;
};

export function DashboardShell({
  children,
  activeSection,
  onNavigate,
  hasReport,
  dateRange,
}: Props) {
  return (
    <div className="dashboard">
      <Sidebar
        activeId={activeSection}
        onNavigate={onNavigate}
        hasReport={hasReport}
      />
      <div className="dashboard-main">
        <TopHeader
          dateRange={dateRange}
          onSettingsClick={() => onNavigate("settings")}
        />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}
