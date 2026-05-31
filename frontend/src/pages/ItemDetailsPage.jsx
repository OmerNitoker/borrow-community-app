import { ArrowRight, Edit, EyeOff, Loader2, Phone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getItem, hideItem } from "../api/itemApi.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { getConditionLabel } from "../constants/itemOptions.js";
import { getItemImageUrl } from "../utils/itemImages.js";

function ItemDetailsPage() {
  const { communityId, itemId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getItem(itemId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [itemId]);

  async function handleDelete() {
    setIsDeleting(true);
    setError("");

    try {
      await hideItem(itemId);
      navigate(`/communities/${communityId}`);
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  }

  if (error && !data) {
    return <PageMessage title="לא ניתן להציג את הפריט" text={error} />;
  }

  if (!data) {
    return <LoadingScreen />;
  }

  const image = getItemImageUrl(data.item);
  const missingCount = Math.max(0, data.viewer.requiredActiveItemCount - data.viewer.activeItemCount);

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <Link
        className="mb-5 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"
        to={`/communities/${communityId}`}
      >
        <ArrowRight size={17} />
        חזרה לקהילה
      </Link>

      {searchParams.get("created") ? (
        <p className="mb-5 rounded-md bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
          {data.viewer.activeItemCount >= 3
            ? "איזה יופי, יש לך עכשיו גישה לפרטי הקשר בקהילה הזו."
            : `הפריט נוסף בהצלחה. ההתקדמות לפתיחת פרטי קשר: ${data.viewer.activeItemCount}/3`}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <img alt="" className="h-96 w-full object-cover" src={image} />
          {data.item.images.length > 1 ? (
            <div className="grid grid-cols-3 gap-2 p-3">
              {data.item.images.map((currentImage) => (
                <img alt="" className="h-24 rounded-md object-cover" key={currentImage.url} src={currentImage.url} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-teal-700">{data.item.category}</p>
              <h1 className="mt-2 text-4xl font-bold">{data.item.title}</h1>
              <p className="mt-2 text-sm text-slate-600">מצב: {getConditionLabel(data.item.condition)}</p>
            </div>
            {!data.item.isActive ? <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">לא פעיל</span> : null}
          </div>

          {data.item.description ? <p className="mt-6 leading-8 text-slate-700">{data.item.description}</p> : null}
          {data.item.notes ? (
            <div className="mt-5 rounded-md bg-slate-50 p-4">
              <p className="font-bold">הערות</p>
              <p className="mt-2 leading-7 text-slate-700">{data.item.notes}</p>
            </div>
          ) : null}

          {data.viewer.isOwner ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                to={`/communities/${communityId}/items/${itemId}/edit`}
              >
                <Edit size={17} />
                עריכה
              </Link>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                onClick={() => setShowConfirm(true)}
                type="button"
              >
                <Trash2 size={17} />
                מחיקה
              </button>
            </div>
          ) : (
            <ContactPanel data={data} missingCount={missingCount} communityId={communityId} />
          )}

          {error ? <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        </section>
      </div>

      {showConfirm ? (
        <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/40 px-5">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <EyeOff className="text-red-700" size={28} />
            <h2 className="mt-4 text-2xl font-bold">להסתיר את הפריט?</h2>
            <p className="mt-3 leading-7 text-slate-700">
              המחיקה לא מוחקת את הפריט לגמרי, אלא הופכת אותו ללא פעיל ומסתירה אותו מהקטלוג.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:bg-slate-400"
                disabled={isDeleting}
                onClick={handleDelete}
                type="button"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={17} /> : <Trash2 size={17} />}
                כן, להסתיר
              </button>
              <button
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100"
                onClick={() => setShowConfirm(false)}
                type="button"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ContactPanel({ data, missingCount, communityId }) {
  if (data.ownerContact) {
    return (
      <div className="mt-6 rounded-md bg-teal-50 p-4 text-teal-950">
        <p className="font-bold">פרטי קשר</p>
        <p className="mt-2">{data.ownerContact.name}</p>
        <p className="mt-1 inline-flex items-center gap-2">
          <Phone size={16} />
          {data.ownerContact.phone}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="font-bold">פרטי הקשר נעולים כרגע</p>
      <div className="mt-3 space-y-2 blur-sm select-none">
        <p>שם המשאיל: ישראל ישראלי</p>
        <p>טלפון: 050-000-0000</p>
      </div>
      <p className="mt-4 leading-7 text-slate-700">
        כדי לשמור על קהילה פעילה והוגנת, פרטי הקשר נפתחים אחרי הוספת 3 פריטים פעילים. חסרים לך עוד {missingCount} פריטים.
      </p>
      <Link
        className="mt-4 inline-flex rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        to={`/communities/${communityId}/items/new`}
      >
        הוספת פריט
      </Link>
    </div>
  );
}

function PageMessage({ title, text }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-slate-700">{text}</p>
      </div>
    </section>
  );
}

export default ItemDetailsPage;
