import { Check, EyeOff, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommunityOverview } from "../api/adminApi.js";
import { approveMembership, rejectMembership } from "../api/membershipApi.js";
import { hideItem } from "../api/itemApi.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { getItemImageUrl } from "../utils/itemImages.js";

function AdminDashboardPage() {
  const { communityId } = useParams();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function loadOverview() {
    setError("");
    const data = await getCommunityOverview(communityId);
    setOverview(data);
  }

  useEffect(() => {
    loadOverview().catch((err) => setError(err.message));
  }, [communityId]);

  async function updateRequest(action, membershipId) {
    setBusyId(membershipId);

    try {
      if (action === "approve") {
        await approveMembership(membershipId);
      } else {
        await rejectMembership(membershipId);
      }

      await loadOverview();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function handleHideItem(itemId) {
    setBusyId(itemId);

    try {
      await hideItem(itemId);
      await loadOverview();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-10">
        <p className="rounded-lg border border-red-100 bg-red-50 p-6 text-red-700">{error}</p>
      </section>
    );
  }

  if (!overview) {
    return <LoadingScreen />;
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-sm font-semibold text-teal-700">ניהול קהילה</p>
      <h1 className="mt-2 text-4xl font-bold">דשבורד מנהל</h1>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Stat label="חברים" value={overview.stats.memberCount} />
        <Stat label="בקשות" value={overview.stats.pendingCount} />
        <Stat label="פריטים פעילים" value={overview.stats.activeItemCount} />
        <Stat label="כל הפריטים" value={overview.stats.totalItemCount} />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">בקשות הצטרפות</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {overview.pendingMembers.length === 0 ? (
            <p className="py-4 text-slate-600">אין בקשות ממתינות כרגע.</p>
          ) : (
            overview.pendingMembers.map((membership) => (
              <div key={membership.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold">{membership.user.name}</p>
                  <p className="text-sm text-slate-600">{membership.user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400"
                    disabled={Boolean(busyId)}
                    onClick={() => updateRequest("approve", membership.id)}
                    type="button"
                  >
                    {busyId === membership.id ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                    אישור
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:text-red-300"
                    disabled={Boolean(busyId)}
                    onClick={() => updateRequest("reject", membership.id)}
                    type="button"
                  >
                    <X size={16} />
                    דחייה
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="חברי הקהילה">
          {overview.members.map((membership) => (
            <p key={membership.id} className="border-b border-slate-100 py-3">
              <span className="font-bold">{membership.user.name}</span>
              <span className="text-slate-500"> · {membership.role === "admin" ? "מנהל" : "חבר"}</span>
            </p>
          ))}
        </Panel>
        <Panel title="רשימת פריטים">
          {overview.items.length === 0 ? (
            <p className="py-3 text-slate-600">עדיין אין פריטים בקהילה.</p>
          ) : (
            overview.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 border-b border-slate-100 py-3">
                <div className="flex items-center gap-3">
                  <img alt="" className="h-14 w-14 rounded-md object-cover" src={getItemImageUrl(item)} />
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-sm text-slate-600">
                      {item.owner.name} · {item.category} · <ItemStatus item={item} />
                    </p>
                  </div>
                </div>
                {item.isActive ? (
                  <button
                    className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:text-red-300"
                    disabled={Boolean(busyId)}
                    onClick={() => handleHideItem(item.id)}
                    type="button"
                  >
                    {busyId === item.id ? <Loader2 className="animate-spin" size={16} /> : <EyeOff size={16} />}
                    הסתרה
                  </button>
                ) : null}
              </div>
            ))
          )}
        </Panel>
      </section>
    </section>
  );
}

function ItemStatus({ item }) {
  if (item.hiddenByAdmin) {
    return <span className="text-red-700">הוסתר על ידי מנהל</span>;
  }

  if (!item.isActive) {
    return <span className="text-slate-500">לא פעיל</span>;
  }

  return <span className="text-teal-700">פעיל</span>;
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default AdminDashboardPage;
