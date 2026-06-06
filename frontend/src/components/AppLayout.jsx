import { LogOut, Plus, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { getMyCommunities } from "../api/communityApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import DemoBadge from "./DemoBadge.jsx";

function AppLayout() {
  const { user, logout } = useAuth();
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState([]);
  const [isMembershipsLoading, setIsMembershipsLoading] = useState(true);

  useEffect(() => {
    getMyCommunities()
      .then((data) => setMemberships(data.memberships || []))
      .catch(() => setMemberships([]))
      .finally(() => setIsMembershipsLoading(false));
  }, []);

  useEffect(() => {
    if (communityId) {
      localStorage.setItem("borrow:lastCommunityId", communityId);
    }
  }, [communityId]);

  const approvedMemberships = memberships.filter((membership) => membership.status === "approved");
  const currentMembership = approvedMemberships.find((membership) => membership.community.id === communityId);
  const adminMembership =
    currentMembership?.role === "admin"
      ? currentMembership
      : approvedMemberships.find((membership) => membership.role === "admin");

  async function handleLogout() {
    await logout();
    navigate("/auth");
  }

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-5 sm:py-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <Link className="brand-wordmark text-xl leading-none text-teal-900" to="/">
              השכן
            </Link>
            <h1 className="truncate text-lg font-bold sm:text-xl">שלום, {user.name}</h1>
            {user.isDemoUser ? (
              <div className="mt-2">
                <DemoBadge />
              </div>
            ) : null}
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            {approvedMemberships.length > 0 ? (
              <select
                className="col-span-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold sm:w-auto"
                onChange={(event) => navigate(`/communities/${event.target.value}`)}
                value={communityId || approvedMemberships[0].community.id}
              >
                {approvedMemberships.map((membership) => (
                  <option key={membership.id} value={membership.community.id}>
                    {membership.community.name}
                  </option>
                ))}
              </select>
            ) : null}

            <Link
              className="inline-flex items-center justify-center gap-2 rounded-md border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-50"
              to="/onboarding"
            >
              <Plus size={17} />
              קהילה נוספת
            </Link>

            <Link
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100"
              to="/profile"
            >
              <UserRound size={17} />
              פרופיל
            </Link>

            {adminMembership ? (
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-100"
                to={`/communities/${adminMembership.community.id}/admin`}
              >
                <ShieldCheck size={17} />
                ניהול
              </Link>
            ) : null}

            <button
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={17} />
              התנתקות
            </button>
          </nav>
        </div>
      </header>

      <Outlet
        context={{
          memberships,
          isMembershipsLoading,
          refreshMemberships: () => getMyCommunities().then((data) => setMemberships(data.memberships || []))
        }}
      />
    </main>
  );
}

export default AppLayout;
