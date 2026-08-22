import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                const response = await api.get("/posts");

                console.log("DASHBOARD POSTS:", response.data);

                setPosts(response.data.data.posts || []);

            } catch (error) {
                console.error("DASHBOARD ERROR:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-10">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard
                    </h1>

                    <p className="mt-4 text-gray-500">
                        Loading your posts...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-gray-600">
                            Manage your blog posts.
                        </p>
                    </div>

                    <Link
                        to="/create-post"
                        className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
                    >
                        + Create Post
                    </Link>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total Posts
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {posts.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Published
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {
                                posts.filter(
                                    (post) =>
                                        post.status === "published"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total Likes
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {posts.reduce(
                                (total, post) =>
                                    total +
                                    (post.likes?.length || 0),
                                0
                            )}
                        </p>
                    </div>

                </div>

                {/* Posts */}
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Your Posts
                        </h2>
                    </div>

                    {posts.length === 0 ? (

                        <div className="p-10 text-center">

                            <p className="text-gray-500">
                                You haven't created any posts yet.
                            </p>

                            <Link
                                to="/create-post"
                                className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Create your first post →
                            </Link>

                        </div>

                    ) : (

                        <div className="divide-y divide-gray-200">

                            {posts.map((post) => (

                                <div
                                    key={post._id}
                                    className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    <div>

                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {post.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {post.category || "Uncategorized"}
                                            {" • "}
                                            {post.likes?.length || 0} likes
                                        </p>

                                    </div>

                                    <Link
                                        to={`/posts/${post._id}`}
                                        className="font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        View →
                                    </Link>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </main>
    );
};

export default Dashboard;