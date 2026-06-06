import { ArrowLeft, Loader2, ShieldCheck, UserRound } from "lucide-react";

const demoOptions = [
  {
    mode: "member",
    title: "כניסה כחבר רגיל",
    text: "התנסות בממשק המשתמש, צפייה בפרטי הדמו, הוספת פריט.",
    icon: UserRound,
    className: "border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
  },
  {
    mode: "admin",
    title: "כניסה כמנהל קהילה",
    text: "התנסות בניהול פריטי ומשתמשי הקהילה.",
    icon: ShieldCheck,
    className: "border-teal-700 bg-teal-700 text-white hover:bg-teal-800"
  }
];

function DemoEntryActions({ isSubmitting = "", onSelect }) {
  return (
    <div>
      <h3 className="text-lg font-bold">רוצים לבחון את האפליקציה?</h3>
      <p className="mt-2 leading-7 text-slate-600">
        היכנסו לקהילת דמו עם משתמשים, פריטים ונתונים לדוגמה.
      </p>
      <div className="mt-4 grid gap-3">
        {demoOptions.map((option) => {
          const Icon = option.icon;
          const isLoading = isSubmitting === `demo-${option.mode}`;

          return (
            <button
              className={`flex min-h-20 items-center justify-between gap-3 rounded-md border px-3 py-3 text-right transition disabled:cursor-not-allowed disabled:opacity-55 sm:px-4 ${option.className}`}
              disabled={Boolean(isSubmitting)}
              key={option.mode}
              onClick={() => onSelect(option.mode)}
              type="button"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-950/5">
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Icon size={20} />}
                </span>
                <span>
                  <span className="block text-sm font-bold">{option.title}</span>
                  <span className="mt-1 block text-xs leading-5 opacity-80">{option.text}</span>
                </span>
              </span>
              <ArrowLeft className="shrink-0" size={18} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DemoEntryActions;
