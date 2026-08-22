import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const CommentForm = ({
    postId,
    setComments
}) => {

    const { user } = useAuth();

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);


    if (!user) {
        return (
            <p>
                Login to comment.
            </p>
        );
    }


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        setLoading(true);


        try {

            const response = await api.post(
                `/comments/post/${postId}`,
                {
                    content
                }
            );

            setComments((previousComments) => [
                response.data.data,
                ...previousComments
            ]);

            setContent("");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to add comment"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <form onSubmit={handleSubmit}>

            <textarea
                value={content}
                onChange={(e) =>
                    setContent(e.target.value)
                }
                placeholder="Write a comment..."
            />


            <button
                type="submit"
                disabled={loading}
            >
                {loading
                    ? "Posting..."
                    : "Comment"}
            </button>

        </form>
    );
};

export default CommentForm;