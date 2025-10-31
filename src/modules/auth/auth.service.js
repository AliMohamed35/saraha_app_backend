import { User } from "../../DB/models/user.model.js";
import { sendMail } from "../../utils/email/index.js";
import { generateOTP } from "../../utils/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import { comparePassword, hashPassword } from "../../utils/hash/index.js";
import jwt from "jsonwebtoken";
import { Token } from "../../DB/models/token.model.js";
import { generateToken } from "../../utils/token/index.js";

// Register
export const register = async (req, res) => {
  // get user data from body
  const { fullName, email, password, phoneNumber, dob } = req.body;

  // chek user existence
  const userExist = await User.findOne({
    $or: [
      {
        $and: [
          { email: { $ne: null } },
          { email: { $exists: true } },
          { email: email },
        ],
      },
      {
        $and: [
          { phoneNumber: { $ne: null } },
          { phoneNumber: { $exists: true } },
          { phoneNumber: phoneNumber },
        ],
      },
    ],
  }); // {} | null
  if (userExist) {
    throw new Error("user already exist", { cause: 409 }); // conflict
  }

  // generate OTP
  const { otp, otpExpire } = generateOTP();

  // prepare data >> hash password >> encrypt phoneNumber >> factory design pattern
  // insert user
  const user = new User({
    fullName,
    email,
    password: hashPassword(password),
    phoneNumber,
    dob,
    otp,
    otpExpire,
  });
  await user.save();

  // send verifitcation email
  if (email)
    await sendMail({
      to: email,
      subject: "Veify your account",
      html: `<p>Your otp to verify your account is ${otp}</p>`,
    });

  // send response
  return res.status(201).json({
    message: " user created successfully",
    success: true,
    data: user,
  });
};

// OTP
export const verifyAccount = async (req, res) => {
  // get data from request
  const { otp, email } = req.body;

  //check if otp is okay and check the expire date
  const userExist = await User.findOne({
    email: email,
    otp: otp,
    otpExpire: { $gt: Date.now() },
  });

  if (!userExist) {
    throw new Error("invalid OTP", { cause: 401 });
  }

  // update user (isVerified) >> true (until here i'm only updating the object located in RAM)
  userExist.isVerified = true;
  userExist.otp = undefined;
  userExist.otpExpire = undefined;

  // so we need to update data base layer also
  await userExist.save();

  // send response
  res.status(200).json({
    message: "user verified successfully",
    success: true,
    data: userExist,
  });
};

// Resend OTP
export const resendOTP = async (req, res) => {
  // get data from req.body
  const { email } = req.body;

  // generate new OTP and expire date
  const { otp, otpExpire } = generateOTP();

  // update user
  const userExist = await User.findOneAndUpdate(
    { email: email },
    { otp, otpExpire }
  );
  // check existence
  if (!userExist) {
    throw new Error("user doesn'\t exist", { cause: 404 });
  }
  // resend email
  await sendMail({
    to: email,
    subject: "re-sent OTP",
    html: `<p>Your otp to verify your account is ${otp}</p>`,
  });

  // send response
  return res.status(201).json({
    message: "OTP resent successfully",
    success: true,
  });
};

// Login
export const login = async (req, res) => {
  // get data from request
  const { email, password, phoneNumber } = req.body;

  // check user existence
  const userExist = await User.findOne({
    $or: [
      {
        $and: [
          { email: { $exists: true } },
          { email: { $ne: null } },
          { email: email },
        ],
      },
      {
        $and: [
          { phoneNumber: { $exists: true } },
          { phoneNumber: { $ne: null } },
          { phoneNumber: phoneNumber },
        ],
      },
    ],
  });

  if (!userExist) {
    throw new Error("invalid credentials", { cause: 404 });
  }

  if (userExist.isVerified == false) {
    throw new Error("user not verified", { cause: 401 });
  }
  // compare password
  const match = comparePassword(password, userExist.password);
  if (!match) {
    throw new Error("invalid credentials", { cause: 401 });
  }
  if (userExist.deletedAt) {
    userExist.deletedAt = undefined;
    await userExist.save();
  }

  // generate token
  const accessToken = generateToken({
    payload: { id: userExist._id },
    options: { expiresIn: "1d" },
  });

  const refreshToken = generateToken({
    payload: { id: userExist._id },
    options: { expiresIn: "7d" },
  });

  // store in DB
  await Token.create({
    token: refreshToken,
    user: userExist._id,
    type: "refresh",
  });

  // send response
  return res.status(200).json({
    message: " user logged in successfully",
    succes: true,
    data: { accessToken, refreshToken },
  });
};

// Google OAuth
export const googleLogin = async (req, res) => {
  // get data from req >> token
  const { idToken } = req.body;

  // verify idToken
  const client = new OAuth2Client(
    "560034876335-2k6giia2i0q1s8mpabo5vctvte2i4h50.apps.googleusercontent.com"
  );

  const ticket = await client.verifyIdToken({ idToken });

  const payload = ticket.getPayload(); // {email, name, picture, phoneNumber}

  // check user
  let userExist = await User.findOne({ email: payload.email }); // {} || null

  if (!userExist) {
    userExist = await User.create({
      fullName: payload.name,
      email: payload.email,
      phoneNumber: payload.phone,
      dob: payload.birthdate,
      isVerified: true,
      userAgent: "google",
    });

    res.status(200).json({
      message: "login successfully",
      success: true,
      data: userExist,
    });
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  // get data from request
  const { email, otp, newPassword } = req.body;

  // check userExistence
  const userExist = await User.findOne({ email });
  if (!userExist) {
    throw new Error("User not found", { cause: 404 });
  }

  // check otp valid or not
  if (userExist.otp != otp) {
    throw new Error("Invalid otp", { cause: 401 }); // unauthorized
  }

  // check expData for otp
  if (userExist.otpExpire < Date.now()) {
    throw new Error("OTP expired", { cause: 400 }); // bad request
  }

  // update user
  userExist.password = hashPassword(newPassword);
  userExist.credentialUpdatedAt = Date.now();
  userExist.otp = undefined;
  userExist.otpExpire = undefined;
  await userExist.save();

  // // destroy all refresh tokens
  // await Token.deleteMany({ user: userExist.id, type: "refresh" });

  return res
    .status(200)
    .json({ message: "Password updated successfully", success: true });
};

// Logout
export const logout = async (req, res, next) => {
  // get data from request
  const token = req.headers.authorization;

  //store token in DB
  await Token.create({ token, user: req.user._id });

  return res
    .status(200)
    .json({ message: "user logged out successfully", success: true });
};
