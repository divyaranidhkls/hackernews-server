import { Hono } from "hono";
import { authenticationRoutes } from "./authentication_routes.js";
import { usersRoutes } from "./user-routes.js";
import { postRoutes } from "./posts-routes.js";
import { LikeRoutes } from "../routes/like-routes.js";
import { CommentRoutes } from "./comment-routes.js";

export const allRoutes = new Hono();
allRoutes.route("/Log-in", authenticationRoutes);
allRoutes.route("/Users", usersRoutes);
allRoutes.route("/Posts", postRoutes);
allRoutes.route("/Like", LikeRoutes);
allRoutes.route("/Comment", CommentRoutes);
