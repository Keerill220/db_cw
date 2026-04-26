import { Calendar, Clock, MapPin, X, Check, AlertCircle } from "lucide-react";

const bookings = [
  { id: 1, studio: "SoundWave Studio", room: "Кімната A - Репетиційна", date: "06.04.2026", time: "13:00 - 15:00", duration: "2 год", price: "500 грн", status: "confirmed" as const },
  { id: 2, studio: "Melody Hub", room: "Кімната B - Звукозапис", date: "08.04.2026", time: "10:00 - 12:00", duration: "2 год", price: "800 грн", status: "pending" as const },
  { id: 3, studio: "BeatBox Rehearsal", room: "Кімната A", date: "01.04.2026", time: "18:00 - 20:00", duration: "2 год", price: "360 грн", status: "completed" as const },
  { id: 4, studio: "Groove Lab", room: "Кімната C", date: "28.03.2026", time: "14:00 - 16:00", duration: "2 год", price: "400 грн", status: "cancelled" as const },
];

const statusMap = {
  confirmed: { label: "Підтверджено", color: "bg-green-50 text-green-600", icon: Check },
  pending: { label: "Очікує", color: "bg-amber-50 text-amber-600", icon: AlertCircle },
  completed: { label: "Завершено", color: "bg-blue-50 text-blue-600", icon: Check },
  cancelled: { label: "Скасовано", color: "bg-red-50 text-red-500", icon: X },
};

export function BookingsListPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1>Мої бронювання</h1>
        <div className="flex gap-2">
          {["Усі", "Активні", "Завершені"].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                i === 0 ? "bg-teal-600 text-white" : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {bookings.map((b) => {
          const s = statusMap[b.status];
          return (
            <div key={b.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4>{b.studio}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${s.color}`}>
                    <s.icon className="w-3 h-3" /> {s.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{b.room}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {b.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {b.time}</span>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-teal-600">{b.price}</p>
                {b.status === "confirmed" && (
                  <button className="px-4 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors">
                    Скасувати
                  </button>
                )}
                {b.status === "pending" && (
                  <button className="px-4 py-1.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors">
                    Скасувати
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}