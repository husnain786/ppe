import { useEffect, useState } from "react";
import { Badge, Button, Card, SectionTitle } from "../components/ui";

export default function NvrDvrView() {
  const [nvrs, setNvrs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", ip_address: "", port: "554", username: "", password: "", rtsp_template: "" });
  
  const [expandedNvrId, setExpandedNvrId] = useState<number | null>(null);
  const [channelForm, setChannelForm] = useState({ channel: "1", process_frame_rate: "10" });

  const fetchData = () => {
    fetch('/api/nvrs/').then(res => res.json()).then(data => setNvrs(data.nvrs || []));
    fetch('/api/rtsp-templates/').then(res => res.json()).then(data => setTemplates(data.templates || []));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelForm({ ...channelForm, [e.target.name]: e.target.value });
  };

  const handleAddNvr = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    
    fetch('/nvrs/', { method: 'POST', body: data })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setIsAdding(false);
          setFormData({ name: "", ip_address: "", port: "554", username: "", password: "", rtsp_template: "" });
          fetchData();
        } else {
          alert("Error adding NVR");
        }
      });
  };

  const handleAddChannel = (e: React.FormEvent, nvrId: number) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(channelForm).forEach(([k, v]) => data.append(k, v));

    fetch(`/nvrs/${nvrId}/add_channel/`, { method: 'POST', body: data })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setChannelForm({ channel: "1", process_frame_rate: "10" });
          fetchData();
        } else {
          alert(res.message || "Error adding channel");
        }
      });
  };

  const handleDeleteNvr = (id: number) => {
    if (!confirm("Delete this NVR and all its channels?")) return;
    fetch(`/nvrs/delete/${id}/`, { method: 'POST' }).then(() => fetchData());
  };

  const handleDeleteChannel = (id: number) => {
    if (!confirm("Remove this channel?")) return;
    fetch(`/devices/delete/${id}/`, { method: 'POST' }).then(() => fetchData());
  };

  const selectedTemplate = templates.find(t => t.id.toString() === formData.rtsp_template);
  let previewUrl = "Select a template to preview URL";
  if (selectedTemplate) {
    const user = formData.username ? encodeURIComponent(formData.username) : "";
    const pw = formData.password ? encodeURIComponent(formData.password) : "";
    const auth = user && pw ? `${user}:${pw}@` : "";
    const ip = formData.ip_address || "IP_ADDRESS";
    const port = formData.port || "554";
    
    let suffix = selectedTemplate.template_string.replace("{channel}", "1");
    if (!suffix.startsWith('/')) suffix = '/' + suffix;
    
    previewUrl = `rtsp://${auth}${ip}:${port}${suffix}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">NVR / DVR Management</h2>
          <p className="text-sm text-slate-400">Manage NVRs and their associated camera channels</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : "+ Add NVR"}
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6">
          <SectionTitle title="New NVR / DVR" subtitle="Configure network settings and RTSP string format" />
          <form onSubmit={handleAddNvr} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400">Device Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400">IP Address</label>
              <input type="text" name="ip_address" value={formData.ip_address} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Port (Default 554)</label>
              <input type="number" name="port" value={formData.port} onChange={handleChange} className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400">RTSP String Template</label>
              <select name="rtsp_template" value={formData.rtsp_template} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-cyan-400/50 focus:outline-none [&>option]:bg-slate-900">
                <option value="" disabled>Select a template...</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Username (Optional)</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Password (Optional)</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
            </div>
            
            <div className="md:col-span-2 mt-2">
              <label className="text-xs text-slate-400">Live Preview (Channel 1)</label>
              <div className="mt-1 rounded-xl bg-black/40 p-4 border border-cyan-500/20">
                <code className="text-sm text-cyan-300 break-all">{previewUrl}</code>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit">Save NVR</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-6">
        {nvrs.map(nvr => (
          <Card key={nvr.id} className="overflow-hidden">
            <div 
              className="flex cursor-pointer items-center justify-between border-b border-white/5 bg-white/5 p-5 hover:bg-white/10 transition-colors"
              onClick={() => setExpandedNvrId(expandedNvrId === nvr.id ? null : nvr.id)}
            >
              <div>
                <h3 className="text-lg font-semibold text-white">{nvr.name}</h3>
                <p className="text-sm text-slate-400">{nvr.ip_address}:{nvr.port}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone="info">{nvr.channels.length} Channels</Badge>
                <span className="text-2xl text-slate-500">{expandedNvrId === nvr.id ? "−" : "+"}</span>
              </div>
            </div>

            {expandedNvrId === nvr.id && (
              <div className="p-5">
                <div className="mb-6 flex items-center justify-between">
                  <SectionTitle title="Channels" subtitle="Attached camera feeds" />
                  <Button variant="danger" onClick={() => handleDeleteNvr(nvr.id)}>Delete NVR</Button>
                </div>
                
                {nvr.channels.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
                    {nvr.channels.map((c: any) => (
                      <div key={c.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-sm font-medium text-white">{c.name}</span>
                           <Badge tone="success">Active</Badge>
                        </div>
                        <p className="text-xs text-slate-400">Channel: {c.channel}</p>
                        <p className="text-xs text-slate-400">FPS: {c.fps}</p>
                        <div className="mt-3 flex justify-end">
                            <button type="button" onClick={() => handleDeleteChannel(c.id)} className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 transition-all">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 mb-6">No channels added yet.</p>
                )}

                <div className="border-t border-white/10 pt-5">
                  <h4 className="text-sm font-medium text-white mb-3">Add Channel</h4>
                  <form onSubmit={(e) => handleAddChannel(e, nvr.id)} className="flex items-end gap-3 flex-wrap">
                    <div className="w-32">
                      <label className="text-xs text-slate-400">Channel No.</label>
                      <input type="number" name="channel" value={channelForm.channel} onChange={handleChannelChange} required className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 p-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
                    </div>
                    <div className="w-32">
                      <label className="text-xs text-slate-400">Process FPS</label>
                      <input type="number" name="process_frame_rate" value={channelForm.process_frame_rate} onChange={handleChannelChange} required className="mt-1 w-full rounded-lg border border-white/10 bg-black/20 p-2 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
                    </div>
                    <Button type="submit" className="h-[38px]">+</Button>
                  </form>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
