import GATEWAY_URL from "../gateway.url";
import axiosInstance from "apis/axiosInstance";
import CreateLikeResponseDto from "./response/create-like.response.dto";
import IsMyLikePostResponseDto from "./response/is-my-like-post.response.dto";
import ResponseDto from "apis/response.dto";
import GetPostLikeCountResponseDto from "./response/get-post-like-count.response.dto";

const DOMAIN = GATEWAY_URL;
const API_DOMAIN = `${DOMAIN}/api/v1/likes`;

const CREATE_LIKE_URL = () => `${API_DOMAIN}`;
const IS_MY_LIKE_POST_URL = (postId) => `${API_DOMAIN}/posts/${postId}/users`;
const DELETE_LIKE_URL = (postId) => `${API_DOMAIN}/posts/${postId}/users`;
const GET_POST_LIKE_COUNT_URL = (postId) => `${API_DOMAIN}/posts/${postId}`;

export const createLikeRequest = async(postId) => {
    try {
        const response = await axiosInstance.post(
            CREATE_LIKE_URL(),
            { postId },
            { withCredentials: true }
        )
        return new CreateLikeResponseDto(
            response.data.message,
            response.data.likeId
        );
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const isMyLikePostRequest = async (postId) => {
    try {
        const response = await axiosInstance.get(
            IS_MY_LIKE_POST_URL(postId),
            { withCredentials: true }
        );
        return new IsMyLikePostResponseDto(
            response.data.message,
            response.data.isMyLikePost
        );
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const deleteLikeRequest = async (postId) => {
    try {
        const response = await axiosInstance.delete(
            DELETE_LIKE_URL(postId),
            { withCredentials: true }
        );
        return new ResponseDto(
            response.data.message
        );
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const getPostLikeCountRequest = async (postId) => {
    try {
        const response = await axiosInstance.get(GET_POST_LIKE_COUNT_URL(postId));
        return new GetPostLikeCountResponseDto(
            response.data.message,
            response.data.likeCount
        );
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}