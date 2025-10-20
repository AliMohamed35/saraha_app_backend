import { User } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../utils/token/index.js";

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

export const uploadProfilePicture = async (req, res, next) => {
  // res.json({ reqFile: req.file.path }); // req. file came from multer
  const token = req.headers.authorization;
  const { id } = verifyToken(token); // destructing the id from the payload

  // update logged in user profilePicture >> path >> req.file
  const userExist = await User.findByIdAndUpdate(
    id,
    {
      profilePic: req.file.path,
    },
    { new: true }
  );

  if (!userExist) {
    throw new Error("user not found", { cause: 404 });
  }

  return res.status(200).json({
    message: "user profile picture updated successfully",
    success: true,
    data: userExist,
  });
};
