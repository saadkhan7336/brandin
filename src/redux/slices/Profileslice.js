// src/redux/slices/profileSlice.js
// Stores the completion status returned by GET /users/me and every PATCH response
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // From GET /users/me
  roleProfile: null,        // Influencer or Brand doc
  completion: {
    isComplete: false,
    percent: 0,
    missing: [],
    completed: 0,
    total: 0,
  },
  loading: false,
  saving: false,            // separate flag so page doesn't flash on save
  error: null,
  successMessage: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) state.error = null;
    },
    setProfileSaving: (state, action) => {
      state.saving = action.payload;
      if (action.payload) state.error = null;
    },
    setProfileError: (state, action) => {
      state.error = action.payload;
      state.saving = false;
      state.loading = false;
    },
    setProfileData: (state, action) => {
      // Payload: { roleProfile, completion }
      state.roleProfile  = action.payload.roleProfile  ?? state.roleProfile;
      state.completion   = action.payload.completion   ?? state.completion;
      state.loading      = false;
      state.saving       = false;
    },
    setProfileSuccess: (state, action) => {
      state.successMessage = action.payload;
      state.saving = false;
    },
    clearProfileMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  setProfileLoading,
  setProfileSaving,
  setProfileError,
  setProfileData,
  setProfileSuccess,
  clearProfileMessages,
} = profileSlice.actions;

export default profileSlice.reducer;