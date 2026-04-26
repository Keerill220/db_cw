export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH", maximumFractionDigits: 0 }).format(n);

export const formatDate = (d: string) => {
  const date = new Date(d.length === 10 ? d + "T00:00:00" : d);
  return new Intl.DateTimeFormat("uk-UA", { year: "numeric", month: "long", day: "numeric" }).format(date);
};

export const formatDateTime = (d: string) => {
  const date = new Date(d);
  return new Intl.DateTimeFormat("uk-UA", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(date);
};

export const formatTime = (t: string) => t.slice(0, 5);

export const todayIso = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const monthLabel = (year: number, month: number) => {
  const d = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat("uk-UA", { month: "short", year: "2-digit" }).format(d);
};

export const statusLabel: Record<string, string> = {
  Pending: "Очікує",
  Confirmed: "Підтверджено",
  Cancelled: "Скасовано",
  Completed: "Завершено",
};

export const statusColor: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-800",
  Completed: "bg-slate-100 text-slate-800",
};
