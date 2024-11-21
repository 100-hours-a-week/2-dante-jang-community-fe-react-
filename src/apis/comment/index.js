import GATEWAY_URL from "../gateway.url";
import axiosInstance from "../axiosInstance";
import GetCommentsResponse from "./response/get-comments.response.dto";
import WriteCommentResponseDto from "./response/write-comment.response.dto";
import ResponseDto from "apis/response.dto";

const DOMAIN = GATEWAY_URL;
const API_DOMAIN = `${DOMAIN}/api/v1/comments`;

const GET_COMMENTS_URL = (postId) => `${API_DOMAIN}/posts/${encodeURIComponent(postId)}`;
const WRITE_COMMENT_URL = () => `${API_DOMAIN}`;
const DELETE_COMMENT_URL = (commentId) => `${API_DOMAIN}/${encodeURIComponent(commentId)}`;

export const getCommentsRequest = async (postId) => {
    try {
        const response = await axiosInstance.get(GET_COMMENTS_URL(postId));
        const responseBody = new GetCommentsResponse(
            response.data.message,
            response.data.comments
        )
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const writeCommentRequest = async (postId, content) => {
    try {
        const response = await axiosInstance.post(
            WRITE_COMMENT_URL(),
            { postId, content },
            { withCredentials:true }
        );
        const responseBody = new WriteCommentResponseDto(
            response.data.message,
            response.data.commentId
        );
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export const deleteCommentRequset = async (commentId) => {
    try {
        const response = await axiosInstance.delete(
            DELETE_COMMENT_URL(commentId),
            { withCredentials:true }
        );
        return new ResponseDto(response.data.message);
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}