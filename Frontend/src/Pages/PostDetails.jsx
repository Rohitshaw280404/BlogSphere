import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import api from "../Services/api";

import LikeButton from "../components/LikeButton";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";

const PostDetails = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get(`/comments/post/${id}`),
      ]);

      setPost(postResponse.data.data);

      setComments(
        commentsResponse.data.data.comments || commentsResponse.data.data || [],
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error || "Post not found"}
        </div>

        <Link
          to="/"
          className="mt-6 inline-block text-sm font-semibold text-blue-600"
        >
          ← Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:py-16">
        <Link
          to="/"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Home
        </Link>

        {/* Header */}

        <header className="mt-8">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
            {post.category}
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>
              By{" "}
              <strong className="text-gray-800">
                {post.author?.fullName || "Unknown"}
              </strong>
            </span>

            <span>•</span>

            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        {/* Content */}

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="whitespace-pre-wrap text-lg leading-8 text-gray-700">
            {post.content}
          </p>

          {post.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-gray-100 pt-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Like */}

        <div className="mt-6">
          <LikeButton post={post} setPost={setPost} />
        </div>

        {/* Comments */}

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Comments</h2>

          <p className="mt-1 text-sm text-gray-500">Join the discussion.</p>

          <div className="mt-6">
            <CommentForm postId={id} setComments={setComments} />
          </div>

          <div className="mt-8 space-y-4">
            {comments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="text-gray-500">No comments yet.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  setComments={setComments}
                />
              ))
            )}
          </div>
        </section>
      </article>
    </main>
  );
};

export default PostDetails;
