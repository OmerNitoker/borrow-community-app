import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-5 text-center text-slate-950">
      <div>
        <p className="text-sm font-semibold text-teal-700">404</p>
        <h1 className="mt-2 text-3xl font-bold">העמוד לא נמצא</h1>
        <Link className="mt-6 inline-flex rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white" to="/">
          חזרה לאפליקציה
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
