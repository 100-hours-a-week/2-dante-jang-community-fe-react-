import ResponseDto from "apis/response.dto";

export default class CreateLikeResponseDto extends ResponseDto {
    constructor(message, likeId) {
        super(message);
        this.likeId = likeId;
    }
}