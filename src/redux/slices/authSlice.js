import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null,
    isAuthenticated:false,
    loading:true,
    error:null,
    message:null,
    otpVerified:false,
    resetEmail:null,
};

const authSlice=createSlice({

    name:"auth",
    initialState,
    reducers:{
        setAuthUser:(state,action)=>{
            state.user=action.payload;
            state.isAuthenticated=true;
            state.loading =false;
        },
        logoutSuccess:(state)=>{
            state.user=null;
            state.isAuthenticated=false;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        setMessage:(state,action)=>{
            state.message=action.payload;
            state.loading=false;
        },
        setOtpVerified:(state,action)=>{
            state.otpVerified=action.payload;
        },
        setResetEmail:(state,action)=>{
            state.resetEmail=action.payload;
        },
        clearAuthState:(state)=>{
            state.error=null;
            state.message=null;
            state.loading=false;
        }
    },
});

export const {
    setAuthUser,
    logoutSuccess,
    setLoading,
    setError,
    setMessage,
    setOtpVerified,
    setResetEmail,
    clearAuthState
}=authSlice.actions;

export default authSlice.reducer