import { useEffect, useState } from "react";
import { Calendar, Clock, X, Check, AlertCircle, CheckCheck } from "lucide-react";
import { bookings } from "../api";
import type { Booking, BookingStatus } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatDate } from "../lib/format";
import { Pagination } from "../components/Pagination";
import { notifyError } from "../api/client";
import { toast } from "sonner";

const statusMap: Record<BookingStatus, { label: string; color: string; Icon: React.ComponentType<{ className?: string }> }> = {
  Confirmed: { label: "Підтверджено", color: "bg-green-50 text-green-600", Icon: Check },
  Pending: { label: "Очікує", color: "bg-amber-50 text-amber-600", Icon: AlertCircle },
  Completed: { label: "Завершено", color: "bg-blue-50 text-blue-600", Icon: CheckCheck },
  Cancelled: { label: "Скасовано", color: "bg-red-50 text-red-500", Icon: X },
};

const tabs = [
  { id: "all", label: "Усі" },
  { id: "active", label: "Активні" },
  { id: "completed", label: "Завершені" },
] as const;

type TabId = typeof tabs[number]["id"];

export function BookingsListPage() {
  const { role } = useAuth();
  const [tab, setTab] = useState<TabId>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [data, setData] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    bookings
      .list({ page, pageSize })
      .then((r) => {
        setData(r.data);
        setTotal(r.total);
      })
      .catch((e) => notifyError(e))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const filtered = data.filter((b) => {
    if (tab === "all") return true;
    if (tab === "active") return b.status === "Pending" || b.status === "Confirmed";
    if (tab === "completed") return b.status === "Completed" || b.status === "Cancelled";
    return true;
  });

  const cancel = async (id: number) => {
    try {
      await bookings.cancel(id);
      toast.success("Бронювання скасовано");
      load();
    } catch (e) {
      notifyError(e);
    }
  };

  const confirm = async (id: number) => {
    try {
      await bookings.confirm(id);
      toast.success("Бронювання підтверджено");
      load();
    } catch (e) {
      notifyError(e);
    }
  };

  const canConfirm = role === "Owner" || role === "Superadmin";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1>{role === "Client" ? "Мої бронювання" : "Бронювання"}</h1>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                tab === t.id ? "bg-teal-600 text-white" : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Завантаження…</p>}

      <div className="space-y-4">
        {filtered.map((b) => {
          const s = statusMap[b.status];
          return (
            <div key={b.bookingId} className="bg-white border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4>{b.studioName}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${s.color}`}>
                    <s.Icon className="w-3 h-3" /> {s.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{b.roomName}</p>
                {role !== "Client" && (
                  <p className="text-xs text-muted-foreground">Клієнт: {b.clientName}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(b.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {b.startTime.slice(0,5)} – {b.endTime.slice(0,5)}</span>
                </div>
                {b.note && <p className="text-xs text-muted-foreground italic">«{b.note}»</p>}
              </div>
              <div className="text-right space-y-2">
                <p className="text-teal-600">{formatCurrency(b.totalPrice)}</p>
                <div className="flex flex-col gap-2 items-end">
                  {canConfirm && b.status === "Pending" && (
                    <button
                      onClick={() => confirm(b.bookingId)}
                      className="px-4 py-1.5 border border-green-200 text-green-600 rounded-lg text-sm hover:bg-green-50 transition-colors"
                    >
                      Підтвердити
                    </button>
                  )}
                  {(b.status === "Pending" || b.status === "Confirmed") && (
                    <button
                      onClick={() => cancel(b.bookingId)}
                      className="px-4 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors"
                    >
                      Скасувати
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Бронювань не знайдено</div>
        )}
      </div>

      <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
    </div>
  );
}
