import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import {
  CommentPosts,
  deteleComments,
  getComments,
} from "../controllers/authentication/Comments/comments-controllers.js";
import { getcommentError } from "../controllers/authentication/Comments/comments-types.js";
import { get } from "http";
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

CommentRoutes.get(
  "/getAllComments/:postId",
  tokenMiddleware,
  async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    const postId = await context.req.param("postId");
    try {
      const result = await getComments({ page, limit, postId });

      return context.json(
        {
          data: result.comments,
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
  }
);

CommentRoutes.delete(
  "/deleteComments/:commentsId",
  tokenMiddleware,
  async (c) => {
    const userId = await c.get("userId");
    const commentsId = await c.req.param("commentsId");

    try {
      const response = await deteleComments({ userId, commentsId });
      if (response) {
        return c.json(response);
      }
    } catch (e) {
      if (e === getcommentError.UNAUTHORIZED) {
        return c.json("Unauthorized Access");
      }
      if (e === getcommentError.NOT_FOUND) {
        return c.json("User or Comments Not Found");
      }
    }
    return c.json("Internal Server Error");
  }
);
