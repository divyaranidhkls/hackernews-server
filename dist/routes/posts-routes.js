"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const posts_controllers_js_1 = require("../controllers/posts/posts-controllers.js");
const prisma_js_1 = require("../extra/prisma.js");
const hono_1 = require("hono");
const token_middlewares_js_1 = require("./middlewares/token-middlewares.js");
const posts_controllers_js_2 = require("../controllers/posts/posts-controllers.js");
const posts_types_js_1 = require("../controllers/posts/posts-types.js");
const session_middlewares_js_1 = require("./middlewares/session-middlewares.js");
exports.postRoutes = new hono_1.Hono();
exports.postRoutes.post("/createposts", session_middlewares_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user"); // Access the user object correctly
    if (!user || !user.id) {
        return context.json({ message: "Unauthorized" }, 401);
    }
    const userId = user.id; // Extract the id property
    const input = await context.req.json();
    try {
        const result = await (0, posts_controllers_js_1.createPosts)({ userId, input });
        return context.json({ message: "Post Created", post: result });
    }
    catch (e) {
        console.error("Error creating post:", e);
        return context.json({ message: "Error creating post", error: String(e) }, 500);
    }
});
exports.postRoutes.get('/getAllposts', session_middlewares_js_1.sessionMiddleware, async (context) => {
    try {
        const page = parseInt(context.req.query('page') || '1', 10);
        const limit = parseInt(context.req.query('limit') || '10', 10);
        const result = await (0, posts_controllers_js_1.getPostsChronologicalOrder)(page, limit);
        return context.json({
            success: true,
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
        console.error('Error fetching posts:', e);
        return context.json({
            success: false,
            message: e?.message || 'Failed to fetch posts',
        }, 500);
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
exports.postRoutes.get("/AuthorById/:postId", session_middlewares_js_1.sessionMiddleware, async (context) => {
    const postId = context.req.param("postId");
    try {
        const author = await prisma_js_1.prismaClient.post.findUnique({
            where: {
                id: postId,
            },
            select: {
                posts: true,
            },
        });
        if (!author) {
            return context.json({ message: "Author not found" }, 404);
        }
        return context.json(author.posts, 200);
    }
    catch (e) {
        return context.json({ message: e }, 500);
    }
});
