import { useEffect, useState, useRef } from "react";
import { cx } from "../data/mockData";
import { Badge, Button, Card, SectionTitle } from "../components/ui";

function LiveTile({ cam }: { cam: any }) {
  const [imgSrc, setImgSrc] = useState<string>("");
  const timerRef = useRef<any>(null);

  const updateSnapshot = () => {
    const timestamp = new Date().getTime();
    setImgSrc(`/camera_snapshot/?cam_id=${cam.id}&t=${timestamp}`);
  };

  useEffect(() => {
    updateSnapshot();
    timerRef.current = setInterval(updateSnapshot, 1000);
    return () => clearInterval(timerRef.current);
  }, [cam.id]);

  return (
    <div className={cx("group rounded-2xl border p-3 transition-all duration-300 hover:-translate-y-1", cam.active ? "border-cyan-400/20 bg-cyan-400/10" : "border-white/10 bg-black/20")}>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Channel {cam.channel}</span>
        <Badge tone={cam.active ? "success" : "danger"}>{cam.active ? "LIVE" : "OFFLINE"}</Badge>
      </div>
      <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-white/10 transition-all duration-300 group-hover:scale-[1.01] bg-black">
        <img 
          src={imgSrc} 
          alt={cam.name} 
          className="h-full w-full object-cover" 
          onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white truncate max-w-[120px]">{cam.name}</p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">IP: {cam.ip} · {cam.fps} FPS</p>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">ID: {cam.id}</span>
      </div>
    </div>
  );
}

export default function OperationsView() {
  const [cameras, setCameras] = useState<any[]>([]);

  const fetchCameras = () => {
    fetch('/api/cameras/')
      .then(res => res.json())
      .then(data => setCameras(data.cameras || []))
      .catch(err => console.error("Error fetching cameras:", err));
  };

  useEffect(() => {
    fetchCameras();
    const interval = setInterval(fetchCameras, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-white/10 p-5 bg-white/5 flex items-center justify-between">
          <SectionTitle title="Live Feed Wall" subtitle="Dynamic multi-camera control center" />
          <Badge tone="success">{cameras.filter(c => c.active).length} ACTIVE</Badge>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3 overflow-y-auto max-h-[700px] no-scrollbar">
          {cameras.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500">
                No cameras configured in Device Management.
            </div>
          ) : cameras.map((cam) => (
            <LiveTile key={cam.id} cam={cam} />
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        <Card>
          <div className="border-b border-white/10 p-5">
            <SectionTitle title="Incident Replay" subtitle="Archive playback and export controls" />
          </div>
          <div className="p-5">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge tone="neutral">{new Date().toLocaleDateString()}</Badge>
              <Button variant="ghost">Export Log</Button>
              <Button variant="ghost">Clip Segment</Button>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-[26px] border border-cyan-400/20 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_35%),linear-gradient(135deg,#0a1019_0%,#02070d_100%)]">
              <div className="absolute left-4 top-4 flex gap-2">
                <Badge tone="danger">Archive Playback</Badge>
                <Badge tone="neutral">SYSTEM_READY</Badge>
              </div>
              <div className="absolute inset-0 opacity-35 animate-pulse border border-cyan-400/10" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="border-b border-white/10 p-5">
            <SectionTitle title="Operator Console" subtitle="Quick actions and operational control" />
          </div>
          <div className="space-y-3 p-5">
            <Button className="w-full justify-start">Acknowledge Alert</Button>
            <Button variant="ghost" className="w-full justify-start">Lock Down Zone</Button>
            <Button variant="ghost" className="w-full justify-start">Dispatch Guard</Button>
            <Button variant="ghost" className="w-full justify-start">Export Incident</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
