export const itemCategories = [
  "ציוד טיולים",
  "כלי עבודה",
  "כלי מטבח",
  "כלי נגינה",
  "ציוד ספורט",
  "ציוד לאירועים",
  "אחר"
];

export const itemConditions = [
  { value: "new", label: "חדש" },
  { value: "good", label: "טוב" },
  { value: "used", label: "משומש" },
  { value: "needs-care", label: "דורש טיפול" }
];

export function getConditionLabel(value) {
  return itemConditions.find((condition) => condition.value === value)?.label || value;
}
