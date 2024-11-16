// Main
export const MAIN_PATH = () => '/';

// Auth
export const LOGIN_PATH = () => '/login';
export const SIGNUP_PATH = () => '/sign-up';

// User
export const SETTING_PATH = () => '/setting';
export const USER_PATH = (userName) => `/${userName}`;

// Post
export const POST_PATH = (userName, postTitle, postId) => `/${userName}/${postTitle}/${postId}`;
export const WRITE_POST_PATH = () => '/write-post'

// Error
export const ERROR_PATH = () => '/error'