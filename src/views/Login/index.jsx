import React, { useState } from "react";
import { SIGNUP_PATH } from "../../constants";
import { useDispatch } from "react-redux";
import { loginRequest } from "../../apis/user";
import { setUser } from "../../stores/userSlice";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "../../constants";
import './style.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [formError, setFormError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let error = formError;

        switch (name) {
            case "email":
                error = value ? "" : "이메일을 입력해 주세요.";
                break;
            case "password":
                error = value ? "" : "비밀번호를 입력해 주세요.";
                break;
            default:
                break;
        }

        setFormError(error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.email === "" || !formData.email) {
            setFormError("이메일을 입력해 주세요.");
            return;
        } else if (formData.password === "" || !formData.password) {
            setFormError("비밀번호를 입력해 주세요.");
            return;
        }

        const loginResponse = await loginRequest(formData.email, formData.password);
        if (loginResponse) {
            dispatch(setUser({
                name: loginResponse.name,
                email: loginResponse.email,
                profile_url: loginResponse.profile_url,
            }));
            navigate(MAIN_PATH());
        } else {
            setFormError("이메일 또는 비밀번호가 틀렸습니다.");
        }
    };

    return (
        <div className="login-form">
            <h2>로그인</h2>

            <form onSubmit={handleSubmit}>
                {/* 이메일 */}
                <div className="form-group">
                    <label>이메일</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required></input>
                </div>
                {/* 비번 */}
                <div className="form-group">
                    <label>비밀번호</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required></input>
                </div>
                {/* 에러 */}
                <div className="error">{formError}</div>
                {/* 로그인 버튼 */}
                <button type="submit">로그인</button>
            </form>

            {/* 회원가입 링크 */}
            <div className="signup-link">
                <a href={SIGNUP_PATH()}>회원가입</a>
            </div>
        </div>
    );
};

export default Login;