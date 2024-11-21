import React, { useState, useEffect, useRef, useCallback } from 'react';
import PostCard from 'components/post/PostCard';
import { getUserPostListRequest } from 'apis/post';

const UserPostList = ({userId}) => {
    const [posts, setPosts] = useState([]);
    const [postMap, setPostMap] = useState({});
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    const fetchPosts = async (userId, page) => {
        try {
            const postListResponse = await getUserPostListRequest(userId, page);
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
            await fetchPosts(userId, page);
        };

        loadPosts();
    }, [userId, page, postMap]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
        if (loader.current) observer.observe(loader.current);

        return () => observer.disconnect();
    }, [handleObserver]);

    return (
        <div style={styles.postList}>
            {posts.map(({ post, user }, idx) => (
                <PostCard key={idx} post={post} user={user} />
            ))}
            {hasMore && <div ref={loader} className="loader">Loading...</div>}
        </div>
    );
};

const styles = {
    postList: {
        width: "70vw",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
        gap: "1rem",
        padding: "1.25rem",
    },
};

export default UserPostList;