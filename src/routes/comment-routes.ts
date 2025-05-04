import {Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import {
  CommentPosts,
  deteleComments,
  getAllComments,
  getComments,
  UpdateComments,
} from "../controllers/Comments/comments-controllers.js";
import { getcommentError } from "../controllers/Comments/comments-types.js";
  import { sessionMiddleware } from "./middlewares/session-middlewares.js";



export const CommentRoutes = new Hono();
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



CommentRoutes.post("/on/:postId", sessionMiddleware, async (c) => {
  try {
    const postId = c.req.param("postId");
    const userId = c.get("user").id; // Get user ID from session
    const { content } = await c.req.json();

    const result = await CommentPosts({ content, postId, userId });
    return c.json(result);
  } catch (error) {
    if (error === getcommentError.UNAUTHORIZED) {
      return c.json({ message: "Post not found" }, 404);
    }
    if (error === getcommentError.NOT_FOUND) {
      return c.json({ message: "Comment creation failed" }, 500);
    }

    return c.json({ message: "Unknown error" }, 500);
  }
});

CommentRoutes.get(
  "/getAllComments/:postId",
  sessionMiddleware,
  async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    const postId =context.req.param("postId");
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
      const result = await getComments({
        page,
        limit,
        postId,
      });
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
      if (e === getcommentError.UNAUTHORIZED) {
        return context.json({ message: "Unauthorized" }, 401);
      }
      if (e === getcommentError.BAD_REQUEST) {
        return context.json({ message: "No comments found" }, 400);
      }
      return context.json({ message: "Internal Server Error" }, 500);
    }
  }
);
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

CommentRoutes.patch(
  "/updateComments/:commentsId",
  tokenMiddleware,
  async (c) => {
    const userId = await c.get("userId");
    const commentsId = await c.req.param("commentsId");
    const { content } = await c.req.json();

    try {
      const response = await UpdateComments({ userId, commentsId, content });
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

CommentRoutes.get("/all", sessionMiddleware, async (context) => {
  const user = context.get("user");
  const page = Math.max(1, Number(context.req.query("page") || 1));
  const limit = Math.max(1, Number(context.req.query("limit") || 10));

  if (!user?.id) {
    return context.json({ message: "Unauthorized" }, 401);
  }

  try {
    const result = await getAllComments({
      userId: user.id,
      page,
      limit,
    });

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
    console.error('Error fetching comments:', e);
    if (e === getcommentError.UNAUTHORIZED) {
      return context.json({ message: "Unauthorized" }, 401);
    }
    if (e === getcommentError.BAD_REQUEST) {
      return context.json({ message: "No comments found" }, 400);
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});
