import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ChevronRight, Music, Wrench, CreditCard } from "lucide-react";
import { rooms as roomsApi, bookings } from "../api";
import type { RoomDetail } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, todayIso } from "../lib/format";
import { notifyError } from "../api/client";
import { toast } from "sonner";

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialRoomId = Number(searchParams.get("roomId") || 0);
  const initialDate = searchParams.get("date") || todayIso();

  const [roomId] = useState<number>(initialRoomId);
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [date, setDate] = useState<string>(initialDate);
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("12:00");
  const [equipmentIds, setEquipmentIds] = useState<Set<number>>(new Set());
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    roomsApi.get(roomId, date).then(setRoom).catch(() => {});
  }, [roomId, date]);

  const hours = (() => {
    const start = parseInt(startTime.slice(0, 2));
    const end = parseInt(endTime.slice(0, 2));
    return Math.max(0, end - start);
  })();

  const eqTotal = room
    ? Array.from(equipmentIds).reduce((sum, id) => {
        const e = room.equipments.find((x) => x.equipmentId === id);
        return sum + (e?.pricePerHour ?? 0) * hours;
      }, 0)
    : 0;
  const roomTotal = (room?.pricePerHour ?? 0) * hours;
  const total = roomTotal + eqTotal;

  const toggleEq = (id: number) => {
    const next = new Set(equipmentIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setEquipmentIds(next);
  };

  const submit = async () => {
    if (!roomId) {
      toast.error("Спочатку оберіть кімнату на сторінці студії.");
      return;
    }
    if (hours <= 0) {
      toast.error("Час кінця має бути пізніше часу початку.");
      return;
    }
    setSubmitting(true);
    try {
      const b = await bookings.create({
        roomId,
        date,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        note: note || undefined,
        equipmentIds: Array.from(equipmentIds),
      });
      toast.success("Бронювання створено!");
      navigate(`/bookings`);
      void b;
    } catch (err) {
      notifyError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Build hour options 09–22
  const hourOptions = Array.from({ length: 14 }, (_, i) => `${String(9 + i).padStart(2, "0")}:00`);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/studios" className="hover:text-foreground no-underline text-muted-foreground">Студії</Link>
        <ChevronRight className="w-4 h-4" />
        {room && (
          <>
            <Link
              to={`/studios/${room.studioId}`}
              className="hover:text-foreground no-underline text-muted-foreground"
            >
              {room.studioName}
            </Link>
            <ChevronRight className="w-4 h-4" />
          </>
        )}
        <span className="text-foreground">Бронювання</span>
      </div>

      <h1 className="mb-8">Оформлення бронювання</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Booking details */}
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <h3 className="flex items-center gap-2"><Music className="w-5 h-5 text-teal-600" /> Деталі бронювання</h3>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Кімната</label>
              <input
                value={room ? `${room.name} (${formatCurrency(room.pricePerHour)}/год)` : "Оберіть кімнату на сторінці студії"}
                readOnly
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
              />
              {!roomId && (
                <p className="text-xs text-amber-600 mt-1">
                  Поверніться до <Link to="/studios" className="underline">каталогу</Link> та оберіть кімнату.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Дата</label>
              <input
                type="date"
                value={date}
                min={todayIso()}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Початок</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
                >
                  {hourOptions.map((h) => <option key={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Кінець</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
                >
                  {hourOptions.map((h) => <option key={h}>{h}</option>)}
                </select>
              </div>
            </div>

            {room && room.busySlots.length > 0 && (
              <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-100 rounded-lg p-3">
                Зайняті інтервали: {room.busySlots.map((s) => `${s.startTime.slice(0,5)}–${s.endTime.slice(0,5)}`).join(", ")}
              </div>
            )}
          </div>

          {/* Equipment */}
          {room && room.equipments.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
              <h3 className="flex items-center gap-2"><Wrench className="w-5 h-5 text-teal-600" /> Додаткове обладнання</h3>
              <div className="space-y-3">
                {room.equipments.map((eq) => (
                  <label
                    key={eq.equipmentId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={equipmentIds.has(eq.equipmentId)}
                        onChange={() => toggleEq(eq.equipmentId)}
                        className="accent-teal-600 w-4 h-4"
                      />
                      <div>
                        <p className="text-sm">{eq.name}</p>
                        <p className="text-xs text-muted-foreground">{eq.typeName}</p>
                      </div>
                    </div>
                    <span className="text-sm text-teal-600">+{formatCurrency(eq.pricePerHour)}/год</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Contact / note */}
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <h3 className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-teal-600" /> Контактна інформація</h3>
            {user && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Ім'я</label>
                  <input
                    value={`${user.firstName} ${user.lastName}`}
                    readOnly
                    className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                  <input
                    value={user.email}
                    readOnly
                    className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Коментар</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm h-20 resize-none"
                placeholder="Додаткові побажання..."
              />
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white border border-border rounded-2xl p-5 sticky top-24 space-y-4">
            <h3>Підсумок</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Студія</span>
                <span className="text-right">{room?.studioName ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Кімната</span>
                <span className="text-right">{room?.name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата</span>
                <span>{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Час</span>
                <span>{startTime} – {endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Тривалість</span>
                <span>{hours} год</span>
              </div>
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Кімната ({hours} год)</span>
                <span>{formatCurrency(roomTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дод. обладнання</span>
                <span>{formatCurrency(eqTotal)}</span>
              </div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span>Всього</span>
              <span className="text-teal-600 text-lg">{formatCurrency(total)}</span>
            </div>
            <button
              onClick={submit}
              disabled={submitting || !roomId || hours <= 0}
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Створення…" : "Підтвердити бронювання"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
