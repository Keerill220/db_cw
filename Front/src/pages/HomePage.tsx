import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Music, Search, Calendar, TrendingUp, Building2, ArrowRight } from "lucide-react";
import { studios, bookings } from "../api";
import type { Booking, Studio } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, formatDate, statusColor, statusLabel } from "../lib/format";

export function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [featured, setFeatured] = useState<Studio[]>([]);
  const [studiosTotal, setStudiosTotal] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [bookingsTotal, setBookingsTotal] = useState(0);

  useEffect(() => {
    studios.list({ page: 1, pageSize: 6 })
      .then((r) => { setFeatured(r.data); setStudiosTotal(r.total); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    bookings.list({ page: 1, pageSize: 5 })
      .then((r) => { setRecentBookings(r.data); setBookingsTotal(r.total); })
      .catch(() => {});
  }, [isAuthenticated]);

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-teal-100 items-center justify-center mb-5">
            <Music className="w-7 h-7 text-teal-600" />
          </div>
          <h1 className="text-3xl md:text-5xl mb-4">Знайдіть свою ідеальну студію</h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            SoundSpace — платформа для пошуку та бронювання музичних студій і репетиційних баз. Зручні фільтри, прозорі ціни, моментальне бронювання.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/studios" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl no-underline hover:bg-teal-700">
              <Search className="w-4 h-4" /> Дивитися студії
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-xl no-underline">
                Створити акаунт
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard icon={<Building2 className="w-5 h-5" />} label="Студій у системі" value={studiosTotal.toString()} to="/studios" tone="teal" />
          {isAuthenticated && (
            <KpiCard icon={<Calendar className="w-5 h-5" />} label={user?.role === "Client" ? "Моїх бронювань" : "Бронювань у студіях"} value={bookingsTotal.toString()} to="/bookings" tone="amber" />
          )}
          {(user?.role === "Owner" || user?.role === "Superadmin") && (
            <KpiCard icon={<TrendingUp className="w-5 h-5" />} label="Звіти та аналітика" value="Перейти" to="/admin" tone="emerald" />
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2>Обрані студії</h2>
          <Link to="/studios" className="text-sm text-teal-600 inline-flex items-center gap-1 no-underline">Усі <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((s) => (
            <Link key={s.studioId} to={`/studios/${s.studioId}`} className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-shadow no-underline text-foreground">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="mb-1">{s.name}</h3>
              <p className="text-sm text-muted-foreground">{s.cityName} · {s.address}</p>
            </Link>
          ))}
        </div>
      </section>

      {isAuthenticated && recentBookings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-4">
            <h2>Останні бронювання</h2>
            <Link to="/bookings" className="text-sm text-teal-600 inline-flex items-center gap-1 no-underline">Усі <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-muted-foreground text-left">
                <tr>
                  <th className="px-4 py-3">Студія / Кімната</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Сума</th>
                  <th className="px-4 py-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.bookingId} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="font-medium">{b.studioName}</div>
                      <div className="text-xs text-muted-foreground">{b.roomName}</div>
                    </td>
                    <td className="px-4 py-3">{formatDate(b.date)}</td>
                    <td className="px-4 py-3 text-teal-700">{formatCurrency(Number(b.totalPrice))}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded ${statusColor[b.status]}`}>{statusLabel[b.status]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function KpiCard({ icon, label, value, to, tone }: { icon: React.ReactNode; label: string; value: string; to: string; tone: "teal" | "amber" | "emerald" }) {
  const toneCls = {
    teal: "bg-teal-100 text-teal-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  }[tone];
  return (
    <Link to={to} className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-shadow no-underline text-foreground">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${toneCls}`}>{icon}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-medium mt-1">{value}</div>
    </Link>
  );
}
