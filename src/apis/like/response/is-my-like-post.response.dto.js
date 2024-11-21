import ResponseDto from "apis/response.dto";

export default class IsMyLikePostResponseDto extends ResponseDto {
    constructor(message, isMyLikePost) {
        super(message);
        this.isMyLikePost=isMyLikePost;
    }
}