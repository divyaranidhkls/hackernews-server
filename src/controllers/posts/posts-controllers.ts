import { prismaClient } from "../../extra/prisma.js";
import {
  type createInputPost,
  type createPostResult,
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
