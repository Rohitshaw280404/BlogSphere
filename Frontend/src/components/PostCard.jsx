import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
    return (
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            {/* Cover Image */}
            {post.coverImage ? (
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-52 w-full object-cover"
                />
            ) : (
                <div className="flex h-52 w-full items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
                    <span className="text-4xl font-bold text-white">
                        Blog
                    </span>
                </div>
            )}

            {/* Content */}
            <div className="p-6">

                {/* Category */}
                {post.category && (
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                        {post.category}
                    </span>
                )}

                {/* Title */}
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-3 line-clamp-3 text-gray-600">
                    {post.excerpt ||
                        post.content?.substring(0, 150)}
                </p>

                {/* Author */}
                <div className="mt-5 flex items-center justify-between">

                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            By {post.author?.fullName || "Unknown"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            {post.createdAt
                                ? new Date(
                                      post.createdAt
                                  ).toLocaleDateString()
                                : ""}
                        </p>
                    </div>

                    {/* Likes */}
                    <span className="text-sm text-gray-500">
                        ♥ {post.likes?.length || 0}
                    </span>

                </div>

                {/* Read More */}
                <Link
                    to={`/posts/${post._id}`}
                    className="mt-6 inline-block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                    Read More
                </Link>

            </div>
        </article>
    );
};

export default PostCard;