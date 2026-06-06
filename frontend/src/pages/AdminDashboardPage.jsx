import { ArrowLeft, Check, EyeOff, Loader2, RotateCcw, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCommunityOverview, updateCommunitySettings } from "../api/adminApi.js";
import { hideItem, updateItem } from "../api/itemApi.js";
import { approveMembership, rejectMembership } from "../api/membershipApi.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import JoinCodeDisplay from "../components/JoinCodeDisplay.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { foundItemsText } from "../utils/hebrewText.js";
import { getItemImageUrl } from "../utils/itemImages.js";

const ADMIN_ITEMS_PAGE_SIZE = 12;

function AdminDashboardPage() {
  const { communityId } = useParams();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [itemFilters, setItemFilters] = useState({ itemSearch: "", ownerSearch: "" });
  const [debouncedItemFilters, setDebouncedItemFilters] = useState(itemFilters);
  const [itemLimit, setItemLimit] = useState(ADMIN_ITEMS_PAGE_SIZE);
  const [isItemsRefreshing, setIsItemsRefreshing] = useState(false);

  async function loadOverview() {
    setError("");

    if (overview) {
      setIsItemsRefreshing(true);
    }

    try {
      const data = await getCommunityOverview(communityId, {
        ...debouncedItemFilters,
        itemLimit
      });
      setOverview(data);
    } finally {
      setIsItemsRefreshing(false);
    }
  }

  useEffect(() => {
    loadOverview().catch((err) => setError(err.message));
  }, [communityId, debouncedItemFilters, itemLimit]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedItemFilters(itemFilters);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [itemFilters]);

  function updateItemFilter(key, value) {
    setItemFilters((current) => ({ ...current, [key]: value }));
    setItemLimit(ADMIN_ITEMS_PAGE_SIZE);
  }

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
      await hideItem(itemId, { asAdmin: true });
      await loadOverview();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function handleReactivateItem(itemId) {
    setBusyId(itemId);

    try {
      await updateItem(itemId, { isActive: true });
      await loadOverview();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function handleUpdateApprovalSetting(requiredApproval) {
    setBusyId("community-settings");

    try {
      await updateCommunitySettings(communityId, { requiredApproval });
      await loadOverview();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  }

  async function runConfirmedAction() {
    if (!confirmAction) {
      return;
    }

    if (confirmAction.type === "membership") {
      await updateRequest(confirmAction.action, confirmAction.id);
    }

    if (confirmAction.type === "hide-item") {
      await handleHideItem(confirmAction.id);
    }

    if (confirmAction.type === "reactivate-item") {
      await handleReactivateItem(confirmAction.id);
    }

    if (confirmAction.type === "community-settings") {
      await handleUpdateApprovalSetting(confirmAction.requiredApproval);
    }

    setConfirmAction(null);
  }

  if (error) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-5 sm:py-10">
        <p className="rounded-lg border border-red-100 bg-red-50 p-6 text-red-700">{error}</p>
      </section>
    );
  }

  if (!overview) {
    return <LoadingScreen />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">ניהול קהילה</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">דשבורד מנהל</h1>
        </div>
        <Link
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100 sm:w-auto"
          to={`/communities/${communityId}`}
        >
          מעבר לדף הקהילה
          <ArrowLeft size={16} />
        </Link>
      </div>

      {overview.community ? (
        <section className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-4 shadow-sm sm:p-5">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-teal-700">קוד הצטרפות לקהילה</p>
            <h2 className="mt-1 text-xl font-bold">{overview.community.name}</h2>
            <p className="mt-2 text-sm text-slate-600">אפשר לשתף את הקוד עם אנשים שרוצים להצטרף לקהילה.</p>
          </div>
          <JoinCodeDisplay
            className="mt-4 max-w-3xl"
            joinCode={overview.community.joinCode}
            requiredApproval={overview.community.requiredApproval}
          />
          <JoinApprovalSetting
            busyId={busyId}
            community={overview.community}
            onConfirmAction={setConfirmAction}
          />
        </section>
      ) : null}

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="חברים" value={overview.stats.memberCount} />
        <Stat label="בקשות" value={overview.stats.pendingCount} />
        <Stat label="פריטים פעילים" value={overview.stats.activeItemCount} />
        <Stat label="כל הפריטים" value={overview.stats.totalItemCount} />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
                <div className="grid gap-2 sm:flex">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:bg-slate-400"
                    disabled={Boolean(busyId)}
                    onClick={() =>
                      setConfirmAction({
                        type: "membership",
                        action: "approve",
                        id: membership.id,
                        title: "לאשר את בקשת ההצטרפות?",
                        text: `${membership.user.name} יקבל גישה לקהילה ולפריטים הפעילים בה.`,
                        confirmText: "כן, לאשר",
                        tone: "success"
                      })
                    }
                    type="button"
                  >
                    {busyId === membership.id ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                    אישור
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:text-red-300"
                    disabled={Boolean(busyId)}
                    onClick={() =>
                      setConfirmAction({
                        type: "membership",
                        action: "reject",
                        id: membership.id,
                        title: "לדחות את בקשת ההצטרפות?",
                        text: `${membership.user.name} לא יקבל גישה לקהילה בשלב זה.`,
                        confirmText: "כן, לדחות"
                      })
                    }
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
          <div className="mb-4 grid gap-3 md:grid-cols-2">
            <label className="relative block">
              <Search className="absolute right-3 top-3.5 text-slate-400" size={17} />
              <input
                className="w-full rounded-md border border-slate-300 py-3 pl-3 pr-10 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                onChange={(event) => updateItemFilter("itemSearch", event.target.value)}
                placeholder="חיפוש לפי שם פריט"
                value={itemFilters.itemSearch}
              />
            </label>
            <label className="relative block">
              <Search className="absolute right-3 top-3.5 text-slate-400" size={17} />
              <input
                className="w-full rounded-md border border-slate-300 py-3 pl-3 pr-10 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                onChange={(event) => updateItemFilter("ownerSearch", event.target.value)}
                placeholder="חיפוש לפי שם משתמש"
                value={itemFilters.ownerSearch}
              />
            </label>
          </div>
          <div className="mb-2 min-h-5 text-sm text-slate-500">
            {isItemsRefreshing ? "מעדכן רשימת פריטים..." : foundItemsText(overview.itemsPagination.totalItems)}
          </div>
          {overview.items.length === 0 ? (
            <p className="py-3 text-slate-600">לא נמצאו פריטים שמתאימים לחיפוש.</p>
          ) : (
            <>
              {overview.items.map((item) => (
                <AdminItemRow
                  busyId={busyId}
                  item={item}
                  key={item.id}
                  onConfirmAction={setConfirmAction}
                />
              ))}

              {overview.itemsPagination.hasMore ? (
                <button
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                  disabled={isItemsRefreshing}
                  onClick={() => setItemLimit((current) => current + ADMIN_ITEMS_PAGE_SIZE)}
                  type="button"
                >
                  {isItemsRefreshing ? <Loader2 className="animate-spin" size={16} /> : null}
                  טען עוד פריטים
                </button>
              ) : null}
            </>
          )}
        </Panel>
      </section>

      {confirmAction ? (
        <ConfirmDialog
          confirmText={confirmAction.confirmText}
          isLoading={busyId === confirmAction.id || busyId === "community-settings"}
          onCancel={() => setConfirmAction(null)}
          onConfirm={runConfirmedAction}
          text={confirmAction.text}
          title={confirmAction.title}
          tone={confirmAction.tone}
        />
      ) : null}
    </section>
  );
}

function JoinApprovalSetting({ busyId, community, onConfirmAction }) {
  const nextRequiredApproval = !community.requiredApproval;

  return (
    <div className="mt-5 max-w-3xl border-t border-teal-100 pt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold">הגדרות הצטרפות</h3>
          <p className="mt-2 leading-7 text-slate-700">
            {community.requiredApproval
              ? "משתמשים שיצטרפו עם הקוד ימתינו לאישור מנהל לפני שיוכלו לראות את פריטי הקהילה."
              : "משתמשים שיזינו את הקוד יצטרפו לקהילה באופן מיידי."}
          </p>
        </div>
        <button
          aria-pressed={community.requiredApproval}
          className={`inline-flex w-full items-center justify-center gap-3 rounded-md border px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
            community.requiredApproval
              ? "border-teal-700 bg-teal-700 text-white hover:bg-teal-800"
              : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
          }`}
          disabled={busyId === "community-settings"}
          onClick={() =>
            onConfirmAction({
              type: "community-settings",
              id: "community-settings",
              requiredApproval: nextRequiredApproval,
              title: nextRequiredApproval ? "להפעיל אישור מנהל להצטרפות?" : "לבטל אישור מנהל להצטרפות?",
              text: nextRequiredApproval
                ? "משתמשים חדשים שיצטרפו עם קוד הקהילה ימתינו לאישור מנהל לפני שיוכלו לראות את פריטי הקהילה."
                : "משתמשים חדשים שיזינו את קוד הקהילה יצטרפו באופן מיידי ויוכלו לראות את פריטי הקהילה.",
              confirmText: nextRequiredApproval ? "כן, להפעיל אישור" : "כן, לבטל אישור",
              tone: nextRequiredApproval ? "success" : "danger"
            })
          }
          type="button"
        >
          {busyId === "community-settings" ? <Loader2 className="animate-spin" size={16} /> : null}
          {community.requiredApproval ? "דורש אישור מנהל" : "הצטרפות מיידית"}
        </button>
      </div>
    </div>
  );
}

function AdminItemRow({ busyId, item, onConfirmAction }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <img alt="" className="h-14 w-14 rounded-md object-cover object-center" src={getItemImageUrl(item, "thumbnail")} />
        <div className="min-w-0">
          <p className="font-bold">{item.title}</p>
          <p className="text-sm text-slate-600">
            {item.owner.name} · {item.category} · <ItemStatus item={item} />
          </p>
        </div>
      </div>
      {item.isActive ? (
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:text-red-300 sm:w-auto"
          disabled={Boolean(busyId)}
          onClick={() =>
            onConfirmAction({
              type: "hide-item",
              id: item.id,
              title: "להסתיר את הפריט?",
              text: `${item.title} יוסתר מהקטלוג. אם הפריט הוסתר על ידי מנהל, רק מנהל קהילה יוכל להחזיר אותו לפעילות.`,
              confirmText: "כן, להסתיר"
            })
          }
          type="button"
        >
          {busyId === item.id ? <Loader2 className="animate-spin" size={16} /> : <EyeOff size={16} />}
          הסתרה
        </button>
      ) : item.hiddenByAdmin ? (
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100 disabled:text-slate-400 sm:w-auto"
          disabled={Boolean(busyId)}
          onClick={() =>
            onConfirmAction({
              type: "reactivate-item",
              id: item.id,
              title: "להחזיר את הפריט לפעילות?",
              text: `${item.title} יחזור להופיע בקטלוג הקהילה.`,
              confirmText: "כן, להחזיר",
              tone: "success"
            })
          }
          type="button"
        >
          {busyId === item.id ? <Loader2 className="animate-spin" size={16} /> : <RotateCcw size={16} />}
          הפעלה
        </button>
      ) : null}
    </div>
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
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default AdminDashboardPage;
