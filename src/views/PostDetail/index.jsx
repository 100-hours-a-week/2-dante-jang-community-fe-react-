import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { POST_PATH, ERROR_PATH } from "constants";
import { getPostRequest } from "apis/post";
import { useSelector } from "react-redux";
import { Edit, Trash2, Eye, ThumbsUp } from 'lucide-react'
import 'views/PostDetail/style.css'
import { MODIFY_POST_PATH } from "constants";
import { DeletePostModal } from "components/post/DeletePostModal";

const PostDetail = () => {
    const { userName, postTitle, postId } = useParams();
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [postUser, setPostUser] = useState(null);
    const [postComments, setPostComments] = useState(null);
    const [isMyPost, setIsMyPost] = useState(false);
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
    // const [tableOfContents, setTableOfContents] = useState([])

    const contentRef = useRef(null)

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const getPostResponse = await getPostRequest(postId);
                console.log(getPostResponse);
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

                // const parser = new DOMParser()
                // const doc = parser.parseFromString(getPostResponse.post.content, 'text/html')
                // const headers = Array.from(doc.querySelectorAll('h1, h2, h3'))
                // setTableOfContents(headers.map((header, index) => ({
                //     id: `section-${index}`,
                //     text: header.textContent,
                //     level: parseInt(header.tagName.charAt(1))
                // })))
            } catch (error) {
                console.error("Error fetching post data:", error);
                alert("게시글을 불러오는 중 문제가 발생했습니다.");
            }
        };

        fetchPostData();
    }, [postId, userName, postTitle, user, navigate]);

    const handleEdit = () => {
        navigate(MODIFY_POST_PATH(postId));
    }

    const handleDelete = () => {
        setIsDeletePostModalOpen(true);
    }

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
                    <div
                        ref={contentRef}
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
                <div className="post-footer">
                    <div className="post-stats">
                        <div className="post-views">
                            <Eye className="h-4 w-4" />
                            <span>{post.view_count}</span>
                        </div>
                        <div className="post-likes">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.like_count || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="comments-section">
                <h2>Comments</h2>
                <div className="comments-list">
                    {postComments.length > 0 ? (
                        postComments.map((comment, index) => (
                            <div key={index} className="comment">
                                <div className="comment-author">
                                    <img src={comment.user.profile_url} alt={comment.user.name} className="comment-avatar" />
                                    <span>{comment.user.name}</span>
                                </div>
                                <p>{comment.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>첫 댓글을 남겨보세요!</p>
                    )}
                </div>
            </div>
            <DeletePostModal
                isOpen={isDeletePostModalOpen}
                onClose={() => setIsDeletePostModalOpen(false)}
                postId={postId}
            />
        </div>
    );
}

export default PostDetail;