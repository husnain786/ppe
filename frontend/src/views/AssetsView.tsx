import { accessRules, devices } from "../data/mockData";
import { Badge, Card, SectionTitle } from "../components/ui";

export default function AssetsView() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
      <Card>
        <div className="border-b border-white/10 p-5">
          <SectionTitle title="Access Control Panel" subtitle="Policies, schedules, visitors, and identity-based access" />
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {accessRules.map((rule) => (
            <div key={rule.title} className="rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:bg-black/30">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-200">✓</div>
                <div>
                  <p className="font-semibold text-white">{rule.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{rule.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="border-b border-white/10 p-5">
          <SectionTitle title="Devices" subtitle="Live inventory, status, and zonewise binding" />
        </div>
        <div className="space-y-3 p-5">
          {devices.map((d) => (
            <div key={d.name} className="grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:bg-black/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{d.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{d.type} · {d.zone}</p>
                </div>
                <Badge tone={d.status === "Online" ? "success" : d.status === "Alert" ? "warning" : "danger"}>{d.status}</Badge>
              </div>
              <p className="text-xs text-slate-500">{d.ip} · {d.fw}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
