import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Search, MapPin, Building2 } from "lucide-react";
import { studios, lookups } from "../api";
import type { City, PagedResult, Studio } from "../api/types";
import { Pagination } from "../components/Pagination";
import { notifyError } from "../api/client";

export function StudiosPage() {
  const [data, setData] = useState<PagedResult<Studio> | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [cityId, setCityId] = useState<number | "">("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [filtersTrigger, setFiltersTrigger] = useState(0);

  useEffect(() => {
    lookups.cities().then(setCities).catch(notifyError);
  }, []);

  useEffect(() => {
    setLoading(true);
    studios.list({
      page,
      pageSize: 12,
      cityId: cityId === "" ? undefined : Number(cityId),
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      q: q || undefined,
    })
      .then(setData)
      .catch(notifyError)
      .finally(() => setLoading(false));
  }, [page, filtersTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = () => {
    setPage(1);
    setFiltersTrigger((n) => n + 1);
  };

  const resetFilters = () => {
    setQ(""); setCityId(""); setMinPrice(""); setMaxPrice("");
    setPage(1);
    setFiltersTrigger((n) => n + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1>Усі студії</h1>
        <p className="text-sm text-muted-foreground mt-1">Знайдіть ідеальну студію для репетиції чи запису</p>
      </div>

      <div className="bg-white border border-border rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Назва або адреса"
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
          />
        </div>
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value === "" ? "" : Number(e.target.value))}
          className="px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
        >
          <option value="">Усі міста</option>
          {cities.map((c) => <option key={c.cityId} value={c.cityId}>{c.name}</option>)}
        </select>
        <input
          type="number"
          placeholder="Ціна від"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
        />
        <input
          type="number"
          placeholder="до"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
        />
        <div className="md:col-span-5 flex gap-2">
          <button onClick={applyFilters} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
            Застосувати
          </button>
          <button onClick={resetFilters} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-accent">
            Скинути
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-12 text-muted-foreground">Завантаження…</div>}
      {!loading && data && data.data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">Студій не знайдено</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((s) => (
          <Link key={s.studioId} to={`/studios/${s.studioId}`} className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-shadow no-underline text-foreground">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              {!s.isActive && <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700">Не активна</span>}
            </div>
            <h3 className="mb-1">{s.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {s.cityName}, {s.address}
            </p>
            {s.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{s.description}</p>}
            <div className="text-xs text-muted-foreground mt-3">Створено: {new Date(s.createdAt).toLocaleDateString("uk-UA")}</div>
          </Link>
        ))}
      </div>

      {data && (
        <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onChange={setPage} />
      )}
    </div>
  );
}
