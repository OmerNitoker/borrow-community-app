import {
  ArrowLeft,
  Boxes,
  CheckCircle2,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const trustSignals = [
  { value: "3", label: "פריטים פעילים לפתיחת פרטי קשר" },
  { value: "2", label: "מסלולי דמו למגייסים" },
  { value: "100%", label: "קהילות פרטיות והרשאות בצד השרת" }
];

const highlights = [
  {
    icon: Users,
    title: "קהילות סגורות עם קוד",
    text: "יוצרים קהילה פרטית, משתפים קוד הצטרפות, ובוחרים אם נדרש אישור מנהל לפני הכניסה."
  },
  {
    icon: Boxes,
    title: "קטלוג פריטים אמיתי",
    text: "חברי הקהילה מעלים פריטים עם קטגוריה, מצב, הערות ותמונות, כדי שיהיה קל להבין מה מתאים להשאלה."
  },
  {
    icon: ShieldCheck,
    title: "מנגנון הוגנות מובנה",
    text: "פרטי קשר נפתחים רק לחברים שתורמים לקהילה, והבדיקה נשארת מאובטחת בצד השרת."
  }
];

const demoOptions = [
  {
    mode: "member",
    title: "כניסה כחבר רגיל",
    text: "מתחילים עם 2 פריטים פעילים ורואים את מנגנון פתיחת פרטי הקשר.",
    icon: UserRound,
    tone: "light"
  },
  {
    mode: "admin",
    title: "כניסה כמנהל קהילה",
    text: "בודקים בקשות הצטרפות, קוד קהילה וכלי ניהול פריטים.",
    icon: ShieldCheck,
    tone: "primary"
  }
];

function AuthPage() {
  return (
    <main className="min-h-screen bg-stone-100 text-slate-950">
      <section
        className="relative min-h-screen overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.66), rgba(15, 23, 42, 0.28)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=82')"
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-100 to-transparent" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-6 lg:py-8">
          <header className="flex items-center justify-between">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white shadow-sm backdrop-blur">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-teal-400 text-slate-950">
                <Boxes size={17} />
              </span>
              <span className="text-sm font-bold">Borrow</span>
            </div>
            <div className="hidden rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur sm:block">
              פרויקט Full Stack קהילתי
            </div>
          </header>

          <div className="grid flex-1 items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            <HeroContent />
            <AuthPanel />
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroContent() {
  return (
    <section className="max-w-3xl text-white">
      <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/30 bg-teal-300/15 px-4 py-2 text-sm font-semibold text-teal-50 backdrop-blur">
        <Sparkles size={16} />
        אפליקציה להשאלת ציוד בתוך קהילות פרטיות
      </div>

      <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
        משאילים יותר, קונים פחות, ובונים קהילה שסומכת על עצמה.
      </h1>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
        Borrow עוזרת לקהילות קטנות לשתף ציוד בצורה מסודרת: מצטרפים עם קוד, מעלים פריטים,
        ופותחים פרטי קשר רק אחרי תרומה אמיתית לקהילה.
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {trustSignals.map((signal) => (
          <div key={signal.label} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-2xl font-bold text-teal-200">{signal.value}</p>
            <p className="mt-1 text-sm leading-6 text-slate-100">{signal.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-3 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur">
              <Icon className="text-teal-200" size={22} />
              <h2 className="mt-3 text-base font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-100">{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AuthPanel() {
  const { login, register, startDemo } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting("auth");

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting("");
    }
  }

  async function handleDemo(mode) {
    setError("");
    setIsSubmitting(`demo-${mode}`);

    try {
      const data = await startDemo(mode);
      navigate(`/communities/${data.community.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting("");
    }
  }

  return (
    <section className="rounded-lg border border-white/70 bg-white/95 p-5 shadow-2xl shadow-slate-950/25 backdrop-blur sm:p-7">
      <div>
        <p className="text-sm font-semibold text-teal-700">כניסה למערכת</p>
        <h2 className="mt-2 text-2xl font-bold">התחילו מקהילה אמיתית או מדמו מוכן</h2>
        <p className="mt-2 leading-7 text-slate-600">
          הרשמה מהירה למשתמשים אמיתיים, ודמו מסודר למגייסים שרוצים לראות את כל הלוגיקה בפעולה.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 rounded-md bg-slate-100 p-1">
        <button
          className={`rounded px-4 py-2.5 text-sm font-semibold transition ${
            mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
          }`}
          onClick={() => setMode("login")}
          type="button"
        >
          התחברות
        </button>
        <button
          className={`rounded px-4 py-2.5 text-sm font-semibold transition ${
            mode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-950"
          }`}
          onClick={() => setMode("register")}
          type="button"
        >
          הרשמה
        </button>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="שם מלא" name="name" value={form.name} onChange={updateField} />
            <TextInput label="טלפון" name="phone" value={form.phone} onChange={updateField} />
          </div>
        ) : null}

        <TextInput label="אימייל" name="email" type="email" value={form.email} onChange={updateField} />
        <TextInput label="סיסמה" name="password" type="password" value={form.password} onChange={updateField} />

        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={Boolean(isSubmitting)}
          type="submit"
        >
          {isSubmitting === "auth" ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
          {mode === "login" ? "התחברות" : "יצירת חשבון"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-bold text-slate-400">או כניסה לדמו</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <LandingDemoActions isSubmitting={isSubmitting} onSelect={handleDemo} />
    </section>
  );
}

function LandingDemoActions({ isSubmitting = "", onSelect }) {
  return (
    <section className="rounded-lg border border-teal-100 bg-teal-50/80 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-teal-700 shadow-sm">
          <LockKeyhole size={18} />
        </span>
        <div>
          <h3 className="text-lg font-bold">רוצים לבחון את האפליקציה?</h3>
          <p className="mt-1 leading-7 text-slate-600">
            היכנסו לקהילת דמו עם משתמשים, פריטים ונתונים לדוגמה.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {demoOptions.map((option) => {
          const Icon = option.icon;
          const isLoading = isSubmitting === `demo-${option.mode}`;
          const isPrimary = option.tone === "primary";

          return (
            <button
              className={`group flex min-h-20 items-center justify-between gap-3 rounded-md border px-4 py-3 text-right transition focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-55 ${
                isPrimary
                  ? "border-teal-700 bg-teal-700 text-white shadow-sm hover:bg-teal-800"
                  : "border-slate-200 bg-white text-slate-950 hover:border-teal-200 hover:bg-white"
              }`}
              disabled={Boolean(isSubmitting)}
              key={option.mode}
              onClick={() => onSelect(option.mode)}
              type="button"
            >
              <span className="flex items-center gap-3">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${
                    isPrimary ? "bg-white/15" : "bg-teal-50 text-teal-700"
                  }`}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Icon size={20} />}
                </span>
                <span>
                  <span className="block text-sm font-bold">{option.title}</span>
                  <span className={`mt-1 block text-xs leading-5 ${isPrimary ? "text-teal-50" : "text-slate-600"}`}>
                    {option.text}
                  </span>
                </span>
              </span>
              <ArrowLeft className="shrink-0 transition group-hover:-translate-x-0.5" size={18} />
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-700">
        <CheckCircle2 className="text-teal-700" size={17} />
        הדמו ניתן לאיפוס ומציג גם חוויית חבר וגם חוויית מנהל.
      </div>
    </section>
  );
}

function TextInput({ label, name, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
        name={name}
        onChange={onChange}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

export default AuthPage;
