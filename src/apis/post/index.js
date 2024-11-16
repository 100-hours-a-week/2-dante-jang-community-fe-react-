import GATEWAY_URL from "../gateway.url";
import axiosInstance from "../axiosInstance";
import WritePostResponseDto from "./response/write-post.response.dto";
import UpdatePostResponseDto from "./response/update-post.response.dto";
import GetPostResponseDto from "./response/get-post.response.dto";

const DOMAIN = GATEWAY_URL;
const API_DOMAIN = `${DOMAIN}/api/v1/posts`;

const WRITE_POST_URL = () => `${API_DOMAIN}`;
const UPDATE_POST_URL = (postId) => `${API_DOMAIN}/${encodeURIComponent(postId)}`;
const GET_POST_URL = (postId) => `${API_DOMAIN}/${encodeURIComponent(postId)}`;

export const writePostRequest = async (title, content, image_url) => {
    try {
        const response = await axiosInstance.post(
            WRITE_POST_URL(),
            {title, content, image_url},
            { withCredentials: true }
        );
        const responseBody = new WritePostResponseDto(
            response.data.message,
            response.data.postId
        )
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const updatePostRequest = async (postId, content, title, image_url) => {
    try {
        const response = await axiosInstance.put(
            UPDATE_POST_URL(postId),
            { content, title, image_url },
            { withCredentials: true }
        );
        const responseBody = new UpdatePostResponseDto(
            response.data.message,
            response.data.postId
        )
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const getPostRequest = async (postId) => {
    try {
        const response = await axiosInstance.get(GET_POST_URL(postId));
        const responseBody = new GetPostResponseDto(
            response.data.message,
            response.data.post,
            response.data.user,
            response.data.comments
        );
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}