import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import { CommentPosts } from "../controllers/authentication/Comments/comments-controllers.js";
import { getcommentError } from "../controllers/authentication/Comments/comments-types.js";
export const CommentRoutes = new Hono();
CommentRoutes.post("/CommentPosts/:postId", tokenMiddleware, async (c) => {
  const userId = await c.get("userId");
  const postId = await c.req.param("postId");
  const { content } = await c.req.json();
  try {
    const comments = await CommentPosts({ userId, postId, content });
    if (comments) {
      return c.json({ message: "Commented Succefully", comments });
    }
  } catch (e) {
    if (e === getcommentError.NOT_FOUND) {
      return c.json("Post | User Not Found");
    }

    return c.json(" ");
  }
});
