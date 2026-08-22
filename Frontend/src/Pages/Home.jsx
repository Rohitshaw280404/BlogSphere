import { useEffect, useState } from "react";

import api from "../services/api";
import PostCard from "../components/PostCard";

const Home = () => {

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const fetchPosts = async () => {

        try {

            const response = await api.get("/posts");

            console.log("Posts response:", response.data);

            setPosts(
                response.data.data.posts
            );

        } catch (error) {

            console.error(
                "Error fetching posts:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to fetch posts"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchPosts();
    }, []);


    if (loading) {
        return (
            <main>
                <h1>Loading posts...</h1>
            </main>
        );
    }


    if (error) {
        return (
            <main>
                <h1>Something went wrong</h1>
                <p>{error}</p>
            </main>
        );
    }


    return (
        <main>

            <h1>Latest Posts</h1>


            {posts.length === 0 ? (

                <p>
                    No posts available.
                </p>

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