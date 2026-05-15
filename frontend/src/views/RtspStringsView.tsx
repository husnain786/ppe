import { useEffect, useState } from "react";
import { Button, Card, SectionTitle } from "../components/ui";

export default function RtspStringsView() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", template_string: "" });

  const fetchTemplates = () => {
    fetch('/api/rtsp-templates/')
      .then(res => res.json())
      .then(data => setTemplates(data.templates || []))
      .catch(err => console.error("Error fetching RTSP templates:", err));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    fetch('/rtsp-templates/', {
      method: 'POST',
      body: data,
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        setIsAdding(false);
        setFormData({ name: "", template_string: "" });
        fetchTemplates();
      } else {
        alert("Error adding template");
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    fetch(`/rtsp-templates/delete/${id}/`, { method: 'POST' })
    .then(res => res.json())
    .then(() => fetchTemplates());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">RTSP Strings</h2>
          <p className="text-sm text-slate-400">Manage RTSP URL templates for your NVR/DVR devices</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Cancel" : "+ Add Template"}
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6">
          <SectionTitle title="New RTSP Template" subtitle="Provide the path/query suffix. Use placeholder: {channel}" />
          <form onSubmit={handleAddTemplate} className="mt-4 space-y-4">
            <div>
              <label className="text-xs text-slate-400">Template Name (e.g., Hikvision Default)</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-cyan-400/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Template String</label>
              <textarea name="template_string" value={formData.template_string} onChange={handleChange} required rows={3} placeholder="/cam/realmonitor?channel={channel}&subtype=0" className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white font-mono focus:border-cyan-400/50 focus:outline-none"></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit">Save Template</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.id} className="flex flex-col justify-between p-5">
            <div>
              <h3 className="font-semibold text-white">{t.name}</h3>
              <div className="mt-3 rounded-lg bg-black/30 p-3">
                <code className="text-xs text-cyan-300 break-all">{t.template_string}</code>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="danger" onClick={() => handleDelete(t.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
