import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import api from "../services/api";

const PostDetails = () => {

    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchPost = async () => {

        try {

            const response = await api.get(
                `/posts/${id}`
            );

            console.log(
                "Post response:",
                response.data
            );

            setPost(response.data.data);

        } catch (error) {

            console.error(
                "Error fetching post:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to fetch post"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchPost();
    }, [id]);


    if (loading) {
        return (
            <main>
                <h1>Loading post...</h1>
            </main>
        );
    }


    if (error) {
        return (
            <main>
                <h1>Error</h1>
                <p>{error}</p>

                <Link to="/">
                    Back to Home
                </Link>
            </main>
        );
    }


    if (!post) {
        return (
            <main>
                <p>Post not found.</p>
            </main>
        );
    }


    return (
        <main>

            <Link to="/">
                ← Back to Home
            </Link>


            <article>

                <h1>{post.title}</h1>


                <p>
                    By{" "}
                    {post.author?.fullName ||
                        "Unknown author"}
                </p>


                <p>
                    Category: {post.category}
                </p>


                <p>
                    Published:{" "}
                    {new Date(
                        post.createdAt
                    ).toLocaleDateString()}
                </p>


                <hr />


                <p>
                    {post.content}
                </p>


                <hr />


                <p>
                    Likes: {post.likes?.length || 0}
                </p>


                {post.tags &&
                    post.tags.length > 0 && (
                        <div>

                            <strong>Tags: </strong>

                            {post.tags.map(
                                (tag, index) => (
                                    <span key={index}>
                                        #{tag}{" "}
                                    </span>
                                )
                            )}

                        </div>
                    )}

            </article>

        </main>
    );
};

export default PostDetails;