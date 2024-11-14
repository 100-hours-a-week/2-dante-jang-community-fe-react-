import ResponseDto from "../../response.dto";

export default class CheckPasswordResponseDto extends ResponseDto {
    constructor(message, isMatch) {
        super(message)
        this.isMatch = isMatch
    }
}