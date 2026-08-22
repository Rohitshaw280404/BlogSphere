import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Comment = ({
    comment,
    setComments
}) => {

    const { user } = useAuth();

    const [editing, setEditing] = useState(false);

    const [content, setContent] = useState(
        comment.content
    );

    const [loading, setLoading] = useState(false);


    const authorId =
        comment.author?._id ||
        comment.author;


    const isOwner =
        user?._id &&
        authorId &&
        user._id.toString() ===
        authorId.toString();


    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                "Delete this comment?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/comments/${comment._id}`
            );


            setComments((previous) =>
                previous.filter(
                    (item) =>
                        item._id !== comment._id
                )
            );


        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete comment."
            );

        }
    };


    const handleUpdate = async () => {

        if (!content.trim()) {
            return;
        }


        setLoading(true);


        try {

            const response = await api.put(
                `/comments/${comment._id}`,
                {
                    content: content.trim()
                }
            );


            const updatedComment =
                response.data.data;


            setComments((previous) =>
                previous.map((item) =>
                    item._id === comment._id
                        ? updatedComment
                        : item
                )
            );


            setEditing(false);


        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to update comment."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between gap-4">

                <div>

                    <p className="font-semibold text-gray-900">
                        {comment.author?.fullName ||
                            comment.author?.username ||
                            "User"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        {comment.createdAt
                            ? new Date(
                                comment.createdAt
                            ).toLocaleDateString()
                            : ""}
                    </p>

                </div>


                {isOwner && !editing && (

                    <div className="flex gap-3">

                        <button
                            onClick={() =>
                                setEditing(true)
                            }
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                            Delete
                        </button>

                    </div>

                )}

            </div>


            {editing ? (

                <div className="mt-4">

                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        rows="3"
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />


                    <div className="mt-3 flex gap-3">

                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                            {loading
                                ? "Saving..."
                                : "Save"}
                        </button>


                        <button
                            onClick={() => {
                                setEditing(false);
                                setContent(comment.content);
                            }}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            ) : (

                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {comment.content}
                </p>

            )}

        </article>
    );
};

export default Comment;