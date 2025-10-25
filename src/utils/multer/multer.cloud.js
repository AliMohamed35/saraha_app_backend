import multer, { diskStorage } from "multer";

export const fileUpload = ({
  allowedTypes = ["image/png", "image/jpeg", "image/jpg"],
} = {}) => {
  const storage = diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format", { cause: 400 }));
    }
  };
  return multer({ storage, fileFilter });
};
