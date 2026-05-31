import { Lock, Plus, Search, ShieldCheck, SlidersHorizontal, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCommunity, getCommunityItems } from "../api/communityApi.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { itemCategories } from "../constants/itemOptions.js";
import { getItemImageUrl } from "../utils/itemImages.js";

function CommunityPage() {
  const { communityId } = useParams();
  const [data, setData] = useState(null);
  const [itemsData, setItemsData] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest"
  });

  useEffect(() => {
    setData(null);
    setItemsData(null);
    setError("");

    Promise.all([getCommunity(communityId), getCommunityItems(communityId, filters)])
      .then(([communityData, communityItemsData]) => {
        setData(communityData);
        setItemsData(communityItemsData);
      })
      .catch((err) => setError(err.message));
  }, [communityId, filters]);

  if (error) {
    return <PageMessage title="אין גישה לקהילה" text={error} />;
  }

  if (!data || !itemsData) {
    return <LoadingScreen />;
  }

  const isAdmin = data.membership.role === "admin";
  const accessStatus = itemsData.accessStatus;

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-5 lg:grid-cols-[1.5fr_0.8fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-teal-700">קהילה</p>
          <h1 className="mt-2 text-4xl font-bold">{data.community.name}</h1>
          {data.community.description ? <p className="mt-3 leading-8 text-slate-700">{data.community.description}</p> : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat label="חברים" value={data.stats.memberCount} />
            <Stat label="פריטים פעילים" value={data.stats.itemCount} />
            <Stat label="בקשות ממתינות" value={data.stats.pendingCount} />
          </div>
        </section>

        <section className="rounded-lg border border-teal-100 bg-teal-50 p-6 text-teal-950 shadow-sm">
          <ShieldCheck size={28} />
          <h2 className="mt-4 text-xl font-bold">סטטוס גישה לפרטי קשר</h2>
          {isAdmin ? (
            <p className="mt-2 leading-7">יש לך גישת מנהל מלאה לפרטי הקשר בקהילה זו.</p>
          ) : (
            <AccessProgress accessStatus={accessStatus} />
          )}
          <Link
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            to={`/communities/${communityId}/items/new`}
          >
            <Plus size={17} />
            הוספת פריט
          </Link>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="relative block">
            <Search className="absolute right-3 top-3.5 text-slate-400" size={18} />
            <input
              className="w-full rounded-md border border-slate-300 py-3 pl-3 pr-10 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="חיפוש לפי שם או תיאור"
              value={filters.search}
            />
          </label>
          <label className="relative block">
            <SlidersHorizontal className="absolute right-3 top-3.5 text-slate-400" size={17} />
            <select
              className="w-full rounded-md border border-slate-300 bg-white py-3 pl-3 pr-10 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
              onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
              value={filters.category}
            >
              <option value="">כל הקטגוריות</option>
              {itemCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <select
            className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
            onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            value={filters.sort}
          >
            <option value="newest">מהחדש לישן</option>
            <option value="oldest">מהישן לחדש</option>
            <option value="name">שם הפריט</option>
          </select>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {itemsData.items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600 md:col-span-3">
            עדיין אין פריטים פעילים בקהילה.
          </div>
        ) : (
          itemsData.items.map((item) => <ItemCard communityId={communityId} item={item} key={item.id} />)
        )}
      </section>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

function ItemCard({ communityId, item }) {
  const isLocked = !item.viewer.isOwner && !item.viewer.canViewContact;
  const Icon = isLocked ? Lock : Unlock;
  const accessLabel = item.viewer.isOwner ? "הפריט שלך" : isLocked ? "פרטי קשר נעולים" : "פרטי קשר פתוחים";

  return (
    <Link className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" to={`/communities/${communityId}/items/${item.id}`}>
      <img alt="" className="h-40 w-full object-cover" src={getItemImageUrl(item)} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{item.category}</p>
          </div>
          <Icon className={isLocked ? "text-slate-400" : "text-teal-700"} size={20} />
        </div>
        {item.description ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p> : null}
        <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${isLocked ? "bg-slate-100 text-slate-600" : "bg-teal-50 text-teal-800"}`}>
          {accessLabel}
        </span>
      </div>
    </Link>
  );
}

function AccessProgress({ accessStatus }) {
  if (accessStatus.canViewContact) {
    return <p className="mt-2 leading-7">יש לך גישה מלאה לפרטי הקשר בקהילה זו.</p>;
  }

  const progress = Math.min(100, (accessStatus.activeItemCount / accessStatus.requiredActiveItemCount) * 100);

  return (
    <div className="mt-3">
      <p className="leading-7">
        הוספת 3 פריטים פעילים בקהילה תפתח לך גישה לפרטי הקשר. כרגע: {accessStatus.activeItemCount}/3
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-teal-700" style={{ width: `${progress}%` }} />
      </div>
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

export default CommunityPage;
