import jwt from "jsonwebtoken";

export const verifyToken = (
  token,
  secretKey = "tokensecretkeyforsarahaapp"
) => {
  return jwt.verify(token, secretKey); // returns payload
};
