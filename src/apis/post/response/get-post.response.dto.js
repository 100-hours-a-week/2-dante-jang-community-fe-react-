import ResponseDto from "apis/response.dto";

export default class GetPostResponseDto extends ResponseDto {
    constructor(message, post, user, comments) {
        super(message);
        this.post = post;
        this.user = user;
        this.comments = comments;
    }
}