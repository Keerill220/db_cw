import { useEffect, useState } from "react";
import { Calendar, X, Check } from "lucide-react";
import { bookings } from "../api";
import type { Booking, BookingStatus, PagedResult } from "../api/types";
import { Pagination } from "../components/Pagination";
import { notifyError } from "../api/client";
import { formatCurrency, formatDate, formatTime, statusColor, statusLabel } from "../lib/format";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function BookingsListPage() {
  const { user } = useAuth();
  const isClient = user?.role === "Client";
  const isAdmin = user?.role === "Owner" || user?.role === "Superadmin";

  const [data, setData] = useState<PagedResult<Booking> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    setLoading(true);
    bookings
      .list({
        page,
        pageSize: 10,
        from: from || undefined,
        to: to || undefined,
        status: status || undefined,
      })
      .then(setData)
      .catch(notifyError)
      .finally(() => setLoading(false));
  }, [page, trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = () => { setPage(1); setTrigger((n) => n + 1); };
  const reset = () => { setFrom(""); setTo(""); setStatus(""); setPage(1); setTrigger((n) => n + 1); };

  const cancel = async (id: number) => {
    try {
      await bookings.cancel(id);
      toast.success("Бронювання скасовано");
      setTrigger((n) => n + 1);
    } catch (e) { notifyError(e); }
  };

  const confirm = async (id: number) => {
    try {
      await bookings.confirm(id);
      toast.success("Бронювання підтверджено");
      setTrigger((n) => n + 1);
    } catch (e) { notifyError(e); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1>{isClient ? "Мої бронювання" : "Усі бронювання"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isClient ? "Перегляд та керування вашими бронюваннями" : "Бронювання у ваших студіях"}
        </p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">З</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">До</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Статус</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus | "")} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm">
            <option value="">Усі</option>
            <option value="Pending">Очікує</option>
            <option value="Confirmed">Підтверджено</option>
            <option value="Cancelled">Скасовано</option>
            <option value="Completed">Завершено</option>
          </select>
        </div>
        <div className="md:col-span-2 flex items-end gap-2">
          <button onClick={apply} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">Застосувати</button>
          <button onClick={reset} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent">Скинути</button>
        </div>
      </div>

      {loading && <div className="text-center py-12 text-muted-foreground">Завантаження…</div>}
      {!loading && data && data.data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">Бронювань не знайдено</div>
      )}

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3">Студія / Кімната</th>
              {!isClient && <th className="px-4 py-3">Клієнт</th>}
              <th className="px-4 py-3">Дата</th>
              <th className="px-4 py-3">Час</th>
              <th className="px-4 py-3">Сума</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3 text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((b) => (
              <tr key={b.bookingId} className="border-t border-border hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{b.studioName}</div>
                  <div className="text-xs text-muted-foreground">{b.roomName}</div>
                </td>
                {!isClient && <td className="px-4 py-3">{b.clientName}</td>}
                <td className="px-4 py-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  {formatDate(b.date)}
                </td>
                <td className="px-4 py-3">{formatTime(b.startTime)}–{formatTime(b.endTime)}</td>
                <td className="px-4 py-3 text-teal-700">{formatCurrency(Number(b.totalPrice))}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${statusColor[b.status]}`}>{statusLabel[b.status]}</span>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  {isAdmin && b.status === "Pending" && (
                    <button onClick={() => confirm(b.bookingId)} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700">
                      <Check className="w-3 h-3" /> Підтвердити
                    </button>
                  )}
                  {(b.status === "Pending" || b.status === "Confirmed") && (
                    <button onClick={() => cancel(b.bookingId)} className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs hover:bg-rose-100 border border-rose-200">
                      <X className="w-3 h-3" /> Скасувати
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onChange={setPage} />}
    </div>
  );
}
