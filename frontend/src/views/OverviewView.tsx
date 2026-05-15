import { useEffect, useState, useRef } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell
} from "recharts";
import { cx, activityData, deviceHealth } from "../data/mockData";
import { Badge, Button, Card, MetricCard, SectionTitle } from "../components/ui";
import { useInView } from "../hooks/useInView";

export default function OverviewView() {
  const [activityRef, activityVisible] = useInView(0.3);
  const [healthRef, healthVisible] = useInView(0.3);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);

  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<any | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const [systemMode, setSystemMode] = useState<"ppe" | "face">("ppe");
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    fetch('/api/mode/get/')
      .then(res => res.json())
      .then(data => setSystemMode(data.mode))
      .catch(err => console.error("Error fetching mode:", err));
  }, []);

  const toggleMode = (newMode: "ppe" | "face") => {
    if (newMode === systemMode || isChanging) return;
    
    setIsChanging(true);
    fetch(`/api/mode/set/?mode=${newMode}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSystemMode(newMode);
        }
      })
      .catch(err => console.error("Error setting mode:", err))
      .finally(() => {
        setTimeout(() => setIsChanging(false), 2000); // Cooldown for model swap
      });
  };

  const PPE_ITEMS = [
    { id: "Hardhat", label: "Hardhat" },
    { id: "Mask", label: "Mask" },
    { id: "Vest", label: "Safety Vest" },
    { id: "Phone", label: "Phone Use" }
  ];

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetryKey(k => k + 1);
  };

  const fetchLogs = () => {
    if (isClearing) return;
    fetch('/api/logs/')
      .then(res => res.json())
      .then(data => setRecentLogs(data.logs || []))
      .catch(err => console.error("Error fetching logs:", err));
  };

  const fetchCameras = () => {
    fetch('/api/cameras/')
      .then(res => res.json())
      .then(data => setCameras(data.cameras || []))
      .catch(err => console.error("Error fetching cameras:", err));
  };

  useEffect(() => {
    fetchLogs();
    fetchCameras();
    const intervalLogs = setInterval(fetchLogs, 3000);
    const intervalCams = setInterval(fetchCameras, 10000);
    return () => {
      clearInterval(intervalLogs);
      clearInterval(intervalCams);
    };
  }, [isClearing]);

  const handleClearLogs = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to clear all alert history?")) return;
    
    setIsClearing(true);
    setRecentLogs([]);
    
    fetch('/api/logs/clear/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': (document.cookie.match(/csrftoken=([^;]+)/) || [])[1] || ''
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setRecentLogs([]);
      } else {
        console.error("Failed to clear logs:", data.message);
        fetchLogs();
      }
    })
    .catch(err => {
      console.error("Error clearing logs:", err);
      fetchLogs();
    })
    .finally(() => {
      setTimeout(() => setIsClearing(false), 1000);
    });
  };

  const GridTile = ({ cam }: { cam: any }) => {
    const [imgSrc, setImgSrc] = useState<string>("");
    const timerRef = useRef<any>(null);

    const updateSnapshot = () => {
        const timestamp = new Date().getTime();
        setImgSrc(`/camera_snapshot/?cam_id=${cam.id}&t=${timestamp}&v=${retryKey}`);
    };

    useEffect(() => {
        updateSnapshot();
        timerRef.current = setInterval(updateSnapshot, 1000);
        return () => clearInterval(timerRef.current);
    }, [cam.id, retryKey]);

    return (
        <img 
            src={imgSrc} 
            alt="Live Feed" 
            className="h-full w-full object-cover" 
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "";
            }}
        />
    );
  };

  const renderAlertModal = () => {
    if (!selectedAlert) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAlert(null)} />
        <div className="relative w-full max-w-2xl rounded-[32px] border border-cyan-400/20 bg-[#0b1120] shadow-2xl shadow-cyan-900/20 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="border-b border-white/10 p-5 flex items-center justify-between bg-white/5 shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-white">Incident Report</h3>
              <p className="text-sm text-slate-400 mt-1">{selectedAlert.timestamp}</p>
            </div>
            <button 
              onClick={() => setSelectedAlert(null)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-slate-400 hover:bg-white/10 hover:text-white transition"
            >
              ✕
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto no-scrollbar flex-1">
            {selectedAlert.snapshot_url ? (
              <div className="mb-6 overflow-hidden rounded-2xl border border-rose-500/30 bg-black/50 shadow-inner flex justify-center">
                <img src={selectedAlert.snapshot_url} alt="Alert Snapshot" className="w-full h-auto max-h-[400px] object-contain" />
              </div>
            ) : (
              <div className="mb-6 flex h-48 items-center justify-center rounded-2xl border border-dashed border-rose-500/30 bg-rose-500/5 text-rose-400">
                No Snapshot Available
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Individual</p>
                <p className="text-lg font-semibold text-white">{selectedAlert.name}</p>
              </div>
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-center">
                <p className="text-[10px] uppercase tracking-wider text-rose-400/70 font-bold mb-1">Primary Violation</p>
                <p className="text-sm font-semibold text-rose-200">{selectedAlert.violation}</p>
              </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 text-center">Safety Audit Checklist</p>
               <div className="grid grid-cols-4 gap-3">
                  {PPE_ITEMS.map(item => {
                    // Check if this specific item is in the violation string
                    const isViolation = selectedAlert.violation.toLowerCase().includes(item.id.toLowerCase());
                    return (
                      <div key={item.id} className={cx("flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all", isViolation ? "border-rose-500/20 bg-rose-500/5 text-rose-300" : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300")}>
                        <div className={cx("flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold", isViolation ? "border-rose-500/40 bg-rose-500/20" : "border-emerald-500/40 bg-emerald-500/20")}>
                           {item.id === "Phone" ? (isViolation ? "!" : "✓") : (isViolation ? "✕" : "✓")}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-center">{item.label}</span>
                        <span className="text-[9px] opacity-60 font-medium">
                          {item.id === "Phone" 
                            ? (isViolation ? "VIOLATION" : "CLEAN") 
                            : (isViolation ? "MISSING" : "VERIFIED")}
                        </span>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/5 shrink-0">
            <Button variant="ghost" onClick={() => setSelectedAlert(null)}>Close</Button>
            <Button>Acknowledge Incident</Button>
          </div>
        </div>
      </div>
    );
  };

  if (selectedCamera) {
    return (
      <div className="space-y-6 relative h-[calc(100vh-140px)] flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-white">{selectedCamera.name}</h2>
            <p className="text-sm text-slate-400 mt-1">IP: {selectedCamera.ip} · Channel: {selectedCamera.channel} · FPS: {selectedCamera.fps}</p>
          </div>
          <Button variant="ghost" onClick={() => setSelectedCamera(null)}>← Back to Overview</Button>
        </div>
        
        <div className="grid gap-6 xl:grid-cols-[2.5fr_1fr] flex-1 min-h-0 pb-6">
          <Card className="flex flex-col overflow-hidden h-full">
             <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                <div className="flex gap-2">
                   <Badge tone="success">LIVE STREAM</Badge>
                   <Badge tone={selectedCamera.active ? "success" : "danger"}>{selectedCamera.active ? "ONLINE" : "OFFLINE"}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleRetry} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">RETRY</button>
                  <span className="text-xs text-slate-500">Live feed</span>
                </div>
             </div>
             <div className="flex-1 bg-black overflow-hidden relative">
                <img key={`main-${selectedCamera.id}-${retryKey}`} src={`/video_feed/?cam_id=${selectedCamera.id}&v=${retryKey}`} alt="Live Feed" className="h-full w-full object-contain" />
             </div>
          </Card>
          
          <Card className="flex flex-col overflow-hidden h-full">
            <div className="border-b border-white/10 p-5 bg-white/5 shrink-0 flex items-center justify-between">
              <SectionTitle title="Live Alerts" subtitle="Real-time" />
              <Button variant="ghost" className="text-[10px] h-7 text-rose-400 hover:text-rose-300" onClick={handleClearLogs}>Clear All</Button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-3">
              {recentLogs.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-4">No recent alerts.</div>
              ) : (
                recentLogs.map((a: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedAlert(a)}
                    className="cursor-pointer rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 transition-all duration-300 hover:bg-rose-500/10 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-3">
                      {a.snapshot_url ? (
                        <img src={a.snapshot_url} alt="Snapshot" className="h-10 w-10 rounded-lg object-cover border border-rose-400/20 shrink-0" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-300 shrink-0">!</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                           <p className="font-medium text-white text-xs truncate">{a.name}</p>
                           <span className="text-[9px] text-slate-500">{a.timestamp}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {PPE_ITEMS.map(item => {
                            const isViolation = a.violation.toLowerCase().includes(item.id.toLowerCase());
                            return (
                              <div key={item.id} className={cx("px-2 py-0.5 rounded-lg text-[9px] font-bold border flex items-center gap-1", isViolation ? "border-rose-500/30 bg-rose-500/10 text-rose-400" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400")}>
                                <span>{isViolation ? (item.id === "Phone" ? "!" : "✕") : "✓"}</span>
                                <span>{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {renderAlertModal()}
      </div>
    );
  }

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 shrink-0">
        <MetricCard label="Total Cameras" value={cameras.length.toString()} hint={`${cameras.filter(c=>c.active).length} active`} accent="◌" />
        <MetricCard label="Active Alerts" value={recentLogs.length.toString()} hint="Real-time" accent="!" />
        <MetricCard label="System Load" value="12.4%" hint="Stable" accent="⌁" />
        <MetricCard label="Storage" value="88%" hint="Healthy" accent="▣" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2.5fr_1fr] h-[550px] shrink-0">
        <Card className="p-0 overflow-hidden flex flex-col h-full">
          <div className="border-b border-white/10 p-5 shrink-0 bg-white/5 flex flex-wrap items-center justify-between gap-4">
            <SectionTitle title="Live Camera Wall" subtitle="Quick overview of active streams" />
            
            <div className="flex items-center gap-3">
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
                 <button 
                   onClick={() => toggleMode("ppe")}
                   disabled={isChanging}
                   className={cx(
                     "px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300",
                     systemMode === "ppe" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10" : "text-slate-500 hover:text-slate-300"
                   )}
                 >
                   {isChanging && systemMode === "face" ? "LOADING..." : "PPE SAFETY"}
                 </button>
                 <button 
                   onClick={() => toggleMode("face")}
                   disabled={isChanging}
                   className={cx(
                     "px-4 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-300",
                     systemMode === "face" ? "bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-500/10" : "text-slate-500 hover:text-slate-300"
                   )}
                 >
                   {isChanging && systemMode === "ppe" ? "LOADING..." : "FACE ID"}
                 </button>
              </div>
              {isChanging && (
                <span className="text-[10px] font-bold text-rose-400 animate-pulse uppercase tracking-widest hidden lg:block">
                  SWAPPING VRAM...
                </span>
              )}
            </div>
          </div>
          <div className="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto no-scrollbar flex-1 content-start">
            {cameras.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-500">
                No cameras registered. Go to "Devices" to add a camera.
              </div>
            ) : cameras.map((cam) => (
              <div 
                key={cam.id} 
                onClick={() => setSelectedCamera(cam)}
                className="cursor-pointer group rounded-xl border p-2.5 transition-all duration-300 hover:-translate-y-1 border-cyan-400/15 bg-black/20 h-fit max-w-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge tone={cam.active ? "success" : "danger"} className="text-[9px] px-1.5 py-0">{cam.active ? "LIVE" : "OFFLINE"}</Badge>
                  <button onClick={handleRetry} className="text-[9px] text-cyan-500 hover:text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase">Refresh</button>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-lg border border-white/5 bg-black shadow-inner">
                   <GridTile cam={cam} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[9px] text-white font-bold tracking-widest uppercase">Click to Enlarge</span>
                   </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <p className="text-[11px] font-bold text-white truncate pr-2 tracking-wide uppercase">{cam.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-cyan-500 animate-pulse" />
                    <p className="text-[9px] text-slate-500 font-mono shrink-0">CH {cam.channel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col h-[550px] overflow-hidden">
            <div className="border-b border-white/10 p-5 shrink-0 flex items-center justify-between bg-white/5">
              <SectionTitle title="Recent Alerts" subtitle="Live Stream" />
              <Button variant="ghost" className="text-[10px] h-7 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:bg-rose-500/10 px-2" onClick={handleClearLogs}>Clear All</Button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
              {recentLogs.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-12">No recent alerts.</div>
              ) : (
                recentLogs.map((a: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedAlert(a)}
                    className="cursor-pointer rounded-2xl border border-rose-500/10 bg-rose-500/5 p-4 transition-all duration-300 hover:bg-rose-500/10 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-4">
                      {a.snapshot_url ? (
                        <img src={a.snapshot_url} alt="Snapshot" className="h-12 w-12 rounded-xl object-cover border border-rose-400/20 shadow-lg shadow-rose-900/10 shrink-0" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300 shrink-0">!</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                             <p className="font-bold text-white text-sm truncate">{a.name}</p>
                             <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5 font-bold">Safety Audit</p>
                           </div>
                           <span className="text-[10px] font-mono text-rose-400/70">{a.timestamp}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {PPE_ITEMS.map(item => {
                            const isFaceScan = a.violation.includes("Face Identification Scan");
                            const isViolation = !isFaceScan && a.violation.toLowerCase().includes(item.id.toLowerCase());
                            
                            if (isFaceScan) {
                              return (
                                <div key={item.id} className="px-2 py-1 rounded-lg text-[9px] font-bold border border-slate-500/20 bg-slate-500/5 text-slate-500 flex items-center gap-1.5">
                                  <span className="text-xs">-</span>
                                  <span>{item.label}</span>
                                </div>
                              );
                            }

                            return (
                              <div key={item.id} className={cx("px-2 py-1 rounded-lg text-[9px] font-bold border flex items-center gap-1.5", isViolation ? "border-rose-500/30 bg-rose-500/10 text-rose-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300")}>
                                <span className="text-xs">{isViolation ? (item.id === "Phone" ? "!" : "✕") : "✓"}</span>
                                <span>{item.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3 shrink-0 pb-4">
        <Card ref={activityRef as any} className={cx("xl:col-span-2 transition-all duration-700", activityVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-60") }>
          <div className="border-b border-white/10 p-5 bg-white/5">
            <SectionTitle title="Activity Analytics" subtitle="Detections, Anomalies & Accesses" />
          </div>
          <div className="h-[350px] p-5">
            {activityVisible ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="det" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ano" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb7185" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="t" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
                  <Legend verticalAlign="top" height={36} />
                  <Area name="Detections" type="monotone" dataKey="detections" stroke="#22d3ee" fill="url(#det)" />
                  <Area name="Accesses" type="monotone" dataKey="accesses" stroke="#a855f7" fill="url(#acc)" />
                  <Area name="Anomalies" type="monotone" dataKey="anomalies" stroke="#fb7185" fill="url(#ano)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 italic">
                Awaiting viewport...
              </div>
            )}
          </div>
        </Card>

        <Card ref={healthRef as any} className={cx("transition-all duration-700", healthVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-60") }>
          <div className="border-b border-white/10 p-5 bg-white/5">
            <SectionTitle title="Device Health" subtitle="System status" />
          </div>
          <div className="h-[350px] p-5">
            {healthVisible ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceHealth} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={4}>
                    {deviceHealth.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,.12)" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 italic">
                Awaiting viewport...
              </div>
            )}
          </div>
        </Card>
      </div>

      {renderAlertModal()}
    </div>
  );
}
