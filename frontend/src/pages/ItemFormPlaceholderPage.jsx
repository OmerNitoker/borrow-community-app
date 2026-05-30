import { ImagePlus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function ItemFormPlaceholderPage() {
  const { communityId } = useParams();

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <ImagePlus className="text-teal-700" size={32} />
        <h1 className="mt-4 text-3xl font-bold">הוספת פריט</h1>
        <p className="mt-3 leading-8 text-slate-700">
          הטופס המלא להעלאת פריטים, תמונות Cloudinary, קטגוריות ומצב פריט יתווסף במיילסטון 4.
        </p>
        <Link
          className="mt-6 inline-flex rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
          to={`/communities/${communityId}`}
        >
          חזרה לקהילה
        </Link>
      </div>
    </section>
  );
}

export default ItemFormPlaceholderPage;
