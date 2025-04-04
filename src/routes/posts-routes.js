import { getPostsError } from "../controllers/posts/posts-types.js";
import { createPosts, deletePostsById, getPostsCronologicalOrder, } from "../controllers/posts/posts-controllers.js";
import { prismaClient } from "../extra/prisma.js";
import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import { getPostsBymeInOrder } from "../controllers/posts/posts-controllers.js";
import { getDeletepostsError } from "../controllers/posts/posts-types.js";
export const postRoutes = new Hono();
postRoutes.post("/post", tokenMiddleware, async (context) => {
    const userId = await context.get("userId");
    const input = await context.req.json();
    try {
        const result = await createPosts({ userId, input });
        return context.json({ message: "Posts Created", post: result });
    }
    catch (e) {
        throw e;
    }
});
postRoutes.get("/getAllposts", tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await getPostsCronologicalOrder(page, limit);
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
postRoutes.get("/getPostsBymeInOrder", tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    const userId = context.get("userId");
    try {
        const result = await getPostsBymeInOrder({ page, limit, userId });
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
postRoutes.delete("/DeletePosts/:postId", tokenMiddleware, async (context) => {
    const userId = await context.get("userId");
    const postId = await context.req.param("postId");
    try {
        const deletePosts = await deletePostsById({ userId, postId });
        if (deletePosts) {
            return context.json("Posts deleted Successfully");
        }
    }
    catch (e) {
        if (e === getDeletepostsError.UNAUTHORIZED) {
            return context.json("Post Already Deleted");
        }
        if (e === getDeletepostsError.NOT_FOUND) {
            return context.json("User Not Fond");
        }
    }
    return context.json("Cant Delete");
});
