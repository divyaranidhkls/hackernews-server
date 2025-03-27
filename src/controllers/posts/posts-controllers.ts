import { prismaClient } from "../../extra/prisma.js";
import {
  type createInputPost,
  type createPostResult,
  type getPostsCrono,
  getPostsError,
} from "./posts-types.js";

//POST /posts -- Creates a post (authored by the current user).

export const createPosts = async (parameters: {
  userId: string;
  input: createInputPost;
}): Promise<createPostResult> => {
  const { userId, input } = parameters;

  if (!input.title || !input.content) {
    throw getPostsError.BAD_REQUEST;
  }

  const newPost = await prismaClient.post.create({
    data: {
      userId: userId,
      content: input.content,
      title: input.title,
    },
  });

  return { post: newPost };
};

//GET /posts -- Returns all posts in reverse chronological order (paginated).
export const getPostsCronologicalOrder = async (
  page: number = 1,
  limit: number = 1
): Promise<getPostsCrono> => {
  const Results = await prismaClient.post.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      posts: true,
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prismaClient.post.count();

  if (!Results) {
    throw getPostsError.BAD_REQUEST;
  }

  return { post: Results, total: total };
};
