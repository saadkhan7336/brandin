import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {

    const [isAuth,setIsAuth]=useState(null);

    useEffect(()=>{
        axios.get("http://localhost:5000/api/users/me",{
            withCredentials:true
         })
         .then(()=>{
            setIsAuth(true)
         })
         .catch(()=>{
            setIsAuth(false)
         });
    },[]);
if (isAuth===null){
    return <div>Loading...</div>
}

return isAuth ? <Outlet/>:<Navigate to="/login" replace />
}

export default ProtectedRoute
