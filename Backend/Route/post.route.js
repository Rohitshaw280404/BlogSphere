import { Router } from "express";

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../Controllers/post.controller.js";

import verifyJWT from "../Middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes
router.post("/", verifyJWT, createPost);
router.put("/:id", verifyJWT, updatePost);
router.delete("/:id", verifyJWT, deletePost);

export default router;
