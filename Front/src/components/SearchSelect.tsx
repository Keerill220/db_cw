import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

interface Option {
  id: number;
  label: string;
  hint?: string;
}

interface Props {
  options: Option[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  allowClear?: boolean;
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Пошук…",
  emptyText = "Нічого не знайдено",
  className = "",
  allowClear = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => options.find((o) => o.id === value) ?? null, [options, value]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(q) ||
      (o.hint?.toLowerCase().includes(q) ?? false)
    );
  }, [options, query]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm text-left hover:border-teal-300 transition-colors"
      >
        <span className={`flex-1 truncate ${selected ? "text-foreground" : "text-muted-foreground"}`}>
          {selected ? selected.label : placeholder}
        </span>
        {allowClear && selected && (
          <X
            className="w-4 h-4 text-muted-foreground hover:text-foreground"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
          />
        )}
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-gray-50">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => { onChange(o.id); setOpen(false); setQuery(""); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-teal-50 transition-colors ${
                  o.id === value ? "bg-teal-50 text-teal-700" : ""
                }`}
              >
                <div className="truncate">{o.label}</div>
                {o.hint && <div className="text-xs text-muted-foreground truncate">{o.hint}</div>}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">{emptyText}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
