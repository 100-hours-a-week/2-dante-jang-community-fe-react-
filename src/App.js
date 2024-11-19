import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Container from 'layouts/Container';
import Main from 'views/Main';
import SignUp from 'views/SignUp';
import User from 'views/User';
import Login from 'views/Login';
import Setting from 'views/Setting';
import PostDetail from 'views/PostDetail';
import ModifyPost from 'views/ModifyPost';
import { ProtectedRoute } from 'components/util/ProtectedRoute';
import { RedirectRoute } from 'components/util/RedirectRoute';
import { useSelector, useDispatch } from 'react-redux';
import { userInfoRequest } from 'apis/user';
import { logoutUser, initUser } from 'stores/userSlice';
import { 
        MAIN_PATH, 
        LOGIN_PATH, 
        SIGNUP_PATH, 
        USER_PATH, 
        SETTING_PATH, 
        WRITE_POST_PATH, 
        POST_PATH,
        ERROR_PATH,
        MODIFY_POST_PATH
    } from './constants';
import WritePost from './views/WritePost';
import Error from 'views/\bError';
import 'App.css'

function App() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (isLoggedIn) {
                const userInfoResponse = await userInfoRequest();
                if (userInfoResponse) {
                    dispatch(initUser({
                        name: userInfoResponse.user.name,
                        email: userInfoResponse.user.email,
                        profile_url: userInfoResponse.user.profile_url,
                    }));
                } else {
                    dispatch(logoutUser());
                }
            }
        };
        
        fetchUserInfo();
    }, [isLoggedIn, dispatch]);

    return (
        <Routes>
            <Route element={<Container />}>
                <Route path={MAIN_PATH()} element={<Main />} />
                <Route path={ERROR_PATH()} element={<Error />} />
                <Route path={USER_PATH(`:userName`)} element={<User />} />
                <Route path={POST_PATH(`:userName`, `:postTitle`, `:postId`)} element={<PostDetail />} />

                <Route path={LOGIN_PATH()} element={<RedirectRoute><Login /></RedirectRoute>} />
                <Route path={SIGNUP_PATH()} element={<RedirectRoute><SignUp /></RedirectRoute>} />

                <Route path={SETTING_PATH()} element={<ProtectedRoute><Setting /></ProtectedRoute>} />
                <Route path={WRITE_POST_PATH()} element={<ProtectedRoute><WritePost /></ProtectedRoute>} />
                <Route path={MODIFY_POST_PATH(`:postId`)} element={<ProtectedRoute><ModifyPost /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}

export default App;
