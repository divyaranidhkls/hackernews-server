import { Hono } from "hono";
import { authenticationRoutes } from "./authentication_routes.js";

export const allRoutes = new Hono();
allRoutes.route("/sign-up", authenticationRoutes);
