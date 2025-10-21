import { verifyToken } from "../utils/token/index.js";
import { User } from "../DB/models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("Token is required", { cause: 401 });
  }
  const payload = verifyToken(token); // returns payload
  const userExist = await User.findById(payload.id); // this step is important to see if the user still exist with us or he deleted his account?
  if (!userExist) {
    throw new Error("user doesn't exist", { cause: 404 });
  }
  req.user = userExist;
  return next();
};
