import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js'
import campaignReducer from './slices/campaignSlice.js'
import notificationReducer from './slices/notificationSlice.js'
import collaborationReducer from './slices/collaborationSlice.js'
import exploreReducer from './slices/exploreSlice.js'
import profileReducer from './slices/Profileslice.js'

const store = configureStore({
    reducer: {
        auth: authReducer,
        campaign: campaignReducer,
        notifications: notificationReducer,
        collaboration: collaborationReducer,
        explore: exploreReducer,
        profile: profileReducer,
    }
})

export default store;