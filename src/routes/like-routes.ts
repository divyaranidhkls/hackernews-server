import { Hono } from "hono";
import { LikeErrors, DeleteLikeErrors } from "../controllers/Likes/likes-types.js";
import { prismaClient } from "../extra/prisma.js";
import { sessionMiddleware } from "./middlewares/session-middlewares.js";
import { LikePosts, getLikes, deleteLikeById } from "../controllers/Likes/like_controllers.js";

export const LikeRoutes = new Hono();

// Like a post
LikeRoutes.post("/LikePosts/:postId", sessionMiddleware, async (c) => {
  const userId = c.get("user").id; // Get user ID from session
  
  const postId =c.req.param("postId");

  try {
    const posts = await LikePosts({ userId, postId });
    return c.json({ message: "Liked Successfully", posts });
  } catch (e) {
    if (e === LikeErrors.ALREADY_LIKED) {
      return c.json({ message: "Already Liked" });
    }
    if (e === LikeErrors.NOT_FOUND) {
      return c.json({ message: "User or Post Not Found" });
    }
    console.error("LikePosts error:", e);
    return c.json({ message: "Internal Server Error" }, 500);
    
  }
});

// Get all likes and whether the user liked it
LikeRoutes.get("/getAllLikes/:postId", async (c) => {
  const postId = c.req.param("postId");
  const page = Number(c.req.query("page") ?? "1");
  const limit = Number(c.req.query("limit") ?? "10");

  try {
    const result = await getLikes({ postId, page, limit });
    return c.json({ data: result.Like, total: result.total });
  } catch (error) {
    return c.json({ message: "Error fetching likes", error});
  }
});

// Delete a like
LikeRoutes.delete("/DeleteLikes/:postId", sessionMiddleware, async (context) => {
  const user = context.get("user");
  const userId = user.id;
  const postId = context.req.param("postId");

  try {
    const deleteLikes = await deleteLikeById({ userId, postId });
    return context.json({ message: "Like deleted successfully" });
  } catch (e) {
    if (e === DeleteLikeErrors.NOT_FOUND) {
      return context.json({ message: "Like Not Found" });
    }
    if (e === DeleteLikeErrors.UNAUTHORIZED) {
      return context.json({ message: "User is Not Authorized" });
    }
    return context.json({ message: "Internal Server Error" });
  }
});
