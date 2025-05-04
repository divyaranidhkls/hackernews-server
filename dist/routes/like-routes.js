"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRoutes = void 0;
const hono_1 = require("hono");
const likes_types_js_1 = require("../controllers/Likes/likes-types.js");
const session_middlewares_js_1 = require("./middlewares/session-middlewares.js");
const like_controllers_js_1 = require("../controllers/Likes/like_controllers.js");
exports.LikeRoutes = new hono_1.Hono();
// Like a post
exports.LikeRoutes.post("/LikePosts/:postId", session_middlewares_js_1.sessionMiddleware, async (c) => {
    const userId = c.get("user").id; // Get user ID from session
    const postId = c.req.param("postId");
    try {
        const posts = await (0, like_controllers_js_1.LikePosts)({ userId, postId });
        return c.json({ message: "Liked Successfully", posts });
    }
    catch (e) {
        if (e === likes_types_js_1.LikeErrors.ALREADY_LIKED) {
            return c.json({ message: "Already Liked" });
        }
        if (e === likes_types_js_1.LikeErrors.NOT_FOUND) {
            return c.json({ message: "User or Post Not Found" });
        }
        console.error("LikePosts error:", e);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});
// Get all likes and whether the user liked it
exports.LikeRoutes.get("/getAllLikes/:postId", async (c) => {
    const postId = c.req.param("postId");
    const page = Number(c.req.query("page") ?? "1");
    const limit = Number(c.req.query("limit") ?? "10");
    try {
        const result = await (0, like_controllers_js_1.getLikes)({ postId, page, limit });
        return c.json({ data: result.Like, total: result.total });
    }
    catch (error) {
        return c.json({ message: "Error fetching likes", error });
    }
});
// Delete a like
exports.LikeRoutes.delete("/DeleteLikes/:postId", session_middlewares_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const userId = user.id;
    const postId = context.req.param("postId");
    try {
        const deleteLikes = await (0, like_controllers_js_1.deleteLikeById)({ userId, postId });
        return context.json({ message: "Like deleted successfully" });
    }
    catch (e) {
        if (e === likes_types_js_1.DeleteLikeErrors.NOT_FOUND) {
            return context.json({ message: "Like Not Found" });
        }
        if (e === likes_types_js_1.DeleteLikeErrors.UNAUTHORIZED) {
            return context.json({ message: "User is Not Authorized" });
        }
        return context.json({ message: "Internal Server Error" });
    }
});
