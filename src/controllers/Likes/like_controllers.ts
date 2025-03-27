import { type LikePost, LikeErrors } from "./likes-types.js";
import { prismaClient } from "../../extra/prisma.js";
import { type getAllLikes } from "./likes-types.js";
import { DeleteLikeErrors } from "../Likes/likes-types.js";
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

export const getLikes = async (parameters: {
  page: number;
  limit: number;
  postId: String;
}): Promise<getAllLikes> => {
  const { page, limit } = parameters;
  const Results = await prismaClient.like.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prismaClient.like.count();

  if (!Results) {
    throw LikeErrors.UNAUTHORIZED;
  }

  return { Like: Results, total: total };
};

export const deleteLikeById = async (Parameters: {
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
    throw DeleteLikeErrors.NOT_FOUND;
  } else {
    const posts = await prismaClient.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (posts) {
      const LikeExists = await prismaClient.like.findFirst({
        where: {
          userId,
          postId,
        },
      });
      if (LikeExists) {
        await prismaClient.like.delete({
          where: {
            id: LikeExists.id,
          },
        });
        return "Like Deleted SucceFully";
      }
    }

    throw DeleteLikeErrors.NOT_FOUND;
  }
};
