import ResponseDto from "../../response.dto";

export default class CheckEmailResponseDto extends ResponseDto {
    constructor(isDuplicated, message) {
        super(message)
        this.isDuplicated = isDuplicated;
    }
}