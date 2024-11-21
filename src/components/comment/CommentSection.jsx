import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DefaultProfile from 'assets/image/default-profile-image-dark.png';
import { deleteCommentRequset, getCommentsRequest, writeCommentRequest } from "apis/comment";
import { Trash } from "lucide-react";

export const CommenSection = ({ postId }) => {
    const user = useSelector((state) => state.user);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showDeleteButtons, setShowDeleteButtons] = useState({});

    useEffect(() => {
        const fetchComments = async () => {
            const commentsResponse = await getCommentsRequest(postId);
            if (commentsResponse) {
                setComments(commentsResponse.comments);
            }
        };
        fetchComments();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const response = await writeCommentRequest(postId, newComment);
        if (response) {
            const commentsResponse = await getCommentsRequest(postId);
            if (commentsResponse) {
                setComments(commentsResponse.comments);
                setNewComment('');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        const response = await deleteCommentRequset(commentId);
        if (response) {
            const commentsResponse = await getCommentsRequest(postId);
            if (commentsResponse) {
                setComments(commentsResponse.comments);
            }
        }
    };

    const toggleDeleteButton = (commentId) => {
        setShowDeleteButtons((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const formatCommentContent = (content) => {
        const cleanContent = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return cleanContent.split("\n").map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div style={styles.commentsSection}>
            <h2 style={styles.header}>Comments</h2>
            <ul style={styles.commentsList}>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <li key={comment.comment_id} style={styles.comment}>
                            <div style={styles.commentHeader}>
                                <div style={styles.commentDetails}>
                                    <img
                                        src={comment.user.profile_url || DefaultProfile}
                                        alt={comment.user.name}
                                        style={styles.commentAvatar}
                                    />
                                    <div style={styles.commentInfo}>
                                        <span style={styles.commentName}>{comment.user.name}</span>
                                        <span style={styles.commentDate}>{new Date(comment.written_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {user.name === comment.user.name && (
                                    <div style={styles.deleteButtonWrapper}>
                                        <button
                                            onClick={() => toggleDeleteButton(comment.comment_id)}
                                            style={styles.deleteButton}
                                            title="Delete"
                                        >
                                            <Trash size="20" color="gray" />
                                        </button>
                                        {showDeleteButtons[comment.comment_id] && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.comment_id)}
                                                style={styles.confirmDeleteButton}
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p style={styles.commentContent}>{formatCommentContent(comment.content)}</p>
                        </li>
                    ))
                ) : (
                    <p style={styles.noComments}>첫 댓글을 남겨보세요!</p>
                )}
            </ul>

            {user.isLoggedIn && (
                <div>
                    <h3>댓글 작성</h3>
                    <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            style={styles.textarea}
                        />
                        <button type="submit" style={styles.submitButton}>
                            Comment
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

const styles = {
    commentsSection: {
        width: "100%",
        margin: "1.25rem auto",
        padding: "0.625rem",
        border: "0.0625rem solid #ccc",
        borderRadius: "0.5rem",
        backgroundColor: "#f9f9f9",
    },
    header: {
        marginBottom: "0.9375rem",
        fontSize: "1.5rem",
        fontWeight: "bold",
    },
    commentsList: {
        margin: "0",
        padding: "0",
        listStyleType: "none",
    },
    comment: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "1rem",
        padding: "1rem",
        border: "0.0625rem solid #ddd",
        borderRadius: "0.5rem",
        backgroundColor: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)",
        wordWrap: "break-word",
    },
    commentHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.5rem",
    },
    commentDetails: {
        display: "flex",
        alignItems: "center",
    },
    commentAvatar: {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        marginRight: "1rem",
        border: "0.125rem solid #ccc",
    },
    commentInfo: {
        display: "flex",
        flexDirection: "column",
    },
    commentName: {
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "0.25rem",
    },
    commentDate: {
        fontSize: "0.875rem",
        color: "#888",
    },
    noComments: {
        textAlign: "center",
        color: "#777",
    },
    commentForm: {
        marginTop: "1.25rem",
        display: "flex",
        flexDirection: "column",
    },
    textarea: {
        padding: "0.625rem",
        marginBottom: "0.625rem",
        borderRadius: "0.5rem",
        border: "0.0625rem solid #ddd",
        fontSize: "1rem",
    },
    submitButton: {
        width: "6.25rem",
        alignSelf: "flex-end",
        padding: "0.625rem",
        borderRadius: "0.5rem",
        border: "none",
        backgroundColor: "#4CAF50",
        color: "#fff",
        cursor: "pointer",
        fontSize: "1rem",
    },
    deleteButton: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "1.2rem",
    },
    commentContent: {
        fontSize: "1rem",
        lineHeight: "1.5",
        color: "#555",
    },
    deleteButtonWrapper: {
        display: "flex",
        alignItems: "center",
    },
    confirmDeleteButton: {
        marginLeft: "0.5rem",
        padding: "0.25rem 0.5rem",
        borderRadius: "0.25rem",
        border: "none",
        backgroundColor: "red",
        color: "#fff",
        cursor: "pointer",
    },
};