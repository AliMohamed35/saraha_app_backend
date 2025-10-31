import { Message } from "../../DB/models/message.model.js";
import { uploadFiles } from "../../utils/cloud/cloudinary.config.js";

export const sendMessage = async (req, res, next) => {
  // get data from req
  const { content } = req.body;
  const { receiver } = req.params;
  const { files } = req;

  // upload to cloud
  const attachments = await uploadFiles(files, {
    folder: `saraha-app/messages/${receiver}`,
  });

  // save data into DB
  Message.create({
    content,
    receiver,
    attachments,
    sender: req.user?._id, // in mongoDB undefined is not stored in DB
  });

  res
    .status(201)
    .json({ message: "Message sent successfully!", success: true });
};
