import { useEffect, useState } from "react";
import { Badge, Button, Card, SectionTitle } from "../components/ui";

export default function EmployeeView() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    employee_id: "",
    photo: null as File | null
  });

  const fetchEmployees = () => {
    setLoading(true);
    fetch('/api/employees/')
      .then(res => res.json())
      .then(data => {
        setEmployees(data.employees || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching employees:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", employee_id: "", photo: null });
    setEditingEmployee(null);
  };

  const handleEdit = (emp: any) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      employee_id: emp.id,
      photo: null
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    
    fetch(`/employee/delete/${id}/`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken') || ''
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') fetchEmployees();
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('employee_id', formData.employee_id);
    if (formData.photo) data.append('photo', formData.photo);

    const url = editingEmployee ? `/employee/edit/${editingEmployee.db_id}/` : '/register/';
    
    fetch(url, {
      method: 'POST',
      body: data,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken') || ''
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setShowModal(false);
        resetForm();
        fetchEmployees();
      } else {
        alert("Error: " + JSON.stringify(data.errors));
      }
    });
  };

  function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="border-b border-white/10 p-5">
          <SectionTitle 
            title="Employee Directory" 
            subtitle="Manage personnel, access levels, and facial recognition profiles" 
            action={
              <Button onClick={() => { resetForm(); setShowModal(true); }}>+ Create New Employee</Button>
            }
          />
        </div>
        <div className="p-5">
          {loading ? (
            <div className="text-slate-400 text-center py-4">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="text-slate-400 text-center py-4">No employees found.</div>
          ) : (
            <div className="grid gap-3">
              {employees.map((emp) => (
                <div key={emp.db_id} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between transition-all duration-300 hover:bg-black/30 hover:-translate-y-0.5">
                  <div className="flex items-center gap-4">
                    {emp.photo_url ? (
                      <img src={emp.photo_url} alt={emp.name} className="h-12 w-12 rounded-full object-cover border border-cyan-400/20 shadow-lg shadow-cyan-500/10" />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-lg font-bold text-cyan-200">
                        {emp.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white text-lg">{emp.name}</p>
                      <p className="text-sm text-slate-400">{emp.id} · {emp.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Department</p>
                      <p className="text-sm text-white">{emp.department}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Clearance</p>
                      <Badge tone="neutral">{emp.accessLevel}</Badge>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Status</p>
                      <Badge tone={emp.status === "Active" ? "success" : emp.status === "Suspended" ? "danger" : "warning"}>
                        {emp.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => handleEdit(emp)}>Edit</Button>
                      <Button variant="ghost" className="text-rose-400 hover:text-rose-300" onClick={() => handleDelete(emp.db_id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      
      {/* Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-[32px] border border-cyan-400/20 bg-[#0b1120] shadow-2xl overflow-hidden">
            <div className="border-b border-white/10 p-6 bg-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingEmployee ? "Edit Employee" : "Register New Employee"}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-cyan-400/50 focus:outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Employee ID</label>
                <input 
                  type="text" 
                  value={formData.employee_id}
                  onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white focus:border-cyan-400/50 focus:outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Facial Photo</label>
                <input 
                  type="file" 
                  onChange={(e) => setFormData({...formData, photo: e.target.files ? e.target.files[0] : null})}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400/10 file:text-cyan-400 hover:file:bg-cyan-400/20"
                  required={!editingEmployee}
                />
                {editingEmployee && <p className="mt-2 text-[10px] text-slate-500 italic">Leave blank to keep existing photo</p>}
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">{editingEmployee ? "Save Changes" : "Register"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards (Same as before) */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="border-b border-white/10 p-5">
            <SectionTitle title="Quick Actions" subtitle="HR bulk operations" />
          </div>
          <div className="p-5 space-y-3">
            <Button className="w-full justify-start" variant="ghost">Import Employee Roster (CSV)</Button>
            <Button className="w-full justify-start" variant="ghost">Sync with Active Directory</Button>
            <Button className="w-full justify-start" variant="ghost">Bulk Update Access Levels</Button>
          </div>
        </Card>

        <Card>
          <div className="border-b border-white/10 p-5">
            <SectionTitle title="Biometric Sync Status" subtitle="Facial profiles registered across zones" />
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Registered Profiles</span>
                <span className="text-white font-semibold">{employees.length} / 500</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${(employees.length / 500) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Sync Success Rate</span>
                <span className="text-emerald-300 font-semibold">99.8%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-emerald-400" style={{ width: '99.8%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
