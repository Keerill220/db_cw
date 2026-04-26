import { Link, useLocation, useNavigate } from "react-router";
import { Music, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allLinks = [
    { to: "/", label: "Головна", roles: null },
    { to: "/studios", label: "Студії", roles: null },
    { to: "/bookings", label: "Бронювання", roles: ["Client", "Owner", "Superadmin"] },
    { to: "/admin", label: "Адмін-панель", roles: ["Owner", "Superadmin"] },
    { to: "/profile", label: "Профіль", roles: ["Client", "Owner", "Superadmin"] },
  ] as const;

  const links = allLinks.filter((l) => !l.roles || (role && (l.roles as readonly string[]).includes(role)));

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Music className="w-7 h-7 text-teal-600" />
            <span className="text-xl text-teal-600 font-medium">SoundSpace</span>
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
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{user.firstName} {user.lastName}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-700">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" /> Вийти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground no-underline">
                  Увійти
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg no-underline hover:bg-teal-700 transition-colors">
                  Реєстрація
                </Link>
              </>
            )}
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
            {user ? (
              <button onClick={handleLogout} className="px-3 py-2 text-sm text-left text-rose-600">
                Вийти
              </button>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm text-muted-foreground no-underline">Увійти</Link>
                <Link to="/register" className="px-3 py-2 text-sm bg-teal-600 text-white rounded-lg no-underline text-center">
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
