import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AlertCircle, Loader2 } from "lucide-react";
import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";
import { setAuthUser } from "../../redux/slices/authSlice";
import { setProfileData } from "../../redux/slices/Profileslice";
import { getDashboardByRole } from "../../routes/ProtectedRoute";

export default function GoogleLoginCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(searchParams.get("error") ? (searchParams.get("msg") || "Google sign-in failed.") : "");

  useEffect(() => {
    const run = async () => {
      if (searchParams.get("error")) {
        setTimeout(() => navigate("/login", { replace: true }), 2500);
        return;
      }

      try {
        const res = await api.get(ENDPOINTS.ME);
        const { user: authUser, roleProfile, completion } = res.data.data || {};
        if (!authUser?.role) {
          throw new Error("missing user");
        }
        dispatch(setAuthUser(authUser));
        if (roleProfile || completion) {
          dispatch(setProfileData({ roleProfile, completion }));
        }
        navigate(getDashboardByRole(authUser.role), { replace: true });
      } catch {
        setError("Could not finish Google sign-in. Please try again.");
        setTimeout(() => navigate("/login", { replace: true }), 2500);
      }
    };
    run();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-12 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
        {error ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Google sign-in failed</h1>
              <p className="text-sm text-red-500 mt-2 font-semibold">{error}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Loader2 size={32} className="text-blue-500 animate-spin" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Signing you in…</h1>
              <p className="text-sm text-gray-400 mt-1 font-medium">
                Finishing Google login.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
