import { prismaClient } from "../../../extra/prisma.js";
import {
  type getcommentResult,
  getcommentError,
  type getCommentByOrder,
} from "../Comments/comments-types.js";
export const CommentPosts = async (parameters: {
  userId: string;
  postId: string;
  content: string;
}): Promise<getcommentResult> => {
  const { userId, postId, content } = parameters;
  const userExists = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExists) {
    throw getcommentError.NOT_FOUND;
  }
  const postExists = await prismaClient.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!postExists) {
    throw getcommentError.NOT_FOUND;
  }

  const Result = await prismaClient.comment.create({
    data: {
      userId: userId,
      postId: postId,
      content: content,
    },
  });

  return { comment: Result };
};

export const getComments = async (parameters: {
  page: number;
  limit: number;
  postId: String;
}): Promise<getCommentByOrder> => {
  const { page, limit } = parameters;
  const Results = await prismaClient.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prismaClient.comment.count();

  if (!Results) {
    throw getcommentError.UNAUTHORIZED;
  }

  return { comments: Results, total: total };
};
