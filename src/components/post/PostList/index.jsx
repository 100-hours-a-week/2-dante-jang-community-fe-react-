import React, { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from 'components/post/PostCard';
import { getPostListRequest } from 'apis/post';
import './style.css';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [postMap, setPostMap] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    const fetchPosts = async (page) => {
        try {
            const postListResponse = await getPostListRequest(page);
            const newPosts = postListResponse.posts;

            if (newPosts.length === 0) {
                setHasMore(false);
                return;
            }

            setPostMap((prevMap) => {
                const updatedMap = { ...prevMap };
                newPosts.forEach((post) => {
                    if (!updatedMap[post.post.post_id]) {
                        updatedMap[post.post.post_id] = post;
                    }
                });

                const sortedPosts = Object.values(updatedMap).sort((a, b) => new Date(b.post.written_at) - new Date(a.post.written_at));
                setPosts(sortedPosts);
                return updatedMap;
            });

            if (newPosts.length < 30) setHasMore(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
        }
    }, [hasMore]);

    useEffect(() => {
        const loadPosts = async () => {
            await fetchPosts(page);
        };

        loadPosts();
    }, [page, postMap]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
        if (loader.current) observer.observe(loader.current);

        return () => observer.disconnect();
    }, [handleObserver]);

    return (
        <div className="post-list">
            {posts.map(({ post, user }, idx) => (
                <PostCard key={idx} post={post} user={user} />
            ))}
            {hasMore && <div ref={loader} className="loader">Loading...</div>}
        </div>
    );
};

export default PostList;