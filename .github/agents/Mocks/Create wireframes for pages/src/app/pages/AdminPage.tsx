import { Link } from "react-router";
import { Building2, DoorOpen, Wrench, Calendar, BarChart3, Plus, Edit3, Trash2, ChevronRight, Users } from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "studios", label: "Студії", icon: Building2 },
  { id: "rooms", label: "Кімнати", icon: DoorOpen },
  { id: "equipment", label: "Обладнання", icon: Wrench },
  { id: "schedule", label: "Розклад", icon: Calendar },
  { id: "stats", label: "Статистика", icon: BarChart3 },
];

const mockStudios = [
  { id: 1, name: "SoundWave Studio", city: "Львів", rooms: 5, status: "Активна" },
  { id: 2, name: "BeatBox Rehearsal", city: "Львів", rooms: 3, status: "Активна" },
];

const mockRooms = [
  { id: 1, name: "Кімната A - Репетиційна", studio: "SoundWave Studio", size: "40 м²", price: "250 грн/год", status: "Вільна" },
  { id: 2, name: "Кімната B - Звукозапис", studio: "SoundWave Studio", size: "25 м²", price: "400 грн/год", status: "Зайнята" },
  { id: 3, name: "Кімната C - Барабанна", studio: "SoundWave Studio", size: "30 м²", price: "200 грн/год", status: "Вільна" },
  { id: 4, name: "Кімната 1", studio: "BeatBox Rehearsal", size: "35 м²", price: "180 грн/год", status: "Вільна" },
];

const mockEquipment = [
  { id: 1, name: "Marshall JCM800", type: "Підсилювач", room: "Кімната A", condition: "Відмінний" },
  { id: 2, name: "Pearl Export Series", type: "Барабани", room: "Кімната C", condition: "Добрий" },
  { id: 3, name: "Neumann U87", type: "Мікрофон", room: "Кімната B", condition: "Відмінний" },
  { id: 4, name: "SSL Console", type: "Мікшер", room: "Кімната B", condition: "Відмінний" },
  { id: 5, name: "Yamaha P-125", type: "Клавіші", room: "Кімната A", condition: "Добрий" },
];

const scheduleSlots = [
  { time: "09:00", rooms: [null, "Іван К.", null, null] },
  { time: "10:00", rooms: [null, "Іван К.", "Марія С.", null] },
  { time: "11:00", rooms: ["Олег Д.", null, "Марія С.", null] },
  { time: "12:00", rooms: ["Олег Д.", null, null, "Тарас В."] },
  { time: "13:00", rooms: [null, null, null, "Тарас В."] },
  { time: "14:00", rooms: ["Андрій Б.", "Наталя Г.", null, null] },
  { time: "15:00", rooms: ["Андрій Б.", "Наталя Г.", null, null] },
  { time: "16:00", rooms: [null, null, "Вікторія Л.", null] },
  { time: "17:00", rooms: [null, null, "Вікторія Л.", "Ігор М."] },
  { time: "18:00", rooms: ["Петро К.", null, null, "Ігор М."] },
];

const roomNames = ["Кімната A", "Кімната B", "Кімната C", "Кімната 1"];

const statsData = {
  weekly: [
    { day: "Пн", hours: 6 },
    { day: "Вт", hours: 8 },
    { day: "Ср", hours: 5 },
    { day: "Чт", hours: 9 },
    { day: "Пт", hours: 10 },
    { day: "Сб", hours: 12 },
    { day: "Нд", hours: 7 },
  ],
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState("studios");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1>Адмін-панель</h1>
          <p className="text-sm text-muted-foreground">Управління студіями та бронюваннями</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" /> Адміністратор
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "bg-teal-600 text-white" : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Studios tab */}
      {activeTab === "studios" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Мої студії</h2>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-teal-700">
              <Plus className="w-4 h-4" /> Додати студію
            </button>
          </div>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Назва</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Місто</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Кімнат</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Статус</th>
                  <th className="text-right px-4 py-3 text-sm text-muted-foreground">Дії</th>
                </tr>
              </thead>
              <tbody>
                {mockStudios.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm">{s.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{s.city}</td>
                    <td className="px-4 py-3 text-sm">{s.rooms}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs">{s.status}</span></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-teal-600"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rooms tab */}
      {activeTab === "rooms" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Кімнати</h2>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-teal-700">
              <Plus className="w-4 h-4" /> Додати кімнату
            </button>
          </div>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Назва</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Студія</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Площа</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Ціна</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Статус</th>
                  <th className="text-right px-4 py-3 text-sm text-muted-foreground">Дії</th>
                </tr>
              </thead>
              <tbody>
                {mockRooms.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{r.studio}</td>
                    <td className="px-4 py-3 text-sm">{r.size}</td>
                    <td className="px-4 py-3 text-sm text-teal-600">{r.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${r.status === "Вільна" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-teal-600"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Equipment tab */}
      {activeTab === "equipment" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Обладнання</h2>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-teal-700">
              <Plus className="w-4 h-4" /> Додати обладнання
            </button>
          </div>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Назва</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Тип</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Кімната</th>
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground">Стан</th>
                  <th className="text-right px-4 py-3 text-sm text-muted-foreground">Дії</th>
                </tr>
              </thead>
              <tbody>
                {mockEquipment.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm">{e.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full text-xs">{e.type}</span></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{e.room}</td>
                    <td className="px-4 py-3 text-sm">{e.condition}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-teal-600"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-1.5 text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule tab */}
      {activeTab === "schedule" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Розклад зайнятості</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-border rounded-lg text-sm">&larr;</button>
              <span className="text-sm">06 квітня 2026</span>
              <button className="px-3 py-1.5 border border-border rounded-lg text-sm">&rarr;</button>
            </div>
          </div>
          <div className="bg-white border border-border rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm text-muted-foreground w-20">Час</th>
                  {roomNames.map((r) => (
                    <th key={r} className="text-left px-4 py-3 text-sm text-muted-foreground">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scheduleSlots.map((slot) => (
                  <tr key={slot.time} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">{slot.time}</td>
                    {slot.rooms.map((client, i) => (
                      <td key={i} className="px-4 py-2.5">
                        {client ? (
                          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">{client}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">Вільно</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-100 rounded" /> Заброньовано</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-white border border-border rounded" /> Вільно</span>
          </div>
        </div>
      )}

      {/* Stats tab */}
      {activeTab === "stats" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Статистика завантаженості</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">Тиждень</button>
              <button className="px-4 py-2 bg-gray-100 text-muted-foreground rounded-lg text-sm">Місяць</button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Всього бронювань", value: "47" },
              { label: "Годин заброньовано", value: "94" },
              { label: "Завантаженість", value: "68%" },
              { label: "Дохід", value: "21 200 грн" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl text-teal-600">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="bg-white border border-border rounded-2xl p-6">
            <h3 className="mb-4">Завантаженість по днях</h3>
            <div className="flex items-end gap-4 h-48">
              {statsData.weekly.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-teal-200 rounded-t-lg transition-all"
                    style={{ height: `${(d.hours / 12) * 100}%` }}
                  >
                    <div
                      className="w-full bg-teal-500 rounded-t-lg"
                      style={{ height: `${(d.hours / 12) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                  <span className="text-xs text-teal-600">{d.hours}г</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room breakdown */}
          <div className="bg-white border border-border rounded-2xl p-6 mt-4">
            <h3 className="mb-4">Завантаженість по кімнатах</h3>
            <div className="space-y-4">
              {[
                { name: "Кімната A - Репетиційна", percent: 78 },
                { name: "Кімната B - Звукозапис", percent: 62 },
                { name: "Кімната C - Барабанна", percent: 45 },
              ].map((r) => (
                <div key={r.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{r.name}</span>
                    <span className="text-teal-600">{r.percent}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${r.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}