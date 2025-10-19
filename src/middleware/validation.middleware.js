export const isValide = (joiSchema) => {
  // schema is changeable for every service thats why we need it to be parameter (dynamic)
  return (req, res, next) => {
    const { value, error } = joiSchema.validate(req.body, {
      abortEarly: false,
    });

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
