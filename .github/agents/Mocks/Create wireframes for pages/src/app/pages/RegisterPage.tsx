import { Link } from "react-router";
import { Music } from "lucide-react";

export function RegisterPage() {
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

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          {/* Role */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Тип акаунту</label>
            <div className="grid grid-cols-2 gap-2">
              <button className="px-4 py-2.5 border-2 border-teal-600 bg-teal-50 text-teal-600 rounded-lg text-sm">Клієнт</button>
              <button className="px-4 py-2.5 border border-border text-muted-foreground rounded-lg text-sm">Власник студії</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Ім'я</label>
              <input className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="Ім'я" readOnly />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Прізвище</label>
              <input className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="Прізвище" readOnly />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="you@example.com" readOnly />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Телефон</label>
            <input className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="+380..." readOnly />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Пароль</label>
            <input type="password" className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="Мінімум 8 символів" readOnly />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Підтвердження пароля</label>
            <input type="password" className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm" placeholder="Повторіть пароль" readOnly />
          </div>
          <button className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Зареєструватись
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Вже маєте акаунт?{" "}
          <Link to="/login" className="text-teal-600 no-underline">Увійти</Link>
        </p>
      </div>
    </div>
  );
}