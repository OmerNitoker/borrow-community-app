import { Boxes, Image, Loader2, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DemoEntryActions from "../components/DemoEntryActions.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const highlights = [
  {
    icon: Users,
    title: "קהילות פרטיות",
    text: "יוצרים קהילה, משתפים קוד הצטרפות ובוחרים אם נדרש אישור מנהל."
  },
  {
    icon: Boxes,
    title: "פריטים אמיתיים",
    text: "כל פריט כולל מצב, קטגוריה, הערות ותמונות בהמשך דרך Cloudinary."
  },
  {
    icon: ShieldCheck,
    title: "אמון לפני פרטי קשר",
    text: "אם השרת לא מחזיר פרטי קשר, הממשק מציג אותם כנעולים ומטושטשים."
  }
];

function AuthPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-semibold text-teal-700">Borrow</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-6xl">
            שיתוף והשאלת ציוד בתוך קהילות פרטיות
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
            אפליקציה קהילתית שבה חברים מעלים פריטים להשאלה, מצטרפים לקהילות סגורות,
            ומקבלים פרטי קשר רק אחרי שהם עומדים בכללי האמון.
          </p>

          <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <img
              alt=""
              className="h-56 w-full object-cover"
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
            />
            <div className="flex items-center gap-3 p-4">
              <Image className="text-teal-700" size={22} />
              <p className="text-sm leading-6 text-slate-700">
                דמו מוכן מציג קהילה פעילה, פריטים ותהליך הרשאות מלא לפרטי קשר.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <Icon className="text-teal-700" size={26} />
                  <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
                  <p className="mt-2 leading-7 text-slate-600">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>

        <AuthPanel />
      </section>
    </main>
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="grid grid-cols-2 rounded-md bg-slate-100 p-1">
        <button
          className={`rounded px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`}
          onClick={() => setMode("login")}
          type="button"
        >
          התחברות
        </button>
        <button
          className={`rounded px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-white text-slate-950 shadow-sm" : "text-slate-600"}`}
          onClick={() => setMode("register")}
          type="button"
        >
          הרשמה
        </button>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "register" ? (
          <>
            <TextInput label="שם מלא" name="name" value={form.name} onChange={updateField} />
            <TextInput label="טלפון" name="phone" value={form.phone} onChange={updateField} />
          </>
        ) : null}

        <TextInput label="אימייל" name="email" type="email" value={form.email} onChange={updateField} />
        <TextInput label="סיסמה" name="password" type="password" value={form.password} onChange={updateField} />

        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={Boolean(isSubmitting)}
          type="submit"
        >
          {isSubmitting === "auth" ? <Loader2 className="animate-spin" size={18} /> : null}
          {mode === "login" ? "התחברות" : "יצירת חשבון"}
        </button>
      </form>

      <div className="my-5 h-px bg-slate-200" />

      <div className="rounded-md bg-slate-50 p-4">
        <DemoEntryActions isSubmitting={isSubmitting} onSelect={handleDemo} />
      </div>
    </section>
  );
}

function TextInput({ label, name, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-slate-950 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
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
