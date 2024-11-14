import React from "react";
import { Outlet } from 'react-router-dom'
import Header from "../Header";
import './style.css';

const Container = () => {
    return (
        <>
            <Header />
            <div className="outlet-wrapper">
                <Outlet />
            </div>
        </>
      )
};

export default Container;