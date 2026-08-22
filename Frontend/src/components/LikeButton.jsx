import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const LikeButton = ({
    post,
    setPost
}) => {

    const { user } = useAuth();

    const [loading, setLoading] = useState(false);


    const isLiked = post.likes?.some(
        (like) => {

            const likeId =
                typeof like === "string"
                    ? like
                    : like?._id;

            return likeId === user?._id;
        }
    );


    const handleLike = async () => {

        if (!user) {

            alert(
                "Please login to like this post."
            );

            return;
        }


        if (loading) {
            return;
        }


        setLoading(true);


        try {

            if (isLiked) {

                await api.post(
                    `/posts/${post._id}/unlike`
                );

            } else {

                await api.post(
                    `/posts/${post._id}/like`
                );

            }


            const response = await api.get(
                `/posts/${post._id}`
            );


            setPost(
                response.data.data
            );


        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to update like."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                isLiked
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gray-900 text-white hover:bg-blue-600"
            } disabled:cursor-not-allowed disabled:opacity-60`}
        >
            {isLiked
                ? "♥ Liked"
                : "♡ Like"}

            {" "}

            ({post.likes?.length || 0})
        </button>
    );
};

export default LikeButton;