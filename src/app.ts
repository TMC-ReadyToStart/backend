import express from "express";
import { router as moocRoutes } from "./routes/moocsRoutes";
import { router as uploadRoutes } from "./routes/uploadRoutes";
import { router as usersRoutes } from "./routes/usersRoutes";

export const app = express();
const port = 3000;

const routes = {
  "/moocs": moocRoutes,
  "/upload": uploadRoutes,
  "/users": usersRoutes,
};

for (const [path, route] of Object.entries(routes)) {
  app.use(path, route);
}

if (require.main === module) {
  app.listen(port, () => {
    console.log("Server is running on port 3000");
  });
}
