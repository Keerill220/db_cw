import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Building2, MapPin, ArrowLeft, Calendar, Users } from "lucide-react";
import { studios } from "../api";
import type { StudioDetail } from "../api/types";
import { notifyError } from "../api/client";
import { formatCurrency } from "../lib/format";
import { useAuth } from "../context/AuthContext";

export function StudioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [studio, setStudio] = useState<StudioDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    studios.get(Number(id))
      .then(setStudio)
      .catch(notifyError)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = (roomId: number) => {
    if (!user) {
      navigate("/login", { state: { from: `/booking?roomId=${roomId}` } });
      return;
    }
    if (user.role !== "Client") {
      // owners/admins can browse but cannot book
      return;
    }
    navigate(`/booking?roomId=${roomId}`);
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground">Завантаження…</div>;
  if (!studio) return <div className="text-center py-20 text-muted-foreground">Студію не знайдено</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/studios" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 no-underline">
        <ArrowLeft className="w-4 h-4" /> До списку
      </Link>

      <div className="bg-white border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center shrink-0">
            <Building2 className="w-7 h-7 text-teal-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1>{studio.name}</h1>
              {!studio.isActive && <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700">Не активна</span>}
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {studio.cityName}, {studio.country} · {studio.address}
            </p>
            {studio.description && <p className="text-sm mt-3">{studio.description}</p>}
          </div>
        </div>
      </div>

      <h2 className="mb-3">Кімнати ({studio.rooms.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studio.rooms.map((r) => (
          <div key={r.roomId} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3>{r.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${r.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {r.isAvailable ? "Доступна" : "Недоступна"}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {Number(r.areaSqm).toFixed(0)} м²</span>
              <span className="text-teal-700 font-medium">{formatCurrency(r.pricePerHour)}/год</span>
            </div>
            <button
              onClick={() => handleBook(r.roomId)}
              disabled={!r.isAvailable || (!!user && user.role !== "Client")}
              className="w-full py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Забронювати
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
