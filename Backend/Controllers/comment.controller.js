import { Comment } from "../Model/comment.model.js";
import { Post } from "../Model/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create comment
const createComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content || !content.trim()) {
    throw ApiError(400, "Comment content is required");
  }

  // Check whether post exists
  const post = await Post.findById(postId);

  if (!post) {
    throw ApiError(404, "Post not found");
  }

  // Create comment
  const comment = await Comment.create({
    content,
    author: req.user._id,
    post: postId,
  });

  // Get comment with author details
  const createdComment = await Comment.findById(comment._id).populate(
    "author",
    "username fullName",
  );

  return res
    .status(201)
    .json(ApiResponse(201, createdComment, "Comment created successfully"));
};

// Get comments for a post
const getPostComments = async (req, res) => {
  const { postId } = req.params;

  // Check whether post exists
  const post = await Post.findById(postId);

  if (!post) {
    throw ApiError(404, "Post not found");
  }

  const comments = await Comment.find({
    post: postId,
  })
    .populate("author", "username fullName ")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(ApiResponse(200, comments, "Comments fetched successfully"));
};

// Update comment
const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    throw ApiError(400, "Comment content is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw ApiError(404, "Comment not found");
  }

  // Only comment author can update it
  if (comment.author.toString() !== req.user._id.toString()) {
    throw ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content;

  await comment.save();

  const updatedComment = await Comment.findById(comment._id).populate(
    "author",
    "username fullName ",
  );

  return res
    .status(200)
    .json(ApiResponse(200, updatedComment, "Comment updated successfully"));
};

// Delete comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw ApiError(404, "Comment not found");
  }

  // Only comment author can delete it
  if (comment.author.toString() !== req.user._id.toString()) {
    throw ApiError(403, "You are not authorized to delete this comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(ApiResponse(200, null, "Comment deleted successfully"));
};

const likePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw ApiError(404, "Post not found");
  }

  // Check if user already liked the post
  const alreadyLiked = post.likes.includes(req.user._id);

  if (alreadyLiked) {
    throw ApiError(400, "You already liked this post");
  }

  // Add user to likes
  post.likes.push(req.user._id);

  await post.save();

  return res.status(200).json(
    ApiResponse(
      200,
      {
        likesCount: post.likes.length,
      },
      "Post liked successfully",
    ),
  );
};

const unlikePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw ApiError(404, "Post not found");
  }

  const alreadyLiked = post.likes.includes(req.user._id);

  if (!alreadyLiked) {
    throw ApiError(400, "You have not liked this post");
  }

  // Remove user's ID from likes
  post.likes = post.likes.filter(
    (userId) => userId.toString() !== req.user._id.toString(),
  );

  await post.save();

  return res.status(200).json(
    ApiResponse(
      200,
      {
        likesCount: post.likes.length,
      },
      "Post unliked successfully",
    ),
  );
};

export {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likePost,
  unlikePost,
};
