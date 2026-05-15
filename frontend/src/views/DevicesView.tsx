import { useEffect, useState } from "react";
import { Badge, Button, Card, SectionTitle } from "../components/ui";

export default function DevicesView() {
  const [devices, setDevices] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", ip_address: "", channel: "102", process_frame_rate: "10", username: "", password: "" });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const fetchDevices = () => {
    fetch('/api/cameras/?ip_only=true')
      .then(res => res.json())
      .then(data => setDevices(data.cameras || []))
      .catch(err => console.error("Error fetching cameras:", err));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (d: any) => {
    setEditingId(d.id);
    setEditFormData({ 
        name: d.name, 
        ip_address: d.ip, 
        channel: d.channel.toString(), 
        process_frame_rate: d.fps.toString(), 
        username: d.username || "", 
        password: d.password || "" 
    });
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    const finalData = { ...formData, name: formData.ip_address };
    Object.entries(finalData).forEach(([k, v]) => data.append(k, v));

    fetch('/devices/', {
      method: 'POST',
      body: data,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': (document.cookie.match(/csrftoken=([^;]+)/) || [])[1] || ''
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        setIsAdding(false);
        setFormData({ name: "", ip_address: "", channel: "102", process_frame_rate: "10", username: "", password: "" });
        fetchDevices();
      } else {
        alert("Error adding device.");
      }
    });
  };

  const handleEditSave = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const data = new FormData();
    const finalData = { ...editFormData, name: editFormData.ip_address };
    Object.entries(finalData).forEach(([k, v]) => data.append(k, v as string));

    fetch(`/devices/${id}/`, {
      method: 'POST',
      body: data,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': (document.cookie.match(/csrftoken=([^;]+)/) || [])[1] || ''
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        setEditingId(null);
        fetchDevices();
      } else {
        alert("Error updating device.");
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this device?")) return;
    fetch(`/devices/delete/${id}/`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': (document.cookie.match(/csrftoken=([^;]+)/) || [])[1] || ''
      }
    })
    .then(res => res.json())
    .then(() => {
        setEditingId(null);
        fetchDevices();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">IP Cameras</h2>
          <p className="mt-1 text-sm text-slate-400">Configure and monitor standalone IP cameras directly via RTSP</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>+ Add IP Camera</Button>
      </div>

      {isAdding && (
        <Card className="p-6 animate-[fadeIn_0.3s_ease-out]">
          <SectionTitle title="New IP Camera" subtitle="Enter RTSP connection details" />
          <form onSubmit={handleAddDevice} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">IP Address</label>
              <input name="ip_address" value={formData.ip_address} onChange={handleChange} required className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Channel</label>
              <input name="channel" value={formData.channel} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Username (Optional)</label>
              <input name="username" value={formData.username} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Password (Optional)</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Process Frame Rate</label>
              <input name="process_frame_rate" value={formData.process_frame_rate} onChange={handleChange} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <Button variant="ghost" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit">Save Device</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {devices.map(d => (
          editingId === d.id ? (
            <Card key={d.id} className="p-5 flex flex-col border-cyan-500/30 bg-cyan-500/5 shadow-lg shadow-cyan-500/5 animate-[fadeIn_0.2s_ease-out]">
              <form onSubmit={(e) => handleEditSave(e, d.id)} className="grid gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">IP Address</label>
                  <input name="ip_address" value={editFormData.ip_address} onChange={(e) => setEditFormData({...editFormData, ip_address: e.target.value})} required className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Channel</label>
                    <input name="channel" value={editFormData.channel} onChange={(e) => setEditFormData({...editFormData, channel: e.target.value})} className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors" />
                    </div>
                    <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">FPS</label>
                    <input name="process_frame_rate" value={editFormData.process_frame_rate} onChange={(e) => setEditFormData({...editFormData, process_frame_rate: e.target.value})} className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">User</label>
                    <input name="username" value={editFormData.username} onChange={(e) => setEditFormData({...editFormData, username: e.target.value})} className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors" />
                    </div>
                    <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pass</label>
                    <input name="password" type="password" value={editFormData.password} onChange={(e) => setEditFormData({...editFormData, password: e.target.value})} className="w-full mt-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500/50 transition-colors" placeholder="••••••••" />
                    </div>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
                    <button type="button" onClick={() => handleDelete(d.id)} className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 transition-all">Delete</button>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setEditingId(null)} className="text-[10px] text-slate-400 hover:text-white font-bold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 transition-all">Discard</button>
                        <button type="submit" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 transition-all">Save Changes</button>
                    </div>
                </div>
              </form>
            </Card>
          ) : (
          <Card key={d.id} className="p-5 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/20 group">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{d.name}</h3>
                <Badge tone={d.active ? "success" : "danger"}>{d.active ? "Online" : "Offline"}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 font-mono">IP</span>
                    <span>{d.ip}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                        <span>Channel {d.channel}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                        <span>{d.fps} FPS</span>
                    </div>
                </div>
              </div>
              {d.username && (
                <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    Credentials Protected
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => handleEditClick(d)} className="text-xs text-cyan-400 hover:text-cyan-300 font-bold border border-cyan-500/30 px-4 py-2 rounded-xl bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-all">Edit Device</button>
            </div>
          </Card>
          )
        ))}
        {devices.length === 0 && !isAdding && (
          <div className="col-span-full py-16 text-center">
             <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-slate-600 text-2xl mb-4 border border-dashed border-white/10">!</div>
             <p className="text-slate-500 font-medium">No active camera devices found.</p>
             <p className="text-sm text-slate-600 mt-1">Connect your first AI-enabled camera to start monitoring.</p>
          </div>
        )}
      </div>
    </div>
  );
}
