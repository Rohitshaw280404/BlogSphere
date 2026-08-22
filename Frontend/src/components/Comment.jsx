import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Comment = ({ comment, setComments }) => {

    const { user } = useAuth();


    const isOwner =
        user &&
        user._id === comment.author?._id;


    const handleDelete = async () => {

        try {

            await api.delete(
                `/comments/${comment._id}`
            );

            setComments((previousComments) =>
                previousComments.filter(
                    (item) =>
                        item._id !== comment._id
                )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Unable to delete comment"
            );
        }
    };


    return (
        <div>

            <strong>
                {comment.author?.fullName}
            </strong>

            <p>
                {comment.content}
            </p>


            {isOwner && (
                <button onClick={handleDelete}>
                    Delete
                </button>
            )}

        </div>
    );
};

export default Comment;