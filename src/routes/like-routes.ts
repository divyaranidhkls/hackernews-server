import { Hono } from "hono";
import { LikeErrors, type LikePost } from "../controllers/Likes/likes-types.js";
import { prismaClient } from "../extra/prisma.js";
import { tokenMiddleware } from "../routes/middlewares/token-middlewares.js";
import { LikePosts } from "../controllers/Likes/like_controllers.js";

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
