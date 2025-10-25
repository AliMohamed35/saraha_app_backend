import { User } from "../../DB/models/user.model.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import cloudinary from "../../utils/cloud/cloudinary.config.js";

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
  // delete old image
  if (req.user.profilePic) {
    fs.unlinkSync(req.user.profilePic);
  }

  // update logged in user profilePicture >> path >> req.file
  const userExist = await User.findByIdAndUpdate(
    req.user._id,
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

export const uploadProfilePictureCloud = async (req, res, next) => {
  const user = req.user; // from isAuthenticated
  const file = req.file;

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path
  );

  // update in data base
  await User.updateOne(
    { _id: req.user._id },
    { profilePic: { secure_url, public_id } }
  );

  return res
    .status(200)
    .json({
      message: "profile picture updated successfully",
      success: true,
      data: { secure_url, public_id },
    });
};
