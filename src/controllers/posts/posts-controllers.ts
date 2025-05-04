import { prismaClient } from "../../extra/prisma.js";
import {
  type createInputPost,
  type createPostResult,
  getDeletepostsError,
  type getPostsByme,
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
export const getPostsChronologicalOrder = async (
  page: number = 1,
  limit: number = 10
): Promise<getPostsCrono> => {
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  if (!Number.isInteger(pageNumber) || pageNumber <= 0 || !Number.isInteger(limitNumber) || limitNumber <= 0) {
    throw getPostsError.BAD_REQUEST; // or custom error saying invalid page/limit
  }

  const Results = await prismaClient.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    // Remove the wrong `include`
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  });

  const total = await prismaClient.post.count();

  return { post: Results, total };
};


export const getPostsBymeInOrder = async (parameters: {
  userId: string;
  page: number;
  limit: number;
}): Promise<getPostsByme> => {
  const Results = await prismaClient.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId: parameters.userId,
    },
    include: {
      posts: true,
    },
    skip: (parameters.page - 1) * parameters.limit,
    take: parameters.limit,
  });
  const total = await prismaClient.post.count();

  if (!Results) {
    throw getPostsError.BAD_REQUEST;
  }

  return { post: Results, total: total };
};

export const deletePostsById = async (Parameters: {
  userId: string;
  postId: string;
}) => {
  const { userId, postId } = Parameters;

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw getDeletepostsError.NOT_FOUND;
  } else {
    const posts = await prismaClient.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (posts) {
      await prismaClient.post.delete({
        where: {
          id: postId,
        },
      });
      return "Posts Deleted";
    }
    throw getDeletepostsError.UNAUTHORIZED;
  }
};
