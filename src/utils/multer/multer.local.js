import fs from "node:fs";
import { nanoid } from "nanoid";
import multer, { diskStorage } from "multer";

export const fileUpload = ({
  folder,
  allowedTypes = ["image/png", "image/jpeg", "image/jpg"],
} = {}) => {
  const storage = diskStorage({
    destination: (req, file, cb) => {
      let dest = `uploads/${req.user._id}/${folder}`;

      // check for duplication
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },

    filename: (req, file, cb) => {
      cb(null, nanoid(5) + "-" + file.originalname); //nanoId
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file format", { cause: 400 }));
    }
  };
  return multer({ storage, fileFilter });
};
