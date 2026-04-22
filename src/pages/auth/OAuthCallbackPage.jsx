// src/pages/auth/OAuthCallbackPage.jsx
// This page handles the redirect after OAuth completes.
// It reads ?platform=youtube&status=success from the URL,
// refreshes the user profile via API, then redirects to settings.
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import profileService from "../../services/profileService";
import { updateUserFields } from "../../redux/slices/authSlice";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const platform = searchParams.get("platform") || "platform";
  const status = searchParams.get("status") || "error";
  const mode = searchParams.get("mode"); // "simulate" for non-OAuth platforms

  const [phase, setPhase] = useState("loading"); // loading | success | error

  const getSettingsPath = () => {
    if (!user?.role) return "/";
    return `/${user.role}/settings`;
  };

  useEffect(() => {
    const handleCallback = async () => {
      let finalRole = user?.role;

      if (status === "error") {
        setPhase("error");
        
        // If role is missing, try to fetch it once to ensure correct redirection
        if (!finalRole) {
          try {
            const data = await profileService.getMe();
            if (data?.user?.role) finalRole = data.user.role;
          } catch (err) {
            console.error("Failed to fetch role for redirection:", err);
          }
        }

        setTimeout(() => navigate(finalRole ? `/${finalRole}/settings` : "/"), 3500);
        return;
      }

      if (status === "pending" && mode === "simulate") {
        try {
          await profileService.simulateVerify(platform);
          setPhase("success");
        } catch {
          setPhase("error");
        }
        setTimeout(() => navigate(finalRole ? `/${finalRole}/settings` : "/"), 2000);
        return;
      }

      // Real OAuth success — just refresh user data
      try {
        const data = await profileService.getMe();
        if (data?.user) {
          dispatch(updateUserFields(data.user));
          finalRole = data.user.role; // Use fresh role from API
        }
        setPhase("success");
      } catch {
        setPhase("error");
      }

      setTimeout(() => navigate(finalRole ? `/${finalRole}/settings` : "/"), 2000);
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorMsg = searchParams.get("msg") || "Something went wrong. Redirecting back…";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-12 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
        {phase === "loading" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Loader2 size={32} className="text-blue-500 animate-spin" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Verifying {platform}…</h1>
              <p className="text-sm text-gray-400 mt-1 font-medium">
                Please wait while we confirm your account.
              </p>
            </div>
          </>
        )}

        {phase === "success" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900 capitalize">
                {platform} Verified! ✓
              </h1>
              <p className="text-sm text-gray-400 mt-1 font-medium">
                Redirecting you back to settings…
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
              <div className="bg-emerald-500 h-1 rounded-full animate-[progress_2s_linear_forwards]" />
            </div>
          </>
        )}

        {phase === "error" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <div className="text-center px-4">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Verification Failed</h1>
              <p className="text-sm text-red-500 mt-2 font-semibold">
                {errorMsg}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Redirecting you back shortly...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
