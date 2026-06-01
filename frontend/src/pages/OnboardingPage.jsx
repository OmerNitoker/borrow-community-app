import { ArrowLeft, Boxes, Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createCommunity, joinCommunity } from "../api/communityApi.js";
import DemoEntryActions from "../components/DemoEntryActions.jsx";
import JoinCodeDisplay from "../components/JoinCodeDisplay.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function OnboardingPage() {
  const navigate = useNavigate();
  const { startDemo } = useAuth();
  const { refreshMemberships } = useOutletContext();
  const [joinCode, setJoinCode] = useState("");
  const [communityForm, setCommunityForm] = useState({
    name: "",
    description: "",
    requiredApproval: true
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const [createdCommunity, setCreatedCommunity] = useState(null);

  async function handleJoin(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting("join");

    try {
      const data = await joinCommunity(joinCode);
      await refreshMemberships();
      navigate(data.membership.status === "approved" ? `/communities/${data.community.id}` : `/pending/${data.community.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting("");
    }
  }

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting("create");

    try {
      const data = await createCommunity(communityForm);
      await refreshMemberships();
      setCreatedCommunity(data.community);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting("");
    }
  }

  async function handleDemo(mode) {
    setError("");
    setIsSubmitting(`demo-${mode}`);

    try {
      const data = await startDemo(mode);
      await refreshMemberships();
      navigate(`/communities/${data.community.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting("");
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-10">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold text-teal-700">התחלה</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">ברוך הבא! איך תרצה להתחיל?</h1>
        <p className="mt-3 leading-8 text-slate-700">
          אפשר להצטרף לקהילה קיימת, לפתוח קהילה חדשה או להיכנס לדמו מלא כדי לראות את המוצר בפעולה.
        </p>
      </div>

      {error ? <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <Users className="text-teal-700" size={28} />
          <h2 className="mt-4 text-xl font-bold">הצטרפות לקהילה קיימת</h2>
          <form className="mt-5 space-y-4" onSubmit={handleJoin}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">קוד קהילה</span>
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-left uppercase outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                dir="ltr"
                onChange={(event) => setJoinCode(event.target.value)}
                required
                value={joinCode}
              />
            </label>
            <ActionButton isLoading={isSubmitting === "join"} text="הצטרפות" />
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <Plus className="text-teal-700" size={28} />
          <h2 className="mt-4 text-xl font-bold">יצירת קהילה חדשה</h2>
          <form className="mt-5 space-y-4" onSubmit={handleCreate}>
            <TextInput
              label="שם הקהילה"
              onChange={(event) => setCommunityForm((current) => ({ ...current, name: event.target.value }))}
              value={communityForm.name}
            />
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">תיאור קצר</span>
              <textarea
                className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
                onChange={(event) => setCommunityForm((current) => ({ ...current, description: event.target.value }))}
                value={communityForm.description}
              />
            </label>
            <label className="flex items-center gap-3 rounded-md bg-slate-50 p-3 text-sm font-semibold">
              <input
                checked={communityForm.requiredApproval}
                onChange={(event) =>
                  setCommunityForm((current) => ({ ...current, requiredApproval: event.target.checked }))
                }
                type="checkbox"
              />
              הצטרפות דורשת אישור מנהל
            </label>
            <ActionButton isLoading={isSubmitting === "create"} text="יצירת קהילה" />
          </form>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:col-span-2 lg:col-span-1">
          <Boxes className="text-teal-700" size={28} />
          <h2 className="mt-4 text-xl font-bold">כניסה לקהילת דמו</h2>
          <div className="mt-4">
            <DemoEntryActions isSubmitting={isSubmitting} onSelect={handleDemo} />
          </div>
        </section>
      </div>

      {createdCommunity ? (
        <CommunityCreatedModal
          community={createdCommunity}
          onContinue={() => navigate(`/communities/${createdCommunity.id}`)}
        />
      ) : null}
    </section>
  );
}

function CommunityCreatedModal({ community, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 text-right shadow-2xl sm:p-6">
        <p className="text-sm font-semibold text-teal-700">קהילה חדשה</p>
        <h2 className="mt-2 text-2xl font-bold">הקהילה נוצרה בהצלחה!</h2>
        <p className="mt-2 text-slate-600">שתף את קוד ההצטרפות עם חברי הקהילה</p>

        <JoinCodeDisplay
          className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-4"
          joinCode={community.joinCode}
          requiredApproval={community.requiredApproval}
        />

        <button
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          onClick={onContinue}
          type="button"
        >
          מעבר לדף הקהילה
          <ArrowLeft size={17} />
        </button>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
        onChange={onChange}
        required
        value={value}
      />
    </label>
  );
}

function ActionButton({ isLoading, text }) {
  return (
    <button
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      disabled={isLoading}
      type="submit"
    >
      {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
      {text}
    </button>
  );
}

export default OnboardingPage;
