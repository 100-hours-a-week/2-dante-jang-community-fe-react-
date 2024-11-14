import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkEmailRequest, checkNameRequest, signUpRequest } from "../../apis/user";
import { LOGIN_PATH } from "../../constants";
import'./style.css';

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [fromSuccess, setFormSuccess] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errors = { ...formErrors };
        let success = { ...fromSuccess };

        if (name === "name") {
            const nameRegex = /^[a-z0-9_]+$/;
            if (!value || value.length < 3) {
                errors.name = "이름은 3글자 이상이어야 합니다.";
                success.name = "";
            } else if (!nameRegex.test(value)) {
                errors.name = "이름은 영어 소문자, 숫자, _만 사용할 수 있습니다.";
                success.name = "";
            } else {
                errors.name = "중복체크를 해주세요.";
                success.name = "";
            }
        } else if (name === "email") {
            if (!value) {
                errors.email = "이메일을 입력해 주세요.";
                success.email = "";
            } else {
                errors.email = "중복체크를 해주세요.";
                success.email = "";
            }
        } else if (name === "password") {
            if (!value || value.length < 8) {
                errors.password = "비밀번호는 8자리 이상이어야 합니다.";
                success.password = "";
            } else if (!/[a-z]/.test(value)) {
                errors.password = "비밀번호에 소문자가 포함되어야 합니다.";
                success.password = "";
            } else if (!/[A-Z]/.test(value)) {
                errors.password = "비밀번호에 대문자가 포함되어야 합니다.";
                success.password = "";
            } else if (!/\d/.test(value)) {
                errors.password = "비밀번호에 숫자가 포함되어야 합니다.";
                success.password = "";
            } else if (!/[!@#$%^&*]/.test(value)) {
                errors.password = "비밀번호에 특수 문자가 포함되어야 합니다.";
                success.password = "";
            } else {
                errors.password = "";
                success.password = "안전한 비밀번호입니다.";
            }
        } else if (name === "confirmPassword") {
            if (value === formData.password) {
                errors.confirmPassword = "";
                success.confirmPassword = "일치합니다.";
            } else {
                errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
                success.confirmPassword = "";
            }
        }

        setFormErrors(errors);
        setFormSuccess(success);
    }

    const checkEmail = async () => {
        const email = formData.email.trim();

        if (!email) {
            setFormErrors({ ...formErrors, email: "이메일을 입력해 주세요." });
            setFormSuccess({ ...fromSuccess, email: "" });
            return;
        }

        const checkEmailResponse = await checkEmailRequest(email);
        if (checkEmailResponse) {
            if (checkEmailResponse.isDuplicated) {
                setFormErrors({ ...formErrors, email: "이미 사용 중인 이메일입니다." });
                setFormSuccess({ ...fromSuccess, email: "" });
            } else {
                setFormErrors({ ...formErrors, email: "" });
                setFormSuccess({ ...fromSuccess, email: "사용 가능한 이메일입니다." });
            }
        } else {
            setFormErrors({ ...formErrors, email: "이메일 확인 중 오류가 발생했습니다." });
            setFormSuccess({ ...fromSuccess, email: "" });
        }
    }

    const checkName = async () => {
        const name = formData.name.trim();

        if (!name) {
            setFormErrors({ ...formErrors, name: "이름을 입력해 주세요." });
            setFormSuccess({ ...fromSuccess, name: "" });
            return;
        }

        const checkNameResponse = await checkNameRequest(name);
        if (checkNameResponse) {
            if (checkNameResponse.isDuplicated) {
                setFormErrors({ ...formErrors, name: "이미 사용 중인 이름입니다." });
                setFormSuccess({ ...fromSuccess, name: "" });
            } else {
                setFormErrors({ ...formErrors, name: "" });
                setFormSuccess({ ...fromSuccess, name: "사용 가능한 이름입니다." });
            }
        } else {
            setFormErrors({ ...formErrors, name: "이름 확인 중 오류가 발생했습니다." });
            setFormSuccess({ ...fromSuccess, name: "" });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = Object.values(formErrors).every((error) => error === "") &&
                        Object.values(formData).every((value) => value);

        if (isValid) {
            const signUpResponse = await signUpRequest(
                formData.name,
                formData.email,
                formData.password,
                formData.confirmPassword
            );
            if (signUpResponse) {
                alert("회원가입이 완료되었습니다.");
                navigate(LOGIN_PATH());
            } else {
                alert("회원가입 중 오류가 발생하였습니다.");
            }
        } else {
            alert("모든 필드를 올바르게 입력해 주세요.");
        }
    };

    return (
        <div className="sign-up-form">
            <h2>회원가입</h2>

            <form onSubmit={handleSubmit}>
                {/* 이름 */}
                <div className="form-group">
                <label>이름</label>
                    <div className="input-wrapper">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        <button className="duplicated-check-btn" type="button" onClick={checkName}>중복체크</button>
                    </div>
                    <div className="error">{formErrors.name}</div>
                    <div className="success">{fromSuccess.name}</div>
                </div>
                {/* 이메일 */}
                <div className="form-group">
                    <label>이메일</label>
                    <div className="input-wrapper">
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        <button className="duplicated-check-btn" type="button" onClick={checkEmail}>중복체크</button>
                    </div>
                    <div className="error">{formErrors.email}</div>
                    <div className="success">{fromSuccess.email}</div>
                </div>
                {/* 비밀번호 */}
                <div className="form-group">
                    <label>비밀번호</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    <div className="error">{formErrors.password}</div>
                    <div className="success">{fromSuccess.password}</div>
                </div>
                {/* 비밀번호 확인 */}
                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    <div className="error">{formErrors.confirmPassword}</div>
                    <div className="success">{fromSuccess.confirmPassword}</div>
                </div>
                {/* 회원가입 버튼 */}
                <button className="sign-up-btn" type="submit">가입하기</button>
            </form>
        </div>
    );
};

export default SignUp;