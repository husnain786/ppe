import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cx, mapNodes, heatCells, activityData, zoneTraffic } from "../data/mockData";
import { Badge, Card, SectionTitle } from "../components/ui";

export default function IntelligenceView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-white/10 p-5">
            <SectionTitle title="Map Overview" subtitle="Live tactical view with active nodes and incident markers" />
          </div>
          <div className="relative h-[560px] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.10),transparent_30%),linear-gradient(180deg,#070b12_0%,#04070c_100%)] p-5">
            <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(34,211,238,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.07)_1px,transparent_1px)] bg-[size:56px_56px]" />
            <div className="absolute left-6 top-6 rounded-2xl border border-cyan-400/20 bg-black/30 px-3 py-2 text-xs text-cyan-200">SYSTEM_STABLE</div>
            {mapNodes.map((n, idx) => (
              <div key={idx} className="absolute" style={{ left: n.x, top: n.y }}>
                <div className={cx("h-5 w-5 rounded-full shadow-[0_0_30px_rgba(34,211,238,.6)]", n.status === "alert" ? "bg-rose-400" : "bg-cyan-400")} />
                {n.status === "alert" ? <div className="mt-2 rounded-lg border border-rose-400/30 bg-rose-500/90 px-3 py-1 text-xs font-semibold tracking-wider text-white">MOTION_DETECTED [CAM_04]</div> : null}
              </div>
            ))}
            <div className="absolute bottom-6 left-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-wider text-slate-500">Total Devices</p>
                <p className="mt-2 text-2xl font-semibold text-white">124</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-wider text-slate-500">Active Alerts</p>
                <p className="mt-2 text-2xl font-semibold text-rose-200">03</p>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-xs text-slate-300">LAT: 34.0522° N · LONG: 118.2437° W</div>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-white/10 p-5">
            <SectionTitle title="Population Density Heatview" subtitle="Crowd concentration across zones in real time" />
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-6 gap-2 rounded-[22px] border border-white/10 bg-black/20 p-3">
              {heatCells.flat().map((v, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-lg transition-all duration-300 hover:scale-110"
                  style={{
                    background: `rgba(34, 211, 238, ${0.06 + v * 0.08})`,
                    boxShadow: v >= 8 ? "0 0 20px rgba(251,113,133,0.25)" : "none",
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-[22px] border border-white/10 bg-black/20 p-4 text-xs text-slate-300">
              <div>
                <p className="text-slate-500">Peak Zone</p>
                <p className="mt-2 text-lg font-semibold text-white">Main Gate</p>
              </div>
              <div>
                <p className="text-slate-500">Density Index</p>
                <p className="mt-2 text-lg font-semibold text-rose-200">84%</p>
              </div>
              <div>
                <p className="text-slate-500">Crowd Shift</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200">North-East</p>
              </div>
            </div>

            {[
              ["Main Gate", 84, "High"],
              ["Parking", 63, "Medium"],
              ["Lobby", 57, "Medium"],
              ["Warehouse", 31, "Low"],
              ["Server Room", 18, "Restricted"],
            ].map(([name, value, level]) => (
              <div key={name} className="rounded-3xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:bg-black/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="mt-1 text-xs text-slate-400">Density level</p>
                  </div>
                  <Badge tone={level === "High" ? "danger" : level === "Medium" ? "warning" : "success"}>{level}</Badge>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className={cx("h-2 rounded-full transition-all duration-500", level === "High" ? "bg-rose-400" : level === "Medium" ? "bg-amber-400" : "bg-emerald-400")}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">{value}% population intensity</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="border-b border-white/10 p-5">
            <SectionTitle title="Spatial Analytics" subtitle="Detection and anomaly trend by time" />
          </div>
          <div className="h-[320px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="t" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
                <Legend />
                <Line type="monotone" dataKey="detections" stroke="#22d3ee" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="anomalies" stroke="#fb7185" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="border-b border-white/10 p-5">
            <SectionTitle title="Zone Traffic" subtitle="Hot zones by activity" />
          </div>
          <div className="h-[320px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneTraffic}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {zoneTraffic.map((_, idx) => (
                    <Cell key={idx} fill={idx % 2 === 0 ? "#22d3ee" : "#8b5cf6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
