import {
  ArrowLeftRight,
  BarChart3,
  Calendar,
  CalendarDays,
  FilterX,
  FolderOpen,
  LayoutDashboard,
  Layers,
  List,
  PieChart,
  Repeat,
  Settings,
  Table2,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "总览", icon: LayoutDashboard },
  { id: "large", label: "大额", icon: List },
  { id: "catlist", label: "分类明细", icon: Layers },
  { id: "monthly", label: "区间详情", icon: Calendar },
  { id: "period", label: "区间趋势", icon: BarChart3 },
  { id: "category", label: "分类占比", icon: Table2 },
  { id: "platform", label: "平台", icon: PieChart },
  { id: "excluded", label: "剔除", icon: FilterX },
  { id: "catTrend", label: "分类趋势", icon: BarChart3 },
  { id: "calendar", label: "日历", icon: CalendarDays },
  { id: "recurring", label: "订阅", icon: Repeat },
  { id: "compare", label: "跨期", icon: ArrowLeftRight },
  { id: "settings", label: "设置", icon: Settings },
] as const;

type Props = {
  activeId: string;
  onNavigate: (id: string) => void;
  hasReport: boolean;
};

export function Sidebar({ activeId, onNavigate, hasReport }: Props) {
  const items = hasReport ? NAV_ITEMS : NAV_ITEMS.filter((i) => i.id === "settings");

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <FolderOpen size={20} strokeWidth={2} />
        <span>FlowCanvas</span>
      </div>
      <nav className="sidebar-nav">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`sidebar-link ${activeId === id ? "active" : ""}`}
            onClick={() => onNavigate(id)}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </button>
        ))}
      </nav>
      <p className="sidebar-tagline">让每一笔支出都更有价值</p>
    </aside>
  );
}
