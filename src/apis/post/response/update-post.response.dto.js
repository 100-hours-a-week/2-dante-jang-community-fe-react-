import ResponseDto from "apis/response.dto";

export default class UpdatePostResponseDto extends ResponseDto {
    constructor(message, postId) {
        super(message);
        this.postId=postId;
    };
};