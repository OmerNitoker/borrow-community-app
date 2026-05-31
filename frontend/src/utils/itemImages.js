const fallbackImagesByCategory = {
  "ציוד טיולים":
    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=75",
  "כלי עבודה":
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=75",
  "כלי מטבח":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=75",
  "כלי נגינה":
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=75",
  "ציוד ספורט":
    "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=75",
  "ציוד לאירועים":
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=75",
  אחר: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=75"
};

export function getItemImageUrl(item) {
  return item.imageUrl || item.images?.[0]?.url || fallbackImagesByCategory[item.category] || fallbackImagesByCategory["אחר"];
}
