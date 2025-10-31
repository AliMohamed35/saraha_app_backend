import { User } from "../../DB/models/user.model.js";
import fs from "fs";
import cloudinary, {
  deleteFolder,
  uploadFiles,
  uploadFile,
} from "../../utils/cloud/cloudinary.config.js";
import { verifyToken } from "../../utils/token/index.js";
import { Token } from "../../DB/models/token.model.js";

export const getProfile = async (req, res, next) => {
  // get data from token
  const token = req.headers.authorization;

  const payload = verifyToken(token);

  const userExist = await User.findById({ _id: payload.id });

  return res.status(200).json({
    message: "user retrieved successfully",
    success: true,
    data: userExist,
  });
};

export const deleteAccount = async (req, res) => {
  const deletedUser = await User.updateOne(
    { _id: req.user._id },
    { deletedAt: Date.now(), credentialUpdatedAt: Date.now() }
  );

  await Token.deleteMany({ user: req.user._id }); // delete all tokens related to this user when deleted so he don't get tokens again.
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

  let uploadOptions = { folder: `saraha-app/users/${user._id}/profile-pic` };
  // upload new file
  const { secure_url, public_id } = await uploadFile({
    path: file.path,
    options: uploadOptions,
  });

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
