import { Router } from "express";

import {
    createComment,
    getPostComments,
    updateComment,
    deleteComment,
    likePost,
    unlikePost
} from "../Controllers/comment.controller.js";

import verifyJWT from "../Middleware/auth.middleware.js";

const router = Router();


// Get all comments for a post
router.get(
    "/post/:postId",
    getPostComments
);


// Create comment
router.post(
    "/post/:postId",
    verifyJWT,
    createComment
);


// Update comment
router.put(
    "/:commentId",
    verifyJWT,
    updateComment
);


// Delete comment
router.delete(
    "/:commentId",
    verifyJWT,
    deleteComment
);

router.post("/:postId/like", verifyJWT, likePost);
router.post("/:postId/unlike", verifyJWT, unlikePost);


export default router;