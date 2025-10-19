import joi from "joi";

// joi validate
export const joiSchema = joi
  .object({
    fullName: joi.string().min(3).max(50).required(),

    email: joi
      .string()
      .email({ tlds: ["com", "org", "eg"] }) // top level domains
      .when("phoneNumber", {
        is: joi.exist(),
        then: joi.optional(),
        otherwise: joi.required(),
      }),

    password: joi
      .string()
      .regex(/^[a-zA-Z0-9]{8,30}$/)
      .required(),

    phoneNumber: joi.string().length(11),

    dob: joi.date(),
  })
  .or("email", "phoneNumber");
