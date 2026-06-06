import { ArrowRight, Edit, EyeOff, Phone, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { deleteItem, getItem, hideItem, updateItem } from "../api/itemApi.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { getConditionLabel } from "../constants/itemOptions.js";
import { missingFairnessItemsText } from "../utils/hebrewText.js";
import { getItemImageUrl, getTransformedImageUrl } from "../utils/itemImages.js";

function ItemDetailsPage() {
  const { communityId, itemId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  async function loadItem() {
    const itemData = await getItem(itemId);
    setData(itemData);
  }

  useEffect(() => {
    setSelectedImageIndex(0);
    loadItem().catch((err) => setError(err.message));
  }, [itemId]);

  async function handleOwnerHide() {
    setIsUpdatingStatus(true);
    setError("");

    try {
      await hideItem(itemId);
      navigate(`/communities/${communityId}`);
    } catch (err) {
      setError(err.message);
      setIsUpdatingStatus(false);
    }
  }

  async function handleOwnerDelete() {
    setIsUpdatingStatus(true);
    setError("");

    try {
      await deleteItem(itemId);
      navigate(`/communities/${communityId}`);
    } catch (err) {
      setError(err.message);
      setIsUpdatingStatus(false);
    }
  }

  async function handleAdminHide() {
    setIsUpdatingStatus(true);
    setError("");

    try {
      await hideItem(itemId, { asAdmin: true });
      await loadItem();
      setConfirmAction(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleAdminReactivate() {
    setIsUpdatingStatus(true);
    setError("");

    try {
      await updateItem(itemId, { isActive: true });
      await loadItem();
      setConfirmAction(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  if (error && !data) {
    return <PageMessage title="לא ניתן להציג את הפריט" text={error} />;
  }

  if (!data) {
    return <LoadingScreen />;
  }

  const galleryImages = data.item.images?.length
    ? data.item.images.map((currentImage) => currentImage.url).filter(Boolean)
    : [getItemImageUrl(data.item, "detail")];
  const image = getTransformedImageUrl(galleryImages[selectedImageIndex] || galleryImages[0], "detail");
  const missingCount = Math.max(0, data.viewer.requiredActiveItemCount - data.viewer.activeItemCount);
  const canAdminReactivate = data.viewer.isCommunityAdmin && !data.item.isActive && data.item.hiddenByAdmin;
  const canShowAdminActions = data.viewer.isCommunityAdmin && (!data.viewer.isOwner || canAdminReactivate);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-10">
      <Link
        className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100 sm:w-auto"
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
          <div className="grid aspect-[4/3] place-items-center bg-slate-50 p-3 sm:p-4">
            <img alt="" className="max-h-full max-w-full object-contain" src={image} />
          </div>
          {galleryImages.length > 1 ? (
            <div className="grid grid-cols-3 gap-2 p-3">
              {galleryImages.map((currentImage, index) => (
                <button
                  aria-label={`הצגת תמונה ${index + 1}`}
                  className={`overflow-hidden rounded-md border-2 bg-slate-50 p-0.5 transition ${
                    selectedImageIndex === index
                      ? "border-teal-700"
                      : "border-transparent hover:border-teal-200"
                  }`}
                  key={currentImage}
                  onClick={() => setSelectedImageIndex(index)}
                  type="button"
                >
                  <img
                    alt=""
                    className="aspect-[4/3] w-full rounded object-cover object-center"
                    src={getTransformedImageUrl(currentImage, "thumbnail")}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
              <p className="text-sm font-semibold text-teal-700">{data.item.category}</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{data.item.title}</h1>
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
            <OwnerActions data={data} itemId={itemId} communityId={communityId} onConfirmAction={setConfirmAction} />
          ) : (
            <ContactPanel data={data} missingCount={missingCount} communityId={communityId} />
          )}

          {canShowAdminActions ? (
            <AdminModerationActions item={data.item} onConfirmAction={setConfirmAction} />
          ) : null}

          {error ? <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        </section>
      </div>

      {confirmAction ? (
        <ConfirmDialog
          confirmText={confirmAction.confirmText}
          isLoading={isUpdatingStatus}
          onCancel={() => setConfirmAction(null)}
          onConfirm={
            confirmAction.type === "owner-hide"
              ? handleOwnerHide
              : confirmAction.type === "owner-delete"
                ? handleOwnerDelete
                : confirmAction.type === "admin-hide"
                ? handleAdminHide
                : handleAdminReactivate
          }
          text={confirmAction.text}
          title={confirmAction.title}
          tone={confirmAction.tone}
        />
      ) : null}
    </section>
  );
}

function OwnerActions({ communityId, data, itemId, onConfirmAction }) {
  if (!data.item.isActive) {
    return (
      <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          to={`/communities/${communityId}/items/${itemId}/edit`}
        >
          <Edit size={17} />
          עריכה
        </Link>
        <DeleteItemButton onConfirmAction={onConfirmAction} />
      </div>
    );
  }

  const hideAsAdmin = data.viewer.isCommunityAdmin;

  return (
    <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
      <Link
        className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        to={`/communities/${communityId}/items/${itemId}/edit`}
      >
        <Edit size={17} />
        עריכה
      </Link>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100"
        onClick={() =>
          onConfirmAction({
            type: hideAsAdmin ? "admin-hide" : "owner-hide",
            title: "להסתיר את הפריט?",
            text: hideAsAdmin
              ? `${data.item.title} יוסתר מהקטלוג. מאחר שהפעולה מתבצעת כמנהל, רק מנהל קהילה יוכל להחזיר אותו לפעילות.`
              : "הפריט לא יימחק מהמערכת, אלא יהפוך ללא פעיל ויוסתר מהקטלוג. מאחר שאתה מסתיר אותו בעצמך, רק אתה תוכל להחזיר אותו לפעילות.",
            confirmText: "כן, להסתיר"
          })
        }
        type="button"
      >
        <EyeOff size={17} />
        הסתרה
      </button>
      <DeleteItemButton onConfirmAction={onConfirmAction} />
    </div>
  );
}

function DeleteItemButton({ onConfirmAction }) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
      onClick={() =>
        onConfirmAction({
          type: "owner-delete",
          title: "האם למחוק את הפריט?",
          confirmText: "כן, למחוק"
        })
      }
      type="button"
    >
      <Trash2 size={17} />
      מחיקה
    </button>
  );
}

function AdminModerationActions({ item, onConfirmAction }) {
  return (
    <div className="mt-6 rounded-md border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold text-slate-700">פעולות מנהל</p>
      {!item.isActive && item.hiddenByAdmin ? (
        <button
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-100 sm:w-auto"
          onClick={() =>
            onConfirmAction({
              type: "admin-reactivate",
              title: "להחזיר את הפריט לפעילות?",
              text: `${item.title} יחזור להופיע בקטלוג הקהילה.`,
              confirmText: "כן, להחזיר",
              tone: "success"
            })
          }
          type="button"
        >
          <RotateCcw size={17} />
          החזרה לפעילות
        </button>
      ) : item.isActive ? (
        <button
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 sm:w-auto"
          onClick={() =>
            onConfirmAction({
              type: "admin-hide",
              title: "להסתיר את הפריט?",
              text: `${item.title} יוסתר מהקטלוג. מאחר שהפעולה מתבצעת כמנהל, רק מנהל קהילה יוכל להחזיר אותו לפעילות.`,
              confirmText: "כן, להסתיר"
            })
          }
          type="button"
        >
          <EyeOff size={17} />
          הסתרת פריט
        </button>
      ) : null}
    </div>
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
        כדי לשמור על קהילה פעילה והוגנת, פרטי הקשר נפתחים אחרי הוספת 3 פריטים פעילים. {missingFairnessItemsText(missingCount)}
      </p>
      <Link
        className="mt-4 inline-flex w-full justify-center rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 sm:w-auto"
        to={`/communities/${communityId}/items/new`}
      >
        הוספת פריט
      </Link>
    </div>
  );
}

function PageMessage({ title, text }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-6 sm:px-5 sm:py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-3 text-slate-700">{text}</p>
      </div>
    </section>
  );
}

export default ItemDetailsPage;
