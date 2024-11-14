import GATEWAY_URL from "../gateway.url";
import axiosInstance from "../axiosInstance";
import UploadImageResponseDto from "./response/upload-image.response.dto";

const DOMAIN = GATEWAY_URL;
const API_DOMAIN = `${DOMAIN}/api/v1/images`;

const UPLOAD_IMAGE_URL = () => `${API_DOMAIN}`

export const uploadImageRequest = async (formData) => {
    try {
        const response = await axiosInstance.post(
            UPLOAD_IMAGE_URL(),
            formData,
            {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        const responseBody = new UploadImageResponseDto(
            response.data.image_id,
            response.data.url
        );
        return responseBody;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};