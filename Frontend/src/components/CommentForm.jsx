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
            <div className="rounded-xl border border-gray-200 bg-white p-5">

                <p className="text-sm text-gray-500">
                    Please login to leave a comment.
                </p>

            </div>
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
                    content: content.trim()
                }
            );


            const newComment =
                response.data.data;


            setComments((previous) => [
                newComment,
                ...previous
            ]);


            setContent("");


        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to add comment."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >

            <textarea
                value={content}
                onChange={(e) =>
                    setContent(e.target.value)
                }
                rows="4"
                placeholder="Write a comment..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
            />


            <div className="mt-3 flex justify-end">

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Posting..."
                        : "Post Comment"}
                </button>

            </div>

        </form>
    );
};

export default CommentForm;