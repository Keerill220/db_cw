import { Link } from "react-router";
import { Search, MapPin, Music, Calendar, Star, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const featuredStudios = [
  {
    id: 1,
    name: "SoundWave Studio",
    location: "Львів, вул. Шевченка 45",
    price: "250 грн/год",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600660585289-c82cbd373e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHJlY29yZGluZyUyMHN0dWRpbyUyMHJvb218ZW58MXx8fHwxNzc1MzI1NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rooms: 5,
  },
  {
    id: 2,
    name: "BeatBox Rehearsal",
    location: "Львів, вул. Франка 12",
    price: "180 грн/год",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1606050580496-f8f32a21afea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWhlYXJzYWwlMjByb29tJTIwYmFuZCUyMHByYWN0aWNlfGVufDF8fHx8MTc3NTMyNTQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rooms: 3,
  },
  {
    id: 3,
    name: "Melody Hub",
    location: "Київ, вул. Хрещатик 22",
    price: "300 грн/год",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1700166269606-b5ea327d0540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VuZCUyMG1peGluZyUyMGNvbnNvbGUlMjBzdHVkaW98ZW58MXx8fHwxNzc1MjQyNDU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rooms: 8,
  },
];

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl text-white mb-4">
              Знайдіть ідеальну студію для вашої музики
            </h1>
            <p className="text-teal-200 text-lg mb-8">
              Бронюйте репетиційні бази та студії звукозапису онлайн. Зручний пошук, прозорі ціни,
              миттєве підтвердження.
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Місто або район"
                  className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-none"
                  readOnly
                />
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Оберіть дату"
                  className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 outline-none"
                  readOnly
                />
              </div>
              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-teal-700 transition-colors">
                <Search className="w-5 h-5" />
                Пошук
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]" />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: "Зручний пошук", desc: "Фільтруйте за локацією, ціною та обладнанням" },
            { icon: Calendar, title: "Миттєве бронювання", desc: "Обирайте вільний час та бронюйте онлайн" },
            { icon: Music, title: "Перевірене обладнання", desc: "Детальний опис обладнання кожної кімнати" },
          ].map((f, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white border border-border">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured studios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2>Популярні студії</h2>
          <Link to="/studios" className="text-teal-600 text-sm flex items-center gap-1 no-underline hover:underline">
            Дивитись усі <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStudios.map((studio) => (
            <Link
              key={studio.id}
              to={`/studios/${studio.id}`}
              className="group rounded-2xl border border-border overflow-hidden bg-white no-underline text-foreground hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <ImageWithFallback
                  src={studio.image}
                  alt={studio.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3>{studio.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500" />
                    {studio.rating}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="w-3.5 h-3.5" /> {studio.location}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-teal-600">{studio.price}</span>
                  <span className="text-muted-foreground">{studio.rooms} кімнат</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}