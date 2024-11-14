import axios from "axios";
import store from "../stores/store";
import { logoutUser } from "../stores/userSlice";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 412) {
            store.dispatch(logoutUser());
            alert("로그인 세션이 만료되었습니다.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;