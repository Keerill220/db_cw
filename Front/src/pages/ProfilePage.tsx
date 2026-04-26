import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { auth as authApi } from "../api/auth";
import { notifyError } from "../api/client";
import { toast } from "sonner";
import type { ChangePassword, ProfileUpdate } from "../api/types";

export function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const [pendingProfile, setPendingProfile] = useState(false);
  const [pendingPwd, setPendingPwd] = useState(false);

  const profileForm = useForm<ProfileUpdate>({
    defaultValues: { firstName: "", lastName: "", phone: "" },
  });
  const pwdForm = useForm<ChangePassword>();

  useEffect(() => {
    if (user) {
      profileForm.reset({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || "" });
    }
  }, [user, profileForm]);

  const saveProfile = async (data: ProfileUpdate) => {
    setPendingProfile(true);
    try {
      await authApi.updateProfile(data);
      await refreshMe();
      toast.success("Профіль оновлено");
    } catch (e) { notifyError(e); }
    finally { setPendingProfile(false); }
  };

  const changePwd = async (data: ChangePassword) => {
    setPendingPwd(true);
    try {
      await authApi.changePassword(data);
      toast.success("Пароль змінено");
      pwdForm.reset();
    } catch (e) { notifyError(e); }
    finally { setPendingPwd(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1>Профіль</h1>
        <p className="text-sm text-muted-foreground mt-1">Керування персональними даними</p>
      </div>

      <section className="bg-white border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <User className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2>Особисті дані</h2>
            <p className="text-xs text-muted-foreground">{user?.email} · {user?.role}</p>
          </div>
        </div>
        <form onSubmit={profileForm.handleSubmit(saveProfile)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Ім'я</label>
            <input {...profileForm.register("firstName", { required: true })} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Прізвище</label>
            <input {...profileForm.register("lastName", { required: true })} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-muted-foreground mb-1 block">Телефон</label>
            <input {...profileForm.register("phone")} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={pendingProfile} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
              {pendingProfile ? "Збереження…" : "Зберегти"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-amber-600" />
          </div>
          <h2>Зміна паролю</h2>
        </div>
        <form onSubmit={pwdForm.handleSubmit(changePwd)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Поточний пароль</label>
            <input type="password" {...pwdForm.register("currentPassword", { required: true })} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Новий пароль</label>
            <input type="password" {...pwdForm.register("newPassword", { required: true, minLength: 6 })} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={pendingPwd} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
              {pendingPwd ? "Збереження…" : "Змінити пароль"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
