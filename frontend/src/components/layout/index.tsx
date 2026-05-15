import { useState } from "react";
import { cx, navItems, topStats } from "../../data/mockData";
import { Badge, Button } from "../ui";

export function Sidebar({ active, setActive, collapsed, setCollapsed }: any) {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({ HR: true });

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <aside
      className={cx(
        "no-scrollbar shrink-0 border-b border-cyan-400/10 bg-[#090d14]/95 p-4 backdrop-blur-xl xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto xl:border-b-0 xl:border-r transition-all duration-300",
        collapsed ? "w-full xl:w-[88px]" : "w-full xl:w-[280px]"
      )}
    >
      <div className={cx("rounded-[24px] border border-cyan-400/10 bg-white/5 p-4 shadow-2xl shadow-black/20 transition-all duration-300", collapsed && "xl:p-3")}>
        <div className={cx("flex items-center gap-3", collapsed && "xl:justify-center")}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <span className="text-lg font-bold">CS</span>
          </div>
          {!collapsed ? (
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-cyan-300">CORE_SENTRY</p>
              <p className="text-xs text-slate-400">SECURITY COMMAND CENTER</p>
            </div>
          ) : null}
        </div>

        {!collapsed ? (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
            <span>Operator_01</span>
            <Badge tone="success">Online</Badge>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => setCollapsed((v: boolean) => !v)}>
          {collapsed ? "Show Panel" : "Hide Panel"}
        </Button>
      </div>

      <nav className="mt-4 flex flex-col gap-6">
        {Object.entries(
          navItems.reduce((acc: any, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
          }, {})
        ).map(([category, items]: any) => {
          const isCollapsed = collapsedCategories[category];
          return (
            <div key={category}>
              {!collapsed && (
                <button
                  onClick={() => toggleCategory(category)}
                  className="mb-2 flex w-full items-center justify-between px-4 text-[10px] font-bold tracking-[0.2em] text-slate-500 transition-colors hover:text-slate-300"
                >
                  <span>{category}</span>
                  <span className="text-lg leading-none">{isCollapsed ? "+" : "−"}</span>
                </button>
              )}
              {(!isCollapsed || collapsed) && (
                <div className={cx("grid gap-2 overflow-hidden transition-all duration-300", collapsed ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-1")}>
                  {items.map((item: any) => {
                    const activeItem = active === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={cx(
                          "group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5",
                          activeItem
                            ? "border-cyan-400/30 bg-cyan-400/10 text-white shadow-lg shadow-cyan-500/10"
                            : "border-white/10 bg-white/0 text-slate-300 hover:border-white/20 hover:bg-white/5",
                          collapsed && "xl:justify-center xl:px-3"
                        )}
                        title={item.label}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={cx(
                              "flex h-7 w-7 items-center justify-center rounded-xl border text-[11px] font-semibold transition-all duration-300",
                              activeItem ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/5 text-slate-400"
                            )}
                          >
                            {item.short}
                          </span>
                          {!collapsed ? <span className="text-sm font-medium">{item.label}</span> : null}
                        </span>
                        {!collapsed ? <span className={cx("text-sm transition-transform duration-300 group-hover:translate-x-1", activeItem ? "text-cyan-300" : "text-slate-500")}>›</span> : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {!collapsed ? (
        <div className="mt-5 rounded-[24px] border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-5">
          <p className="text-sm font-semibold text-white">Pitch Ready</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Operator console, incident replay, map view, population heatview, live cameras, and configurable AI parameters are integrated for a client-facing demo.
          </p>
        </div>
      ) : null}
    </aside>
  );
}

export function TopBar({ collapsed, setCollapsed }: any) {
  return (
    <header className="rounded-[30px] border border-cyan-400/10 bg-[#11161f]/85 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">CORE_SENTRY</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white lg:text-4xl">AI Surveillance Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Premium command center for live feeds, incident archive, map visualization, density heatview, analytics, access control, alerts, logs, and AI parameter configuration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" onClick={() => setCollapsed((v: boolean) => !v)}>{collapsed ? "Show Sidebar" : "Hide Sidebar"}</Button>
          <Button variant="ghost">Terminal Search</Button>
          <Button>New Incident</Button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/25">
            <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
            <p className="mt-2 text-xs text-slate-500">{item.hint}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

export function MobileTabs({ active, setActive }: any) {
  return (
    <div className="xl:hidden">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={cx(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300",
                isActive ? "border-cyan-400/30 bg-cyan-400/10 text-white" : "border-white/10 bg-white/5 text-slate-300"
              )}
            >
              <span className="text-xs font-semibold">{item.short}</span>
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
