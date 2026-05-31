import { Sparkles } from "lucide-react";

function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 ring-1 ring-teal-100">
      <Sparkles size={14} />
      מצב דמו
    </span>
  );
}

export default DemoBadge;
