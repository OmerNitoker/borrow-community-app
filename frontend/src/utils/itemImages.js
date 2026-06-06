const fallbackImagesByCategory = {
  "ציוד טיולים":
    "https://res.cloudinary.com/dmhaze3tc/image/upload/v1780685327/borrow/travel-default_kbpcfm.jpg",
  "כלי עבודה":
    "https://res.cloudinary.com/dmhaze3tc/image/upload/v1780685466/borrow/tools-default_wawval.jpg",
  "כלי מטבח":
    "https://res.cloudinary.com/dmhaze3tc/image/upload/v1780685676/borrow/kitchenware-default_q1ehhn.jpg",
  "כלי נגינה":
    "https://res.cloudinary.com/dmhaze3tc/image/upload/v1780685806/borrow/music-default_k00ega.jpg",
  "ציוד ספורט":
    "https://res.cloudinary.com/dmhaze3tc/image/upload/v1780686272/borrow/sports-default_bgq1nq.jpg",
  "ציוד לאירועים":
    "https://res.cloudinary.com/dmhaze3tc/image/upload/v1780685983/borrow/event-default_ewv7v1.jpg",
  אחר: "https://res.cloudinary.com/dmhaze3tc/image/upload/v1780686082/borrow/other-default_afrbf5.jpg"
};

const cloudinaryTransforms = {
  card: "w_700,h_460,c_fill,g_auto,q_auto:good,f_auto",
  detail: "w_1400,h_900,c_fill,g_auto,q_auto:best,f_auto",
  thumbnail: "w_180,h_180,c_fill,g_auto,q_auto:good,f_auto"
};

export function getItemImageUrl(item, variant = "card") {
  const imageUrl = item.imageUrl || item.images?.[0]?.url || fallbackImagesByCategory[item.category] || fallbackImagesByCategory["אחר"];

  return getTransformedImageUrl(imageUrl, variant);
}

export function getTransformedImageUrl(imageUrl, variant = "card") {
  const transform = cloudinaryTransforms[variant];

  if (!imageUrl || !transform || !imageUrl.includes("/image/upload/")) {
    return imageUrl;
  }

  const uploadMarker = "/image/upload/";
  const uploadIndex = imageUrl.indexOf(uploadMarker);
  const prefix = imageUrl.slice(0, uploadIndex + uploadMarker.length);
  const rest = imageUrl.slice(uploadIndex + uploadMarker.length);
  const [firstSegment, ...remainingSegments] = rest.split("/");
  const hasExistingTransform = firstSegment && !/^v\d+$/.test(firstSegment) && firstSegment.includes("_");

  if (hasExistingTransform) {
    return `${prefix}${transform}/${remainingSegments.join("/")}`;
  }

  return `${prefix}${transform}/${rest}`;
}
