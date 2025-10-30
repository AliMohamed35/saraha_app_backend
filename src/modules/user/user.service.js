import { User } from "../../DB/models/user.model.js";
import fs from "fs";
import cloudinary from "../../utils/cloud/cloudinary.config.js";
import { verifyToken } from "../../utils/token/index.js";

export const getProfile = async (req, res, next) => {
  // get data from token
  const token = req.headers.authorization;

  const payload = verifyToken(token);

  const userExist = await User.findById({ _id: payload.id });

  return res
    .status(200)
    .json({
      message: "user retrieved successfully",
      success: true,
      data: userExist,
    });
};

export const deleteAccount = async (req, res) => {
  // delete user folder from server (cloud or local)
  if (req.user.profilePic.public_id) {
    // delete the content of the folder first
    await cloudinary.api.delete_resources_by_prefix(
      `saraha-app/users/${req.user._id}`
    );
    // to delete the folder it must be empty
    await cloudinary.api.delete_folder(`saraha-app/users/${req.user._id}`);
  }
  // delete user from DB
  const deletedUser = await User.deleteOne({ _id: req.user._id });

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

  // delete the old image from the cloud
  // await cloudinary.uploader.destroy(user.profilePic.public_id);

  // upload new file
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `saraha-app/users/${user._id}/Profile Picture`,
      public_id: user.profilePic.public_id, // better than the destroy (more optimized)
    }
  );

  // update in data base
  await User.updateOne(
    { _id: req.user._id },
    { profilePic: { secure_url, public_id } }
  );

  return res.status(200).json({
    message: "profile picture updated successfully",
    success: true,
    data: { secure_url, public_id },
  });
};
