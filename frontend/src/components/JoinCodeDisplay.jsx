import { Check, Copy } from "lucide-react";
import { useState } from "react";

function JoinCodeDisplay({ joinCode, requiredApproval, className = "" }) {
  const [copyStatus, setCopyStatus] = useState("");

  async function copyJoinCode() {
    if (!joinCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(joinCode);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus(""), 1800);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus(""), 2200);
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <code className="inline-flex min-h-14 flex-1 items-center justify-center rounded-md border border-teal-200 bg-white px-5 py-3 text-center text-3xl font-bold tracking-widest text-teal-800 shadow-sm">
          {joinCode}
        </code>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={!joinCode}
          onClick={copyJoinCode}
          type="button"
        >
          {copyStatus === "copied" ? <Check size={17} /> : <Copy size={17} />}
          {copyStatus === "copied" ? "הועתק" : "העתקת קוד"}
        </button>
      </div>

      {copyStatus === "failed" ? (
        <p className="mt-2 text-sm font-semibold text-red-700">לא הצלחנו להעתיק אוטומטית. אפשר לסמן ולהעתיק את הקוד ידנית.</p>
      ) : null}

      <p className="mt-4 leading-7 text-slate-700">
        {requiredApproval
          ? "מאחר שהפעלת אישור מנהל, משתמשים שיצטרפו עם הקוד ימתינו לאישור שלך לפני שיוכלו לראות את פריטי הקהילה."
          : "משתמשים שיזינו את הקוד יצטרפו לקהילה באופן מיידי."}
      </p>
    </div>
  );
}

export default JoinCodeDisplay;
