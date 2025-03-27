import { getPostsError } from "../controllers/posts/posts-types.js";
import { createPosts } from "../controllers/posts/posts-controllers.js";
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
