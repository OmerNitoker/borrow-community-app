import { ArrowLeft, Clock, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { cancelPendingMembership } from "../api/membershipApi.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function PendingApprovalPage() {
  const { communityId } = useParams();
  const { memberships, isMembershipsLoading, refreshMemberships } = useOutletContext();
  const { startDemo } = useAuth();
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");

  useEffect(() => {
    setMembership(memberships.find((item) => item.community.id === communityId));
  }, [communityId, memberships]);

  async function handleCancel() {
    setError("");
    setIsSubmitting("cancel");

    try {
      await cancelPendingMembership(communityId);
      await refreshMemberships();
      navigate("/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting("");
    }
  }

  async function handleDemo() {
    setError("");
    setIsSubmitting("demo");

    try {
      const data = await startDemo();
      await refreshMemberships();
      navigate(`/communities/${data.community.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting("");
    }
  }

  if (isMembershipsLoading) {
    return <LoadingScreen />;
  }

  if (!membership) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-10">
        <p className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">לא נמצאה בקשת הצטרפות לקהילה הזו.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Clock className="text-teal-700" size={32} />
        <h1 className="mt-4 text-3xl font-bold">הבקשה נשלחה</h1>
        <p className="mt-3 leading-8 text-slate-700">
          בקשת ההצטרפות שלך אל <strong>{membership.community.name}</strong> ממתינה לאישור מנהל.
        </p>
        <p className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-800">
          סטטוס: ממתין לאישור מנהל
        </p>

        {error ? <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:text-red-300"
            disabled={Boolean(isSubmitting)}
            onClick={handleCancel}
            type="button"
          >
            {isSubmitting === "cancel" ? <Loader2 className="animate-spin" size={17} /> : <X size={17} />}
            ביטול בקשה
          </button>
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"
            to="/onboarding"
          >
            קהילה אחרת
          </Link>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={Boolean(isSubmitting)}
            onClick={handleDemo}
            type="button"
          >
            {isSubmitting === "demo" ? <Loader2 className="animate-spin" size={17} /> : null}
            כניסה לדמו
            <ArrowLeft size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default PendingApprovalPage;
