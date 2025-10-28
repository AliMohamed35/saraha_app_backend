import bcyrpt from "bcrypt";

export const hashPassword = (password) => {
  return bcyrpt.hashSync(password, 10);
};

export const comparePassword = (password, hashPassword) => {
  return bcyrpt.compareSync(password, hashPassword);
};
