export function getGoogleAuthUrl({ intent = "login", role = "brand" } = {}) {
  const base = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const params = new URLSearchParams({
    intent: intent === "signup" ? "signup" : "login",
    role: role === "influencer" ? "influencer" : "brand",
  });
  return `${base}/api/v1/auth/google?${params.toString()}`;
}

export function startGoogleAuth(opts) {
  window.location.href = getGoogleAuthUrl(opts);
}
