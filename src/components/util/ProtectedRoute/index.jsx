import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LOGIN_PATH } from '../../../constants';

export const ProtectedRoute = ({ children }) => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to={LOGIN_PATH()} />;
    }

    return children;
};