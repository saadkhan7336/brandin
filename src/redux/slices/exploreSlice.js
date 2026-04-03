import { createSlice } from "@reduxjs/toolkit";
 
const initialState = {
  campaigns: [],
  brands: [],
  activeTab: "campaigns",   // "campaigns" | "brands"
  loading: false,
  error: null,
  filters: {
    search: "",
    industry: "",
    platform: "",
    page: 1,
    limit: 12,
  },
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
};
 
const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      state.filters.page = 1; // reset page on tab switch
    },
    setExploreLoading: (state, action) => {
      state.loading = action.payload;
      if (action.payload) state.error = null;
    },
    setExploreError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setExploreCampaigns: (state, action) => {
      state.campaigns = action.payload.campaigns;
      state.pagination = {
        total: action.payload.total,
        page: action.payload.page,
        pages: action.payload.pages,
      };
      state.loading = false;
    },
    setExploreBrands: (state, action) => {
      state.brands = action.payload.brands;
      state.pagination = {
        total: action.payload.total,
        page: action.payload.page,
        pages: action.payload.pages,
      };
      state.loading = false;
    },
    setExploreFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setExplorePage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetExploreFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});
 
export const {
  setActiveTab,
  setExploreLoading,
  setExploreError,
  setExploreCampaigns,
  setExploreBrands,
  setExploreFilters,
  setExplorePage,
  resetExploreFilters,
} = exploreSlice.actions;
 
export default exploreSlice.reducer;