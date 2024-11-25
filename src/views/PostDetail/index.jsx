import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { POST_PATH, ERROR_PATH } from "constants";
import { getPostRequest } from "apis/post";
import { useSelector } from "react-redux";
import { Edit, Trash2, Eye, ThumbsUp } from 'lucide-react'
import { MODIFY_POST_PATH } from "constants";
import { DeletePostModal } from "components/post/DeletePostModal";
import { CommenSection } from "components/comment/CommentSection";
import 'views/PostDetail/style.css'
import { createLikeRequest, deleteLikeRequest, getPostLikeCountRequest, isMyLikePostRequest } from "apis/like";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';

const PostDetail = () => {
    const { userName, postTitle, postId } = useParams();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [postUser, setPostUser] = useState(null);
    const [isMyPost, setIsMyPost] = useState(false);
    const [isMyLikePost, setIsMyLikePost] = useState(false);
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Color,
            Link,
        ],
        content: '',
        editable: false
    });

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

                const getPostLikeCountResponse = await getPostLikeCountRequest(postId);
                if (getPostLikeCountResponse) {
                    getPostResponse.post.like_count = getPostLikeCountResponse.likeCount;
                }

                setPost(getPostResponse.post);
                setPostUser(getPostResponse.user);
                setIsMyPost(getPostResponse.user.name === user.name);
                editor?.commands.setContent(getPostResponse.post.content);

                if (user.isLoggedIn) {
                    const isMyLikePostResponse = await isMyLikePostRequest(postId);
                    if (isMyLikePostResponse) {
                        setIsMyLikePost(isMyLikePostResponse.isMyLikePost);
                    }
                }
            } catch (error) {
                console.error("Error fetching post data:", error);
                alert("게시글을 불러오는 중 문제가 발생했습니다.");
            }
        };

        fetchPostData();
    }, [postId, userName, postTitle, user, navigate, editor]);

    const handleEdit = () => {
        navigate(MODIFY_POST_PATH(postId));
    }

    const handleDelete = () => {
        setIsDeletePostModalOpen(true);
    }

    const handleLike = async () => {
        if (!user.isLoggedIn) {
            alert("로그인을 해주세요!");
            return;
        }

        if (isMyLikePost) {
            const deleteLikeResponse = await deleteLikeRequest(postId);
            if (deleteLikeResponse) {
                setIsMyLikePost(false);
                setPost((prevPost) => ({
                    ...prevPost,
                    like_count: prevPost.like_count - 1,
                }));
            }
        } else {
            const createLikeResponse = await createLikeRequest(postId);
            if (createLikeResponse) {
                setIsMyLikePost(true);
                setPost((prevPost) => ({
                    ...prevPost,
                    like_count: prevPost.like_count + 1,
                }));
            }
        }
    };

    if (!post || !postUser) return null

    return (
        <div className="post-container">
            <div className="post-content">
                <div className="post-header">
                    <div className="post-header-content">
                        <div className="post-author">
                            <div className="author-avatar">
                                <img src={postUser.profile_url} alt={postUser.name} />
                            </div>
                            <div>
                                <h1 className="post-title">{post.title}</h1>
                                <p className="post-meta">{postUser.name} • {new Date(post.written_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {isMyPost && (
                            <div className="post-actions">
                                <button onClick={handleEdit} className="button button-text">
                                    <Edit className="h-4 w-4" /> Edit
                                </button>
                                <button onClick={handleDelete} className="button button-text button-danger">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="thumbnail-viewer">
                    {post.image_url &&
                        <img src={post.image_url} alt="Thumbnail" className="thumbnail-view" />}
                </div>

                <div className="post-body">
                    <EditorContent editor={editor} />
                </div>
                <div className="post-footer">
                    <div className="post-stats">
                        <div className="post-views">
                            <Eye className="h-4 w-4" />
                            <span>{post.view_count}</span>
                        </div>
                        <div
                            className={`post-likes ${isMyLikePost ? 'active' : ''}`}
                            onClick={handleLike}
                            style={{ cursor: user.isLoggedIn ? 'pointer' : 'not-allowed' }}
                            title={user.isLoggedIn ? '' : '로그인을 해주세요!'}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.like_count || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 댓글 */}
            <CommenSection postId={postId} />

            {/* 삭제 모달 */}
            <DeletePostModal
                isOpen={isDeletePostModalOpen}
                onClose={() => setIsDeletePostModalOpen(false)}
                postId={postId}
            />
        </div>
    );
}

export default PostDetail;