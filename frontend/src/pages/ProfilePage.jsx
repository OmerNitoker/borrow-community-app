import { Plus } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProfilePage() {
  const { user } = useAuth();
  const { memberships } = useOutletContext();
  const approvedMemberships = memberships.filter((membership) => membership.status === "approved");

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
                    <p className="text-sm text-slate-600">{membership.role === "admin" ? "מנהל" : "חבר"}</p>
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
        <p className="mt-3 text-slate-600">רשימת הפריטים, עריכה, מחיקה ושינוי זמינות יתווספו במיילסטון הפריטים.</p>
      </section>
    </section>
  );
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
