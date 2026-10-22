import { Router } from "express";

import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  likePost,
  unlikePost,
} from "../Controllers/comment.controller.js";

import verifyJWT from "../Middleware/auth.middleware.js";

const router = Router();

// Create comment
router.post("/post/:postId", verifyJWT, createComment);

// Get all comments for a post
router.get("/post/:postId", getPostComments);

// Update comment
router.put("/:commentId", verifyJWT, updateComment);

// Delete comment
router.delete("/:commentId", verifyJWT, deleteComment);

// Like a post
router.post("/:postId/like", verifyJWT, likePost);

 // Unlike a post
router.post("/:postId/unlike", verifyJWT, unlikePost);



export default router;
