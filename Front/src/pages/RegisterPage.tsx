import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Music } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { notifyError } from "../api/client";

export function RegisterPage() {
  const navigate = useNavigate();
  const { initiateRegistration } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Пароль має бути не менше 6 символів");
      return;
    }
    if (password !== confirm) {
      setError("Паролі не співпадають");
      return;
    }
    setSubmitting(true);
    try {
      const confirmedEmail = await initiateRegistration({ email, password, firstName, lastName, phone: phone || undefined });
      navigate("/verify-email", { state: { email: confirmedEmail } });
    } catch (err) {
      notifyError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-6 h-6 text-teal-600" />
          </div>
          <h1>Реєстрація</h1>
          <p className="text-sm text-muted-foreground mt-1">Створіть акаунт у SoundSpace</p>
        </div>

        <form onSubmit={submit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Тип акаунту</label>
            <div className="grid grid-cols-1 gap-2">
              <button type="button" disabled className="px-4 py-2.5 border-2 border-teal-600 bg-teal-50 text-teal-600 rounded-lg text-sm">
                Клієнт
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Власників студій додає адміністратор системи.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Ім'я</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
                placeholder="Ім'я"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Прізвище</label>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
                placeholder="Прізвище"
              />
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
            <label className="text-sm text-muted-foreground mb-1.5 block">Телефон</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
              placeholder="+380..."
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
              placeholder="Мінімум 6 символів"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Підтвердження пароля</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
              placeholder="Повторіть пароль"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Реєстрація…" : "Зареєструватись"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Вже маєте акаунт?{" "}
          <Link to="/login" className="text-teal-600 no-underline">Увійти</Link>
        </p>
      </div>
    </div>
  );
}
