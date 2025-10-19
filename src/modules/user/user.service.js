import { User } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";

export const deleteAccount = async (req, res) => {
  // get data from token >> req.headers.authorization
  const token = req.headers.authorization;
  const payload = jwt.verify(token, "tokensecretkeyforsarahaapp"); // throwing error
  const { id } = payload;

  // delete user
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new Error("User not found", { cause: 404 });
  }

  // send response
  return res.status(200).json({
    message: "user deleted successfully",
    success: true,
    data: deletedUser,
  });
};
