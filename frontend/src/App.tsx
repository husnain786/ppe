import { useState, useMemo } from "react";
import { Sidebar, TopBar, MobileTabs } from "./components/layout";
import { alertParameters } from "./data/mockData";

import OverviewView from "./views/OverviewView";
import OperationsView from "./views/OperationsView";
import IntelligenceView from "./views/IntelligenceView";
import AssetsView from "./views/AssetsView";
import AdminView from "./views/AdminView";
import EmployeeView from "./views/EmployeeView";
import DevicesView from "./views/DevicesView";
import NvrDvrView from "./views/NvrDvrView";
import RtspStringsView from "./views/RtspStringsView";

export default function App() {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [params, setParams] = useState(() => alertParameters);

  const toggleParam = (id: string) => {
    setParams((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const setAllCore = () => {
    setParams((prev) => prev.map((p) => (p.tier === "Core" ? { ...p, enabled: true } : p)));
  };

  const setAllAddon = () => {
    setParams((prev) => prev.map((p) => (p.tier === "Addon" ? { ...p, enabled: false } : p)));
  };

  const setAll = () => {
    setParams((prev) => prev.map((p) => ({ ...p, enabled: !p.enabled })));
  };

  const view = useMemo(() => {
    switch (active) {
      case "operations":
        return <OperationsView />;
      case "intelligence":
        return <IntelligenceView />;
      case "assets":
        return <AssetsView />;
      case "ip_cameras":
        return <DevicesView />;
      case "nvr_dvr":
        return <NvrDvrView />;
      case "rtsp_strings":
        return <RtspStringsView />;
      case "admin":
        return <AdminView params={params} toggleParam={toggleParam} setAllCore={setAllCore} setAllAddon={setAllAddon} setAll={setAll} />;
      case "employees":
        return <EmployeeView />;
      default:
        return <OverviewView />;
    }
  }, [active, params]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_26%),linear-gradient(180deg,#020617_0%,#0b1120_42%,#020617_100%)] text-white">
      <div className="flex min-h-screen flex-col xl:flex-row">
        <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 p-4 lg:p-6 xl:p-8">
          <div className="mx-auto max-w-[1680px] space-y-6">
            <TopBar collapsed={collapsed} setCollapsed={setCollapsed} />
            <MobileTabs active={active} setActive={setActive} />
            <section key={active} className="animate-[fadeIn_0.35s_ease-out]">
              {view}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
