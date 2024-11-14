import ResponseDto from "apis/response.dto";

export default class WritePostResponseDto extends ResponseDto {
    constructor(message, postId) {
        super(message);
        this.postId = postId;
    }
}