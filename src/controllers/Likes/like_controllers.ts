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
  const userLike = await prismaClient.like.findFirst({
    where: { postId, userId: userId },
  });
  

  if (userLike) {
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
  postId: string; // Also ensure consistent casing: use `string`, not `String`
}): Promise<getAllLikes> => {
  const { page, limit, postId } = parameters;

  const Results = await prismaClient.like.findMany({
    where: {
      postId, // <-- Filter by postId
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prismaClient.like.count({
    where: {
      postId, // <-- Count only likes for this post
    },
  });

  return { Like: Results, total };
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
