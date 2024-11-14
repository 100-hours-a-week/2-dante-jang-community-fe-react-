import axiosInstance from "../axiosInstance";
import CheckEmailResponseDto from "./response/check-email.response.dto";
import SignUpResponseDto from "./response/sign-up.response.dto";
import LoginResponseDto from "./response/login.response.dto";
import LogoutResponseDto from "./response/logout.response.dto";
import CheckNameResponseDto from "./response/check-name.response.dto";
import UserInfoResponseDto from "./response/user-info.response.dto";
import UpdateUserResponseDto from "./response/update-user.response.dto";
import CheckPasswordResponseDto from "./response/check-password.response.dto";
import ResponseDto from "../response.dto";
import GATEWAY_URL from "../gateway.url";

const DOMAIN = GATEWAY_URL;
const API_DOMAIN = `${DOMAIN}/api/v1/users`;

const CHECK_EMAIL_URL = (email) => `${API_DOMAIN}/check-email?email=${encodeURIComponent(email)}`;
const CHECK_NAME_URL = (name) => `${API_DOMAIN}/check-name?name=${encodeURIComponent(name)}`;
const CHECK_USER_PASSWORD_URL = () => `${API_DOMAIN}/check-password`;
const SIGN_UP_URL = () => `${API_DOMAIN}`;
const USER_INFO_URL = () => `${API_DOMAIN}`;
const LOGIN_URL = () => `${API_DOMAIN}/login`;
const LOGOUT_URL = () => `${API_DOMAIN}/logout`;
const CHANGE_USER_PROFILE_URL = () => `${API_DOMAIN}/change-profile`;
const CHANGE_USER_NAME_URL = () => `${API_DOMAIN}/change-name`;
const CHANGE_USER_PASSWORD_URL = () => `${API_DOMAIN}/change-password`;
const DELETE_USER_URL = () => `${API_DOMAIN}`;

export const checkEmailRequest = async (email) => {
    try {
        const response = await axiosInstance.get(CHECK_EMAIL_URL(email));
        const responseBody = new CheckEmailResponseDto(
            response.data.isDuplicated,
            response.data.message
        );
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const checkNameRequest = async (name) => {
    try {
        const response = await axiosInstance.get(CHECK_NAME_URL(name));
        const responseBody = new CheckNameResponseDto(
            response.data.isDuplicated,
            response.data.message
        );
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const signUpRequest = async (name, email, password, confirmPassword) => {
    try {
        const response = await axiosInstance.post(SIGN_UP_URL(), { name, email, password, confirmPassword });
        const responseBody = new SignUpResponseDto(response.data.message);
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const loginRequest = async (email, password) => {
    try {
        const response = await axiosInstance.post(
            LOGIN_URL(),
            { email, password },
            { withCredentials: true }
        );
        const responseBody = new LoginResponseDto(
            response.data.name,
            response.data.email,
            response.data.profile_url,
            response.data.message
        );
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const logoutRequest = async () => {
    try {
        const response = await axiosInstance.post(
            LOGOUT_URL(),
            {},
            { withCredentials: true }
        );
        const responseBody = new LogoutResponseDto(response.data.message);
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const userInfoRequest = async () => {
    try {
        const response = await axiosInstance.get(
            USER_INFO_URL(),
            { withCredentials: true }
        );
        const responseBody = new UserInfoResponseDto(response.data.user);
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const changeUserProfileRequest = async (formData) => {
    try {
        const response = await axiosInstance.patch(
            CHANGE_USER_PROFILE_URL(),
            formData,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        const responseBody = new UpdateUserResponseDto(response.data.message, response.data.user);
        return responseBody
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const changeUserNameRequest = async (name) => {
    try {
        const response = await axiosInstance.patch(
            CHANGE_USER_NAME_URL(),
            { name },
            { withCredentials: true }
        );
        const responseBody = new UpdateUserResponseDto(response.data.message, response.data.user);
        return responseBody
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const checkPasswordRequest = async (password) => {
    try {
        const response = await axiosInstance.post(
            CHECK_USER_PASSWORD_URL(),
            { password },
            { withCredentials: true }
        );
        const responseBody = new CheckPasswordResponseDto(response.data.message, response.data.isMatch);
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const changePasswordRequest = async (password, checkPassword) => {
    try {
        const response = await axiosInstance.patch(
            CHANGE_USER_PASSWORD_URL(),
            { password, checkPassword },
            { withCredentials: true }
        );
        const responseBody = new ResponseDto(response.data.message);
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const deleteUserRequsest = async () => {
    try {
        const response = await axiosInstance.delete(
            DELETE_USER_URL(),
            { withCredentials: true }
        );
        const responseBody = new ResponseDto(response.data.message);
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}