"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const hono_1 = require("hono");
const authentication_routes_js_1 = require("./authentication_routes.js");
const user_routes_js_1 = require("./user-routes.js");
const posts_routes_js_1 = require("./posts-routes.js");
const like_routes_js_1 = require("../routes/like-routes.js");
const comment_routes_js_1 = require("./comment-routes.js");
exports.allRoutes = new hono_1.Hono();
exports.allRoutes.route("/Log-in", authentication_routes_js_1.authenticationRoutes);
exports.allRoutes.route("/Users", user_routes_js_1.usersRoutes);
exports.allRoutes.route("/Posts", posts_routes_js_1.postRoutes);
exports.allRoutes.route("/Like", like_routes_js_1.LikeRoutes);
exports.allRoutes.route("/Comment", comment_routes_js_1.CommentRoutes);
