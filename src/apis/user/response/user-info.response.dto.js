import ResponseDto from "../../response.dto";

export default class UserInfoResponseDto extends ResponseDto {
    constructor(user) {
        super();
        this.user=user;
    }
}