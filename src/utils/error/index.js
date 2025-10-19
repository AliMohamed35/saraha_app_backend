export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      next(error); // then this will go and try to find middleware that accepts 4 args >>> global error handler
    });
  };
};
