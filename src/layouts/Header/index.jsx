import { React } from "react";
import { FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import HeaderMenu from "../../components/HeaderMenu"
import { MAIN_PATH, WRITE_POST_PATH } from "../../constants";
import './style.css';

const Header = () => {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const mainNav = () => { navigate(MAIN_PATH()); };
    const writePostNav = () => { navigate(WRITE_POST_PATH()); };

    return (
        <div className="header">
            <div className="header-wrapper">
                <div className="header-left">
                    <button className="logo" onClick={mainNav}> Community </button>
                </div>
                
                <div className="header-right">
                    {isLoggedIn && 
                    <button className="header-write-button" onClick={writePostNav}>
                        <FiEdit className="header-write-icon" />
                        Write
                    </button>}
                    <HeaderMenu />
                </div>
            </div>
        </div>
    );
};

export default Header;