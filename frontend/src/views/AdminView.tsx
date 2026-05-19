import { useEffect, useState } from "react";
import { Badge, Button, Card, MetricCard, SectionTitle, Switch } from "../components/ui";

export default function AdminView({ params, toggleParam, setAllCore, setAllAddon, setAll }: any) {
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("18:00");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings/')
      .then(res => res.json())
      .then(data => {
        setOpenTime(data.office_open_time);
        setCloseTime(data.office_close_time);
      })
      .catch(err => console.error("Error fetching settings:", err));
  }, []);

  const saveSettings = () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append('office_open_time', openTime);
    formData.append('office_close_time', closeTime);

    fetch('/api/settings/', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': (document.cookie.match(/csrftoken=([^;]+)/) || [])[1] || ''
      },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        alert("Settings updated successfully!");
      }
    })
    .catch(err => console.error("Error saving settings:", err))
    .finally(() => setIsSaving(false));
  };

  const enabledCount = params.filter((p: any) => p.enabled).length;
  const coreCount = params.filter((p: any) => p.tier === "Core" && p.enabled).length;
  const addonCount = params.filter((p: any) => p.tier === "Addon" && p.enabled).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Enabled Parameters" value={`${enabledCount}/30`} hint="Per-camera configurable" accent="✓" />
        <MetricCard label="Core Tier Active" value={`${coreCount}/10`} hint="Gold tier" accent="★" />
        <MetricCard label="Add-on Active" value={`${addonCount}/20`} hint="Premium phase 2" accent="◇" />
        <MetricCard label="Notification Mode" value="Auto" hint="WhatsApp / Email / Clip" accent="↯" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="border-b border-white/10 p-5">
            <SectionTitle
              title="AI Parameter Library"
              subtitle="Enable or disable each detection rule from the admin dashboard"
              action={
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={setAll}>All On/Off</Button>
                  <Button variant="ghost" onClick={setAllCore}>Core On</Button>
                  <Button variant="ghost" onClick={setAllAddon}>Add-ons Off</Button>
                </div>
              }
            />
          </div>

          <div className="p-5 space-y-6">
            <div className="rounded-[24px] border border-emerald-400/15 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              Based on your parameter sheet, all 30 alerts can be configured per camera. Tier 1 contains the non-negotiable core rules, while Tier 2 is ideal for premium add-ons and phase-2 rollouts.
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Tier 1 — Core Parameters</p>
                  <p className="text-xs text-slate-500">High ROI, recommended for every deployment</p>
                </div>
                <Badge tone="success">Always visible</Badge>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {params.filter((p: any) => p.tier === "Core").map((p: any) => (
                  <div key={p.id} className="rounded-3xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:bg-black/30">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{p.category}</p>
                      </div>
                      <Badge tone="success">Core</Badge>
                    </div>
                    <div className="mt-4">
                      <Switch checked={p.enabled} onChange={() => toggleParam(p.id)} label={p.enabled ? "Enabled" : "Disabled"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Tier 2 — Add-on Parameters</p>
                  <p className="text-xs text-slate-500">Premium / phase-2 advanced rules</p>
                </div>
                <Badge tone="warning">Optional</Badge>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {params.filter((p: any) => p.tier === "Addon").map((p: any) => (
                  <div key={p.id} className="rounded-3xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:bg-black/30">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{p.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{p.category}</p>
                      </div>
                      <Badge tone={p.enabled ? "success" : "neutral"}>{p.enabled ? "On" : "Off"}</Badge>
                    </div>
                    <div className="mt-4">
                      <Switch checked={p.enabled} onChange={() => toggleParam(p.id)} label={p.enabled ? "Enabled" : "Disabled"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="border-b border-white/10 p-5">
              <SectionTitle title="Office Hours" subtitle="Set your operational schedule" />
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Office Open Time</label>
                <input 
                  type="time" 
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Office Close Time</label>
                <input 
                  type="time" 
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-3 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                />
              </div>
              <Button className="w-full mt-2" onClick={saveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Update Office Hours"}
              </Button>
            </div>
          </Card>

          <Card>
            <div className="border-b border-white/10 p-5">
              <SectionTitle title="Admin Controls" subtitle="Bulk actions and deployment presets" />
            </div>
            <div className="space-y-3 p-5">
              <Button className="w-full justify-start" onClick={setAllCore}>Enable All Core Rules</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={setAllAddon}>Disable All Add-ons</Button>
              <Button variant="ghost" className="w-full justify-start" onClick={setAll}>Toggle All Parameters</Button>
              <Button variant="ghost" className="w-full justify-start">Apply Safety Preset</Button>
              <Button variant="ghost" className="w-full justify-start">Apply Security Preset</Button>
              <Button variant="ghost" className="w-full justify-start">Apply Productivity Preset</Button>
            </div>
          </Card>

          <Card>
            <div className="border-b border-white/10 p-5">
              <SectionTitle title="Delivery Notes" subtitle="What each trigger generates" />
            </div>
            <div className="space-y-3 p-5 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">Alert log entry</div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">Annotated screenshot</div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">60-second video clip</div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">WhatsApp / Email notification</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
