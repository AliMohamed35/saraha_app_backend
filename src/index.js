import bootstrap from "./app.controller.js";
import express from "express";
const app = express();
const PORT = 3000;

bootstrap(app, express);

app.listen(PORT, () => {
  console.log(`app running on port: ${PORT}`);
});
