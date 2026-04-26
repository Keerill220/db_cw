import { Link, useNavigate } from "react-router";
import { Music } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../api/client";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setPending(true);
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      toast.success("Акаунт створено!");
      navigate("/", { replace: true });
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
          <h1>Реєстрація</h1>
          <p className="text-sm text-muted-foreground mt-1">Створіть акаунт клієнта SoundSpace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ім'я" error={errors.firstName?.message}>
              <input {...register("firstName", { required: "Обов'язкове" })} className="input" />
            </Field>
            <Field label="Прізвище" error={errors.lastName?.message}>
              <input {...register("lastName", { required: "Обов'язкове" })} className="input" />
            </Field>
          </div>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" {...register("email", { required: "Введіть email" })} className="input" />
          </Field>
          <Field label="Телефон (опціонально)">
            <input {...register("phone")} className="input" placeholder="+380…" />
          </Field>
          <Field label="Пароль" error={errors.password?.message}>
            <input type="password" {...register("password", { required: "Введіть пароль", minLength: { value: 6, message: "Мінімум 6 символів" } })} className="input" />
          </Field>
          <Field label="Підтвердіть пароль" error={errors.confirmPassword?.message}>
            <input type="password" {...register("confirmPassword", { validate: (v) => v === password || "Паролі не співпадають" })} className="input" />
          </Field>
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {pending ? "Створення…" : "Зареєструватись"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Вже маєте акаунт? <Link to="/login" className="text-teal-600 no-underline">Увійти</Link>
        </p>
      </div>
      <style>{`.input { width: 100%; padding: 0.625rem 0.75rem; background: #f9fafb; border: 1px solid var(--color-border); border-radius: 0.5rem; font-size: 0.875rem; outline: none; }
        .input:focus { box-shadow: 0 0 0 2px rgb(20 184 166 / 0.5); }`}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
