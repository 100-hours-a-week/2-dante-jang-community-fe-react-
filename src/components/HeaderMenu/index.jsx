import { React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_PATH, USER_PATH, SETTING_PATH } from "../../constants";
import { useSelector } from "react-redux";
import { logoutUser } from "../../stores/userSlice";
import { logoutRequest } from "../../apis/user";
import store from "../../stores/store";
import DefaultProfile from "../../assets/image/default-profile-image-dark.png"

const HeaderMenu = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [isToggle, setToggle] = useState(false);
    const headerMenuRef = useRef(null);

    const logout = async () => {
        const logoutResponse = await logoutRequest();
        if (logoutResponse) {
            store.dispatch(logoutUser());
            alert("로그아웃");
            window.location.reload();
        } else {
            alert("로그아웃에 실패 했습니다.");
        }
        
    }
    
    const setting = () => { navigate(SETTING_PATH()) }

    const loginNav = () => { navigate(LOGIN_PATH()); };

    const mypageNav = () => { navigate(USER_PATH(user.name)) };

    const toggleHeaderMenu = () => {
        setToggle((isToggle) => !isToggle);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (headerMenuRef.current && !headerMenuRef.current.contains(event.target)) {
                setToggle(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },
        [headerMenuRef]
    );

    const profileImageUrl = user.profile_url || DefaultProfile;

    return (
        <>
            {user.isLoggedIn ?
                <button className="profile-icon" onClick={toggleHeaderMenu}>
                    <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="profile-icon-image"
                    />
                </button> :
                <button className="hamburger-icon" onClick={toggleHeaderMenu}></button>
            }

            {isToggle &&
                <div ref={headerMenuRef} className="side-navigation">
                    {user.isLoggedIn ?
                    <>
                        <button className="side-nav-text" onClick={mypageNav}>마이페이지</button>
                        <button className="side-nav-text" onClick={logout}>로그아웃</button>
                        <button className="side-nav-text" onClick={setting}>설정</button>
                    </>
                    :
                    <button className="side-nav-text" onClick={loginNav}>로그인</button>}
                </div>
            }
        </>
    );
};

export default HeaderMenu;