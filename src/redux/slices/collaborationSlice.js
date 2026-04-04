import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  stats: {
    all: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  },
  // pagination
  total: 0,
  page: 1,
  pages: 1,
  // category counts
  counts: {
    sent: 0,
    received: 0,
  },
  // UI states
  loading: false,
  error: null,
  // filters
  filters: {
    page: 1,
    limit: 10,
    status: "all",
    type: "received", // default to received (applications)
    search: "",
    platform: "all",
  },
};

const collaborationSlice = createSlice({
  name: "collaboration",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setRequests: (state, action) => {
      state.requests = action.payload.requests;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
      state.counts = action.payload.counts || state.counts;
    },
    updateRequestInState: (state, action) => {
      const index = state.requests.findIndex(
        (req) => req._id === action.payload._id
      );
      if (index !== -1) {
        state.requests[index] = { ...state.requests[index], ...action.payload };
      }
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setRequests,
  updateRequestInState,
  setFilters,
  resetFilters,
  setStats,
} = collaborationSlice.actions;

export default collaborationSlice.reducer;
