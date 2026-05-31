import { ImagePlus, Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addItemImages, createItem, deleteItemImage, getItem, updateItem } from "../api/itemApi.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { itemCategories, itemConditions } from "../constants/itemOptions.js";

const emptyForm = {
  title: "",
  description: "",
  category: itemCategories[0],
  condition: "good",
  notes: "",
  isActive: true
};

function ItemFormPage({ mode }) {
  const { communityId, itemId } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";
  const [form, setForm] = useState(emptyForm);
  const [existingItem, setExistingItem] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyImageId, setBusyImageId] = useState("");

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    getItem(itemId)
      .then((data) => {
        setExistingItem(data.item);
        setForm({
          title: data.item.title,
          description: data.item.description,
          category: data.item.category,
          condition: data.item.condition,
          notes: data.item.notes,
          isActive: data.item.isActive
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [isEdit, itemId]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function updateFiles(event) {
    const maxAvailableSlots = Math.max(0, 3 - (existingItem?.images?.length || 0));
    setFiles(Array.from(event.target.files || []).slice(0, isEdit ? maxAvailableSlots : 3));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (isEdit) {
        const data = await updateItem(itemId, form);

        if (files.length > 0) {
          const imageFormData = createImageFormData(files);
          await addItemImages(itemId, imageFormData);
        }

        setSuccess("הפריט עודכן בהצלחה.");
        navigate(`/communities/${data.item.community}/items/${data.item.id}`);
      } else {
        const formData = createItemFormData({ ...form, community: communityId }, files);
        const data = await createItem(formData);
        navigate(`/communities/${communityId}/items/${data.item.id}?created=1`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteImage(publicId) {
    setError("");
    setBusyImageId(publicId);

    try {
      const data = await deleteItemImage(itemId, publicId);
      setExistingItem(data.item);
      setSuccess("התמונה נמחקה בהצלחה.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyImageId("");
    }
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <ImagePlus className="text-teal-700" size={32} />
        <h1 className="mt-4 text-3xl font-bold">{isEdit ? "עריכת פריט" : "הוספת פריט"}</h1>
        <p className="mt-3 leading-8 text-slate-700">
          ככל שיהיו יותר תמונות ותיאור ברור יותר, יהיה קל יותר לחברי הקהילה להבין אם הפריט מתאים להם.
        </p>

        {existingItem?.hiddenByAdmin ? (
          <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
            הפריט הוסתר על ידי מנהל קהילה ולכן אי אפשר להחזיר אותו לפעיל.
          </p>
        ) : null}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <TextInput label="שם הפריט" name="title" onChange={updateField} value={form.title} />
          <TextArea label="תיאור" name="description" onChange={updateField} value={form.description} />

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectInput label="קטגוריה" name="category" onChange={updateField} value={form.category}>
              {itemCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </SelectInput>

            <SelectInput label="מצב הפריט" name="condition" onChange={updateField} value={form.condition}>
              {itemConditions.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </SelectInput>
          </div>

          <TextArea label="הערות ותנאי השאלה" name="notes" onChange={updateField} value={form.notes} />

          {isEdit && existingItem?.images?.length > 0 ? (
            <section>
              <p className="text-sm font-semibold text-slate-700">תמונות קיימות</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {existingItem.images.map((image) => (
                  <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50" key={image.publicId || image.url}>
                    <img alt="" className="h-28 w-full object-cover" src={image.url} />
                    <button
                      className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:text-slate-400"
                      disabled={Boolean(busyImageId)}
                      onClick={() => handleDeleteImage(image.publicId)}
                      type="button"
                    >
                      {busyImageId === image.publicId ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                      מחיקת תמונה
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              {isEdit ? `הוספת תמונות (${existingItem?.images?.length || 0}/3 קיימות)` : "תמונות עד 3"}
            </span>
            <input
              accept="image/png,image/jpeg,image/webp"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3"
              disabled={isEdit && (existingItem?.images?.length || 0) >= 3}
              multiple
              onChange={updateFiles}
              type="file"
            />
            <span className="mt-2 block text-sm text-slate-500">
              לא חובה להעלות תמונה. אם אין תמונה, תופיע תצוגת ברירת מחדל לפי הקטגוריה בהמשך.
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-md bg-slate-50 p-3 text-sm font-semibold">
            <input
              checked={form.isActive}
              disabled={existingItem?.hiddenByAdmin}
              name="isActive"
              onChange={updateField}
              type="checkbox"
            />
            הפריט פעיל ומופיע בקטלוג הקהילה
          </label>

          {error ? <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          {success ? <p className="rounded-md bg-teal-50 px-4 py-3 text-sm text-teal-800">{success}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isEdit ? "שמירת שינויים" : "הוספת פריט"}
            </button>
            <Link
              className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-slate-100"
              to={isEdit ? `/communities/${communityId}/items/${itemId}` : `/communities/${communityId}`}
            >
              ביטול
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}

function createItemFormData(payload, files) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
  files.forEach((file) => formData.append("images", file));
  return formData;
}

function createImageFormData(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return formData;
}

function TextInput({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
        name={name}
        onChange={onChange}
        required
        value={value}
      />
    </label>
  );
}

function TextArea({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        className="mt-2 min-h-28 w-full rounded-md border border-slate-300 px-3 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
        name={name}
        onChange={onChange}
        value={value}
      />
    </label>
  );
}

function SelectInput({ label, name, value, onChange, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100"
        name={name}
        onChange={onChange}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

export default ItemFormPage;
