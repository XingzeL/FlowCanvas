import {
  BarChart3,
  Calendar,
  FolderOpen,
  LayoutDashboard,
  Layers,
  List,
  Settings,
  Table2,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "总览", icon: LayoutDashboard },
  { id: "category", label: "分类", icon: Table2 },
  { id: "catlist", label: "分类明细", icon: Layers },
  { id: "period", label: "区间", icon: BarChart3 },
  { id: "large", label: "大额", icon: List },
  { id: "monthly", label: "月度", icon: Calendar },
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
