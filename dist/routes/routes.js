"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const hono_1 = require("hono");
const authentication_routes_js_1 = require("./authentication_routes.js");
const user_routes_js_1 = require("./user-routes.js");
const posts_routes_js_1 = require("./posts-routes.js");
const like_routes_js_1 = require("../routes/like-routes.js");
const comment_routes_js_1 = require("./comment-routes.js");
const cors_1 = require("hono/cors");
const session_middlewares_js_1 = require("./middlewares/session-middlewares.js");
exports.allRoutes = new hono_1.Hono();
exports.allRoutes.use((0, cors_1.cors)({
    origin: "http://localhost:4000", // or your actual frontend origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, // 👈 Add this line
}));
exports.allRoutes.route("/comment", comment_routes_js_1.CommentRoutes);
exports.allRoutes.route("/posts", posts_routes_js_1.postRoutes);
exports.allRoutes.route("/api/auth", session_middlewares_js_1.authRoute);
exports.allRoutes.route("/Like", like_routes_js_1.LikeRoutes);
exports.allRoutes.route("/Log-in", authentication_routes_js_1.authenticationRoutes);
exports.allRoutes.route("/Users", user_routes_js_1.usersRoutes);
