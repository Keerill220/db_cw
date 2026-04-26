import { Link, useLocation, useNavigate } from "react-router";
import { Music } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../api/client";

interface FormData { email: string; password: string; }

export function LoginPage() {
  const { loginClient, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [mode, setMode] = useState<"client" | "admin">("client");
  const [pending, setPending] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setPending(true);
    try {
      if (mode === "client") await loginClient(data.email, data.password);
      else await loginAdmin(data.email, data.password);
      toast.success("Вхід виконано");
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-6 h-6 text-teal-600" />
          </div>
          <h1>Вхід</h1>
          <p className="text-sm text-muted-foreground mt-1">Увійдіть у свій акаунт SoundSpace</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-1 p-1 bg-gray-50 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("client")}
              className={`py-2 text-sm rounded-md transition-colors ${mode === "client" ? "bg-white shadow-sm text-teal-700" : "text-muted-foreground"}`}
            >
              Клієнт
            </button>
            <button
              type="button"
              onClick={() => setMode("admin")}
              className={`py-2 text-sm rounded-md transition-colors ${mode === "admin" ? "bg-white shadow-sm text-teal-700" : "text-muted-foreground"}`}
            >
              Адміністратор
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                {...register("email", { required: "Введіть email" })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Пароль</label>
              <input
                type="password"
                {...register("password", { required: "Введіть пароль", minLength: { value: 6, message: "Мінімум 6 символів" } })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="********"
              />
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {pending ? "Вхід…" : "Увійти"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Немає акаунту?{" "}
          <Link to="/register" className="text-teal-600 no-underline">Зареєструватись</Link>
        </p>
      </div>
    </div>
  );
}
