import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Clock, Music } from "lucide-react";
import { rooms, bookings } from "../api";
import type { RoomDetail } from "../api/types";
import { notifyError } from "../api/client";
import { formatCurrency, todayIso } from "../lib/format";
import { toast } from "sonner";

export function BookingPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialRoomId = Number(params.get("roomId") || 0);

  const roomId = initialRoomId;
  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [date, setDate] = useState<string>(todayIso());
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("12:00");
  const [equipmentIds, setEquipmentIds] = useState<number[]>([]);
  const [note, setNote] = useState<string>("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    rooms.get(roomId, date).then(setRoom).catch(notifyError);
  }, [roomId, date]);

  const durationHours = useMemo(() => {
    const [h1, m1] = startTime.split(":").map(Number);
    const [h2, m2] = endTime.split(":").map(Number);
    return Math.max(0, (h2 + m2 / 60) - (h1 + m1 / 60));
  }, [startTime, endTime]);

  const equipmentSum = useMemo(() => {
    if (!room) return 0;
    return room.equipments
      .filter((e) => equipmentIds.includes(e.equipmentId))
      .reduce((s, e) => s + Number(e.pricePerHour), 0);
  }, [room, equipmentIds]);

  const totalPrice = room ? (Number(room.pricePerHour) + equipmentSum) * durationHours : 0;

  const toggleEquip = (id: number) =>
    setEquipmentIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const submit = async () => {
    if (!room) return;
    if (durationHours <= 0) { toast.error("Кінцевий час має бути після початкового"); return; }
    setPending(true);
    try {
      await bookings.create({
        roomId: room.roomId,
        date,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        equipmentIds: equipmentIds.length ? equipmentIds : undefined,
        note: note || null,
      });
      toast.success("Бронювання створено!");
      navigate("/bookings", { replace: true });
    } catch (err) {
      notifyError(err);
    } finally {
      setPending(false);
    }
  };

  if (!roomId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Перейдіть із картки кімнати, щоб створити бронювання.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Назад
      </button>
      <h1 className="mb-6">Створення бронювання</h1>

      {!room && <div className="text-muted-foreground">Завантаження кімнати…</div>}

      {room && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6 space-y-5">
            <div>
              <div className="text-sm text-muted-foreground">Кімната</div>
              <div className="text-lg font-medium">{room.name}</div>
              <div className="text-sm text-muted-foreground">{room.studioName}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Дата</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">З</label>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">До</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" />
              </div>
            </div>

            {room.busySlots.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-sm font-medium text-amber-800 mb-1.5 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Зайняті інтервали на {date}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {room.busySlots.map((b, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-white border border-amber-200 text-amber-800">
                      {b.startTime.slice(0, 5)}–{b.endTime.slice(0, 5)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {room.equipments.length > 0 && (
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Обладнання (опційно)</label>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {room.equipments.map((e) => (
                    <label key={e.equipmentId} className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" className="accent-teal-600" checked={equipmentIds.includes(e.equipmentId)} onChange={() => toggleEquip(e.equipmentId)} />
                      <Music className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm">{e.name}</div>
                        <div className="text-xs text-muted-foreground">{e.typeName}</div>
                      </div>
                      <div className="text-sm text-teal-700">+{formatCurrency(Number(e.pricePerHour))}/год</div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Примітка</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" placeholder="Особливі побажання…" />
            </div>
          </div>

          <aside className="bg-white border border-border rounded-2xl p-6 space-y-3 h-fit lg:sticky lg:top-20">
            <h3>Підсумок</h3>
            <Row label="Ціна кімнати" value={`${formatCurrency(Number(room.pricePerHour))}/год`} />
            <Row label="Обладнання" value={`${formatCurrency(equipmentSum)}/год`} />
            <Row label="Тривалість" value={`${durationHours.toFixed(1)} год`} />
            <hr />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Разом</span>
              <span className="text-2xl font-medium text-teal-700">{formatCurrency(totalPrice)}</span>
            </div>
            <button
              onClick={submit}
              disabled={pending || durationHours <= 0}
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
            >
              {pending ? "Створення…" : "Підтвердити бронювання"}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
