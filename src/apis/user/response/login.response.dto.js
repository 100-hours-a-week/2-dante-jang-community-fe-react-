import ResponseDto from "../../response.dto";

export default class LoginResponseDto extends ResponseDto {
    constructor(name, email, profile_url, message) {
        super(message);
        this.name = name;
        this.email = email;
        this.profile_url = profile_url;
    }
}