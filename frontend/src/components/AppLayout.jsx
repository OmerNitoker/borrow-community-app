import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { getMyCommunities } from "../api/communityApi.js";
import { useAuth } from "../context/AuthContext.jsx";

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

  const approvedMemberships = memberships.filter((membership) => membership.status === "approved");
  const currentMembership = approvedMemberships.find((membership) => membership.community.id === communityId);

  async function handleLogout() {
    await logout();
    navigate("/auth");
  }

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link className="text-sm font-semibold text-teal-700" to="/">
              Borrow
            </Link>
            <h1 className="text-xl font-bold">שלום, {user.name}</h1>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {approvedMemberships.length > 0 ? (
              <select
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold"
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
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100"
              to="/profile"
            >
              <UserRound size={17} />
              פרופיל
            </Link>

            {currentMembership?.role === "admin" ? (
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900 hover:bg-teal-100"
                to={`/communities/${communityId}/admin`}
              >
                <ShieldCheck size={17} />
                ניהול
              </Link>
            ) : null}

            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-100"
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
