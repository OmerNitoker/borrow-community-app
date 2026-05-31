import { AlertTriangle, Loader2 } from "lucide-react";

function ConfirmDialog({
  title,
  text,
  confirmText = "אישור",
  cancelText = "ביטול",
  tone = "danger",
  isLoading = false,
  onCancel,
  onConfirm
}) {
  const confirmClass =
    tone === "danger"
      ? "bg-red-700 text-white hover:bg-red-800 disabled:bg-slate-400"
      : "bg-teal-700 text-white hover:bg-teal-800 disabled:bg-slate-400";

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/40 px-5">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <AlertTriangle className={tone === "danger" ? "text-red-700" : "text-teal-700"} size={28} />
        <h2 className="mt-4 text-2xl font-bold">{title}</h2>
        {text ? <p className="mt-3 leading-7 text-slate-700">{text}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold ${confirmClass}`}
            disabled={isLoading}
            onClick={onConfirm}
            type="button"
          >
            {isLoading ? <Loader2 className="animate-spin" size={17} /> : null}
            {confirmText}
          </button>
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
            disabled={isLoading}
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
