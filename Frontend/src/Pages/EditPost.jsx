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
        content: "",
        excerpt: "",
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

                const post = response.data.data;

                setFormData({
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt || "",
                    category: post.category,
                    tags: post.tags?.join(", ") || "",
                    status: post.status
                });

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load post"
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
                        .map(tag => tag.trim())
                        .filter(Boolean)
                }
            );

            navigate(`/posts/${id}`);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to update post"
            );

        } finally {

            setSaving(false);

        }
    };


    if (loading) {
        return <p>Loading...</p>;
    }


    return (
        <main>

            <h1>Edit Post</h1>


            {error && <p>{error}</p>}


            <form onSubmit={handleSubmit}>

                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />

                <input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                />

                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                />

                <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                />

                <input
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                />

                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="15"
                />

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="draft">
                        Draft
                    </option>

                    <option value="published">
                        Published
                    </option>
                </select>


                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Changes"}
                </button>

            </form>

        </main>
    );
};

export default EditPost;