import jwt from "jsonwebtoken";

export const verifyToken = (
  token,
  secretKey = "tokensecretkeyforsarahaapp"
) => {
  return jwt.verify(token, secretKey); // returns payload // also if entered invalid token it returns Error("invalid token signature")
};

export const generateToken = ({
  payload,
  secretKey = "tokensecretkeyforsarahaapp",
  options = { expiresIn: "15m" },
}) => {
  return jwt.sign(payload, secretKey, options);
};
