import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/posts", {
                params: {
                    page: 1,
                    limit: 10,
                    _t: Date.now(),
                },
            });

            console.log("POSTS RESPONSE:", response.data);

            setPosts(response.data?.data?.posts || []);

        } catch (error) {
            console.error("POSTS ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load posts."
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
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-lg text-gray-600">
                    Loading posts...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-gray-50 px-4 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-lg bg-red-50 p-5 text-red-600">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="mx-auto max-w-6xl">

                {/* Hero */}
                <section className="mb-12 text-center">

                    <h1 className="text-5xl font-bold text-gray-900">
                        Discover Great Stories
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                        Read, write and share your thoughts with the
                        BlogPlatform community.
                    </p>

                    <Link
                        to="/create-post"
                        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Create a Post
                    </Link>

                </section>

                {/* Posts */}
                <section>

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-3xl font-bold text-gray-900">
                            Latest Posts
                        </h2>

                        <button
                            onClick={fetchPosts}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Refresh
                        </button>

                    </div>

                    {posts.length === 0 ? (

                        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                            <p className="text-gray-500">
                                No posts available.
                            </p>
                        </div>

                    ) : (

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                />
                            ))}

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
};

export default Home;