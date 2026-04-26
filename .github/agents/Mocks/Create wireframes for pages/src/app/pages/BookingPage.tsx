import { Link } from "react-router";
import { ChevronRight, Check, Music, Clock, CreditCard } from "lucide-react";

const additionalEquipment = [
  { name: "Додатковий мікрофон Shure SM58", price: 50 },
  { name: "DI-бокс", price: 30 },
  { name: "Мониторна пара (навушники)", price: 40 },
  { name: "Клавіші Yamaha P-125", price: 100 },
];

export function BookingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/studios/1" className="hover:text-foreground no-underline text-muted-foreground">SoundWave Studio</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">Бронювання</span>
      </div>

      <h1 className="mb-8">Оформлення бронювання</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-8">
        {["Деталі", "Обладнання", "Підтвердження"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              i === 0 ? "bg-teal-600 text-white" : "bg-gray-100 text-muted-foreground"
            }`}>
              {i === 0 ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm ${i === 0 ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Booking details */}
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <h3 className="flex items-center gap-2"><Music className="w-5 h-5 text-teal-600" /> Деталі бронювання</h3>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Кімната</label>
              <select className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
                <option>Кімната A - Репетиційна (250 грн/год)</option>
                <option>Кімната B - Звукозапис (400 грн/год)</option>
                <option>Кімната C - Барабанна (200 грн/год)</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Дата</label>
              <input type="date" className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" defaultValue="2026-04-06" readOnly />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Початок</label>
                <select className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
                  <option>13:00</option>
                  <option>14:00</option>
                  <option>16:00</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Кінець</label>
                <select className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
                  <option>15:00</option>
                  <option>16:00</option>
                  <option>17:00</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional equipment */}
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <h3 className="flex items-center gap-2"><Clock className="w-5 h-5 text-teal-600" /> Додаткове обладнання</h3>
            <div className="space-y-3">
              {additionalEquipment.map((eq) => (
                <label key={eq.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="accent-teal-600 w-4 h-4" readOnly />
                    <span className="text-sm">{eq.name}</span>
                  </div>
                  <span className="text-sm text-teal-600">+{eq.price} грн</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
            <h3 className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-teal-600" /> Контактна інформація</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Ім'я</label>
                <input className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="Ваше ім'я" readOnly />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Телефон</label>
                <input className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="+380..." readOnly />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Коментар</label>
              <textarea className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm h-20 resize-none" placeholder="Додаткові побажання..." readOnly />
            </div>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white border border-border rounded-2xl p-5 sticky top-24 space-y-4">
            <h3>Підсумок</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Студія</span><span>SoundWave</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Кімната</span><span>Кімната A</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Дата</span><span>06.04.2026</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Час</span><span>13:00 - 15:00</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Трив��лість</span><span>2 години</span></div>
            </div>
            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Кімната (2 год)</span><span>500 грн</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Дод. обладнання</span><span>0 грн</span></div>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span>Всього</span>
              <span className="text-teal-600 text-lg">500 грн</span>
            </div>
            <button className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Підтвердити бронювання
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}