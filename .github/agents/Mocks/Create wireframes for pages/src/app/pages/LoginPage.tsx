import { Link } from "react-router";
import { Music } from "lucide-react";

export function LoginPage() {
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

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="you@example.com" readOnly />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Пароль</label>
            <input type="password" className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="********" readOnly />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-teal-600" readOnly />
              Запам'ятати мене
            </label>
            <a href="#" className="text-teal-600 no-underline">Забули пароль?</a>
          </div>
          <button className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Увійти
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Немає акаунту?{" "}
          <Link to="/register" className="text-teal-600 no-underline">Зареєструватись</Link>
        </p>
      </div>
    </div>
  );
}