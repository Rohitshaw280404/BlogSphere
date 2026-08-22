import { useEffect, useState } from "react";

import api from "../services/api";
import PostCard from "../components/PostCard";

const Home = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchPosts = async () => {

        try {

            const response = await api.get(
                "/posts"
            );

            setPosts(
                response.data.data.posts
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load posts"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchPosts();
    }, []);


    if (loading) {
        return <p>Loading posts...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
        <main>

            <h1>Latest Posts</h1>


            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                posts.map((post) => (
                    <PostCard
                        key={post._id}
                        post={post}
                    />
                ))
            )}

        </main>
    );
};

export default Home;