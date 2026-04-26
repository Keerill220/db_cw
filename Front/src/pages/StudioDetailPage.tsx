import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { MapPin, Clock, Music, ChevronRight, Building2 } from "lucide-react";
import { studios, rooms as roomsApi } from "../api";
import type { StudioDetail, RoomDetail } from "../api/types";
import { StudioImage } from "../components/StudioImage";
import { formatCurrency, todayIso } from "../lib/format";

export function StudioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const studioId = Number(id);
  const [studio, setStudio] = useState<StudioDetail | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [roomDetail, setRoomDetail] = useState<RoomDetail | null>(null);
  const [date, setDate] = useState(todayIso());

  useEffect(() => {
    studios.get(studioId).then((s) => {
      setStudio(s);
      if (s.rooms.length > 0) setActiveRoomId(s.rooms[0].roomId);
    }).catch(() => {});
  }, [studioId]);

  useEffect(() => {
    if (activeRoomId) {
      roomsApi.get(activeRoomId, date).then(setRoomDetail).catch(() => {});
    }
  }, [activeRoomId, date]);

  // Build hour grid 09–22
  const hours: { time: string; available: boolean }[] = [];
  for (let h = 9; h <= 22; h++) {
    const time = `${String(h).padStart(2, "0")}:00`;
    let available = true;
    if (roomDetail) {
      for (const slot of roomDetail.busySlots) {
        const start = parseInt(slot.startTime.slice(0, 2));
        const end = parseInt(slot.endTime.slice(0, 2));
        if (h >= start && h < end) { available = false; break; }
      }
    }
    hours.push({ time, available });
  }

  if (!studio) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-muted-foreground">Завантаження…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/studios" className="hover:text-foreground no-underline text-muted-foreground">Студії</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{studio.name}</span>
      </div>

      {/* Header image */}
      <div className="rounded-2xl overflow-hidden mb-8 aspect-[21/8]">
        <StudioImage src={studio.photoUrl} alt={studio.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="mb-1">{studio.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {studio.cityName}, {studio.address}
              </p>
            </div>
            {!studio.isActive && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">Неактивна</span>
            )}
          </div>

          {studio.description && (
            <p className="text-muted-foreground mb-6">{studio.description}</p>
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { icon: Clock, label: "09:00 – 22:00" },
              { icon: Building2, label: studio.country },
              { icon: Music, label: `${studio.rooms.length} ${roomsLabel(studio.rooms.length)}` },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 px-3 py-2 rounded-lg">
                <a.icon className="w-4 h-4" /> {a.label}
              </div>
            ))}
          </div>

          <h2 className="mb-4">Кімнати</h2>
          <div className="space-y-4">
            {studio.rooms.map((room) => (
              <div
                key={room.roomId}
                onClick={() => setActiveRoomId(room.roomId)}
                className={`flex flex-col sm:flex-row gap-4 border rounded-2xl p-4 bg-white cursor-pointer transition-colors ${
                  activeRoomId === room.roomId ? "border-teal-500 ring-2 ring-teal-100" : "border-border hover:border-teal-300"
                }`}
              >
                <div className="sm:w-48 aspect-[16/10] sm:aspect-auto rounded-xl overflow-hidden shrink-0">
                  <StudioImage src={room.photoUrl} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">{room.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">Площа: {room.areaSqm} м²</p>
                  {!room.isAvailable && (
                    <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-xs mb-2">
                      Тимчасово недоступна
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-teal-600">{formatCurrency(room.pricePerHour)}/год</span>
                    <Link
                      to={`/booking?roomId=${room.roomId}&date=${date}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm no-underline hover:bg-teal-700 transition-colors"
                    >
                      Забронювати
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {studio.rooms.length === 0 && (
              <p className="text-sm text-muted-foreground">У цій студії ще немає кімнат.</p>
            )}
          </div>
        </div>

        {/* Sidebar - schedule */}
        <aside className="lg:w-80 shrink-0">
          <div className="bg-white border border-border rounded-2xl p-5 sticky top-24">
            <h3 className="mb-4">Розклад</h3>
            <input
              type="date"
              value={date}
              min={todayIso()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mb-3 px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm"
            />
            <p className="text-sm text-muted-foreground mb-3">
              {roomDetail ? roomDetail.name : "Оберіть кімнату"}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {hours.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  className={`py-2 rounded-lg text-sm border transition-colors ${
                    slot.available
                      ? "border-teal-200 text-teal-600 hover:bg-teal-50 cursor-pointer"
                      : "border-border text-muted-foreground/40 bg-gray-50 cursor-not-allowed line-through"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            {roomDetail && roomDetail.equipments.length > 0 && (
              <div className="border-t border-border pt-4 mb-4">
                <p className="text-sm text-muted-foreground mb-2">Обладнання</p>
                <div className="flex flex-wrap gap-1">
                  {roomDetail.equipments.map((e) => (
                    <span key={e.equipmentId} className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full text-xs">
                      {e.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              to={activeRoomId ? `/booking?roomId=${activeRoomId}&date=${date}` : "/studios"}
              className="block w-full py-3 bg-teal-600 text-white rounded-lg text-center no-underline hover:bg-teal-700 transition-colors"
            >
              Забронювати
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function roomsLabel(n: number): string {
  if (n === 1) return "кімната";
  if (n >= 2 && n <= 4) return "кімнати";
  return "кімнат";
}
