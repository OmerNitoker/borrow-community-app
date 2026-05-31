import { Edit, EyeOff, Loader2, Plus, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getMyItems, hideItem, updateItem } from "../api/itemApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getItemImageUrl } from "../utils/itemImages.js";

function ProfilePage() {
  const { user } = useAuth();
  const { memberships } = useOutletContext();
  const approvedMemberships = memberships.filter((membership) => membership.status === "approved");
  const [items, setItems] = useState([]);
  const [activeCountsByCommunity, setActiveCountsByCommunity] = useState({});
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  async function loadItems() {
    const data = await getMyItems();
    setItems(data.items || []);
    setActiveCountsByCommunity(data.activeCountsByCommunity || {});
  }

  useEffect(() => {
    loadItems()
      .catch((err) => setError(err.message))
      .finally(() => setIsLoadingItems(false));
  }, []);

  async function toggleItem(item) {
    setBusyId(item.id);
    setError("");

    try {
      if (item.isActive) {
        await hideItem(item.id);
      } else {
        await updateItem(item.id, { isActive: true });
      }

      await loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-sm font-semibold text-teal-700">פרופיל אישי</p>
      <h1 className="mt-2 text-4xl font-bold">{user.name}</h1>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">פרטי משתמש</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <ProfileRow label="אימייל" value={user.email} />
            <ProfileRow label="טלפון" value={user.phone} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">הקהילות שלי</h2>
            {approvedMemberships[0] ? (
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                to={`/communities/${approvedMemberships[0].community.id}/items/new`}
              >
                <Plus size={16} />
                הוספת פריט
              </Link>
            ) : null}
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {memberships.length === 0 ? (
              <p className="py-4 text-slate-600">עדיין לא הצטרפת לקהילות.</p>
            ) : (
              memberships.map((membership) => (
                <div key={membership.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-bold">{membership.community.name}</p>
                    <p className="text-sm text-slate-600">
                      {membership.role === "admin" ? "מנהל" : "חבר"} · {activeCountsByCommunity[membership.community.id] || 0} פריטים פעילים
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {membership.status === "approved" ? "מאושר" : "ממתין"}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">הפריטים שלי</h2>
        {error ? <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {isLoadingItems ? (
          <div className="mt-4 flex items-center gap-2 text-slate-600">
            <Loader2 className="animate-spin" size={18} />
            טוען פריטים
          </div>
        ) : items.length === 0 ? (
          <p className="mt-3 text-slate-600">עדיין לא העלית פריטים.</p>
        ) : (
          <div className="mt-4 divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <img alt="" className="h-16 w-16 rounded-md object-cover" src={getItemImageUrl(item)} />
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-slate-600">{item.communityName || item.category} · {item.category}</p>
                    <p className="text-sm font-semibold">{getItemStatusLabel(item)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100"
                    to={`/communities/${item.community}/items/${item.id}/edit`}
                  >
                    <Edit size={16} />
                    עריכה
                  </Link>
                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                    disabled={busyId === item.id || item.hiddenByAdmin}
                    onClick={() => toggleItem(item)}
                    type="button"
                  >
                    {busyId === item.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : item.isActive ? (
                      <EyeOff size={16} />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    {item.isActive ? "הסתרה" : "הפעלה"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function getItemStatusLabel(item) {
  if (item.hiddenByAdmin) {
    return "הוסתר על ידי מנהל";
  }

  return item.isActive ? "פעיל" : "לא פעיל";
}

function ProfileRow({ label, value }) {
  return (
    <div>
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-950">{value}</dd>
    </div>
  );
}

export default ProfilePage;
