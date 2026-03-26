import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice.js'
import campaignReducer from './slices/campaignSlice.js'
const store = configureStore({
    reducer:{
        auth:authReducer,
        campaign:campaignReducer,
    }
})   

export default store;