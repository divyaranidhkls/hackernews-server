import { type LikePost, LikeErrors } from "./likes-types.js";
import { prismaClient } from "../../extra/prisma.js";

export const LikePosts = async (parameters: {
  userId: string;
  postId: string;
}): Promise<LikePost> => {
  const { userId, postId } = parameters;
  const userExists = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userExists) {
    throw LikeErrors.NOT_FOUND;
  }
  const postExists = await prismaClient.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!postExists) {
    throw LikeErrors.NOT_FOUND;
  }
  const LikeExists = await prismaClient.like.findFirst({
    where: {
      userId,
      postId,
    },
  });
  if (LikeExists) {
    throw LikeErrors.ALREADY_LIKED;
  }

  const Result = await prismaClient.like.create({
    data: {
      userId,
      postId,
    },
  });

  return { Likes: Result };
};
