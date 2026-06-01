import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  KeyRound,
  Loader2,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logoUrl from "../logo.png";

const demoOptions = [
  {
    mode: "member",
    title: "כניסה כחבר רגיל",
    text: "התנסות בממשק המשתמש, צפייה בפרטי הדמו, הוספת פריט.",
    icon: UserRound,
    tone: "light"
  },
  {
    mode: "admin",
    title: "כניסה כמנהל קהילה",
    text: "התנסות בניהול פריטי ומשתמשי הקהילה.",
    icon: ShieldCheck,
    tone: "primary"
  }
];

const howItWorksSteps = [
  {
    icon: KeyRound,
    title: "נרשמים או נכנסים",
    text: "משתמש יוצר חשבון עם שם, טלפון ואימייל, או נכנס לחשבון קיים."
  },
  {
    icon: Users,
    title: "מצטרפים לקהילה",
    text: "אפשר ליצור קהילה חדשה או להצטרף לקהילה קיימת באמצעות קוד הצטרפות."
  },
  {
    icon: Plus,
    title: "מעלים פריטים",
    text: "חברי הקהילה מעלים פריטים להשאלה עם קטגוריה, מצב, הערות ותמונות."
  },
  {
    icon: Search,
    title: "מחפשים ומשאילים",
    text: "הקטלוג מאפשר לחפש, לסנן ולפתוח פרטי פריט בצורה נוחה."
  },
  {
    icon: LockKeyhole,
    title: "פרטי קשר נפתחים בהוגנות",
    text: "פרטי קשר מוצגים רק אחרי שלמשתמש יש לפחות 3 פריטים פעילים באותה קהילה."
  }
];

function AuthPage() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:py-6">
        <header className="flex items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <img alt="" className="h-12 w-12 object-contain" src={logoUrl} />
            <div>
              <p className="text-2xl font-bold leading-none">השכן</p>
              <p className="mt-1 text-sm font-semibold text-teal-700">השאלת ציוד בקהילות פרטיות</p>
            </div>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:px-4"
            onClick={() => setIsHowItWorksOpen(true)}
            type="button"
          >
            <HelpCircle size={17} />
            איך זה עובד?
          </button>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center py-5 sm:py-6">
          <section className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              השאלת פריטים בתוך הקהילה
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              יוצרים קהילה פרטית, מעלים פריטים להשאלה, ופותחים פרטי קשר לפי כללי הוגנות פשוטים.
            </p>
          </section>

          <section className="mt-6 grid w-full max-w-5xl gap-5 lg:grid-cols-2">
            <AuthPanel />
            <DemoPanel />
          </section>
        </div>
      </section>

      {isHowItWorksOpen ? <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} /> : null}
    </main>
  );
}

function AuthPanel() {
  const { login, register } = useAuth();
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

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-sm font-bold text-teal-700">חשבון אישי</p>
        <h2 className="mt-2 text-2xl font-bold">כניסה או הרשמה</h2>
        <p className="mt-2 leading-7 text-slate-600">
          התחבר כדי לעבור לקהילה שלך, או הירשם כדי ליצור קהילה חדשה ולהתחיל לשתף פריטים.
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
    </section>
  );
}

function DemoPanel() {
  const { startDemo } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

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
    <section className="rounded-xl border border-teal-100 bg-teal-50 p-5 shadow-sm sm:p-6">
      <div>
        <p className="text-sm font-bold text-teal-700">רוצים לראות איך זה עובד?</p>
        <h2 className="mt-2 text-2xl font-bold">כניסה לקהילת דמו</h2>
        <p className="mt-2 leading-7 text-slate-600">
          קהילה מוכנה עם משתמשים, פריטים, בקשות הצטרפות ומנגנון הרשאות מלא.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {demoOptions.map((option) => {
          const Icon = option.icon;
          const isLoading = isSubmitting === `demo-${option.mode}`;
          const isPrimary = option.tone === "primary";

          return (
            <button
              className={`group flex min-h-20 items-center justify-between gap-3 rounded-md border px-4 py-3 text-right transition focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-55 ${
                isPrimary
                  ? "border-teal-700 bg-teal-700 text-white shadow-sm hover:bg-teal-800"
                  : "border-slate-200 bg-white text-slate-950 hover:border-teal-200"
              }`}
              disabled={Boolean(isSubmitting)}
              key={option.mode}
              onClick={() => handleDemo(option.mode)}
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

      {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}

      <div className="mt-5 flex items-start gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold leading-6 text-slate-700">
        <CheckCircle2 className="mt-0.5 shrink-0 text-teal-700" size={17} />
        הדמו ניתן לאיפוס ומציג גם חוויית חבר רגיל וגם חוויית מנהל קהילה.
      </div>
    </section>
  );
}

function HowItWorksModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 text-right shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-teal-700">איך זה עובד?</p>
            <h2 className="mt-2 text-2xl font-bold">מהרשמה ועד השאלה בתוך הקהילה</h2>
            <p className="mt-2 leading-7 text-slate-600">
              השכן בנויה סביב קהילה פרטית, תרומה הדדית ושמירה על פרטי קשר רק למי שעומד בכללי ההוגנות.
            </p>
          </div>
          <button
            aria-label="סגירת חלון"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article key={step.title} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-white text-teal-700 shadow-sm">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-500">שלב {index + 1}</p>
                  <h3 className="mt-1 font-bold">{step.title}</h3>
                  <p className="mt-1 leading-7 text-slate-600">{step.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        <button
          className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800"
          onClick={onClose}
          type="button"
        >
          הבנתי
        </button>
      </section>
    </div>
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
