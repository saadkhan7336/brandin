import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    message: null,
    otpVerified: false,
    resetEmail: null,
};

const authSlice = createSlice({

    name: "auth",
    initialState,
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        // Called after profile save — updates profileComplete on the cached user
        updateProfileComplete: (state, action) => {
            if (state.user) {
                state.user.profileComplete = action.payload;
            }
        },
        // Called after user info save — syncs fullname/profilePic/coverPic
        updateUserFields: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
            state.loading = false;
        },
        setOtpVerified: (state, action) => {
            state.otpVerified = action.payload;
        },
        setResetEmail: (state, action) => {
            state.resetEmail = action.payload;
        },
        clearAuthState: (state) => {
            state.error = null;
            state.message = null;
            state.loading = false;
        }
    },
});

export const {
    setAuthUser,
    updateProfileComplete,
    updateUserFields,
    logoutSuccess,
    setLoading,
    setError,
    setMessage,
    setOtpVerified,
    setResetEmail,
    clearAuthState
} = authSlice.actions;

export default authSlice.reducer