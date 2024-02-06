import React from "react";

import { Navigate, useLocation } from "react-router-dom";

export const setToken = (token) => {
    localStorage.setItem('loginToken', token)
}

export const fetchToken = () => {
    return localStorage.getItem('loginToken')
}

export function RequireToken({children}){
    
    let auth = fetchToken()
    let location = useLocation();

    if (!auth) {
        return <Navigate to='/login' state={{from: location}} />;
    }
    return children;
}
