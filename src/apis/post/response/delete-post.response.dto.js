import ResponseDto from "apis/response.dto"

export default class DeletePostResponseDto extends ResponseDto {
    constructor(message, postId) {
        super(message);
        this.postId = postId;
    }
}