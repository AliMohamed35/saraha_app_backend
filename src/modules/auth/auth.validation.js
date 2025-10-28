import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

// joi validate
export const joiSchema = joi
  .object({
    fullName: generalFields.name.required(),
    email: generalFields.email,
    password: generalFields.password,
    phoneNumber: generalFields.phoneNumber,
    dob: generalFields.dob,
  })
  .or("email", "phoneNumber");

export const resetPasswordSchema = joi.object({
  email: generalFields.email.required(),
  otp: generalFields.otp.required(),
  newPassword: generalFields.password.required(),
  rePassword: generalFields.rePassword("newPassword").required(),
});
