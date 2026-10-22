import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../Controllers/user.controller.js";

import verifyJWT from "../Middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

router.get("/me", verifyJWT, (req, res) => {
  res.set("Cache-Control", "no-store");

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
