import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./Config/db.js";
import authRouter from "./Route/auth.route.js";
import errorHandler from "./Middleware/error.middleware.js";
import postRouter from "./Route/post.route.js";
import commentRouter from "./Route/comment.route.js";
import cors from "cors";
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
// Routes
app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
