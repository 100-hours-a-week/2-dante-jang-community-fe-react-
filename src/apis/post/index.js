import GATEWAY_URL from "../gateway.url";
import axiosInstance from "../axiosInstance";
import WritePostResponseDto from "./response/write-post.response.dto";

const DOMAIN = GATEWAY_URL;
const API_DOMAIN = `${DOMAIN}/api/v1/posts`;

const WRITE_POST_URL = () => `${API_DOMAIN}`

export const writePostRequest = async (title, content, image_url) => {
    try {
        const response = await axiosInstance.post(
            WRITE_POST_URL(),
            {title, content, image_url},
            { withCredentials: true }
        );
        const responseBody = new WritePostResponseDto(
            response.data.message,
            response.data.data.postId
        )
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}