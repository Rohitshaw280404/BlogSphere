import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreatePost = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        tags: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Convert title into URL-friendly slug
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.title.trim() ||
            !formData.content.trim() ||
            !formData.category.trim()
        ) {
            setError("Title, content and category are required.");
            return;
        }

        const slug = generateSlug(formData.title);

        try {
            setLoading(true);

            const response = await api.post("/posts", {
                title: formData.title,
                slug: slug,
                content: formData.content,
                excerpt: formData.excerpt,
                category: formData.category,

                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),

                      status: "published",
            });

            console.log("CREATE POST RESPONSE:", response.data);

            setSuccess("Post created successfully!");

            setFormData({
                title: "",
                content: "",
                excerpt: "",
                category: "",
                tags: "",
            });

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.error("CREATE POST ERROR:", error);

            setError(
                error.response?.data?.message ||
                "Failed to create post."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">

            <div className="mx-auto max-w-3xl">

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Create New Post
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Share your thoughts with the community.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
                >

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-6">
                        <label
                            htmlFor="title"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter your post title"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Slug Preview */}
                    <div className="mb-6">
                        <label
                            htmlFor="slug"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Slug
                        </label>

                        <input
                            id="slug"
                            name="slug"
                            type="text"
                            value={generateSlug(formData.title)}
                            readOnly
                            placeholder="my-first-blog"
                            className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600 outline-none"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Slug is generated automatically from the title.
                        </p>
                    </div>

                    {/* Excerpt */}
                    <div className="mb-6">
                        <label
                            htmlFor="excerpt"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Excerpt
                        </label>

                        <input
                            id="excerpt"
                            name="excerpt"
                            type="text"
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="Short description of your post"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                        <label
                            htmlFor="category"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Category
                        </label>

                        <input
                            id="category"
                            name="category"
                            type="text"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Technology"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                        <label
                            htmlFor="tags"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Tags
                        </label>

                        <input
                            id="tags"
                            name="tags"
                            type="text"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="react, node, mongodb"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Separate tags with commas.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <label
                            htmlFor="content"
                            className="mb-2 block font-medium text-gray-800"
                        >
                            Content
                        </label>

                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your blog post..."
                            rows="12"
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Publishing..." : "Publish Post"}
                    </button>

                </form>

            </div>

        </main>
    );
};

export default CreatePost;