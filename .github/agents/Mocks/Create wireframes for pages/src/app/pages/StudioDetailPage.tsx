import { Link } from "react-router";
import { MapPin, Star, Clock, Music, Wifi, Car, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const rooms = [
  { id: 1, name: "Кімната A - Репетиційна", size: "40 м²", price: 250, equipment: ["Барабани Pearl", "Marshall JCM800", "Fender Bass Amp", "3 мікрофони"], image: "https://images.unsplash.com/photo-1606050580496-f8f32a21afea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWhlYXJzYWwlMjByb29tJTIwYmFuZCUyMHByYWN0aWNlfGVufDF8fHx8MTc3NTMyNTQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, name: "Кімната B - Звукозапис", size: "25 м²", price: 400, equipment: ["Neumann U87", "SSL Console", "Pro Tools HD", "Мониторы Genelec"], image: "https://images.unsplash.com/photo-1700166269606-b5ea327d0540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMG1peGluZyUyMGNvbnNvbGUlMjBzdHVkaW98ZW58MXx8fHwxNzc1MjQyNDU3fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, name: "Кімната C - Барабанна", size: "30 м²", price: 200, equipment: ["DW Collector's Series", "Zildjian тарілки", "Мікрофонний набір"], image: "https://images.unsplash.com/photo-1758336717046-c475fc6f45ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcnVtJTIwa2l0JTIwcmVoZWFyc2FsJTIwc3BhY2V8ZW58MXx8fHwxNzc1MzI1NDY3fDA&ixlib=rb-4.1.0&q=80&w=1080" },
];

const timeSlots = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "12:00", available: false },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: false },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
  { time: "18:00", available: true },
  { time: "19:00", available: false },
  { time: "20:00", available: true },
];

export function StudioDetailPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/studios" className="hover:text-foreground no-underline text-muted-foreground">Студії</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">SoundWave Studio</span>
      </div>

      {/* Header image */}
      <div className="rounded-2xl overflow-hidden mb-8 aspect-[21/8]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1600660585289-c82cbd373e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHJlY29yZGluZyUyMHN0dWRpbyUyMHJvb218ZW58MXx8fHwxNzc1MzI1NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="SoundWave Studio"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="mb-1">SoundWave Studio</h1>
              <p className="text-muted-foreground flex items-center gap-1"><MapPin className="w-4 h-4" /> Львів, вул. Шевченка 45</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-amber-500" /> 4.8
            </div>
          </div>

          <p className="text-muted-foreground mb-6">
            Професійна музична студія у центрі Львова. Сучасне обладнання, звукоізольовані кімнати,
            комфортні умови для репетицій та звукозапису. Працюємо з 2018 року.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { icon: Clock, label: "09:00 - 23:00" },
              { icon: Wifi, label: "Wi-Fi" },
              { icon: Car, label: "Парковка" },
              { icon: Music, label: "5 кімнат" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 px-3 py-2 rounded-lg">
                <a.icon className="w-4 h-4" /> {a.label}
              </div>
            ))}
          </div>

          {/* Rooms */}
          <h2 className="mb-4">Кімнати</h2>
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="flex flex-col sm:flex-row gap-4 border border-border rounded-2xl p-4 bg-white">
                <div className="sm:w-48 aspect-[16/10] sm:aspect-auto rounded-xl overflow-hidden shrink-0">
                  <ImageWithFallback src={room.image} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1">{room.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">Площа: {room.size}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {room.equipment.map((e) => (
                      <span key={e} className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full text-xs">{e}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600">{room.price} грн/год</span>
                    <Link to="/booking" className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm no-underline hover:bg-teal-700 transition-colors">
                      Забронювати
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - schedule */}
        <aside className="lg:w-80 shrink-0">
          <div className="bg-white border border-border rounded-2xl p-5 sticky top-24">
            <h3 className="mb-4">Розклад на сьогодні</h3>
            <p className="text-sm text-muted-foreground mb-3">Кімната A - Репетиційна</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {timeSlots.map((slot) => (
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

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Кімната</span>
                <span>Кімната A</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Час</span>
                <span>13:00 - 14:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Тривалість</span>
                <span>1 година</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Вартість</span>
                <span className="text-teal-600">250 грн</span>
              </div>
            </div>

            <Link
              to="/booking"
              className="mt-4 block w-full py-3 bg-teal-600 text-white rounded-lg text-center no-underline hover:bg-teal-700 transition-colors"
            >
              Забронювати
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}