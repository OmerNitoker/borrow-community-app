import { Loader2 } from "lucide-react";

function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 text-slate-950">
      <Loader2 className="animate-spin text-teal-700" size={32} />
    </main>
  );
}

export default LoadingScreen;
