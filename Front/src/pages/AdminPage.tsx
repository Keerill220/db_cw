import { useEffect, useMemo, useState } from "react";
import { Building2, DoorOpen, Wrench, BarChart3, Plus, Edit3, Trash2, Users, X } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { studios as studiosApi, rooms as roomsApi, equipment as equipmentApi, lookups, reports } from "../api";
import type { Studio, StudioDetail, RoomSummary, Equipment, City, EquipmentType, OccupancyReportItem, RevenueReportItem, TopRoom } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, monthLabel } from "../lib/format";
import { notifyError } from "../api/client";
import { toast } from "sonner";

const tabs = [
  { id: "studios", label: "Студії", icon: Building2 },
  { id: "rooms", label: "Кімнати", icon: DoorOpen },
  { id: "equipment", label: "Обладнання", icon: Wrench },
  { id: "stats", label: "Статистика", icon: BarChart3 },
] as const;

type TabId = typeof tabs[number]["id"];

export function AdminPage() {
  const { role } = useAuth();
  const [tab, setTab] = useState<TabId>("studios");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1>Адмін-панель</h1>
          <p className="text-sm text-muted-foreground">Управління студіями та бронюваннями</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" /> {role === "Superadmin" ? "Суперадмін" : "Власник"}
        </div>
      </div>

      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              tab === t.id ? "bg-teal-600 text-white" : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "studios" && <StudiosTab />}
      {tab === "rooms" && <RoomsTab />}
      {tab === "equipment" && <EquipmentTab />}
      {tab === "stats" && <StatsTab />}
    </div>
  );
}

/* --------------------------------- Studios -------------------------------- */

function StudiosTab() {
  const [items, setItems] = useState<Studio[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [editing, setEditing] = useState<Studio | null>(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    studiosApi.list({ page: 1, pageSize: 100 }).then((r) => setItems(r.data)).catch(notifyError);
  };

  useEffect(() => {
    load();
    lookups.cities().then(setCities).catch(() => {});
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Видалити студію?")) return;
    try {
      await studiosApi.remove(id);
      toast.success("Студію видалено");
      load();
    } catch (e) {
      notifyError(e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Студії</h2>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" /> Додати студію
        </button>
      </div>
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Назва</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Місто</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Адреса</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Статус</th>
              <th className="text-right px-4 py-3 text-sm text-muted-foreground">Дії</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.studioId} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm">{s.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{s.cityName}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{s.address}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${s.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}`}>
                    {s.isActive ? "Активна" : "Неактивна"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(s)} className="p-1.5 text-muted-foreground hover:text-teal-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(s.studioId)} className="p-1.5 text-muted-foreground hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Студій немає</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <StudioModal
          cities={cities}
          studio={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function StudioModal({ studio, cities, onClose, onSaved }: { studio: Studio | null; cities: City[]; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(studio?.name ?? "");
  const [cityId, setCityId] = useState<number>(cities.find((c) => c.name === studio?.cityName)?.cityId ?? cities[0]?.cityId ?? 0);
  const [address, setAddress] = useState(studio?.address ?? "");
  const [description, setDescription] = useState(studio?.description ?? "");
  const [photoUrl, setPhotoUrl] = useState(studio?.photoUrl ?? "");
  const [isActive, setIsActive] = useState(studio?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (studio) {
        await studiosApi.update(studio.studioId, { name, cityId, address, description: description || null, photoUrl: photoUrl || null, isActive });
        toast.success("Студію оновлено");
      } else {
        await studiosApi.create({ name, cityId, address, description: description || null, photoUrl: photoUrl || null });
        toast.success("Студію створено");
      }
      onSaved();
    } catch (e) {
      notifyError(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={studio ? "Редагувати студію" : "Нова студія"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Назва"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
        <Field label="Місто">
          <select value={cityId} onChange={(e) => setCityId(Number(e.target.value))} className={inputCls}>
            {cities.map((c) => <option key={c.cityId} value={c.cityId}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Адреса"><input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} /></Field>
        <Field label="Опис"><textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputCls} h-20`} /></Field>
        <Field label="Фото URL"><input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className={inputCls} /></Field>
        {studio && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-teal-600" />
            Активна
          </label>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
            {saving ? "Збереження…" : "Зберегти"}
          </button>
          <button onClick={onClose} className="px-6 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50">Скасувати</button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------------------------- Rooms --------------------------------- */

function RoomsTab() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [studioId, setStudioId] = useState<number | null>(null);
  const [detail, setDetail] = useState<StudioDetail | null>(null);
  const [editing, setEditing] = useState<RoomSummary | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    studiosApi.list({ page: 1, pageSize: 100 }).then((r) => {
      setStudios(r.data);
      if (r.data[0]) setStudioId(r.data[0].studioId);
    }).catch(notifyError);
  }, []);

  const loadDetail = () => {
    if (!studioId) return;
    studiosApi.get(studioId).then(setDetail).catch(notifyError);
  };

  useEffect(loadDetail, [studioId]);

  const remove = async (id: number) => {
    if (!confirm("Видалити кімнату?")) return;
    try { await roomsApi.remove(id); toast.success("Видалено"); loadDetail(); } catch (e) { notifyError(e); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2>Кімнати</h2>
        <div className="flex items-center gap-3">
          <select
            value={studioId ?? ""}
            onChange={(e) => setStudioId(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-border rounded-lg text-sm"
          >
            {studios.map((s) => <option key={s.studioId} value={s.studioId}>{s.name}</option>)}
          </select>
          <button
            onClick={() => setCreating(true)}
            disabled={!studioId}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-teal-700 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Додати кімнату
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Назва</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Площа</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Ціна</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Статус</th>
              <th className="text-right px-4 py-3 text-sm text-muted-foreground">Дії</th>
            </tr>
          </thead>
          <tbody>
            {detail?.rooms.map((r) => (
              <tr key={r.roomId} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm">{r.name}</td>
                <td className="px-4 py-3 text-sm">{r.areaSqm} м²</td>
                <td className="px-4 py-3 text-sm text-teal-600">{formatCurrency(r.pricePerHour)}/год</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${r.isAvailable ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                    {r.isAvailable ? "Доступна" : "Тимчасово недоступна"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(r)} className="p-1.5 text-muted-foreground hover:text-teal-600"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => remove(r.roomId)} className="p-1.5 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!detail || detail.rooms.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Кімнат немає</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && studioId && (
        <RoomModal
          room={editing}
          studioId={studioId}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); loadDetail(); }}
        />
      )}
    </div>
  );
}

function RoomModal({ room, studioId, onClose, onSaved }: { room: RoomSummary | null; studioId: number; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(room?.name ?? "");
  const [area, setArea] = useState<number>(room?.areaSqm ?? 20);
  const [price, setPrice] = useState<number>(room?.pricePerHour ?? 200);
  const [photoUrl, setPhotoUrl] = useState(room?.photoUrl ?? "");
  const [isAvailable, setIsAvailable] = useState(room?.isAvailable ?? true);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (room) {
        await roomsApi.update(room.roomId, { name, areaSqm: area, pricePerHour: price, isAvailable, photoUrl: photoUrl || null });
        toast.success("Кімнату оновлено");
      } else {
        await roomsApi.create({ studioId, name, areaSqm: area, pricePerHour: price, photoUrl: photoUrl || null });
        toast.success("Кімнату створено");
      }
      onSaved();
    } catch (e) { notifyError(e); } finally { setSaving(false); }
  };

  return (
    <Modal title={room ? "Редагувати кімнату" : "Нова кімната"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Назва"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Площа (м²)"><input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className={inputCls} /></Field>
          <Field label="Ціна за год"><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={inputCls} /></Field>
        </div>
        <Field label="Фото URL"><input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className={inputCls} /></Field>
        {room && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="accent-teal-600" />
            Доступна
          </label>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
            {saving ? "Збереження…" : "Зберегти"}
          </button>
          <button onClick={onClose} className="px-6 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50">Скасувати</button>
        </div>
      </div>
    </Modal>
  );
}

/* -------------------------------- Equipment ------------------------------- */

function EquipmentTab() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [studioId, setStudioId] = useState<number | null>(null);
  const [detail, setDetail] = useState<StudioDetail | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [types, setTypes] = useState<EquipmentType[]>([]);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    studiosApi.list({ page: 1, pageSize: 100 }).then((r) => {
      setStudios(r.data);
      if (r.data[0]) setStudioId(r.data[0].studioId);
    });
    lookups.equipmentTypes().then(setTypes);
  }, []);

  useEffect(() => {
    if (!studioId) return;
    studiosApi.get(studioId).then((s) => {
      setDetail(s);
      if (s.rooms[0]) setRoomId(s.rooms[0].roomId);
    });
  }, [studioId]);

  const loadEq = () => {
    if (!roomId) { setEquipments([]); return; }
    roomsApi.get(roomId).then((rd) => {
      // RoomDetail.equipments is summary only — need full Equipment objects.
      // We'll fetch each via equipmentApi.get to retain edit capability.
      Promise.all(rd.equipments.map((e) => equipmentApi.get(e.equipmentId)))
        .then(setEquipments)
        .catch(() => setEquipments([]));
    });
  };

  useEffect(loadEq, [roomId]);

  const remove = async (id: number) => {
    if (!confirm("Видалити обладнання?")) return;
    try { await equipmentApi.remove(id); toast.success("Видалено"); loadEq(); } catch (e) { notifyError(e); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2>Обладнання</h2>
        <div className="flex items-center gap-3">
          <select value={studioId ?? ""} onChange={(e) => setStudioId(Number(e.target.value))} className="px-3 py-2 bg-white border border-border rounded-lg text-sm">
            {studios.map((s) => <option key={s.studioId} value={s.studioId}>{s.name}</option>)}
          </select>
          <select value={roomId ?? ""} onChange={(e) => setRoomId(Number(e.target.value))} className="px-3 py-2 bg-white border border-border rounded-lg text-sm">
            {detail?.rooms.map((r) => <option key={r.roomId} value={r.roomId}>{r.name}</option>)}
          </select>
          <button onClick={() => setCreating(true)} disabled={!roomId} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-teal-700 disabled:opacity-50">
            <Plus className="w-4 h-4" /> Додати
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Назва</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Тип</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Стан</th>
              <th className="text-left px-4 py-3 text-sm text-muted-foreground">Ціна</th>
              <th className="text-right px-4 py-3 text-sm text-muted-foreground">Дії</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((e) => (
              <tr key={e.equipmentId} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm">{e.name}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full text-xs">{e.typeName}</span></td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{e.condition ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-teal-600">{formatCurrency(e.pricePerHour)}/год</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setEditing(e)} className="p-1.5 text-muted-foreground hover:text-teal-600"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => remove(e.equipmentId)} className="p-1.5 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {equipments.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">Обладнання немає</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && roomId && (
        <EquipmentModal
          equipment={editing}
          roomId={roomId}
          types={types}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); loadEq(); }}
        />
      )}
    </div>
  );
}

function EquipmentModal({ equipment, roomId, types, onClose, onSaved }: { equipment: Equipment | null; roomId: number; types: EquipmentType[]; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(equipment?.name ?? "");
  const [typeId, setTypeId] = useState<number>(equipment?.typeId ?? types[0]?.typeId ?? 0);
  const [condition, setCondition] = useState(equipment?.condition ?? "");
  const [price, setPrice] = useState<number>(equipment?.pricePerHour ?? 0);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      if (equipment) {
        await equipmentApi.update(equipment.equipmentId, { typeId, name, condition: condition || null, pricePerHour: price });
        toast.success("Оновлено");
      } else {
        await equipmentApi.create({ roomId, typeId, name, condition: condition || null, pricePerHour: price });
        toast.success("Створено");
      }
      onSaved();
    } catch (e) { notifyError(e); } finally { setSaving(false); }
  };

  return (
    <Modal title={equipment ? "Редагувати обладнання" : "Нове обладнання"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Назва"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
        <Field label="Тип">
          <select value={typeId} onChange={(e) => setTypeId(Number(e.target.value))} className={inputCls}>
            {types.map((t) => <option key={t.typeId} value={t.typeId}>{t.name}</option>)}
          </select>
        </Field>
        <Field label="Стан"><input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Відмінний / Добрий…" className={inputCls} /></Field>
        <Field label="Ціна за год"><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className={inputCls} /></Field>
        <div className="flex gap-3 pt-2">
          <button onClick={save} disabled={saving} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
            {saving ? "Збереження…" : "Зберегти"}
          </button>
          <button onClick={onClose} className="px-6 py-2.5 border border-border rounded-lg text-sm hover:bg-gray-50">Скасувати</button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------------------------- Stats --------------------------------- */

function StatsTab() {
  const [occ, setOcc] = useState<OccupancyReportItem[]>([]);
  const [rev, setRev] = useState<RevenueReportItem[]>([]);
  const [top, setTop] = useState<TopRoom[]>([]);

  useEffect(() => {
    reports.occupancy().then(setOcc).catch(() => {});
    reports.revenue().then(setRev).catch(() => {});
    reports.topRooms().then(setTop).catch(() => {});
  }, []);

  const totalBookings = useMemo(() => occ.reduce((s, x) => s + x.totalBookings, 0), [occ]);
  const totalHours = useMemo(() => occ.reduce((s, x) => s + x.occupiedHours, 0), [occ]);
  const totalRevenue = useMemo(() => rev.reduce((s, x) => s + x.revenue, 0), [rev]);

  // Aggregate by month for charts
  const occByMonth = useMemo(() => {
    const m = new Map<string, { label: string; bookings: number; hours: number }>();
    for (const x of occ) {
      const k = `${x.year}-${x.month}`;
      const cur = m.get(k) ?? { label: monthLabel(x.year, x.month), bookings: 0, hours: 0 };
      cur.bookings += x.totalBookings;
      cur.hours += x.occupiedHours;
      m.set(k, cur);
    }
    return Array.from(m.values());
  }, [occ]);

  const revByMonth = useMemo(() => {
    const m = new Map<string, { label: string; revenue: number }>();
    for (const x of rev) {
      const k = `${x.year}-${x.month}`;
      const cur = m.get(k) ?? { label: monthLabel(x.year, x.month), revenue: 0 };
      cur.revenue += x.revenue;
      m.set(k, cur);
    }
    return Array.from(m.values());
  }, [rev]);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Всього бронювань", value: totalBookings.toString() },
          { label: "Годин заброньовано", value: totalHours.toString() },
          { label: "Дохід", value: formatCurrency(totalRevenue) },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border rounded-2xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl text-teal-600">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 mb-4">
        <h3 className="mb-4">Завантаженість по місяцях</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="hours" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 mb-4">
        <h3 className="mb-4">Дохід по місяцях</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} dot={{ fill: "#0d9488" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6">
        <h3 className="mb-4">Топ кімнат</h3>
        <div className="space-y-4">
          {top.slice(0, 5).map((r) => {
            const max = top[0]?.totalBookings || 1;
            const percent = Math.round((r.totalBookings / max) * 100);
            return (
              <div key={r.roomId}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{r.roomName} <span className="text-muted-foreground text-xs">({r.studioName})</span></span>
                  <span className="text-teal-600">{r.totalBookings} бронь</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
          {top.length === 0 && <p className="text-sm text-muted-foreground">Немає даних</p>}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Helpers -------------------------------- */

const inputCls = "w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3>{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
