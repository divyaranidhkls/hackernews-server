import { Hono } from "hono";
import { LikeErrors, type LikePost } from "../controllers/Likes/likes-types.js";
import { prismaClient } from "../extra/prisma.js";
import { tokenMiddleware } from "../routes/middlewares/token-middlewares.js";
import { LikePosts } from "../controllers/Likes/like_controllers.js";
import { getLikes } from "../controllers/Likes/like_controllers.js";
export const LikeRoutes = new Hono();
LikeRoutes.post("/LikePosts/:postId", tokenMiddleware, async (c) => {
  const userId = await c.get("userId");
  const postId = await c.req.param("postId");
  try {
    const posts = await LikePosts({ userId, postId });
    if (posts) {
      return c.json({ message: "Liked Succefully", posts });
    }
  } catch (e) {
    if (e === LikeErrors.ALREADY_LIKED) {
      return c.json("Already Liked");
    }
    if (e === LikeErrors.NOT_FOUND) {
      return c.json("User | post Not Found");
    }
    return c.json("Internal Server Eror ");
  }
});

LikeRoutes.get("/getAllLikes/:postId", tokenMiddleware, async (context) => {
  const page = Number(context.req.query("page") || 1);
  const limit = Number(context.req.query("limit") || 10);
  const postId = await context.req.param("postId");
  try {
    const result = await getLikes({ page, limit, postId });

    return context.json(
      {
        data: result.Like,
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
