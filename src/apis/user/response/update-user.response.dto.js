import ResponseDto from "../../response.dto";

export default class UpdateUserResponseDto extends ResponseDto {
    constructor(message, user) {
        super(message);
        this.user = user;
    }
};