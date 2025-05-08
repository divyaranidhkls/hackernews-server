import { Hono } from "hono";
import { authenticationRoutes } from "./authentication_routes.js";
//import { usersRoutes } from "./user-routes.js";
import { postRoutes } from "./posts-routes.js";
import { LikeRoutes } from "../routes/like-routes.js";
import { CommentRoutes } from "./comment-routes.js";
import { cors } from "hono/cors";
import { authRoute } from "./middlewares/session-middlewares.js";
export const allRoutes = new Hono();
allRoutes.use(
  cors({
    origin: "http://localhost:4000", // or your actual frontend origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, // 👈 Add this line
  })
);
allRoutes.route("/comment", CommentRoutes);
allRoutes.route("/posts", postRoutes);
allRoutes.route("/api/auth",authRoute)
allRoutes.route("/Like", LikeRoutes);

    


allRoutes.route("/Log-in", authenticationRoutes);
//allRoutes.route("/Users", usersRoutes);



