import express from "express";
import { router as moocRoutes } from "./routes/moocsRoutes";
import { router as uploadRoutes } from "./routes/uploadRoutes";
import { router as usersRoutes } from "./routes/usersRoutes";
import cors from "cors";
import { setupAssistant } from "./services/bardai";
import { env } from "process";
import mongoose from "mongoose";

export const app = express();
const port = 3033;

const routes = {
  "/moocs": moocRoutes,
  "/upload": uploadRoutes,
  "/users": usersRoutes,
};

mongoose.connect(
  "mongodb://api:docker1234@localhost:27017/malwares?authSource=admin"
);
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(cors());

for (const [path, route] of Object.entries(routes)) {
  app.use(path, route);
}

if (require.main === module) {
  app.listen(port, () => {
    console.log("Server is running on port 3033");
  });
}

setupAssistant();
