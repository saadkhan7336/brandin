import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import collaborationService from "../../services/collaborationService";

export const fetchSidebarCounts = createAsyncThunk(
  "collaboration/fetchSidebarCounts",
  async (_, { rejectWithValue }) => {
    try {
      const [reqRes, collabRes] = await Promise.allSettled([
        collaborationService.getRequests({ status: 'pending', limit: 1 }),
        collaborationService.getAll({ limit: 1 }),
      ]);

      const counts = reqRes.status === 'fulfilled' ? (reqRes.value?.data?.counts ?? reqRes.value?.counts) : { sent: 0, received: 0 };
      const pendingRequestCount = (counts?.sent || 0) + (counts?.received || 0);

      let activeCollabCount = 0;
      if (collabRes.status === 'fulfilled') {
        const raw = collabRes.value;
        const items = raw?.data?.collaborations ?? raw?.data ?? raw ?? [];
        const arr = Array.isArray(items) ? items : [];
        activeCollabCount = arr.filter(
          c => c.status?.toLowerCase() === 'active' || c.status?.toLowerCase() === 'ongoing'
        ).length;
      }

      return { pendingRequestCount, activeCollabCount };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  requests: [],
  // Accepted collaborations (separate from requests)
  collaborations: [],
  collaborationsLoading: false,
  collaborationsError: null,
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
  // Sidebar notification badge counts
  pendingRequestCount: 0,   // display count (dot)
  activeCollabCount: 0,     // display count (dot)
  rawPendingRequestCount: 0, // actual server count
  rawActiveCollabCount: 0,   // actual server count
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
    setNotifCounts: (state, action) => {
      if (typeof action.payload.pendingRequestCount === 'number') {
        state.pendingRequestCount = action.payload.pendingRequestCount;
      }
      if (typeof action.payload.activeCollabCount === 'number') {
        state.activeCollabCount = action.payload.activeCollabCount;
      }
    },
    setCollaborations: (state, action) => {
      state.collaborations = action.payload;
    },
    setCollaborationsLoading: (state, action) => {
      state.collaborationsLoading = action.payload;
    },
    setCollaborationsError: (state, action) => {
      state.collaborationsError = action.payload;
    },
    clearPendingRequestCount: (state) => {
      localStorage.setItem('lastSeenPendingRequestCount', state.rawPendingRequestCount.toString());
      state.pendingRequestCount = 0;
    },
    clearActiveCollabCount: (state) => {
      localStorage.setItem('lastSeenActiveCollabCount', state.rawActiveCollabCount.toString());
      state.activeCollabCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSidebarCounts.fulfilled, (state, action) => {
      const { pendingRequestCount, activeCollabCount } = action.payload;
      state.rawPendingRequestCount = pendingRequestCount;
      state.rawActiveCollabCount = activeCollabCount;

      // Check current location to auto-clear if user is already on the page
      const path = window.location.pathname;
      const isViewingRequests = path.includes('/requests');
      const isViewingCollabs = path.includes('/collaborations');

      if (isViewingRequests) {
        localStorage.setItem('lastSeenPendingRequestCount', pendingRequestCount.toString());
      }
      if (isViewingCollabs) {
        localStorage.setItem('lastSeenActiveCollabCount', activeCollabCount.toString());
      }

      // Persistence logic for Pending Requests
      const lastSeenPending = parseInt(localStorage.getItem('lastSeenPendingRequestCount') || '0');
      state.pendingRequestCount = pendingRequestCount > lastSeenPending ? pendingRequestCount : 0;

      // Persistence logic for Active Collaborations
      const lastSeenActive = parseInt(localStorage.getItem('lastSeenActiveCollabCount') || '0');
      state.activeCollabCount = activeCollabCount > lastSeenActive ? activeCollabCount : 0;
    });
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
  setNotifCounts,
  setCollaborations,
  setCollaborationsLoading,
  setCollaborationsError,
  clearPendingRequestCount,
  clearActiveCollabCount,
} = collaborationSlice.actions;

export default collaborationSlice.reducer;
