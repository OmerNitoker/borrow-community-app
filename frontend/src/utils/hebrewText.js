export function itemCountText(count) {
  return count === 1 ? "פריט אחד" : `${count} פריטים`;
}

export function activeItemCountText(count) {
  return count === 1 ? "פריט פעיל אחד" : `${count} פריטים פעילים`;
}

export function foundItemsText(count) {
  return count === 1 ? "פריט אחד נמצא" : `${count} פריטים נמצאו`;
}

export function missingFairnessItemsText(count) {
  return count === 1 ? "חסר לך רק פריט אחד." : `חסרים לך עוד ${count} פריטים.`;
}

export function selectedImagesForUploadText(count) {
  return count === 1 ? "נבחרה תמונה אחת להעלאה" : `נבחרו ${count} תמונות להעלאה`;
}
