import ResponseDto from "apis/response.dto";

export default class GetPostLikeCountResponseDto extends ResponseDto {
    constructor(message, likeCount) {
        super(message);
        this.likeCount = likeCount;
    }
}