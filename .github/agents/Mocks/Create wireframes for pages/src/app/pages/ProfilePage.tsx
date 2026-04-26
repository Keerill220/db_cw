import { User, Mail, Phone, MapPin, Edit3, Camera } from "lucide-react";

export function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Мій профіль</h1>

      {/* Avatar & basic info */}
      <div className="bg-white border border-border rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
              <User className="w-10 h-10 text-teal-600" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2>Кирил Пономаренко</h2>
            <p className="text-sm text-muted-foreground">Клієнт</p>
            <p className="text-xs text-muted-foreground mt-1">Зареєстрований: 15.01.2026</p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3>Особиста інформація</h3>
          <button className="text-sm text-teal-600 flex items-center gap-1">
            <Edit3 className="w-4 h-4" /> Редагувати
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Ім'я</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Кирил</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Прізвище</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>Пономаренко</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>kyrylo@example.com</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Телефон</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>+380 99 123 4567</span>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground mb-1.5 block">Місто</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>Львів</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors">
            Зберегти зміни
          </button>
          <button className="px-6 py-2.5 border border-border text-muted-foreground rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Скасувати
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { label: "Бронювань", value: "12" },
          { label: "Відвіданих студій", value: "4" },
          { label: "Витрачено", value: "5 400 грн" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-border rounded-2xl p-4 text-center">
            <p className="text-2xl text-teal-600">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}