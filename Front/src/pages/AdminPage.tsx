import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Building2, BarChart3, Plus, Trash2, Pencil, Award } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useForm } from "react-hook-form";
import { studios, lookups, reports } from "../api";
import type { City, OccupancyReportItem, PagedResult, RevenueReportItem, Studio, StudioCreate, TopRoom } from "../api/types";
import { Pagination } from "../components/Pagination";
import { notifyError } from "../api/client";
import { formatCurrency, monthLabel } from "../lib/format";
import { toast } from "sonner";

type Tab = "studios" | "reports";

export function AdminPage() {
  const [tab, setTab] = useState<Tab>("studios");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1>Адмін-панель</h1>
        <p className="text-sm text-muted-foreground mt-1">Керування студіями, кімнатами та звіти</p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
        <TabBtn active={tab === "studios"} onClick={() => setTab("studios")} icon={<Building2 className="w-4 h-4" />}>Студії</TabBtn>
        <TabBtn active={tab === "reports"} onClick={() => setTab("reports")} icon={<BarChart3 className="w-4 h-4" />}>Звіти</TabBtn>
      </div>

      {tab === "studios" && <StudiosAdmin />}
      {tab === "reports" && <ReportsTab />}
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${active ? "bg-white shadow-sm text-teal-700" : "text-muted-foreground hover:text-foreground"}`}
    >
      {icon} {children}
    </button>
  );
}

function StudiosAdmin() {
  const [data, setData] = useState<PagedResult<Studio> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Studio | null>(null);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => { lookups.cities().then(setCities).catch(notifyError); }, []);

  useEffect(() => {
    setLoading(true);
    studios.list({ page, pageSize: 10 })
      .then(setData)
      .catch(notifyError)
      .finally(() => setLoading(false));
  }, [page, trigger]);

  const remove = async (id: number) => {
    if (!confirm("Видалити студію?")) return;
    try {
      await studios.remove(id);
      toast.success("Студію видалено");
      setTrigger((n) => n + 1);
    } catch (e) { notifyError(e); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Студії</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
          <Plus className="w-4 h-4" /> Додати студію
        </button>
      </div>

      {loading && <div className="text-center py-12 text-muted-foreground">Завантаження…</div>}

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3">Назва</th>
              <th className="px-4 py-3">Місто</th>
              <th className="px-4 py-3">Адреса</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3 text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((s) => (
              <tr key={s.studioId} className="border-t border-border hover:bg-gray-50">
                <td className="px-4 py-3 font-medium"><Link to={`/studios/${s.studioId}`} className="no-underline text-teal-700">{s.name}</Link></td>
                <td className="px-4 py-3">{s.cityName}</td>
                <td className="px-4 py-3">{s.address}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${s.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {s.isActive ? "Активна" : "Не активна"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  <button onClick={() => { setEditing(s); setShowForm(true); }} className="inline-flex items-center gap-1 px-2 py-1 border border-border rounded text-xs hover:bg-accent">
                    <Pencil className="w-3 h-3" /> Редагувати
                  </button>
                  <button onClick={() => remove(s.studioId)} className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs hover:bg-rose-100 border border-rose-200">
                    <Trash2 className="w-3 h-3" /> Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onChange={setPage} />}

      {showForm && (
        <StudioForm
          studio={editing}
          cities={cities}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); setTrigger((n) => n + 1); }}
        />
      )}
    </div>
  );
}

function StudioForm({ studio, cities, onClose, onSaved }: { studio: Studio | null; cities: City[]; onClose: () => void; onSaved: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<StudioCreate & { isActive?: boolean }>({
    defaultValues: studio
      ? { name: studio.name, cityId: cities.find((c) => c.name === studio.cityName)?.cityId ?? 0, address: studio.address, description: studio.description || "", photoUrl: studio.photoUrl || "", isActive: studio.isActive }
      : { name: "", cityId: cities[0]?.cityId ?? 0, address: "", description: "", photoUrl: "", isActive: true },
  });
  const [pending, setPending] = useState(false);

  const submit = async (data: StudioCreate & { isActive?: boolean }) => {
    setPending(true);
    try {
      const payload = { ...data, cityId: Number(data.cityId) };
      if (studio) {
        await studios.update(studio.studioId, { ...payload, isActive: !!data.isActive });
        toast.success("Студію оновлено");
      } else {
        await studios.create(payload);
        toast.success("Студію створено");
      }
      onSaved();
    } catch (e) { notifyError(e); }
    finally { setPending(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit(submit)} className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
        <h2>{studio ? "Редагувати студію" : "Нова студія"}</h2>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Назва</label>
          <input {...register("name", { required: "Обов'язкове" })} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
          {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Місто</label>
          <select {...register("cityId", { required: true, valueAsNumber: true })} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm">
            {cities.map((c) => <option key={c.cityId} value={c.cityId}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Адреса</label>
          <input {...register("address", { required: "Обов'язкове" })} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Опис</label>
          <textarea {...register("description")} rows={3} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
        </div>
        {studio && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} className="accent-teal-600" /> Активна
          </label>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-border rounded-lg text-sm">Скасувати</button>
          <button type="submit" disabled={pending} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
            {pending ? "Збереження…" : "Зберегти"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ReportsTab() {
  const [occ, setOcc] = useState<OccupancyReportItem[]>([]);
  const [rev, setRev] = useState<RevenueReportItem[]>([]);
  const [top, setTop] = useState<TopRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([reports.occupancy(), reports.revenue(), reports.topRooms()])
      .then(([o, r, t]) => { setOcc(o); setRev(r); setTop(t); })
      .catch(notifyError)
      .finally(() => setLoading(false));
  }, []);

  // aggregate per month across studios
  const occByMonth = aggregate(occ, (i) => `${i.year}-${String(i.month).padStart(2, "0")}`, (i) => Number(i.occupiedHours));
  const revByMonth = aggregate(rev, (i) => `${i.year}-${String(i.month).padStart(2, "0")}`, (i) => Number(i.revenue));

  if (loading) return <div className="text-center py-12 text-muted-foreground">Завантаження звітів…</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="mb-3">Зайнятість (годин на місяць)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={occByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Годин" stroke="#0d9488" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="mb-3">Дохід за останні 7 місяців</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="value" name="Дохід" fill="#0d9488" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-amber-600" />
          <h3>Топ кімнат</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-left">
            <tr>
              <th className="py-2">Студія</th>
              <th className="py-2">Кімната</th>
              <th className="py-2">Бронювань</th>
              <th className="py-2">Дохід</th>
            </tr>
          </thead>
          <tbody>
            {top.map((r) => (
              <tr key={r.roomId} className="border-t border-border">
                <td className="py-2">{r.studioName}</td>
                <td className="py-2">{r.roomName}</td>
                <td className="py-2">{r.totalBookings}</td>
                <td className="py-2 text-teal-700">{formatCurrency(Number(r.totalRevenue))}</td>
              </tr>
            ))}
            {top.length === 0 && (
              <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Немає даних</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function aggregate<T>(items: T[], key: (i: T) => string, value: (i: T) => number) {
  const map = new Map<string, number>();
  for (const i of items) {
    const k = key(i);
    map.set(k, (map.get(k) ?? 0) + value(i));
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => {
      const [y, m] = k.split("-").map(Number);
      return { label: monthLabel(y, m), value: v };
    });
}
