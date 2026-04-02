import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js'
import campaignReducer from './slices/campaignSlice.js'
import exploreReducer from './slices/exploreSlice.js'
const store = configureStore({
    reducer:{
        auth:authReducer,
        campaign:campaignReducer,
        explore: exploreReducer, 
    }
})      

export default store;