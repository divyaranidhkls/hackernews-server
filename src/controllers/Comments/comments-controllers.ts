import { prismaClient } from "../../extra/prisma";
import {
  type getcommentResult,
  getcommentError,
  type getCommentByOrder,
} from "../Comments/comments-types";
export const CommentPosts = async (parameters: {
  userId: string;
  postId: string;
  content: string;
}): Promise<getcommentResult> => {
  const { userId, postId, content } = parameters;
  // const userExists = await prismaClient.user.findUnique({
  //   where: {
  //     id: userId,
  //   },
  // });
  // if (!userExists) {
  //   throw getcommentError.NOT_FOUND;
  // }
  // const postExists = await prismaClient.post.findUnique({
  //   where: {
  //     id: postId,
  //   },
  // });
  // if (!postExists) {
  //   throw getcommentError.NOT_FOUND;
  // }

  const Result = await prismaClient.comment.create({
    data: {
      userId: userId,
      postId: postId,
      content: content,
      // Removed as it's not part of the expected type
    },
  });

  return { comment: Result };
};

export const getComments = async (parameters: {
  page: number;
  limit: number;
  postId: string; // Ensure `postId` is treated as a string
}): Promise<getCommentByOrder> => {
  const { page, limit, postId } = parameters;

  try {
    const Results = await prismaClient.comment.findMany({
      where: {
        postId: postId, // Add a condition to filter by postId
      },
      orderBy: {
        createdAt: "desc", // Sort by creation date in descending order
      },
      skip: (page - 1) * limit, // Pagination: Skip based on the page and limit
      take: limit, // Limit the number of results
    });

    const total = await prismaClient.comment.count({
      where: {
        postId: postId, // Count only comments for the specific postId
      },
    });

    return { comments: Results, total: total };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};


export const deteleComments = async (parameters: {
  userId: string;
  commentsId: string;
}) => {
  const { userId, commentsId } = parameters;
  const users = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!users) {
    throw getcommentError.UNAUTHORIZED;
  }
  const comments = await prismaClient.comment.findUnique({
    where: {
      id: commentsId,
    },
  });
  if (!comments) {
    throw getcommentError.NOT_FOUND;
  }

  await prismaClient.comment.delete({
    where: {
      id: commentsId,
    },
  });

  return "Comments Deleted Successfully";
};

export const UpdateComments = async (parameters: {
  userId: string;
  commentsId: string;
  content: string;
}) => {
  const { userId, commentsId, content } = parameters;
  const users = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!users) {
    throw getcommentError.UNAUTHORIZED;
  }
  const comments = await prismaClient.comment.findUnique({
    where: {
      id: commentsId,
    },
  });
  if (!comments) {
    throw getcommentError.NOT_FOUND;
  }

  const newComment = await prismaClient.comment.update({
    where: {
      id: commentsId,
    },
    data: {
      content: content,
    },
  });

  return { newComment};
};







export const getAllComments = async (parameters: {
  userId: string;
  page: number;
  limit: number;
}) => {
  const { userId, page, limit } = parameters;
  const comments = await prismaClient.comment.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prismaClient.comment.count({
    where: {
      userId: userId,
    },
  });
  return { comments, total };
}