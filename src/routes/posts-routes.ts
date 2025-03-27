import { getPostsError } from "../controllers/posts/posts-types.js";
import {
  createPosts,
  getPostsCronologicalOrder,
} from "../controllers/posts/posts-controllers.js";
import { prismaClient } from "../extra/prisma.js";
import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";

export const postRoutes = new Hono();

postRoutes.post("/post", tokenMiddleware, async (context) => {
  const userId = await context.get("userId");
  const input = await context.req.json();

  try {
    const result = await createPosts({ userId, input });

    return context.json({ message: "Posts Created", post: result });
  } catch (e) {
    throw e;
  }
});

postRoutes.get("/getAllposts", tokenMiddleware, async (context) => {
  const page = Number(context.req.query("page") || 1);
  const limit = Number(context.req.query("limit") || 10);
  try {
    const result = await getPostsCronologicalOrder(page, limit);

    return context.json(
      {
        data: result.post,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      },
      200
    );
  } catch (e) {
    return context.json({ message: e }, 404);
  }
});
