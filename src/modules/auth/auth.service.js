import { User } from "../../DB/models/user.model.js";
import bcrypt from "bcrypt";
import { sendMail } from "../../utils/email/index.js";
import { generateOTP } from "../../utils/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

// register
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
    password: bcrypt.hashSync(password, 10),
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

// resend OTP
export const resendOTP = async (req, res) => {
  // get data from req.body
  const { email } = req.body;

  // generate new OTP and expire date
  const { otp, otpExpire } = generateOTP();

  // update user
  await User.updateOne({ email: email }, { otp, otpExpire });

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

// login
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

  // compare password
  const match = bcrypt.compareSync(password, userExist.password);
  if (!match) {
    throw new Error("invalid credentials", { cause: 401 });
  }
  // generate token
  const token = jwt.sign(
    { id: userExist._id, name: userExist.fullName },
    "tokensecretkeyforsarahaapp",
    { expiresIn: "15m" }
  );

  // send response
  return res.status(200).json({
    message: " user logged in successfully",
    succes: true,
    data: { token },
  });
};

// google OAuth
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
