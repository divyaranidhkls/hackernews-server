import { getPostsError } from "../controllers/posts/posts-types.js";
import {
  createPosts,
  deletePostsById,
  getPostsChronologicalOrder,
} from "../controllers/posts/posts-controllers.js";
import { prismaClient } from "../extra/prisma.js";
import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import { getPostsBymeInOrder } from "../controllers/posts/posts-controllers.js";
import { getDeletepostsError } from "../controllers/posts/posts-types.js";
import { sessionMiddleware } from "./middlewares/session-middlewares.js";


export const postRoutes = new Hono();

postRoutes.post("/createposts", sessionMiddleware, async (context) => {
  const user = context.get("user");  // Access the user object correctly
  if (!user || !user.id) {
    return context.json({ message: "Unauthorized" }, 401);
  }
  
  const userId = user.id;  // Extract the id property
  const input = await context.req.json();
  
  try {
    const result = await createPosts({ userId, input });
    return context.json({ message: "Post Created", post: result });
  } catch (e) {
    console.error("Error creating post:", e);
    return context.json({ message: "Error creating post", error: String(e) }, 500);
  }
});


postRoutes.get('/getAllposts', sessionMiddleware, async (context) => {
  try {
    const page = parseInt(context.req.query('page') || '1', 10);
    const limit = parseInt(context.req.query('limit') || '10', 10);

    const result = await getPostsChronologicalOrder(page, limit);

    
    

    return context.json(
      {
        success: true,
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

  } catch (e: any) {
    console.error('Error fetching posts:', e);
    return context.json(
      {
        success: false,
        message: e?.message || 'Failed to fetch posts',
      },
      500
    );
  }
});

postRoutes.get("/getPostsBymeInOrder", tokenMiddleware, async (context) => {
  const page = Number(context.req.query("page") || 1);
  const limit = Number(context.req.query("limit") || 10);
  const userId = context.get("userId");

  try {
    const result = await getPostsBymeInOrder({ page, limit, userId });

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

  return context.json(
    {
      message: "Internal Server Error",
    },
    500
  );
});

postRoutes.delete("/DeletePosts/:postId", tokenMiddleware, async (context) => {
  const userId = await context.get("userId");
  const postId = await context.req.param("postId");

  try {
    const deletePosts = await deletePostsById({ userId, postId });
    if (deletePosts) {
      return context.json("Posts deleted Successfully");
    }
  } catch (e) {
    if (e === getDeletepostsError.UNAUTHORIZED) {
      return context.json("Post Already Deleted");
    }
    if (e === getDeletepostsError.NOT_FOUND) {
      return context.json("User Not Fond");
    }
  }
  return context.json("Cant Delete");
});

postRoutes.get("/AuthorById/:postId",sessionMiddleware, async (context) => {
  const postId = context.req.param("postId");

  try {
    const author = await prismaClient.post.findUnique({
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
  } catch (e) {
    return context.json({ message: e }, 500);
  }
}
);