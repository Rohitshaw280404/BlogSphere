import jwt from "jsonwebtoken";
import { User } from "../Model/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw ApiError(401, "Unauthorized request");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw ApiError(401, "Invalid or expired access token");
    }
    throw error;
  }

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw ApiError(401, "Invalid access token");
  }

  req.user = user;

  next();
};

export default verifyJWT;
