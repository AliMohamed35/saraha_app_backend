import { User } from "../../DB/models/user.model.js";

export const deleteAccount = async (req, res) => {
  try {
    // get data from req
    const { id } = req.params;

    // delete user
    const deletedUser = await User.findByIdAndDelete(id);
    console.log(deletedUser);
    if (!deletedUser) {
      throw new Error("User not found", { cause: 404 });
    }

    // send response
    return res
      .status(200)
      .json({
        message: "user deleted successfully",
        success: true,
        data: deletedUser,
      });
  } catch (error) {
    res
      .status(error.cause || 500)
      .json({ message: error.message, success: false });
  }
};
