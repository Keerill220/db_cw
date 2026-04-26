import { Link, useLocation } from "react-router";
import { Music, User, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: "Головна" },
    { to: "/studios", label: "Студії" },
    { to: "/bookings", label: "Мої бронювання" },
    { to: "/profile", label: "Профіль" },
    { to: "/admin", label: "Адмін-панель" },
  ];

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary no-underline">
            <Music className="w-7 h-7 text-teal-600" />
            <span className="text-xl text-teal-600">SoundSpace</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
                  location.pathname === link.to
                    ? "bg-teal-100 text-teal-700"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground no-underline"
            >
              Увійти
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg no-underline hover:bg-teal-700 transition-colors"
            >
              Реєстрація
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm no-underline ${
                location.pathname === link.to
                  ? "bg-teal-100 text-teal-700"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link to="/login" className="px-3 py-2 text-sm text-muted-foreground no-underline">
              Увійти
            </Link>
            <Link
              to="/register"
              className="px-3 py-2 text-sm bg-teal-600 text-white rounded-lg no-underline text-center"
            >
              Реєстрація
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}