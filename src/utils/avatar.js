export function getNameInitial(name) {
  const text = String(name || "")
    .trim()
    .replace(/^@+/, "");
  if (!text) return "?";
  const char = Array.from(text)[0];
  return char.toLocaleUpperCase();
}

export function isUsableAvatarUrl(url) {
  if (!url || typeof url !== "string") return false;
  const value = url.trim();
  if (!value || value === "undefined" || value === "null") return false;
  if (value.includes("ui-avatars.com")) return false;
  if (value.startsWith("data:") && value.length < 32) return false;
  return true;
}

const COLOR_CLASSES = [
  "bg-blue-100 text-blue-700",
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-cyan-100 text-cyan-800",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-700",
];

export function avatarColorClass(name) {
  const text = String(name || "");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash + text.charCodeAt(i) * (i + 1)) % COLOR_CLASSES.length;
  }
  return COLOR_CLASSES[hash] || COLOR_CLASSES[0];
}
