import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { auth as authApi } from "../api/auth";
import { notifyError } from "../api/client";

export function EmailVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email: string | undefined = (location.state as { email?: string })?.email;

  const { completeRegistration } = useAuth();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCooldown]);

  const code = digits.join("");

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      e.preventDefault();
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || !email) return;
    setSubmitting(true);
    try {
      await completeRegistration(email, code);
      navigate("/");
    } catch (err) {
      notifyError(err);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setResendCooldown(60);
    } catch (err) {
      notifyError(err);
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-teal-600" />
          </div>
          <h1>Підтвердіть email</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ми надіслали 6-значний код на{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={submit} className="bg-white border border-border rounded-2xl p-6 space-y-6">
          <div>
            <label className="text-sm text-muted-foreground mb-3 block text-center">
              Введіть код підтвердження
            </label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-14 text-center text-xl font-bold bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">Код дійсний протягом 10 хвилин</p>
          </div>

          <button
            type="submit"
            disabled={submitting || code.length !== 6}
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Перевірка…" : "Підтвердити"}
          </button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Не отримали код?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || resendCooldown > 0}
              className="text-sm text-teal-600 hover:underline disabled:text-muted-foreground disabled:no-underline mt-1"
            >
              {resendCooldown > 0
                ? `Надіслати повторно (${resendCooldown}с)`
                : resending
                  ? "Надсилання…"
                  : "Надіслати повторно"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
