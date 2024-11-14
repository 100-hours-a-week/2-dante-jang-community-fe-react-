import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MAIN_PATH } from "../../../constants";


export const RedirectRoute = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    if (isLoggedIn) {
        return <Navigate to={MAIN_PATH()} />
    }

    return children;
}