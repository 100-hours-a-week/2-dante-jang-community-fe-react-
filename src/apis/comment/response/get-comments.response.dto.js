import ResponseDto from "apis/response.dto";

export default class GetCommentsResponse extends ResponseDto {
    constructor(message, comments) {
        super(message);
        this.comments = comments;
    }
}