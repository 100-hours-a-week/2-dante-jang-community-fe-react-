import React from "react";
import { useParams } from 'react-router-dom';

const User = (props) => {
    const { userName } = useParams();

    return (
        <div className="my-page-wrapper">
            {/* 프로필 */}
            <div className="profile-wrapper">
                <p>Username: {userName}</p>
            </div>
            {/* 내 포스트 목록 */}
            <div className="post-list-wrapper">
            </div>
        </div>
    );
};

export default User;