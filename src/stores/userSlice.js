import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const SESSION_COOKIE_NAME = "session_token";

const userSlice = createSlice({
    name: "user",
    initialState: {
        name: null,
        email: null,
        profile_url: null,
        isLoggedIn: !!Cookies.get(SESSION_COOKIE_NAME)
    },
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.profile_url = action.payload.profile_url;
            state.isLoggedIn = true;
            console.log(state.profile_url)
            Cookies.set(SESSION_COOKIE_NAME, "active", { expires: 6 * 24 });
        },
        logoutUser: (state) => {
            state.name = null;
            state.email = null;
            state.profile_url = null;
            state.isLoggedIn = false;

            Cookies.remove(SESSION_COOKIE_NAME);
        },
        initUser: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.profile_url = action.payload.profile_url;
        }
    },
});

export const { setUser, logoutUser, initUser } = userSlice.actions;
export default userSlice.reducer;