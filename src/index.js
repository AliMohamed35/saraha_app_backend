import bootstrap from "./app.controller.js";
import express from "express";
import { User } from "./DB/models/user.model.js";
import schedule from "node-schedule";
import { deleteFolder } from "./utils/cloud/cloudinary.config.js";
import { Message } from "./DB/models/message.model.js";

schedule.scheduleJob("1 2 7 * * *", async () => {
  const users = await User.find({
    deletedAt: { $lte: Date.now() - 60 * 1000 },
  });

  for (const user of users) {
    if (user.profilePic.public_id) {
      await deleteFolder(`saraha-app/users/${user._id}`);
    }
  }

  await User.deleteMany({
    deletedAt: { $lte: Date.now() - 60 * 1000 },
  });

  await Message.deleteMany({
    receiver: { $in: users.map((user) => user._id) },
  });

  console.log("deleted user");
});

const app = express();
const PORT = process.env.PORT;

bootstrap(app, express);

app.listen(PORT, () => {
  console.log(`app running on port: ${PORT}`);
});
