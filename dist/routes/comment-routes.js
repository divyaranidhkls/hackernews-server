"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const hono_1 = require("hono");
const token_middlewares_js_1 = require("./middlewares/token-middlewares.js");
const comments_controllers_js_1 = require("../controllers/authentication/Comments/comments-controllers.js");
const comments_types_js_1 = require("../controllers/authentication/Comments/comments-types.js");
exports.CommentRoutes = new hono_1.Hono();
exports.CommentRoutes.post("/CommentPosts/:postId", token_middlewares_js_1.tokenMiddleware, async (c) => {
    const userId = await c.get("userId");
    const postId = await c.req.param("postId");
    const { content } = await c.req.json();
    try {
        const comments = await (0, comments_controllers_js_1.CommentPosts)({ userId, postId, content });
        if (comments) {
            return c.json({ message: "Commented Succefully", comments });
        }
    }
    catch (e) {
        if (e === comments_types_js_1.getcommentError.NOT_FOUND) {
            return c.json("Post | User Not Found");
        }
        return c.json(" ");
    }
});
exports.CommentRoutes.get("/getAllComments/:postId", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    const postId = await context.req.param("postId");
    try {
        const result = await (0, comments_controllers_js_1.getComments)({ page, limit, postId });
        return context.json({
            data: result.comments,
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
exports.CommentRoutes.delete("/deleteComments/:commentsId", token_middlewares_js_1.tokenMiddleware, async (c) => {
    const userId = await c.get("userId");
    const commentsId = await c.req.param("commentsId");
    try {
        const response = await (0, comments_controllers_js_1.deteleComments)({ userId, commentsId });
        if (response) {
            return c.json(response);
        }
    }
    catch (e) {
        if (e === comments_types_js_1.getcommentError.UNAUTHORIZED) {
            return c.json("Unauthorized Access");
        }
        if (e === comments_types_js_1.getcommentError.NOT_FOUND) {
            return c.json("User or Comments Not Found");
        }
    }
    return c.json("Internal Server Error");
});
exports.CommentRoutes.patch("/updateComments/:commentsId", token_middlewares_js_1.tokenMiddleware, async (c) => {
    const userId = await c.get("userId");
    const commentsId = await c.req.param("commentsId");
    const { content } = await c.req.json();
    try {
        const response = await (0, comments_controllers_js_1.UpdateComments)({ userId, commentsId, content });
        if (response) {
            return c.json(response);
        }
    }
    catch (e) {
        if (e === comments_types_js_1.getcommentError.UNAUTHORIZED) {
            return c.json("Unauthorized Access");
        }
        if (e === comments_types_js_1.getcommentError.NOT_FOUND) {
            return c.json("User or Comments Not Found");
        }
    }
    return c.json("Internal Server Error");
});
