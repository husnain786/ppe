import { useEffect, useState } from "react";
import { Badge, Card, SectionTitle } from "../components/ui";

interface AttendanceRecord {
  employee_name: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
}

export default function AttendanceView() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttendance = () => {
    fetch('/api/attendance/')
      .then(res => res.json())
      .then(data => {
        setRecords(data.attendance || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching attendance:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Attendance Logs</h2>
          <p className="mt-1 text-sm text-slate-400">Automated check-in/out records via Face ID</p>
        </div>
        <Badge tone="success">LIVE UPDATE</Badge>
      </div>

      <Card className="overflow-hidden border-white/5 bg-black/20">
        <div className="border-b border-white/10 p-5 bg-white/5">
          <SectionTitle title="Daily Attendance" subtitle="First scan is Check-in, last scan is Check-out" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Employee</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Check-In</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Check-Out</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                       <div className="h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                       <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No attendance records found for today.
                  </td>
                </tr>
              ) : (
                records.map((r, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold">
                          {r.employee_name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{r.employee_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-400">#{r.employee_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{r.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                         <span className="text-sm font-medium text-emerald-400">{r.check_in || '--:--:--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <span className={r.check_out ? "h-1.5 w-1.5 rounded-full bg-amber-500" : "h-1.5 w-1.5 rounded-full bg-slate-700"}></span>
                         <span className={r.check_out ? "text-sm font-medium text-amber-400" : "text-sm font-medium text-slate-600"}>{r.check_out || '--:--:--'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {r.status === "On Time" || r.status === "Completed" ? (
                        <Badge tone="success">{r.status}</Badge>
                      ) : r.status.includes("Late") || r.status.includes("Early") ? (
                        <Badge tone="warning">{r.status}</Badge>
                      ) : (
                        <Badge>{r.status}</Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
