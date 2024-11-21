import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import DefaultProflie from 'assets/image/default-profile-image-dark.png'
import { userInfoWithNameRequest } from "apis/user";
import { ERROR_PATH } from "constants";
import UserPostList from "components/post/UserPostList";

const User = (props) => {
    const navigate = useNavigate();
    const { userName } = useParams();
    const [ userInfo, setUserInfo ] = useState([]);
    const [activeTab, setActiveTab] = useState("Posts");
    const tabs = ["Posts"];

    useEffect(() => {
        const userInfo = async () => {
            const userInfoResponse = await userInfoWithNameRequest(userName);
            if (!userInfoResponse) {
                navigate(ERROR_PATH());
            } else {
                setUserInfo(userInfoResponse.user);
            }
        }
        userInfo();
    }, [userName, setUserInfo, navigate]);

    return (
        <div className="my-page-wrapper">
            {/* 프로필 */
                <div style={styles.profileSection}>
                    <img 
                        style={styles.profileImage} 
                        src={userInfo?.profile_url ? userInfo.profile_url : DefaultProflie} 
                        alt={userInfo?.name || userName}
                    />
                    <p>@{userName}</p>
                </div>
            }
            {/* 탭 뷰 */
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <div
                            style={{
                                ...styles.tab,
                                ...(activeTab === tab && styles.tabActive)
                            }}
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            }
            {/* 내 포스트 목록 */
                activeTab === tabs[0] && userInfo?.user_id &&
                <UserPostList userId={userInfo.user_id} />
            }
        </div>
    );
};

const styles = {
    myPageWrapper: {
        width: "100%",
        // maxWidth: "60rem",
        margin: "0 auto",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
    },
    profileSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "1rem",
        padding: "1rem",
        border: "0.0625rem solid #ccc",
        borderRadius: "0.5rem",
        backgroundColor: "#f9f9f9",
        width: "100%",
    },
    profileImage: {
        width: "6rem", // 프로필 이미지 크기
        height: "6rem",
        borderRadius: "50%",
        objectFit: "cover",
        border: "0.125rem solid #ddd",
    },
    tabs: {
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        width: "100%",
        borderBottom: "0.0625rem solid #ccc",
    },
    tab: {
        padding: "0.75rem 1rem",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#555",
        borderBottom: "0.1875rem solid transparent",
        transition: "color 0.2s ease, border-bottom 0.2s ease",
    },
    tabActive: {
        color: "#111",
        borderBottom: "0.1875rem solid #111",
    },
}

export default User;