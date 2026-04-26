import { useState } from "react";
import { User, Mail, Phone, Edit3, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../api/auth";
import { notifyError } from "../api/client";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, refreshMe, role } = useAuth();
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const [showPwd, setShowPwd] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  if (!user) return null;

  const save = async () => {
    setSaving(true);
    try {
      await auth.updateProfile({ firstName, lastName, phone: phone || null });
      await refreshMe();
      toast.success("Профіль оновлено");
      setEditing(false);
    } catch (e) {
      notifyError(e);
    } finally {
      setSaving(false);
    }
  };

  const changePwd = async () => {
    if (newPassword.length < 6) {
      toast.error("Пароль має бути не менше 6 символів");
      return;
    }
    setPwdSaving(true);
    try {
      await auth.changePassword({ currentPassword, newPassword });
      toast.success("Пароль змінено");
      setShowPwd(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (e) {
      notifyError(e);
    } finally {
      setPwdSaving(false);
    }
  };

  const cancel = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone ?? "");
    setEditing(false);
  };

  const roleLabel = role === "Client" ? "Клієнт" : role === "Owner" ? "Власник студії" : "Суперадмін";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="mb-8">Мій профіль</h1>

      {/* Avatar block */}
      <div className="bg-white border border-border rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="w-10 h-10 text-teal-600" />
          </div>
          <div className="text-center sm:text-left">
            <h2>{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-muted-foreground">{roleLabel}</p>
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-5 mb-6">
        <div className="flex items-center justify-between">
          <h3>Особиста інформація</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-sm text-teal-600 flex items-center gap-1">
              <Edit3 className="w-4 h-4" /> Редагувати
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Ім'я</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!editing}
              className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm disabled:text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Прізвище</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!editing}
              className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm disabled:text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Телефон</label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!editing}
                placeholder="+380..."
                className="w-full bg-transparent outline-none disabled:text-foreground"
              />
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              disabled={saving}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Збереження…" : "Зберегти зміни"}
            </button>
            <button
              onClick={cancel}
              className="px-6 py-2.5 border border-border text-muted-foreground rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Скасувати
            </button>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2"><Lock className="w-4 h-4" /> Безпека</h3>
          {!showPwd && (
            <button onClick={() => setShowPwd(true)} className="text-sm text-teal-600">
              Змінити пароль
            </button>
          )}
        </div>

        {showPwd && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Поточний пароль</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Новий пароль</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-border rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={changePwd}
                disabled={pwdSaving}
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {pwdSaving ? "Збереження…" : "Зберегти"}
              </button>
              <button
                onClick={() => { setShowPwd(false); setCurrentPassword(""); setNewPassword(""); }}
                className="px-6 py-2.5 border border-border text-muted-foreground rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Скасувати
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
