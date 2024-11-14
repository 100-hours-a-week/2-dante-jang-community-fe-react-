import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultProfileImage from "../../assets/image/default-profile-image-dark.png"
import "./style.css";
import { initUser } from "../../stores/userSlice";
import { changeUserNameRequest, changeUserProfileRequest } from "../../apis/user";
import FormData from "form-data";
import { PasswordChangeModal } from "../../components/setting/ChangePasswordModal";
import { DeleteConfirmationModal } from "../../components/setting/deleteUserModal";

const Setting = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(user.name);
    const [profileImage, setProfileImage] = useState(user.profile_url);
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [nicknameErrors, setNicknameErrors] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        setProfileImage(user.profile_url);
        setNickname(user.name);
    }, [user.profile_url, user.name]);

    const handleEditClick = () => setIsEditing(true);

    const handleChangePasswordClick = () => setIsPasswordModalOpen(true);

    const deletButtonClick = () => setIsDeleteUserModalOpen(true);

    const validateNickname = (nickname) => {
        const nicknameRegex = /^[a-z0-9_]+$/;
        if (!nickname || nickname.length < 3) {
            setNicknameErrors("닉네임은 3글자 이상이어야 합니다.");
            return false;
        } else if (!nicknameRegex.test(nickname)) {
            setNicknameErrors("닉네임은 영어 소문자, 숫자, _만 사용할 수 있습니다.");
            return false;
        } else {
            setNicknameErrors("");
            return true;
        }
    }

    const handleNicknameChange = (event) => {
        const newNickname = event.target.value;
        setNickname(newNickname);
        validateNickname(newNickname);
    }

    const handleProfileImageClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("파일 크기는 5MB 이하로 업로드해야 합니다.");
                return;
            }
            setNewProfileImage(file);
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        let profileUpdateSuccess = true;
        let nameUpdateSuccess = true;

        if (user.name !== nickname && nicknameErrors === "") {
            console.log(user)
            try {
                const updateUser = await changeUserNameRequest(nickname);
                dispatch(initUser({
                    name: updateUser.user.name,
                    email: user.email,
                    profile_url: user.profile_url
                }));
            } catch (error) {
                nameUpdateSuccess = false;
                console.error("Failed to update name:", error);
            }
        }

        if (newProfileImage) {
            try {
                const formData = new FormData();
                formData.append("profileImage", newProfileImage, newProfileImage.name);
                const updatedUser = await changeUserProfileRequest(formData);
                dispatch(initUser({
                    name: user.name,
                    email: user.email,
                    profile_url: updatedUser.user.profile_url
                }));
                console.log(updatedUser.user.profile_url)
            } catch (error) {
                profileUpdateSuccess = false;
                console.error("Failed to update profile:", error);
            }
        }

        if (nameUpdateSuccess && profileUpdateSuccess) {
            alert("저장 완료.");
            setIsEditing(false);
        } else {
            alert(profileUpdateSuccess ? "이미 사용 중인 이름입니다." : "프로필 변경 실패");
        }
    };

    return (
        <div className="setting-wrapper">
            <div className="title">
                <h2>설정</h2>
            </div>
            <div className="profile-form">
                {/* 프로필 이미지 */}
                <div className="setting-page-profile-image-wrapper">
                    <img
                        className={`setting-page-profile-image ${isEditing ? 'editable' : ''}`}
                        src={profileImage || DefaultProfileImage}
                        alt="User profile"
                        onClick={handleProfileImageClick}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="profile-image-input"
                        style={{ display: 'none' }}
                    />
                    {isEditing && (
                        <div className="profile-image-edit-hint">Click to change</div>
                    )}
                </div>
                {/* 이메일 */}
                <div className="form-group">
                    <label>이메일</label>
                    <div className="email-field">{user.email}</div>
                </div>
                {/* 닉네임 */}
                <div className="form-group">
                    <label>닉네임</label>
                    {isEditing ? (
                        <input
                            id="nickname"
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                            className="nickname-input"
                        />
                    ) : (
                        <div className="name-field">{user.name}</div>
                    )}
                    <div className="error">{nicknameErrors}</div>
                </div>
            </div>
            
            <div className="button-wrapper">
            {isEditing ? (
                    <>
                        <button type="button" className="save-button" onClick={handleSave} disabled={nicknameErrors !== ""}>
                            저장
                        </button>
                        <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                            취소
                        </button>
                    </>
                ) : (
                    <>
                        <button type="button" className="change-userinfo-button" onClick={handleEditClick}>
                            정보 수정
                        </button>
                        <button type="button" className="change-password-button" onClick={handleChangePasswordClick}>비밀번호 번경</button>
                        <button type="button" className="delete-user-button" onClick={deletButtonClick}>탈퇴</button>
                    </>
                )}
            </div>
            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
            <DeleteConfirmationModal 
                isOpen={isDeleteUserModalOpen}
                onClose={() => setIsDeleteUserModalOpen(false)}
            />
        </div>
    );
};

export default Setting;