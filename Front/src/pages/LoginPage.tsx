import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Music } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notifyError } from "../api/client";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginClient, loginAdmin } = useAuth();
  const [accountType, setAccountType] = useState<"client" | "admin">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (accountType === "admin") await loginAdmin(email, password);
      else await loginClient(email, password);
      navigate("/");
    } catch (err) {
      notifyError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-6 h-6 text-teal-600" />
          </div>
          <h1>Вхід</h1>
          <p className="text-sm text-muted-foreground mt-1">Увійдіть у свій акаунт SoundSpace</p>
        </div>

        <form onSubmit={submit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Тип акаунту</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccountType("client")}
                className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  accountType === "client"
                    ? "border-2 border-teal-600 bg-teal-50 text-teal-600"
                    : "border border-border text-muted-foreground"
                }`}
              >
                Клієнт
              </button>
              <button
                type="button"
                onClick={() => setAccountType("admin")}
                className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  accountType === "admin"
                    ? "border-2 border-teal-600 bg-teal-50 text-teal-600"
                    : "border border-border text-muted-foreground"
                }`}
              >
                Адмін
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Вхід…" : "Увійти"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Немає акаунту?{" "}
          <Link to="/register" className="text-teal-600 no-underline">Зареєструватись</Link>
        </p>
      </div>
    </div>
  );
}
