// export const asyncHandler = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((error) => {
//       next(error); // then this will go and try to find middleware that accepts 4 args >>> global error handler
//     });
//   };
// };

import { Token } from "../../DB/models/token.model.js";
import { verifyToken } from "../token/index.js";
import { generateToken } from "../token/index.js";

export const globalErrorHandler = async (error, req, res, next) => {
  // if (req.file) {
  //   fs.unlinkSync(req.file.path);
  // }
  if (error.message === "jwt expired") {
    const refreshToken = req.headers.refreshtoken;
    const payload = verifyToken(refreshToken);
    console.log(payload);

    const tokenExist = await Token.findOneAndDelete({
      token: refreshToken,
      user: payload.id,
      type: "refresh",
    });

    if (!tokenExist) {
      throw new Error("invalid refresh token", { cause: 401 });
      // logout from all devices
    }
    const accessToken = generateToken({
      payload: { id: payload.id },
      options: { expiresIn: "15m" },
    });

    const newRefreshToken = generateToken({
      payload: { id: payload.id },
      options: { expiresIn: "7d" },
    });
    console.log(newRefreshToken);

    return res.status(200).json({
      message: "refresh token successfully",
      succes: true,
      data: { accessToken, refreshToken: newRefreshToken },
    });
  }
  res.status(error.cause || 500).json({
    message: error.message,
    success: false,
    stack: error.stack,
    globalErrorHandler: true,
  });
};
