import ResponseDto from "apis/response.dto";

export default class PostListResponseDto extends ResponseDto {
    constructor(message, posts) {
        super(message);
        this.posts = posts;
    }
}