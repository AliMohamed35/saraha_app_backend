import { User } from "../../DB/models/user.model";

export const register = (req, res, next) => {
  // get user data from body
  const { userName, email, password, phoneNumber } = req.body;

  // chek user existence
  const userExist = User.findOne(req.body.email);
  if (userExist) {
    res.status(500).json({ message: "user already exist", success: false });
  }

  // insert user
  User.insertOne({ userName: userName });
};
