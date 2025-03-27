import { Hono } from "hono";
import { authenticationRoutes } from "./authentication_routes.js";
import { usersRoutes } from "./user-routes.js";
import { postRoutes } from "./posts-routes.js";

export const allRoutes = new Hono();
allRoutes.route("/log-in", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postRoutes);
