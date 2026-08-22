import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

const EditPost = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        status: "draft"
    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchPost = async () => {

            try {

                const response = await api.get(
                    `/posts/${id}`
                );

                const post =
                    response.data.data;


                setFormData({
                    title: post.title || "",
                    slug: post.slug || "",
                    excerpt: post.excerpt || "",
                    content: post.content || "",
                    category: post.category || "",
                    tags: post.tags?.join(", ") || "",
                    status: post.status || "draft"
                });


            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load post."
                );

            } finally {

                setLoading(false);

            }
        };


        fetchPost();

    }, [id]);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");


        try {

            await api.put(
                `/posts/${id}`,
                {
                    ...formData,

                    tags: formData.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                }
            );


            navigate(`/posts/${id}`);


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update post."
            );

        } finally {

            setSaving(false);

        }
    };


    if (loading) {

        return (
            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            </div>
        );
    }


    return (
        <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-6 lg:py-16">

            <div className="mx-auto max-w-4xl">

                <div className="mb-8">

                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Manage
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        Edit Post
                    </h1>

                </div>


                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    <div className="space-y-6">

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Title
                            </label>

                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


                        <div className="grid gap-6 md:grid-cols-2">

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Slug
                                </label>

                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Category
                                </label>

                                <input
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                            </div>

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Tags
                            </label>

                            <input
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Excerpt
                            </label>

                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows="3"
                                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Content
                            </label>

                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="15"
                                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 leading-7 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                required
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >

                                <option value="draft">
                                    Draft
                                </option>

                                <option value="published">
                                    Published
                                </option>

                            </select>

                        </div>

                    </div>


                    <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
};

export default EditPost;