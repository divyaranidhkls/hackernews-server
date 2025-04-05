"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRoutes = void 0;
const hono_1 = require("hono");
const likes_types_js_1 = require("../controllers/Likes/likes-types.js");
const token_middlewares_js_1 = require("../routes/middlewares/token-middlewares.js");
const like_controllers_js_1 = require("../controllers/Likes/like_controllers.js");
const like_controllers_js_2 = require("../controllers/Likes/like_controllers.js");
const like_controllers_js_3 = require("../controllers/Likes/like_controllers.js");
const likes_types_js_2 = require("../controllers/Likes/likes-types.js");
exports.LikeRoutes = new hono_1.Hono();
exports.LikeRoutes.post("/LikePosts/:postId", token_middlewares_js_1.tokenMiddleware, async (c) => {
    const userId = await c.get("userId");
    const postId = await c.req.param("postId");
    try {
        const posts = await (0, like_controllers_js_1.LikePosts)({ userId, postId });
        if (posts) {
            return c.json({ message: "Liked Succefully", posts });
        }
    }
    catch (e) {
        if (e === likes_types_js_1.LikeErrors.ALREADY_LIKED) {
            return c.json("Already Liked");
        }
        if (e === likes_types_js_1.LikeErrors.NOT_FOUND) {
            return c.json("User | post Not Found");
        }
        return c.json("Internal Server Eror ");
    }
});
exports.LikeRoutes.get("/getAllLikes/:postId", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    const postId = await context.req.param("postId");
    try {
        const result = await (0, like_controllers_js_2.getLikes)({ page, limit, postId });
        return context.json({
            data: result.Like,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        return context.json({ message: e }, 404);
    }
});
exports.LikeRoutes.delete("/DeleteLikes/:postId", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const userId = context.get("userId");
    const postId = await context.req.param("postId");
    try {
        const deleteLikes = await (0, like_controllers_js_3.deleteLikeById)({ userId, postId });
        if (deleteLikes) {
            return context.json("Like deleted Successfully");
        }
    }
    catch (e) {
        if (e === likes_types_js_2.DeleteLikeErrors.NOT_FOUND) {
            return context.json("Like Not Found");
        }
        if (e === likes_types_js_2.DeleteLikeErrors.UNAUTHORIZED) {
            return context.json("User is Not Authorized");
        }
    }
    return context.json("Internal ServerError");
});
