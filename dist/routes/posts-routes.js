"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const posts_controllers_js_1 = require("../controllers/posts/posts-controllers.js");
const hono_1 = require("hono");
const token_middlewares_js_1 = require("./middlewares/token-middlewares.js");
const posts_controllers_js_2 = require("../controllers/posts/posts-controllers.js");
const posts_types_js_1 = require("../controllers/posts/posts-types.js");
exports.postRoutes = new hono_1.Hono();
exports.postRoutes.post("/post", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const userId = await context.get("userId");
    const input = await context.req.json();
    try {
        const result = await (0, posts_controllers_js_1.createPosts)({ userId, input });
        return context.json({ message: "Posts Created", post: result });
    }
    catch (e) {
        throw e;
    }
});
exports.postRoutes.get("/getAllposts", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, posts_controllers_js_1.getPostsCronologicalOrder)(page, limit);
        return context.json({
            data: result.post,
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
exports.postRoutes.get("/getPostsBymeInOrder", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    const userId = context.get("userId");
    try {
        const result = await (0, posts_controllers_js_2.getPostsBymeInOrder)({ page, limit, userId });
        return context.json({
            data: result.post,
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
    return context.json({
        message: "Internal Server Error",
    }, 500);
});
exports.postRoutes.delete("/DeletePosts/:postId", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const userId = await context.get("userId");
    const postId = await context.req.param("postId");
    try {
        const deletePosts = await (0, posts_controllers_js_1.deletePostsById)({ userId, postId });
        if (deletePosts) {
            return context.json("Posts deleted Successfully");
        }
    }
    catch (e) {
        if (e === posts_types_js_1.getDeletepostsError.UNAUTHORIZED) {
            return context.json("Post Already Deleted");
        }
        if (e === posts_types_js_1.getDeletepostsError.NOT_FOUND) {
            return context.json("User Not Fond");
        }
    }
    return context.json("Cant Delete");
});
