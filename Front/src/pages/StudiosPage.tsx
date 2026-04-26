import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { studios, lookups } from "../api";
import type { City, Studio, EquipmentType } from "../api/types";
import { StudioImage } from "../components/StudioImage";
import { Pagination } from "../components/Pagination";

export function StudiosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cities, setCities] = useState<City[]>([]);
  const [eqTypes, setEqTypes] = useState<EquipmentType[]>([]);

  const [cityId, setCityId] = useState<string>(searchParams.get("cityId") ?? "");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") ?? "");
  const [q, setQ] = useState<string>(searchParams.get("q") ?? "");
  const [eqChecked, setEqChecked] = useState<Set<number>>(new Set());

  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
  const [data, setData] = useState<Studio[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 9;

  useEffect(() => {
    lookups.cities().then(setCities).catch(() => {});
    lookups.equipmentTypes().then(setEqTypes).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    studios
      .list({
        page,
        pageSize,
        cityId: cityId ? Number(cityId) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        q: q || undefined,
      })
      .then((r) => {
        setData(r.data);
        setTotal(r.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, cityId, minPrice, maxPrice, q]);

  const apply = () => {
    setPage(1);
    const sp: Record<string, string> = {};
    if (cityId) sp.cityId = cityId;
    if (minPrice) sp.minPrice = minPrice;
    if (maxPrice) sp.maxPrice = maxPrice;
    if (q) sp.q = q;
    setSearchParams(sp);
  };

  const reset = () => {
    setCityId("");
    setMinPrice("");
    setMaxPrice("");
    setQ("");
    setEqChecked(new Set());
    setPage(1);
    setSearchParams({});
  };

  const toggleEq = (id: number) => {
    const next = new Set(eqChecked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setEqChecked(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-6">Каталог студій</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white border border-border rounded-2xl p-5 space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Фільтри</h3>
              <button onClick={reset} className="text-xs text-teal-600">Скинути</button>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Місто</label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm"
              >
                <option value="">Усі міста</option>
                {cities.map((c) => <option key={c.cityId} value={c.cityId}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Ціна (грн/год)</label>
              <div className="flex gap-2">
                <input
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Від"
                  inputMode="numeric"
                  className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm"
                />
                <input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="До"
                  inputMode="numeric"
                  className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Обладнання</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {eqTypes.map((eq) => (
                  <label key={eq.typeId} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eqChecked.has(eq.typeId)}
                      onChange={() => toggleEq(eq.typeId)}
                      className="rounded border-border accent-teal-600"
                    />
                    {eq.name}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={apply} className="w-full py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors">
              Застосувати
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-white border border-border rounded-lg">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && apply()}
                placeholder="Пошук за назвою..."
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <select className="px-3 py-2.5 bg-white border border-border rounded-lg text-sm">
              <option>За назвою</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {loading ? "Завантаження…" : `Знайдено ${total} студій`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {data.map((s) => (
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
                  <div className="flex items-center justify-between mb-1">
                    <h4>{s.name}</h4>
                    {!s.isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Неактивна</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />{s.cityName}, {s.address}
                  </p>
                  {s.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{s.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                    <span className="text-teal-600">{s.country}</span>
                    <span className="text-muted-foreground">Деталі →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!loading && data.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Студій не знайдено</div>
          )}

          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
