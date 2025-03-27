import type { Post } from "@prisma/client";

export type createInputPost = {
  title: string;
  content: string;
};
export type createPostResult = {
  post: Post;
};
export enum getPostsError {
  BAD_REQUEST,
  UNAUTHORIZED,
}
export type getPostsCrono = {
  post: Array<Post>;
  total: number;
};

export type getPostsByme = {
  post: Array<Post>;
  total: number;
};
