import joi from "joi";

export const isValide = (joiSchema) => {
  // schema is changeable for every service thats why we need it to be parameter (dynamic)
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const { error } = joiSchema.validate(data, { abortEarly: false });

    if (error) {
      let errMessage = error.details.map((err) => {
        return err.message;
      });

      errMessage.join(", ");
      throw new Error(errMessage, { cause: 400 });
    }

    next();
  };
};

export const generalFields = {
  email: joi.string().email({ tlds: { allow: ["com", "net", "org"] } }),
  phoneNumber: joi.string().length(11),
  password: joi
    .string()
    .min(8)
    .regex(/^[a-zA-Z0-9]{8,30}$/),
  name: joi.string().min(3).max(30),
  dob: joi.date(),
  otp: joi.number().max(5),
  rePassword: (ref) => joi.string().min(8).valid(joi.ref(ref)),
  objectId: joi.string().hex().length(24),
};
