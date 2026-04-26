import { Link } from "react-router";
import { Search, MapPin, Star, SlidersHorizontal, X } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const studios = [
  { id: 1, name: "SoundWave Studio", location: "Львів, вул. Шевченка 45", price: 250, rating: 4.8, image: "https://images.unsplash.com/photo-1600660585289-c82cbd373e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHJlY29yZGluZyUyMHN0dWRpbyUyMHJvb218ZW58MXx8fHwxNzc1MzI1NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080", rooms: 5, equipment: ["Мікрофон", "Барабани", "Підсилювач"] },
  { id: 2, name: "BeatBox Rehearsal", location: "Львів, вул. Франка 12", price: 180, rating: 4.5, image: "https://images.unsplash.com/photo-1606050580496-f8f32a21afea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWhlYXJzYWwlMjByb29tJTIwYmFuZCUyMHByYWN0aWNlfGVufDF8fHx8MTc3NTMyNTQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080", rooms: 3, equipment: ["Барабани", "Підсилювач"] },
  { id: 3, name: "Melody Hub", location: "Київ, вул. Хрещатик 22", price: 300, rating: 4.9, image: "https://images.unsplash.com/photo-1700166269606-b5ea327d0540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMG1peGluZyUyMGNvbnNvbGUlMjBzdHVkaW98ZW58MXx8fHwxNzc1MjQyNDU3fDA&ixlib=rb-4.1.0&q=80&w=1080", rooms: 8, equipment: ["Мікрофон", "Мікшер", "Клавіші"] },
  { id: 4, name: "Groove Lab", location: "Одеса, вул. Дерибасівська 7", price: 200, rating: 4.3, image: "https://images.unsplash.com/photo-1758336717046-c475fc6f45ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcnVtJTIwa2l0JTIwcmVoZWFyc2FsJTIwc3BhY2V8ZW58MXx8fHwxNzc1MzI1NDY3fDA&ixlib=rb-4.1.0&q=80&w=1080", rooms: 4, equipment: ["Барабани", "Гітара"] },
  { id: 5, name: "Vocal Box", location: "Київ, вул. Льва Толстого 5", price: 350, rating: 4.7, image: "https://images.unsplash.com/photo-1561446289-4112a4f79116?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMG1pY3JvcGhvbmUlMjB2b2NhbHxlbnwxfHx8fDE3NzUzMjU3Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080", rooms: 2, equipment: ["Мікрофон", "Мікшер"] },
  { id: 6, name: "Amplify Studio", location: "Львів, вул. Городоцька 30", price: 220, rating: 4.6, image: "https://images.unsplash.com/photo-1771890949433-5e1e3576655b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXIlMjBhbXBsaWZpZXIlMjBtdXNpYyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzUzMjU0Njd8MA&ixlib=rb-4.1.0&q=80&w=1080", rooms: 6, equipment: ["Підсилювач", "Мікрофон", "Барабани"] },
];

export function StudiosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-6">Каталог студій</h1>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white border border-border rounded-2xl p-5 space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Фільтри</h3>
              <button className="text-xs text-teal-600">Скинути</button>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Місто</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm">
                <option>Усі міста</option>
                <option>Львів</option>
                <option>Київ</option>
                <option>Одеса</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Ціна (грн/год)</label>
              <div className="flex gap-2">
                <input placeholder="Від" className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" readOnly />
                <input placeholder="До" className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" readOnly />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Обладнання</label>
              <div className="space-y-2">
                {["Мікрофон", "Барабани", "Підсилювач", "Мікшер", "Клавіші"].map((eq) => (
                  <label key={eq} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded border-border accent-teal-600" readOnly />
                    {eq}
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors">
              Застосувати
            </button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-white border border-border rounded-lg">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input placeholder="Пошук за назвою..." className="w-full bg-transparent outline-none text-sm" readOnly />
            </div>
            <select className="px-3 py-2.5 bg-white border border-border rounded-lg text-sm">
              <option>За рейтингом</option>
              <option>Ціна: від низької</option>
              <option>Ціна: від високої</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground mb-4">Знайдено {studios.length} студій</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {studios.map((s) => (
              <Link
                key={s.id}
                to={`/studios/${s.id}`}
                className="group rounded-2xl border border-border overflow-hidden bg-white no-underline text-foreground hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <ImageWithFallback src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4>{s.name}</h4>
                    <span className="flex items-center gap-1 text-sm text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-500" />{s.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{s.location}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {s.equipment.map((e) => (
                      <span key={e} className="px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full text-xs">{e}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-teal-600">{s.price} грн/год</span>
                    <span className="text-muted-foreground">{s.rooms} кімнат</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}