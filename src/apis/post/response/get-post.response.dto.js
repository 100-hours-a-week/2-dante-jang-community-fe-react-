import ResponseDto from "apis/response.dto";

export default class GetPostResponseDto extends ResponseDto {
    constructor(message, post, user) {
        super(message);
        this.post = post;
        this.user = user;
    }
}