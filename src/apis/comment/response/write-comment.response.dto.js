import ResponseDto from "apis/response.dto";

export default class WriteCommentResponseDto extends ResponseDto {
    constructor(message, commentId) {
        super(message);
        this.commentId = commentId;
    }
}