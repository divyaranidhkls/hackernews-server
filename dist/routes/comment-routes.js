"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const hono_1 = require("hono");
const token_middlewares_js_1 = require("./middlewares/token-middlewares.js");
const comments_controllers_js_1 = require("../controllers/Comments/comments-controllers.js");
const comments_types_js_1 = require("../controllers/Comments/comments-types.js");
const session_middlewares_js_1 = require("./middlewares/session-middlewares.js");
exports.CommentRoutes = new hono_1.Hono();
// CommentRoutes.post("/on/:postId", sessionMiddleware, async (context) => {
//   const user = context.get("user");
//   const postId =context.req.param("postId");
//   const body = await context.req.json();
//   if (!body.content || typeof body.content !== "string") {
//     return context.json({ message: "Invalid content" }, 400);
//   }
//   const content = body.content;
//   if(!user.id)
//   {return context.json({ message: "User not found" }, 400);}
//   try {
//     const result = await CommentPosts({
//       userId: user.id,
//       postId,
//       content,
//       // updatedAt: new Date(now()), // Removed as it's not part of the expected type
//     });
//     if(!result) 
//   {  return context.json(result, 200);}
//   } catch (e) {
//     if (e === getcommentError.UNAUTHORIZED) {
//       return context.json({ message: "User with the token is not found" }, 400);
//     }
//     if (e === getcommentError.NOT_FOUND) {
//       return context.json({ message: "Post with given id is not found" }, 404);
//     }
//     console.error("Internal error in commentPost:", e); // 🔍 useful!
//     return context.json({e}, 500);
//   }
// });
exports.CommentRoutes.post("/on/:postId", session_middlewares_js_1.sessionMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const userId = c.get("user").id; // Get user ID from session
        const { content } = await c.req.json();
        const result = await (0, comments_controllers_js_1.CommentPosts)({ content, postId, userId });
        return c.json(result);
    }
    catch (error) {
        if (error === comments_types_js_1.getcommentError.UNAUTHORIZED) {
            return c.json({ message: "Post not found" }, 404);
        }
        if (error === comments_types_js_1.getcommentError.NOT_FOUND) {
            return c.json({ message: "Comment creation failed" }, 500);
        }
        return c.json({ message: "Unknown error" }, 500);
    }
});
exports.CommentRoutes.get("/getAllComments/:postId", session_middlewares_js_1.sessionMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    const postId = context.req.param("postId");
    const user = context.get("user"); // Fetch logged-in user
    if (!user?.id) {
        return context.json({ message: "Unauthorized" }, 401);
    }
    if (!postId) {
        return context.json({ message: "Post ID is required" }, 400);
    }
    if (!page || !limit) {
        return context.json({ message: "Page and limit are required" }, 400);
    }
    try {
        const result = await (0, comments_controllers_js_1.getComments)({
            page,
            limit,
            postId,
        });
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
        if (e === comments_types_js_1.getcommentError.UNAUTHORIZED) {
            return context.json({ message: "Unauthorized" }, 401);
        }
        if (e === comments_types_js_1.getcommentError.BAD_REQUEST) {
            return context.json({ message: "No comments found" }, 400);
        }
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
// CommentRoutes.get("/comment/getAllComments/:postId",sessionmiddleware, async (c) => {
//   const postId = c.req.param("postId");
//   const page = Number(c.req.query("page") || 1);
//   const limit = Number(c.req.query("limit") || 10);
//   try {
//     const { comments, total } = await getComments({ page, limit, postId });
//     return c.json({ data: comments, total });
//   } catch (error) {
//     console.error("Error getting comments:", error);
//     return c.json({ message: "Failed to fetch comments" }, 500);
//   }
// });
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
exports.CommentRoutes.get("/all", session_middlewares_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const page = Math.max(1, Number(context.req.query("page") || 1));
    const limit = Math.max(1, Number(context.req.query("limit") || 10));
    if (!user?.id) {
        return context.json({ message: "Unauthorized" }, 401);
    }
    try {
        const result = await (0, comments_controllers_js_1.getAllComments)({
            userId: user.id,
            page,
            limit,
        });
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
        console.error('Error fetching comments:', e);
        if (e === comments_types_js_1.getcommentError.UNAUTHORIZED) {
            return context.json({ message: "Unauthorized" }, 401);
        }
        if (e === comments_types_js_1.getcommentError.BAD_REQUEST) {
            return context.json({ message: "No comments found" }, 400);
        }
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
