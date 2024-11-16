import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { POST_PATH, ERROR_PATH } from "constants";
import { getPostRequest } from "apis/post";
import { useSelector } from "react-redux";

const PostDetail = () => {
    const { userName, postTitle, postId } = useParams();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [postUser, setPostUser] = useState(null);
    const [postComments, setPostComments] = useState(null);
    const [isMyPost, setIsMyPost] = useState(false);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const getPostResponse = await getPostRequest(postId);
                if (!getPostResponse) {
                    navigate(ERROR_PATH());
                    return;
                }

                if (userName !== getPostResponse.user.name || postTitle !== getPostResponse.post.title) {
                    navigate(POST_PATH(getPostResponse.user.name, getPostResponse.post.title, postId));
                    return;
                }

                setPost(getPostResponse.post);
                setPostUser(getPostResponse.user);
                setPostComments(getPostResponse.comments);
                setIsMyPost(getPostResponse.user.name === user.name);
            } catch (error) {
                console.error("Error fetching post data:", error);
                alert("게시글을 불러오는 중 문제가 발생했습니다.");
            }
        };

        fetchPostData();
    }, [postId, userName, postTitle, user, navigate]);

    return (<></>);
}

export default PostDetail;