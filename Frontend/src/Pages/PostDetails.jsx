import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";

import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import LikeButton from "../components/LikeButton";

const PostDetails = () => {

    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchPost = async () => {

        try {

            const response = await api.get(
                `/posts/${id}`
            );

            setPost(response.data.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Post not found"
            );

        }
    };


    const fetchComments = async () => {

        try {

            const response = await api.get(
                `/comments/post/${id}`
            );

            setComments(response.data.data);

        } catch (error) {

            console.error(error);

        }
    };


    useEffect(() => {

        const loadData = async () => {

            await Promise.all([
                fetchPost(),
                fetchComments()
            ]);

            setLoading(false);
        };

        loadData();

    }, [id]);


    if (loading) {
        return <p>Loading...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
        <main>

            <h1>{post.title}</h1>

            <p>
                By {post.author?.fullName}
            </p>

            <p>
                Category: {post.category}
            </p>

            <article>
                {post.content}
            </article>


            <LikeButton
                post={post}
                setPost={setPost}
            />


            <hr />


            <h2>Comments</h2>

            <CommentForm
                postId={id}
                setComments={setComments}
            />


            {comments.map((comment) => (
                <Comment
                    key={comment._id}
                    comment={comment}
                    setComments={setComments}
                />
            ))}

        </main>
    );
};

export default PostDetails;