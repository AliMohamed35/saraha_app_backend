/**
 * @param expireTime - in milliseconds
 * @returns object {otp, otpExpire}
 */

export const generateOTP = (expireTime = 15 * 60 * 1000) => {
  // generate OTP
  const otp = Math.floor(Math.random() * 90000 + 10000); // 10000 >>> minimum number
  const otpExpire = Date.now() + expireTime * 60 * 1000; // 15 minutes
  return { otp, otpExpire };
};

generateOTP();
