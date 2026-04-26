import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, MapPin, Music, Calendar, ArrowRight } from "lucide-react";
import { studios, lookups } from "../api";
import type { City, Studio } from "../api/types";
import { StudioImage } from "../components/StudioImage";

export function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Studio[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState<string>("");

  useEffect(() => {
    studios.list({ page: 1, pageSize: 3 }).then((r) => setFeatured(r.data)).catch(() => {});
    lookups.cities().then(setCities).catch(() => {});
  }, []);

  const search = () => {
    const params = new URLSearchParams();
    if (cityId) params.set("cityId", cityId);
    navigate(`/studios?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl text-white mb-4 leading-tight">
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
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full bg-transparent text-gray-900 outline-none"
                >
                  <option value="">Усі міста</option>
                  {cities.map((c) => (
                    <option key={c.cityId} value={c.cityId}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="date"
                  className="w-full bg-transparent text-gray-900 outline-none"
                />
              </div>
              <button
                onClick={search}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg flex items-center gap-2 justify-center hover:bg-teal-700 transition-colors"
              >
                <Search className="w-5 h-5" />
                Пошук
              </button>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')",
          }}
        />
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
          {featured.map((s) => (
            <Link
              key={s.studioId}
              to={`/studios/${s.studioId}`}
              className="group rounded-2xl border border-border overflow-hidden bg-white no-underline text-foreground hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <StudioImage
                  src={s.photoUrl}
                  alt={s.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-1">{s.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="w-3.5 h-3.5" /> {s.cityName}, {s.address}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-teal-600">{s.country}</span>
                  <span className="text-muted-foreground">Деталі →</span>
                </div>
              </div>
            </Link>
          ))}
          {featured.length === 0 && (
            <div className="col-span-3 text-center py-12 text-muted-foreground">Завантаження…</div>
          )}
        </div>
      </section>
    </div>
  );
}
