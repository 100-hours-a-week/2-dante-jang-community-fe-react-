import React from 'react';
import defaultThumbnail from 'assets/image/default-thumbnail.png'
import defaultProfile from 'assets/image/default-profile-image-dark.png';
import { useNavigate } from 'react-router-dom';
import { POST_PATH } from 'constants';
import './style.css';

const PostCard = ({ post, user }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(POST_PATH(user.name, post.title, post.post_id));
    };

    return (
        <div className="post-card" onClick={handleCardClick}>
            <img 
                src={post.image_url || defaultThumbnail} 
                alt={post.title} 
                className="post-card__image" 
            />
            <div className="post-card__content">
                <div className="post-card__user-info">
                    <img 
                        src={user.profile_url || defaultProfile} 
                        alt={user.name} 
                        className="post-card__user-profile" 
                    />
                    <p className="post-card__user-name">{user.name}</p>
                </div>
                <h2>{post.title}</h2>
                <p>{new Date(post.writed_at).toLocaleDateString()}</p>
                <p>Views: {post.view_count}</p>
            </div>
        </div>
    );
};

export default PostCard;