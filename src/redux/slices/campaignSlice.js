import { createSlice } from "@reduxjs/toolkit";

// const campaignSlice = createSlice({
//   name: "campaign",
//   initialState,
//   reducers: {
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },

//     setCampaigns: (state, action) => {
//       state.campaigns = action.payload.campaigns;
//       state.total = action.payload.total;
//       state.page = action.payload.page;
//       state.pages = action.payload.pages;
//     },

//     setError: (state, action) => {
//       state.error = action.payload;
//     },

//     setFilters: (state, action) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },

//     addCampaign: (state, action) => {
//       state.campaigns.unshift(action.payload);
//     }
//   }
// });

const initialState = {
    campaigns: [],
    selectedCampaign: null,

    // pagination
    total: 0,
    page: 1,
    pages: 1,

    // UI states
    loading: false,
    error: null,

    // filters (connected to backend query)
    filters: {
        page: 1,
        limit: 10,
        status: "",
        search: ""
    }
};

const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {

        // LOADING & ERROR
        setLoading: (state, action) => {
            state.loading = action.payload;
            if (action.payload) state.error = null; // reset error on new request
        },
        setError: (state, action) => {
            state.error = action.payload;
        },

        // FETCH ALL CAMPAIGNS
        setCampaigns: (state, action) => {
            state.campaigns = action.payload.campaigns;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.pages = action.payload.pages;
        },


        // SINGLE CAMPAIGN
        setSelectedCampaign: (state, action) => {
            state.selectedCampaign = action.payload;
        },

        // CREATE CAMPAIGN
        addCampaign: (state, action) => {
            state.campaigns.unshift(action.payload);
            state.total += 1;
        },

        // UPDATE CAMPAIGN
        updateCampaignInState: (state, action) => {
            const index = state.campaigns.findIndex(
                (campaign) => campaign._id === action.payload._id
            );
            // update in list if found 
            if (index !== -1) {
                state.campaigns[index] = action.payload;
            }
            // update selected campaign if same id
            if (state.selectedCampaign?._id === action.payload._id) {
                state.selectedCampaign = action.payload;
            }
        },

        // DELETE CAMPAIGN (SOFT DELETE HANDLED)
        removeCampaign: (state, action) => {
            state.campaigns = state.campaigns.filter(
                (campaign) => campaign._id !== action.payload
            );
            state.total -= 1;
        },

        // FILTERS
        setFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload
            };
        },

        // RESET FILTERS
        resetFilters: (state) => {
            state.filters = initialState.filters;
        }
    }
})

export const {
    setLoading,
    setError,
    setCampaigns,
    setSelectedCampaign,
    addCampaign,
    updateCampaignInState,
    removeCampaign,
    setFilters,
    resetFilters
} = campaignSlice.actions;

export default campaignSlice.reducer;