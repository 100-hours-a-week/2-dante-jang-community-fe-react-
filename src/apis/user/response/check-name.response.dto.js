import ResponseDto from "../../response.dto";

export default class CheckNameResponseDto extends ResponseDto {
    constructor(isDuplicated, message) {
        super(message)
        this.isDuplicated = isDuplicated;
    }
}