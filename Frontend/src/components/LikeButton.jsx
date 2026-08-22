import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const LikeButton = ({ post, setPost }) => {

    const { user } = useAuth();


    const isLiked = post.likes?.some(
        (id) =>
            id === user?._id ||
            id?._id === user?._id
    );


    const handleLike = async () => {

        if (!user) {
            alert("Please login to like a post");
            return;
        }


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

            setPost(response.data.data);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to update like"
            );
        }
    };


    return (
        <button onClick={handleLike}>

            {isLiked ? "Unlike" : "Like"}

            {" "}

            ({post.likes?.length || 0})

        </button>
    );
};

export default LikeButton;