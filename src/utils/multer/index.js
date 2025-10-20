import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

export const fileUpload = () => {
  const storage = diskStorage({
    destination: "uploads", // where to save
    filename: (req, file, cb) => {
      console.log(file);
      //   if (file.mimetype == "application/pdf") {
      //     cb(new Error("invalid file format"), { cause: 400 }); // global error handler
      //   }

      // cb(null, Date.now() + "-" + Math.random() + "_" + file.originalname); // this is the next(); // same name will over ride
      cb(null, nanoid(5) + "-" + file.originalname); //nanoId
    },
  });

  return multer({ storage });
};

fileUpload(); // object from multer
